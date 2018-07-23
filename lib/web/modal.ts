import { getElement } from "./util";

export class ModalBuilder {
  modals: Modal[] = [];

  constructor(readonly template: HTMLTemplateElement) {
    this.template = template;
    this.create('this is a smoke test to make sure the template is valid!');

    this.handleKeyUp = this.handleKeyUp.bind(this);
    document.addEventListener('keyup', this.handleKeyUp);
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
    const modal = this.create(text);
    this.modals.push(modal);
    modal.open(() => {
      modal.close();
      this.modals.splice(this.modals.indexOf(modal), 1);
    });
  }

  shutdown() {
    document.removeEventListener('keyup', this.handleKeyUp);
    this.modals.forEach(modal => modal.close());
    this.modals = [];
  }

  private handleKeyUp(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      const modal = this.modals.pop();
      if (modal) {
        modal.close();
      }
    }
  }
}

class Modal {
  modalDiv: HTMLDivElement;
  okButton: HTMLButtonElement;
  closeButton: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, text: string) {
    const clone = document.importNode(template.content, true);
    const modalDiv = getElement('div', '.modal', clone);
    const contentEl = getElement('div', '[data-modal-content]', modalDiv);

    this.modalDiv = modalDiv;
    this.okButton = getElement('button', '.is-primary', modalDiv);
    this.closeButton = getElement('button', '.modal-close', modalDiv);

    contentEl.textContent = text;
  }

  open(onClose: () => void) {
    document.body.appendChild(this.modalDiv);
    this.okButton.focus();
    this.okButton.onclick = this.closeButton.onclick = onClose;
    // TODO: Trap keyboard focus and all the other accessibility bits.
  }

  close() {
    document.body.removeChild(this.modalDiv);
  }
}
