export function getElement(selector: string): Element {
  const node = document.querySelector(selector);
  if (!node) {
    throw new Error(`Couldn't find any elements matching "${selector}"`);
  }
  return node;
}

let idCounter = 0;

export function createUniqueId(): string {
  idCounter++;
  return `unique_id_${idCounter}`;
}

export function makeRadio(parent: HTMLElement, inputName: string, labelText: string): {
  label: HTMLLabelElement,
  input: HTMLInputElement
} {
  const input = document.createElement('input');
  const id = createUniqueId();
  input.setAttribute('type', 'radio');
  input.setAttribute('name', inputName);
  input.setAttribute('value', labelText);
  input.setAttribute('id', id);

  const label = document.createElement('label');
  label.setAttribute('for', id);
  label.textContent = labelText;

  parent.appendChild(input);
  parent.appendChild(label);

  return { label, input };
}
