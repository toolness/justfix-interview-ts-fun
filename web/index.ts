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

class WebInterviewIO extends InterviewIO {
  constructor(readonly root: Element) {
    super();
    this.root = root;
  }

  ask<T>(question: Question<T>): Promise<T> {
    const form = document.createElement('form');

    const p = document.createElement('p');
    p.appendChild(document.createTextNode(question.text));
    form.appendChild(p);

    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    form.appendChild(input);

    const submit = document.createElement('input');
    submit.setAttribute('type', 'submit');
    form.appendChild(submit);

    this.root.appendChild(form);

    return new Promise((resolve, reject) => {
      form.onsubmit = (e) => {
        e.preventDefault();
        question.processResponse(input.value).then(response => {
          if (response instanceof ValidationError) {
            window.alert(response.message);
            return;
          }
          resolve(response);
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
