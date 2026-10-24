// C06 Priority checkout, following capture 171752: offer timer, 예약 정보, 방문 목적, 결제 수단 (a
// preset demo card only), 총 결제 금액, 고객 요청사항, required consents, pay button. Payment is MOCK:
// the page shows whatever the payment ledger says (processing / unknown / recovery / refunded) and
// reconciles on load, so reload, back/forward or a second tab never charge twice.
import { POLICY } from '../core/config.js';
import { STRINGS } from '../core/strings.js';
import { afterMockDelay, getState, subscribe } from '../core/store.js';
import { now } from '../core/clock.js';
import { addDays, formatKRW, formatMonthDay, weekdayOf } from '../core/format.js';
import { pageUrl, queryParam } from '../core/nav.js';
import { findOffer, findSlot, offerIsLive } from '../services/allocation.js';
import { depositFor, findOperation, REQUIRED_CONSENTS, reservationForOffer, retryReservationCommit, startCheckout } from '../services/payment.js';
import { reconcile } from '../services/reconcile.js';
import { h } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { pageHeader } from '../ui/header.js';
import { showToast } from '../ui/toast.js';
import { conditionText, formatRemaining } from '../ui/cancellation-ui.js';

const K = STRINGS.checkout;
const C = STRINGS.cancellation;
const app = document.getElementById('app');
const offerId = queryParam('offerId');
const offerHref = pageUrl('customer/offer.html', { offerId });
const CONSENT_KEYS = [...REQUIRED_CONSENTS, 'taste'];
const form = { purposes: new Set(), requestNote: '', consents: new Set() };  // kept across re-renders of this visit
let countdown = null;

const settleSoon = () => afterMockDelay(reconcile, POLICY.mockServiceDelayMs + 50);  // epoch-guarded

function header(restaurant) {
  return h('header', { class: 'page-header page-header--actions' },
    h('a', { class: 'icon-button', href: offerHref, 'aria-label': K.close }, icon('close')),
    h('h1', { class: 'page-header__title' }, restaurant.name));
}

function section(title, ...content) {
  return h('section', { class: 'checkout-section' }, h('h2', { class: 'checkout-section__title' }, title), ...content);
}

function refundDate(serviceDate) {
  const day = addDays(serviceDate, -1);
  return `${formatMonthDay(day)}(${STRINGS.weekdays[weekdayOf(day)]})`;
}

function formView(offer, slot, restaurant, failedOperation) {
  const amount = depositFor(restaurant, slot.partySize);
  countdown = h('span', { class: 'checkout-timer__value', role: 'timer', 'aria-label': C.remainingLabel });
  const pay = h('button', { class: 'button button--primary button--block checkout-pay', type: 'button', 'aria-describedby': 'consent-hint', onclick: onPay },
    amount ? K.pay(formatKRW(amount)) : K.bookFree);
  const hint = h('p', { class: 'checkout-hint', id: 'consent-hint' }, K.consentHint);
  const consentBoxes = {};
  function syncConsents() {
    const ready = REQUIRED_CONSENTS.every((key) => form.consents.has(key));
    pay.disabled = !ready;
    hint.hidden = ready;
    allBox.checked = CONSENT_KEYS.every((key) => form.consents.has(key));
    CONSENT_KEYS.forEach((key) => { consentBoxes[key].checked = form.consents.has(key); });
  }
  const checkbox = (key, label) => {
    consentBoxes[key] = h('input', { type: 'checkbox', onchange: (event) => { form.consents[event.target.checked ? 'add' : 'delete'](key); syncConsents(); } });
    return h('label', { class: 'consent' }, consentBoxes[key], h('span', {}, label));
  };
  const allBox = h('input', { type: 'checkbox', onchange: (event) => { CONSENT_KEYS.forEach((key) => form.consents[event.target.checked ? 'add' : 'delete'](key)); syncConsents(); } });

  function onPay() {
    pay.disabled = true;  // the service also turns a repeat into the same operation
    const result = startCheckout(offer.id, { consents: [...form.consents], purposes: [...form.purposes], requestNote: form.requestNote.trim() });
    if (!result.ok) { showToast(STRINGS.errors[result.reason] ?? STRINGS.errors.INVALID_STATE); render(); return; }
    if (result.reservationId) { window.location.replace(pageUrl('customer/reservation.html', { reservationId: result.reservationId, confirmed: '1' })); return; }
    settleSoon();
    refresh();
  }

  const view = [
    header(restaurant),
    h('main', { class: 'mobile-content checkout' },
      h('p', { class: 'checkout-timer' }, countdown, h('span', {}, K.timerText)),
      failedOperation && h('p', { class: 'notice notice--warning checkout-failed', role: 'alert' }, K.failedNotice),
      section(K.infoHeading, h('p', { class: 'checkout-condition' }, conditionText(slot))),
      section(K.purposeHeading,
        h('p', { class: 'checkout-section__hint' }, K.purposeHint),
        h('div', { class: 'purpose-chips', role: 'group', 'aria-label': K.purposeHeading }, K.purposes.map((purpose) => h('button', {
          class: 'purpose-chip', type: 'button', 'aria-pressed': String(form.purposes.has(purpose)),
          onclick: (event) => {
            form.purposes[form.purposes.has(purpose) ? 'delete' : 'add'](purpose);
            event.currentTarget.setAttribute('aria-pressed', String(form.purposes.has(purpose)));
          },
        }, purpose)))),
      amount > 0 && section(K.methodHeading,
        h('label', { class: 'pay-method' }, h('input', { type: 'radio', name: 'method', checked: true }), h('span', {}, K.demoCard)),
        h('p', { class: 'checkout-section__hint' }, K.demoCardNote)),
      section(K.totalHeading,
        h('p', { class: 'checkout-total' }, amount ? formatKRW(amount) : K.noDeposit),
        amount > 0 && h('p', { class: 'checkout-section__hint' }, K.breakdown(formatKRW(restaurant.policies.depositPerPersonKRW), slot.partySize)),
        amount > 0 && h('p', { class: 'checkout-section__hint' }, K.refundUntil(refundDate(slot.serviceDate)))),
      section(K.requestHeading,
        h('textarea', { class: 'checkout-request', rows: 3, maxlength: 100, placeholder: K.requestPlaceholder, 'aria-label': K.requestLabel, oninput: (event) => { form.requestNote = event.target.value; } })),
      h('section', { class: 'checkout-section consents' },
        h('label', { class: 'consent consent--all' }, allBox, h('span', {}, K.agreeAll)),
        checkbox('refund', K.consents.refund),
        h('div', { class: 'refund-table' },
          h('p', {}, K.refundTableTitle),
          h('dl', {}, K.refundTable.map(([when, rule]) => h('div', {}, h('dt', {}, when), h('dd', {}, rule))))),
        checkbox('payment', K.consents.payment),
        checkbox('privacy', K.consents.privacy),
        checkbox('thirdParty', K.consents.thirdParty),
        checkbox('taste', K.consents.taste),
        h('p', { class: 'checkout-section__hint' }, K.demoNote))),
    h('div', { class: 'bottom-bar bottom-bar--stacked checkout-bar' },
      h('dl', { class: 'checkout-summary' },
        h('div', {}, h('dt', {}, K.summaryInfo), h('dd', {}, conditionText(slot))),
        h('div', {}, h('dt', {}, K.summaryAmount), h('dd', { class: 'checkout-summary__amount' }, amount ? formatKRW(amount) : K.noDeposit))),
      hint,
      pay),
  ];
  const textarea = view[1].querySelector('textarea');
  textarea.value = form.requestNote;
  syncConsents();
  repaint(offer);
  return view;
}

function stateView(restaurant, title, body, ...actions) {
  return [
    header(restaurant),
    h('main', { class: 'mobile-content checkout checkout--state' },
      h('div', { class: 'checkout-state', role: 'status' },
        h('h2', { class: 'checkout-state__title' }, title),
        h('p', { class: 'checkout-state__body' }, body)),
      ...actions),
  ];
}

function operationLine(operation) {
  return h('p', { class: 'checkout-op' }, K.paymentStatus(operation.id, formatKRW(operation.amountKRW)));
}

function repaint(offer) {
  if (!countdown) return;
  const remaining = Date.parse(offer.expiresAt) - now();
  countdown.textContent = formatRemaining(remaining);
  if (remaining <= 0) reconcile();
}

function message(title, body) {
  app.replaceChildren(
    pageHeader({ backHref: offerHref, backLabel: STRINGS.restaurant.back }),
    h('main', { class: 'mobile-content empty-state' },
      h('h1', { class: 'empty-state__title' }, title),
      h('p', { class: 'text-secondary' }, body),
      h('a', { class: 'button button--primary', href: pageUrl('customer/cancellation-queue.html') }, C.toQueue)));
}

function render() {
  const state = getState();
  const offer = findOffer(state, offerId);
  countdown = null;
  if (!offer) { message(C.notFoundTitle, C.notFoundBody); return; }
  if (offer.ownerId !== state.meta.activeCustomerId) { message(C.notOwnedTitle, C.notOwnedBody); return; }
  const slot = findSlot(state, offer.slotId);
  const restaurant = state.restaurants.find((r) => r.id === slot.restaurantId);
  const operation = offer.paymentOperationId && findOperation(state, offer.paymentOperationId);
  document.title = `${K.pageTitle} · ${STRINGS.appName}`;
  if (offer.status === 'BOOKED') {
    window.location.replace(pageUrl('customer/reservation.html', { reservationId: reservationForOffer(state, offer.id).id, confirmed: '1' }));
    return;
  }
  const back = h('a', { class: 'button button--block', href: offerHref }, K.toOffer);
  const views = {
    PAYMENT_PENDING: () => stateView(restaurant, K.processingTitle, K.processingBody, h('div', { class: 'spinner', 'aria-hidden': 'true' }), operationLine(operation)),
    PAYMENT_UNKNOWN: () => stateView(restaurant, K.unknownTitle, K.unknownBody, operationLine(operation),
      h('button', { class: 'button button--block', type: 'button', onclick: () => { reconcile(); if (findOffer(getState(), offerId).status === 'PAYMENT_UNKNOWN') showToast(K.checking); } }, K.checkAgain)),
    RECOVERY_PENDING: () => stateView(restaurant, K.recoveryTitle, K.recoveryBody, operationLine(operation),
      h('p', { class: 'checkout-section__hint' }, K.recoveryNote),
      h('button', { class: 'button button--primary button--block', type: 'button', onclick: () => {
        const result = retryReservationCommit(operation.id);
        if (!result.ok) showToast(STRINGS.errors[result.reason]);
      } }, K.retryCommit)),
    REFUNDED: () => stateView(restaurant, K.refundedTitle, K.refundedBody(formatKRW(operation.amountKRW)), back),
  };
  if (views[offer.status]) { app.replaceChildren(...views[offer.status]()); return; }
  if (offerIsLive(offer, now())) { app.replaceChildren(...formView(offer, slot, restaurant, operation?.status === 'FAILED')); return; }
  app.replaceChildren(...stateView(restaurant, C.endedTitle[offer.status] ?? STRINGS.errors.OFFER_ENDED, C.endedBody[offer.status] ?? '', back));
}

// Re-render only when the offer or its payment changed, so store notifications (focus, other tabs)
// never reset what the customer is typing; the form values also live in `form`.
let lastKey = null;
function refresh() {
  const state = getState();
  const offer = findOffer(state, offerId);
  const operation = offer?.paymentOperationId && findOperation(state, offer.paymentOperationId);
  const key = `${state.meta.activeCustomerId}|${offer?.status}|${operation?.id}|${operation?.status}`;
  if (key !== lastKey) { lastKey = key; render(); }
}

reconcile();
refresh();
if (findOffer(getState(), offerId)?.status === 'PAYMENT_PENDING') settleSoon();  // e.g. reloaded mid-payment
subscribe(refresh);
window.setInterval(() => {
  const offer = findOffer(getState(), offerId);
  if (offer && countdown) repaint(offer);
  if (offer?.status === 'PAYMENT_PENDING') reconcile();
}, 1000);
