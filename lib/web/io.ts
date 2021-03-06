import { InterviewIO, QuestionsFor, IOCancellationError } from '../interview-io';
import { Question, ValidationError, MultiChoiceAnswer } from '../question';
import { Photo } from '../util';
import { WebPhotoQuestion } from './photo';
import { WebYesNoQuestion } from './yes-no';
import { wrapInControlDiv, makeElement } from './util';
import { ModalBuilder } from './modal';
import { WebDateQuestion } from './date';
import { WebMultiChoiceQuestion } from './multi-choice';
import makeThrobber from './throbber';

/**
 * A WebWidget is an additional interface that can be implemented on
 * a Question to indicate that it has native web support, and doesn't
 * need to just be a text input field.
 */
export interface WebWidget<T> {
  /**
   * Returns the native HTML element for the question.
   */
  getElement: () => Element;

  /**
   * Processes the current value of the question's web interface
   * and returns its value (or a validation error if it's invalid).
   */
  processElement: () => Promise<T|ValidationError>;

  /**
   * If the native HTML element contains an <input> that needs a label,
   * this can be set to the "id" attribute of the <input>. Calling code
   * is responsible for creating a <label> with a "for" attribute pointing
   * to the id.
   */
  labelForId?: string;
}

/** A WebQuestion is just a Question that supports the WebWidget interface. */
type WebQuestion<T> = WebWidget<T> & Question<T>;

/**
 * Returns whether the given Question has native web support.
 * 
 * @param question A Question instance.
 */
function isWebQuestion<T>(question: Question<T>): question is WebQuestion<T> {
  return typeof((<WebQuestion<T>>question).getElement) === 'function';
}

/** 
 * Given a Question, return a web-enabled version of it. If the
 * Question doesn't have native web support, we wrap it in a
 * simple text input field as a fallback.
 */
function createWebWidget<T>(question: Question<T>): WebWidget<T> {
  if (isWebQuestion(question)) {
    return question;
  } else {
    const input = makeElement('input', {
      type: 'text',
      name: question.text,
      classes: ['input'],
    });
    const control = wrapInControlDiv(input);
    return {
      getElement: () => control,
      processElement: () => question.processResponse(input.value),
      labelForId: input.id
    };
  }
}

/**
 * This is a mapped type [1] consisting of properties that consist
 * of question inputs whose answers map to the original property types.
 * 
 * [1] https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types
 */
export type QuestionInputsFor<T> = {
  [P in keyof T]: QuestionInput<T[P]>;
};

/**
 * A QuestionInput wraps a Question in an HTML element with an area
 * for a label, an input field tailored to the type of question
 * being asked, and an error message area.
 */
export class QuestionInput<T> {
  container: HTMLDivElement;
  widget: WebWidget<T>;
  error: HTMLParagraphElement|null;

  constructor(readonly question: Question<T>) {
    this.question = question;
    this.container = makeElement('div', { classes: ['field'] });

    const label = makeElement('label', {
      classes: ['jf-question', 'label'],
      textContent: question.text,
      appendTo: this.container,
    });

    this.widget = createWebWidget(question);
    this.container.appendChild(this.widget.getElement());
    if (this.widget.labelForId) {
      label.setAttribute('for', this.widget.labelForId);
    }
    this.error = null;
  }

  showError(message: string) {
    if (!this.error) {
      this.error = makeElement('p', {
        classes: ['help', 'is-danger'],
        appendTo: this.container
      });
    }
    this.error.textContent = message;
  }

  hideError() {
    if (this.error) {
      this.container.removeChild(this.error);
      this.error = null;
    }
  }

  /**
   * Ask for the underlying Question's current answer, if
   * it has a valid one. If it doesn't, show the error to
   * the user in the error area and return null.
   */
  async respond(): Promise<T|null> {
    let response = await this.widget.processElement();

    if (response instanceof ValidationError) {
      this.showError(response.message);
      return null;
    }
    this.hideError();
    return response;
  }
}

export class WebInterviewIO extends InterviewIO {
  root: Element|null;
  statusDiv: HTMLDivElement;

  constructor(root: Element, readonly modalBuilder: ModalBuilder) {
    super();
    this.root = root;
    this.modalBuilder = modalBuilder;
    this.statusDiv = makeElement('div', { appendTo: root });
  }

  ensureRoot(): Element {
    if (!this.root) {
      throw new IOCancellationError(this);
    }
    return this.root;
  }

  async ask<T>(question: Question<T>): Promise<T> {
    return (await this.askMany({ question })).question;
  }

  /**
   * This gathers one or more questions to ask and embeds them
   * in a <form> element. It automatically takes care of
   * showing validation errors to the user and doesn't return
   * until all questions have been given a valid answer by
   * the user.
   * 
   * @param questions The questions to ask.
   */
  async askMany<T>(questions: QuestionsFor<T>): Promise<T> {
    const form = document.createElement('form');
    const questionInputs = {} as QuestionInputsFor<T>;
    let foundFirstQuestion = false;

    this.ensureRoot().appendChild(form);
    await this.setStatus('');

    for (let key in questions) {
      if (!foundFirstQuestion) {
        foundFirstQuestion = true;
        this.emit('title', questions[key].text);
      }
      const qi = new QuestionInput(questions[key]);
      questionInputs[key] = qi;
      form.appendChild(qi.container);
    }

    const submit = makeElement('button', {
      type: 'submit',
      classes: ['button', 'is-primary'],
      textContent: 'Submit',
      appendTo: form,
    });

    const getResponses = async (): Promise<T|null> => {
      const responses = {} as T;
      let isValid = true;
      for (let key in questionInputs) {
        const response = await questionInputs[key].respond();
        if (response !== null) {
          responses[key] = response;
        } else {
          isValid = false;
        }
      }
      return isValid ? responses : null;
    }

    return new Promise<T>((resolve, reject) => {
      form.onsubmit = (e) => {
        e.preventDefault();
        getResponses().then(responses => {
          if (responses) {
            this.ensureRoot().removeChild(form);
            return resolve(responses);
          }
        }).catch(reject);
      };
    });
  }

  async notify(text: string) {
    await this.setStatus('');
    this.emit('title', text);
    await this.modalBuilder.createAndOpen(text);
  }

  async setStatus(text: string, options: { showThrobber?: boolean } = { showThrobber: true }) {
    this.ensureRoot();
    this.statusDiv.textContent = text;
    if (text) {
      if (options.showThrobber) {
        this.statusDiv.appendChild(document.createTextNode(' '));
        this.statusDiv.appendChild(makeThrobber());
      }
      this.emit('title', text);
    }
  }

  createPhotoQuestion(text: string): Question<Photo> {
    return new WebPhotoQuestion(text);
  }

  createYesNoQuestion(text: string): Question<boolean> {
    return new WebYesNoQuestion(text);
  }

  createDateQuestion(text: string): Question<Date> {
    return new WebDateQuestion(text);
  }

  createMultiChoiceQuestion<T>(text: string, answers: MultiChoiceAnswer<T>[]) {
    return new WebMultiChoiceQuestion(text, answers);
  }

  close() {
    this.ensureRoot().innerHTML = '';
    this.root = null;
    this.modalBuilder.shutdown();
  }
}

export interface WebInterviewIO {
  on(event: 'title', listener: (title: string) => void): this;
  emit(event: 'title', title: string): boolean;
}
