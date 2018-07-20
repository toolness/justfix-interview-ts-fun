import { InterviewIO, QuestionsFor } from '../interview-io';
import { Question, ValidationError } from '../question';
import { Photo } from '../util';
import { PhotoQuestion } from './photo';

export interface WebWidget<T> {
  getElement: () => Element;
  processElement: () => Promise<T|ValidationError>;
}

type WebQuestion<T> = WebWidget<T> & Question<T>;

function isWebQuestion<T>(question: Question<T>): question is WebQuestion<T> {
  return typeof((<WebQuestion<T>>question).getElement) === 'function';
}

function createWebWidget<T>(question: Question<T>): WebWidget<T> {
  if (isWebQuestion(question)) {
    return question;
  } else {
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    return {
      getElement: () => input,
      processElement: () => question.processResponse(input.value)
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
  error: HTMLDivElement|null;

  constructor(readonly question: Question<T>) {
    this.question = question;
    this.container = document.createElement('div');

    const p = document.createElement('p');
    p.appendChild(document.createTextNode(question.text));
    this.container.appendChild(p);

    this.widget = createWebWidget(question);
    this.container.appendChild(this.widget.getElement());
    this.error = null;
  }

  showError(message: string) {
    if (!this.error) {
      this.error = document.createElement('div');
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
  constructor(readonly root: Element) {
    super();
    this.root = root;
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

    const submit = document.createElement('input');
    submit.setAttribute('type', 'submit');
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
    const notification = document.createElement('div');
    notification.appendChild(document.createTextNode(text));
    notification.appendChild(document.createTextNode(' '));
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    notification.appendChild(closeBtn);
    this.root.appendChild(notification);
    closeBtn.onclick = () => this.root.removeChild(notification);
    return closeBtn;
  }

  createPhotoQuestion(text: string): Question<Photo> {
    return new PhotoQuestion(text);
  }
}
