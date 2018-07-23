import { ValidationError, YesNoQuestion } from "../question";
import { WebWidget } from "./io";
import { createUniqueId } from "./util";


export class WebYesNoQuestion extends YesNoQuestion implements WebWidget<boolean> {
  div: HTMLDivElement;
  yesInput: HTMLInputElement;
  noInput: HTMLInputElement;
  inputName: string;

  constructor(readonly text: string) {
    super(text);
    this.div = document.createElement('div');
    this.inputName = createUniqueId();
    this.yesInput = this.makeRadio('Yes');
    this.noInput = this.makeRadio('No');
  }

  private makeRadio(labelText: string): HTMLInputElement {
    const input = document.createElement('input');
    const id = createUniqueId();
    input.setAttribute('type', 'radio');
    input.setAttribute('name', this.inputName);
    input.setAttribute('value', labelText);
    input.setAttribute('id', id);

    const label = document.createElement('label');
    label.setAttribute('for', id);
    label.textContent = labelText;

    this.div.appendChild(input);
    this.div.appendChild(label);

    return input;
  }

  getElement(): HTMLElement {
    return this.div;
  }

  async processElement(): Promise<boolean|ValidationError> {
    if (this.yesInput.checked) {
      return true;
    } else if (this.noInput.checked) {
      return false;
    } else {
      return new ValidationError('Please choose an answer.');
    }
  }
}
