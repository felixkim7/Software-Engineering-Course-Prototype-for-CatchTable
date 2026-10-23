import { h } from './dom.js';

const VISIBLE_MS = 3000;

// One polite live region per page, created at import so it already exists before the first
// message (screen readers announce changes to an existing region more reliably).
const region = document.body.appendChild(
  h('div', { class: 'toast', role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true' }),
);
let hideTimer;

export function showToast(message) {
  region.textContent = message;
  region.classList.add('is-visible');
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => region.classList.remove('is-visible'), VISIBLE_MS);
}
