import { InterviewIO, QuestionsFor } from '../lib/interview-io';
import { Question, ValidationError } from '../lib/question';
import { Photo, addDays } from '../lib/util';
import { TenantInterview } from '../lib/tenant-interview';
import { Tenant } from '../lib/tenant';

import * as querystring from 'querystring';

function getElement(selector: string): Element {
  const node = document.querySelector(selector);
  if (!node) {
    throw new Error(`Couldn't find any elements matching "${selector}"`);
  }
  return node;
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

class QuestionInput<T> {
  container: HTMLDivElement;
  input: HTMLInputElement;
  error: HTMLDivElement|null;

  constructor(readonly question: Question<T>) {
    this.question = question;
    this.container = document.createElement('div');

    const p = document.createElement('p');
    p.appendChild(document.createTextNode(question.text));
    this.container.appendChild(p);

    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    this.input  = input;
    this.container.appendChild(input);

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
    const response = await this.question.processResponse(this.input.value);
    if (response instanceof ValidationError) {
      this.showError(response.message);
      return null;
    }
    this.hideError();
    return response;
  }
}

class WebInterviewIO extends InterviewIO {
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
    throw new Error('not implemented');
  }
}

export class LocalStorageSerializer<S> {
  constructor(readonly keyname: string, readonly defaultState: S) {
    this.keyname = keyname;
    this.defaultState = defaultState;
  }

  get(): S {
    try {
      const contents = window.localStorage[this.keyname];
      return JSON.parse(contents);
    } catch (e) {
      return this.defaultState;
    }
  }

  set(state: S) {
    const contents = JSON.stringify(state, null, 2);
    window.localStorage[this.keyname] = contents;
  }
}

function getQuerystringParam(name: string): string {
  const query = querystring.parse(window.location.search.slice(1));
  const value = query[name];

  if (value) {
    if (Array.isArray(value)) {
      return value[0];
    }
  }

  return '';
}

window.addEventListener('load', () => {
  const io = new WebInterviewIO(getElement('#main'));
  let now = new Date();
  const days = parseInt(getQuerystringParam('days'));

  if (!isNaN(days)) {
    now = addDays(now, days);
  }

  const interview = new TenantInterview({ io, now });
  const serializer = new LocalStorageSerializer('tenantState', {} as Tenant);

  (window as any).serializer = serializer;

  interview.on('change', (_, nextState) => {
    console.log(`Updating localStorage['${serializer.keyname}'].`);
    serializer.set(nextState);
  });
  interview.execute(serializer.get()).then(tenant => {
    console.log('Interview complete.');
  });
});
