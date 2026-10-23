/**
 * Minimal element builder: h('button', { class: 'button', onclick: fn }, 'label').
 * Children that are strings become text nodes, so data is never parsed as HTML.
 * `on*` keys attach listeners; `true` sets an empty boolean attribute; false/null are skipped.
 */
export function h(tag, attributes = {}, ...children) {
  const element = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) {
    if (value === false || value == null) continue;
    if (name.startsWith('on')) element.addEventListener(name.slice(2), value);
    else element.setAttribute(name, value === true ? '' : String(value));
  }
  element.append(...children.flat().filter((child) => child != null && child !== false));
  return element;
}
