import { getElement } from "./util";

/**
 * Create a simple modal with some text and an OK button.
 * 
 * @param text The text to display in the modal.
 */
export function createModal(text: string) {
  const template = getElement('template#modal') as HTMLTemplateElement;
  const clone = document.importNode(template.content, true);
  const modalDiv = getElement('div.modal', clone) as HTMLDivElement;
  const closeButton = getElement('button.modal-close', modalDiv) as HTMLButtonElement;
  const okButton = getElement('button.is-primary', modalDiv) as HTMLButtonElement;
  const contentEl = getElement('[data-modal-content]', modalDiv);
  const onKeyUp = (event: KeyboardEvent) => {
    if (event.keyCode === 27) {
      close();
    }
  };

  document.addEventListener('keyup', onKeyUp);

  const close = () => {
    document.body.removeChild(modalDiv);
    document.removeEventListener('keyup', onKeyUp);
  };

  document.body.appendChild(modalDiv);

  contentEl.textContent = text;
  closeButton.onclick = okButton.onclick = close;
  okButton.focus();

  // TODO: Trap keyboard focus and all the other accessibility bits.
}
