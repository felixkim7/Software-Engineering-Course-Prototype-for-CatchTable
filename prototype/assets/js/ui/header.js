import { h } from './dom.js';

// Static, trusted markup (no data), so innerHTML is safe here.
const BACK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12H4M10 6l-6 6 6 6"/></svg>';

/** Customer page header: back link + title, as in the app's back-arrow screens. */
export function pageHeader({ title, backHref, backLabel }) {
  const back = h('a', { class: 'icon-button', href: backHref, 'aria-label': backLabel });
  back.innerHTML = BACK_ICON;
  return h('header', { class: 'page-header' }, back, h('h1', { class: 'page-header__title' }, title));
}
