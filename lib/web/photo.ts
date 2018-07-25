import { Question, ValidationError } from "../question";
import { Photo } from "../util";
import { WebWidget } from "./io";
import { makeElement } from "./util";

const IMG_SIZE = 64;

export class WebPhotoQuestion extends Question<Photo> implements WebWidget<Photo> {
  input: HTMLInputElement;
  labelForId: string;

  constructor(readonly text: string) {
    super();
    this.text = text;
    this.input = makeElement('input', { type: 'file' });
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

    return new Promise<Photo|ValidationError>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const width = IMG_SIZE;
        const height = IMG_SIZE;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject('unable to obtain CanvasRenderingContext2D');
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.5));
      };
      img.onerror = (e) => {
        resolve(new ValidationError('That does not appear to be a valid image.'));
      };
      img.src = URL.createObjectURL(file);
    });
  }
}
