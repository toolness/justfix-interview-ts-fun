import { InterviewIO, QuestionsFor } from '../interview-io';
import { Question, ValidationError } from '../question';
import { Photo } from '../util';
import { WebPhotoQuestion } from './photo';
import { WebYesNoQuestion } from './yes-no';
import { createUniqueId, makeInput, wrapInControlDiv } from './util';
import { ModalBuilder } from './modal';
import { WebDateQuestion } from './date';

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
    const input = makeInput('text');
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

export class QuestionInput<T> {
  container: HTMLDivElement;
  widget: WebWidget<T>;
  error: HTMLParagraphElement|null;

  constructor(readonly question: Question<T>) {
    this.question = question;
    this.container = document.createElement('div');
    this.container.className = "field";

    const label = document.createElement('label');
    label.className = 'jf-question label';
    label.appendChild(document.createTextNode(question.text));
    this.container.appendChild(label);

    this.widget = createWebWidget(question);
    this.container.appendChild(this.widget.getElement());
    if (this.widget.labelForId) {
      label.setAttribute('for', this.widget.labelForId);
    }
    this.error = null;
  }

  showError(message: string) {
    if (!this.error) {
      this.error = document.createElement('p');
      this.error.className = "help is-danger";
      this.container.appendChild(this.error);
    }
    this.error.innerHTML = '';
    this.error.appendChild(document.createTextNode(message));
  }

  hideError() {
    if (this.error) {
      this.container.removeChild(this.error);
      this.error = null;
    }
  }

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
  constructor(readonly root: Element, readonly modalBuilder: ModalBuilder) {
    super();
    this.root = root;
    this.modalBuilder = modalBuilder;
  }

  async ask<T>(question: Question<T>): Promise<T> {
    return (await this.askMany({ question })).question;
  }

  async askMany<T>(questions: QuestionsFor<T>): Promise<T> {
    const form = document.createElement('form');
    const questionInputs = {} as QuestionInputsFor<T>;

    for (let key in questions) {
      const qi = new QuestionInput(questions[key]);
      questionInputs[key] = qi;
      form.appendChild(qi.container);
    }

    const submit = document.createElement('button');
    submit.setAttribute('type', 'submit');
    submit.className = 'button is-primary';
    submit.textContent = 'Submit';
    form.appendChild(submit);

    this.root.appendChild(form);

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
            this.root.removeChild(form);
            return resolve(responses);
          }
        }).catch(reject);
      };
    });
  }

  notify(text: string) {
    this.modalBuilder.createAndOpen(text);
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

  close() {
    this.root.innerHTML = '';
    this.modalBuilder.shutdown();
  }
}
