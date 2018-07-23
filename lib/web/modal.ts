import { getElement } from "./util";
import { EventEmitter } from "events";

export class ModalBuilder {
  modal: Modal|null = null;

  constructor(readonly template: HTMLTemplateElement) {
    this.template = template;
    this.create('this is a smoke test to make sure the template is valid!');
  }

  private create(text: string): Modal {
    return new Modal(this.template, text);
  }

  /**
   * Create a simple modal with some text and an OK button, and show it.
   * 
   * @param text The text to display in the modal.
   */
  createAndOpen(text: string) {
    if (this.modal) {
      this.modal.addText(text);
    } else {
      this.modal = this.create(text);
      this.modal.on('close', () => {
        this.modal = null;
      });
      this.modal.open();
    }
  }

  shutdown() {
    if (this.modal) {
      this.modal.close();
    }
  }
}

class Modal extends EventEmitter {
  modalDiv: HTMLDivElement;
  okButton: HTMLButtonElement;
  closeButton: HTMLButtonElement;
  contentEl: HTMLDivElement;

  constructor(template: HTMLTemplateElement, text: string) {
    super();
    const clone = document.importNode(template.content, true);

    this.modalDiv = getElement('div', '.modal', clone);
    this.contentEl = getElement('div', '[data-modal-content]', this.modalDiv);
    this.okButton = getElement('button', '.is-primary', this.modalDiv);
    this.closeButton = getElement('button', '.modal-close', this.modalDiv);

    this.close = this.close.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    this.contentEl.textContent = text;
  }

  open() {
    document.body.appendChild(this.modalDiv);
    document.addEventListener('keyup', this.handleKeyUp);
    this.okButton.focus();
    this.okButton.onclick = this.closeButton.onclick = this.close;
    // TODO: Trap keyboard focus and all the other accessibility bits.
  }

  close() {
    document.body.removeChild(this.modalDiv);
    document.removeEventListener('keyup', this.handleKeyUp);
    this.emit('close');
  }

  addText(text: string) {
    this.contentEl.appendChild(document.createElement('br'));
    this.contentEl.appendChild(document.createElement('br'));
    this.contentEl.appendChild(document.createTextNode(text));
  }

  private handleKeyUp(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      this.close();
    }
  }
}
