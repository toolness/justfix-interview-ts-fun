import { ValidationError, YesNoQuestion } from "../question";
import { WebWidget } from "./io";
import { createUniqueId, makeRadio } from "./util";


export class WebYesNoQuestion extends YesNoQuestion implements WebWidget<boolean> {
  div: HTMLDivElement;
  yesInput: HTMLInputElement;
  noInput: HTMLInputElement;
  inputName: string;

  constructor(readonly text: string) {
    super(text);
    this.div = document.createElement('div');
    this.inputName = createUniqueId();
    this.yesInput = makeRadio(this.div, this.inputName, 'Yes').input;
    this.noInput = makeRadio(this.div, this.inputName, 'No').input;
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
