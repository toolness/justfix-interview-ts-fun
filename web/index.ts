import { InterviewIO, QuestionsFor } from '../lib/interview-io';
import { Question, ValidationError } from '../lib/question';
import { Photo } from '../lib/util';
import { TenantInterview } from '../lib/tenant-interview';
import { resolve } from 'path';

function getElement(selector: string): Element {
  const node = document.querySelector(selector);
  if (!node) {
    throw new Error(`Couldn't find any elements matching "${selector}"`);
  }
  return node;
}

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

  ask<T>(question: Question<T>): Promise<T> {
    const form = document.createElement('form');

    const qi = new QuestionInput(question);
    form.appendChild(qi.container);

    const submit = document.createElement('input');
    submit.setAttribute('type', 'submit');
    form.appendChild(submit);

    this.root.appendChild(form);

    return new Promise((resolve, reject) => {
      form.onsubmit = (e) => {
        e.preventDefault();
        qi.respond().then(response => {
          if (response) {
            this.root.removeChild(form);
            return resolve(response);
          }
        }).catch(reject);
      };
    });
  }

  async askMany<T>(questions: QuestionsFor<T>): Promise<T> {
    throw new Error('not implemented');
  }

  notify(text: string) {
    throw new Error('not implemented');
  }

  createPhotoQuestion(text: string): Question<Photo> {
    throw new Error('not implemented');
  }
}

window.addEventListener('load', () => {
  const io = new WebInterviewIO(getElement('#main'));
  const now = new Date();
  const interview = new TenantInterview({ io, now });

  interview.execute({}).then(tenant => {
    console.log('Interview complete.');
  });
});
