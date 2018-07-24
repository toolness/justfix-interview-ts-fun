import { makeElement, getElement } from "./util";

// https://commons.wikimedia.org/wiki/File:Chromiumthrobber.svg
const HTML = `
<svg width="16" height="16" viewBox="0 0 300 300"
     xmlns="http://www.w3.org/2000/svg" version="1.1">
  <path d="M 150,0
           a 150,150 0 0,1 106.066,256.066
           l -35.355,-35.355
           a -100,-100 0 0,0 -70.711,-170.711 z"
        fill="#00d1b2">
    <animateTransform attributeName="transform" attributeType="XML"
           type="rotate" from="0 150 150" to="360 150 150"
           begin="0s" dur="1s" fill="freeze" repeatCount="indefinite" />
  </path>
</svg>
`.trim();

export default function makeThrobber(): SVGElement {
  const div = makeElement('div', { innerHTML: HTML });
  const svg = div.querySelector('svg');
  if (!svg) {
    throw new Error('throbber svg not found');
  }
  return svg;
}

// This is a smoke test/sanity check.
makeThrobber();