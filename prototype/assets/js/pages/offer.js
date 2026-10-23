// C05 Exclusive priority offer. Only its owner may see or act on it. The countdown is derived
// from the stored absolute deadline (expiresAt - now), so a reload never restarts it; the timer
// only repaints and asks reconcile() to hand the slot on once the deadline passes.
// Booking/payment is Phase 4: 예약하기 explains that instead of pretending to confirm.
import { STRINGS } from '../core/strings.js';
import { getState, subscribe } from '../core/store.js';
import { now } from '../core/clock.js';
import { formatKRW } from '../core/format.js';
import { pageUrl, queryParam } from '../core/nav.js';
import { declineOffer, findOffer, findRequest, findSlot, joinQueue, offerIsLive, reconcileOffers } from '../services/allocation.js';
import { h } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { pageHeader } from '../ui/header.js';
import { confirmDialog } from '../ui/modal.js';
import { showToast } from '../ui/toast.js';
import { clockOf, conditionText, formatRemaining } from '../ui/cancellation-ui.js';

const C = STRINGS.cancellation;
const app = document.getElementById('app');
const offerId = queryParam('offerId');
const queueHref = pageUrl('customer/cancellation-queue.html');
let countdown = null;  // node repainted every second while the offer is live

function message(title, body) {
  app.replaceChildren(
    pageHeader({ backHref: queueHref, backLabel: STRINGS.restaurant.back }),
    h('main', { class: 'mobile-content empty-state' },
      h('h1', { class: 'empty-state__title' }, title),
      h('p', { class: 'text-secondary' }, body),
      h('a', { class: 'button button--primary', href: queueHref }, C.toQueue)));
}

async function onDecline(offer) {
  const confirmed = await confirmDialog({ title: C.declineTitle, message: C.declineBody, confirmLabel: C.declineYes, cancelLabel: C.declineNo, tone: 'danger' });
  if (!confirmed) return;
  const result = declineOffer(offer.id);
  showToast(result.ok ? C.declinedToast : STRINGS.errors[result.reason]);
}

function onRejoin(slot) {
  const result = joinQueue({ restaurantId: slot.restaurantId, serviceDate: slot.serviceDate, serviceTime: slot.serviceTime, partySize: slot.partySize });
  showToast(result.ok ? C.rejoinedToast : STRINGS.errors[result.reason]);
  if (result.ok || result.reason === 'DUPLICATE_REQUEST') window.setTimeout(() => { window.location.href = queueHref; }, 900);
}

function liveView(offer, slot, restaurant) {
  const deposit = restaurant.policies?.depositKRW ?? 0;
  countdown = h('p', { class: 'offer-timer__value', role: 'timer', 'aria-label': C.remainingLabel });
  repaint(offer);
  return [
    pageHeader({ title: C.offerTitle, backHref: queueHref, backLabel: STRINGS.restaurant.back }),
    h('main', { class: 'mobile-content offer' },
      h('section', { class: 'offer__head' },
        h('p', { class: 'offer__lead' }, icon('bell'), C.offerLead),
        h('a', { class: 'offer__name', href: pageUrl('customer/restaurant.html', { restaurantId: restaurant.id }) }, restaurant.name, icon('chevronRight')),
        h('p', { class: 'offer__condition' }, conditionText(slot))),
      h('div', { class: 'offer-timer' },
        h('p', { class: 'offer-timer__label' }, C.remainingLabel),
        countdown,
        h('p', { class: 'offer-timer__deadline' }, C.deadline(clockOf(offer.expiresAt)))),
      h('p', { class: 'offer__exclusive' }, C.offerExclusive),
      h('dl', { class: 'confirm-rows offer__facts' },
        h('div', { class: 'confirm-row' }, h('dt', {}, C.conditionLabel), h('dd', {}, conditionText(slot))),
        h('div', { class: 'confirm-row' }, h('dt', {}, C.depositLabel), h('dd', {}, deposit ? formatKRW(deposit) : C.depositNone))),
      h('p', { class: 'notice offer__note' }, C.bookingNote)),
    h('div', { class: 'bottom-bar' },
      h('button', { class: 'button', type: 'button', onclick: () => onDecline(offer) }, C.decline),
      h('button', { class: 'button button--primary', type: 'button', onclick: () => showToast(C.bookUnavailable) }, C.book)),
  ];
}

function endedView(offer, slot, restaurant) {
  const request = findRequest(getState(), offer.requestId);
  const key = request.status === 'CANCELLED' ? 'CANCELLED' : offer.status;
  return [
    pageHeader({ title: C.offerTitle, backHref: queueHref, backLabel: STRINGS.restaurant.back }),
    h('main', { class: 'mobile-content offer' },
      h('section', { class: 'offer__head offer__head--ended' },
        h('h2', { class: 'offer__ended' }, C.endedTitle[key] ?? STRINGS.errors.OFFER_ENDED),
        h('p', { class: 'text-secondary' }, C.endedBody[key] ?? ''),
        h('p', { class: 'offer__name offer__name--plain' }, restaurant.name),
        h('p', { class: 'offer__condition' }, conditionText(slot))),
      h('div', { class: 'offer__after' },
        h('button', { class: 'button button--primary button--block', type: 'button', onclick: () => onRejoin(slot) }, C.rejoin),
        h('a', { class: 'button button--block', href: queueHref }, C.toQueue))),
  ];
}

function repaint(offer) {
  const remaining = Date.parse(offer.expiresAt) - now();
  if (countdown) countdown.textContent = formatRemaining(remaining);
  if (remaining <= 0) reconcileOffers();  // hands the slot on exactly once; subscribe re-renders
}

function render() {
  const state = getState();
  const offer = findOffer(state, offerId);
  countdown = null;
  if (!offer) { message(C.notFoundTitle, C.notFoundBody); return; }
  if (offer.ownerId !== state.meta.activeCustomerId) { message(C.notOwnedTitle, C.notOwnedBody); return; }
  const slot = findSlot(state, offer.slotId);
  const restaurant = state.restaurants.find((r) => r.id === slot.restaurantId);
  app.replaceChildren(...(offerIsLive(offer, now()) ? liveView(offer, slot, restaurant) : endedView(offer, slot, restaurant)));
}

document.title = `${C.offerTitle} · ${STRINGS.appName}`;
reconcileOffers();
render();
subscribe(render);
window.setInterval(() => {
  const offer = findOffer(getState(), offerId);
  if (offer && countdown) repaint(offer);
}, 1000);
