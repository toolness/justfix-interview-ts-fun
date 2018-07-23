import { getElement } from "./util";

export class ModalBuilder {
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
    this.create(text).open();
  }
}

class Modal {
  modalDiv: HTMLDivElement;
  okButton: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, text: string) {
    const clone = document.importNode(template.content, true);
    const modalDiv = getElement('div', '.modal', clone);
    const closeButton = getElement('button', '.modal-close', modalDiv);
    const okButton = getElement('button', '.is-primary', modalDiv);
    const contentEl = getElement('div', '[data-modal-content]', modalDiv);

    this.modalDiv = modalDiv;
    this.okButton = okButton;
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.close = this.close.bind(this);

    closeButton.onclick = okButton.onclick = this.close;
    contentEl.textContent = text;
  }

  open() {
    document.addEventListener('keyup', this.handleKeyUp);
    document.body.appendChild(this.modalDiv);
    this.okButton.focus();
    // TODO: Trap keyboard focus and all the other accessibility bits.
  }

  private close() {
    document.body.removeChild(this.modalDiv);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyUp(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      this.close();
    }
  }
}
