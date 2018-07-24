import { MultiChoiceAnswer, ValidationError, Question } from "../question";
import { WebWidget } from "./io";
import { makeElement, createUniqueId, makeRadio } from "./util";

export class WebMultiChoiceQuestion<T> extends Question<T> implements WebWidget<T> {
  div: HTMLDivElement;
  inputName: string;
  radios: HTMLInputElement[];
  text: string;
  answers: MultiChoiceAnswer<T>[];

  constructor(question: string, answers: MultiChoiceAnswer<T>[]) {
    super();
    this.text = question;
    this.answers = answers;
    this.div = makeElement('div', { classes: ['control'] });
    this.inputName = createUniqueId();
    this.radios = answers.map(answer => {
      const wrapper = makeElement('p', { appendTo: this.div });
      return makeRadio(wrapper, this.inputName, answer[1]).input;
    });
  }

  getElement() {
    return this.div;
  }

  async processElement() {
    for (let i = 0; i < this.radios.length; i++) {
      const radio = this.radios[i];
      if (radio.checked) {
        return this.answers[i][0];
      }
    }
    return new ValidationError('Please choose an answer.');
  }

  processResponse(response: string): Promise<T | ValidationError> {
    throw new Error('This should never be called!');
  }
}
