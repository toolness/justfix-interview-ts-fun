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
  input.setAttribute('type', 'radio');
  input.setAttribute('name', inputName);
  input.setAttribute('value', labelText);

  const label = document.createElement('label');
  label.className = 'radio';
  label.appendChild(input);
  label.appendChild(document.createTextNode(labelText));

  parent.appendChild(label);

  return { label, input };
}
