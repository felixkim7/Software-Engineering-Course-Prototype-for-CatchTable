/**
 * Minimal element builder: h('button', { class: 'button', onclick: fn }, 'label').
 * Children that are strings become text nodes, so data is never parsed as HTML.
 * `on*` keys attach listeners; `true` sets an empty boolean attribute; false/null are skipped.
 * Inputs get autocomplete="off": on back/forward the browser would otherwise restore a radio's
 * checked state after the page has rendered from the store, leaving the UI out of sync.
 */
export function h(tag, attributes = {}, ...children) {
  const element = document.createElement(tag);
  if (tag === 'input') element.setAttribute('autocomplete', 'off');
  for (const [name, value] of Object.entries(attributes)) {
    if (value === false || value == null) continue;
    if (name.startsWith('on')) element.addEventListener(name.slice(2), value);
    else element.setAttribute(name, value === true ? '' : String(value));
  }
  element.append(...children.flat(Infinity).filter((child) => child != null && child !== false));
  return element;
}

/**
 * Returns focus to a dialog's opener. Pages re-render from the store (countdowns, reconcile,
 * window focus) while a dialog is open, which replaces the opener node; then its twin with the
 * same tag, class, text and aria-label (which tells row buttons apart) takes focus instead.
 */
export function refocus(opener) {
  if (!opener || opener === document.body) return;
  const twin = (el) => el.className === opener.className && el.textContent === opener.textContent
    && el.getAttribute('aria-label') === opener.getAttribute('aria-label');
  const target = opener.isConnected ? opener : [...document.querySelectorAll(opener.tagName)].find(twin);
  target?.focus();
}
