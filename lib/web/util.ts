export function getElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  selector: string,
  parent: ParentNode = document
): HTMLElementTagNameMap[K] {
  const finalSelector = `${tagName}${selector}`;
  const node = parent.querySelector(finalSelector);
  if (!node) {
    throw new Error(`Couldn't find any elements matching "${finalSelector}"`);
  }
  return node as HTMLElementTagNameMap[K];
}

let idCounter = 0;

export function createUniqueId(): string {
  idCounter++;
  return `unique_id_${idCounter}`;
}

export function makeInput(type: string): HTMLInputElement {
  const input = document.createElement('input');
  input.type = type;
  input.id = createUniqueId();
  input.className = 'input';
  return input;
}

export function wrapInControlDiv(el: Element): HTMLDivElement {
  const control = document.createElement('div');
  control.className = 'control';
  control.appendChild(el);
  return control;
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
