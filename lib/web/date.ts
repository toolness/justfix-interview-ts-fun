import { DateQuestion, ValidationError } from "../question";
import { WebWidget } from "./io";
import { makeInput, wrapInControlDiv } from "./util";

export class WebDateQuestion extends DateQuestion implements WebWidget<Date> {
  input: HTMLInputElement;
  container: HTMLDivElement;

  constructor(readonly text: string) {
    super(text);
    this.input = makeInput('date');
    this.container = wrapInControlDiv(this.input);
  }

  getElement() {
    return this.container;
  }

  processElement() {
    if ('valueAsDate' in <any>this.input) {
      if (!this.input.valueAsDate) {
        return new ValidationError('Please provide a valid date!');
      }
      return this.input.valueAsDate;
    }
    return this.processResponse(this.input.value);
  }
}
