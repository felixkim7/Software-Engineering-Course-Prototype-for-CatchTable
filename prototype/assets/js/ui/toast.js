import { h } from './dom.js';
import { STRINGS } from '../core/strings.js';

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

/** Copies text (link, address) and reports the outcome; clipboard needs a secure context. */
export async function copyWithToast(text, successMessage, failureMessage) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage);
  } catch {
    showToast(failureMessage);
  }
}

/** Shared response for app controls kept for visual fidelity but not built in this demo. */
export function notInDemo() {
  showToast(STRINGS.common.notInDemo);
}
