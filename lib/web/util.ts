import * as querystring from 'querystring';

export function getElement(selector: string): Element {
  const node = document.querySelector(selector);
  if (!node) {
    throw new Error(`Couldn't find any elements matching "${selector}"`);
  }
  return node;
}

export function getQuerystringParam(name: string): string {
  const query = querystring.parse(window.location.search.slice(1));
  const value = query[name];

  if (value) {
    if (Array.isArray(value)) {
      return value[0];
    }
    return value;
  }

  return '';
}
