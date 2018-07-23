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
