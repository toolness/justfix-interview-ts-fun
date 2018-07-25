/**
 * Find an element.
 * 
 * @param tagName The name of the element's HTML tag.
 * @param selector The selector for the element, not including its HTML tag.
 * @param parent The parent node to search within.
 */
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

/** This defines all the valid CSS classes in our project. */
type CssClassName =
  // Bulma classes.
  'control' |
  'field' |
  'label' |
  'help' |
  'button' |
  'radio' |
  'input' |
  'panel-block' |
  'is-danger' |
  'is-primary' |
  // Custom JustFix classes.
  'jf-question';

interface MakeElementOptions<T extends HTMLElement> {
  /** The element's classes (corresponds to the "class" attribute). */
  classes?: CssClassName[],
  /** The input element's type. */
  type?: T extends HTMLInputElement | HTMLButtonElement ? string : never,
  /** The input element's name. */
  name?: T extends HTMLInputElement ? string : never,
  /** The input element's value. */
  value?: T extends HTMLInputElement ? string : never,
  /** Optional parent element to append the newly-created element to. */
  appendTo?: Element,
  /** Optional child elements to append to the newly-created element. */
  children?: Element[],
  /** The element's text content. */
  textContent?: string,
  /** The element's inner HTML. */
  innerHTML?: string,
  /** The element's "tabindex" attribute. */
  tabIndex?: 0 | -1,
}

/**
 * Create an HTML element.
 * 
 * If the element is an <input>, automatically assign a unique ID to it.
 * 
 * @param tagName The name of the element's HTML tag.
 * @param options Options for the element.
 */
export function makeElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options: MakeElementOptions<HTMLElementTagNameMap[K]>
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tagName);

  if (options.classes) {
    options.classes.forEach(className => el.classList.add(className));
  }
  if (el instanceof HTMLInputElement || el instanceof HTMLButtonElement) {
    el.type = options.type || '';
  }
  if (el instanceof HTMLInputElement) {
    el.name = options.name || '';
    el.value = options.value || '';
    el.id = createUniqueId();
  }

  if (options.textContent) {
    el.textContent = options.textContent;
  }
  if (options.innerHTML) {
    el.innerHTML = options.innerHTML;
  }
  if (options.appendTo) {
    options.appendTo.appendChild(el);
  }
  if (options.children) {
    options.children.forEach(child => el.appendChild(child));
  }
  if (typeof(options.tabIndex) === 'number') {
    el.tabIndex = options.tabIndex;
  }

  return el;
}

/**
 * Wrap the given element in a <div class="control">.
 * 
 * @param el The element to wrap.
 */
export function wrapInControlDiv(el: Element): HTMLDivElement {
  return makeElement('div', {
    classes: ['control'],
    children: [el],
  });
}

/**
 * Create an <input type="radio"> wrapped in a <label>.
 * 
 * @param parent The parent node to append the radio to.
 * @param inputName The "name" attribute of the radio.
 * @param labelText The text of the radio's label.
 */
export function makeRadio(parent: HTMLElement, inputName: string, labelText: string): {
  label: HTMLLabelElement,
  input: HTMLInputElement
} {
  const label = makeElement('label', { classes: ['radio'] });
  const input = makeElement('input', {
    type: 'radio',
    name: inputName,
    value: labelText,
    appendTo: label
  });

  label.appendChild(document.createTextNode(` ${labelText}`));

  parent.appendChild(label);

  return { label, input };
}
