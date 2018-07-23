import { getElement } from "./util";

/**
 * Create a simple modal with some text and an OK button.
 * 
 * @param text The text to display in the modal.
 */
export function createModal(text: string) {
  const template = getElement('template', '#modal');
  const clone = document.importNode(template.content, true);
  const modalDiv = getElement('div', '.modal', clone);
  const closeButton = getElement('button', '.modal-close', modalDiv);
  const okButton = getElement('button', '.is-primary', modalDiv);
  const contentEl = getElement('div', '[data-modal-content]', modalDiv);
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
