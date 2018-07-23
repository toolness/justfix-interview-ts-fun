import { Question, ValidationError } from "../question";
import { Photo } from "../util";
import { WebWidget } from "./io";
import { createUniqueId } from "./util";

export class WebPhotoQuestion extends Question<Photo> implements WebWidget<Photo> {
  input: HTMLInputElement;
  labelForId: string;

  constructor(readonly text: string) {
    super();
    this.text = text;
    this.input = document.createElement('input');
    this.input.setAttribute('type', 'file');
    this.input.id = createUniqueId();
    this.labelForId = this.input.id;
  }

  processResponse(response: string): Promise<Photo|ValidationError> {
    throw new Error('This function should never be called!');
  }

  getElement(): Element {
    return this.input;
  }

  async processElement(): Promise<Photo|ValidationError> {
    const files = this.input.files;

    if (!files || files.length === 0) {
      return new ValidationError('You must upload an image!');
    }

    const file = files[0];
    const reader = new FileReader();

    return new Promise<Photo>((resolve, reject) => {
      reader.onload = (event) => {
        if (!event.target) {
          return reject('event.target is null!');
        }
        if (typeof(event.target.result) === 'string' &&
            /^data:/.test(event.target.result)) {
          resolve(event.target.result);
        } else {
          reject('event.target.result is not a data URI!');
        }
      };
      reader.readAsDataURL(file);
    });
  }
}
