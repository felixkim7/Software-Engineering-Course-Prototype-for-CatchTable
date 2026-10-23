// M01 예약 · 빈자리 (desktop), allocation section: released slots of the manager's restaurant with
// their live offer and deadline, and the restaurant's cancellation-seat requests in FIFO order.
// It reads the same records as the customer pages (same request IDs). Allocation is automatic,
// so the manager only observes it here; bookings join this page in Phase 4.
import { STRINGS } from '../core/strings.js';
import { getState, subscribe } from '../core/store.js';
import { now } from '../core/clock.js';
import { formatTimeOfDay } from '../core/format.js';
import { pageUrl } from '../core/nav.js';
import { findOffer, findRequest, matchingQueue, queueRank, reconcileOffers } from '../services/allocation.js';
import { managerRestaurant } from '../services/waiting.js';
import { h } from '../ui/dom.js';
import { managerHeader } from '../ui/manager-header.js';
import { clockOf, conditionText, formatRemaining } from '../ui/cancellation-ui.js';

const A = STRINGS.allocation;
const app = document.getElementById('app');
const customerName = (state, id) => state.customers.find((c) => c.id === id)?.displayName ?? id;
const remainingText = (expiresAt) => A.remaining(clockOf(expiresAt), formatRemaining(Date.parse(expiresAt) - now()));

function table(columns, rows, emptyText, caption) {
  return rows.length
    ? h('table', { class: 'mgr-grid' },
      h('caption', { class: 'visually-hidden' }, caption),
      h('thead', {}, h('tr', {}, Object.values(columns).map((label) => h('th', { scope: 'col' }, label)))),
      h('tbody', {}, rows))
    : h('p', { class: 'mgr-empty' }, emptyText);
}

function slotRow(state, slot) {
  const offer = slot.offerId && findOffer(state, slot.offerId);
  const request = offer && findRequest(state, offer.requestId);
  const waiting = matchingQueue(state, slot);
  return h('tr', { 'data-slot': slot.id },
    h('td', {}, h('strong', {}, conditionText(slot)), h('span', { class: 'mgr-sub' }, `${slot.id} · ${formatTimeOfDay(slot.releasedAt)}`)),
    h('td', {}, h('span', { class: `mgr-status mgr-status--${slot.status.toLowerCase()}` }, A.slotStatus[slot.status])),
    h('td', {}, request
      ? [h('strong', {}, customerName(state, offer.ownerId)), h('span', { class: 'mgr-sub' }, `${request.id} · ${offer.id}`)]
      : h('span', { class: 'mgr-sub' }, A.availableNote)),
    h('td', {}, offer?.status === 'OFFERED' ? h('span', { 'data-expires': offer.expiresAt }, remainingText(offer.expiresAt)) : '–'),
    h('td', {}, waiting.length
      ? [h('strong', {}, A.queueCount(waiting.length)), h('span', { class: 'mgr-sub' }, waiting.map((r) => `${customerName(state, r.customerId)} (${r.id})`).join(', '))]
      : '0'));
}

function requestRow(state, request) {
  const rank = queueRank(state, request);
  return h('tr', { 'data-request': request.id },
    h('td', {}, h('strong', {}, request.id)),
    h('td', {}, customerName(state, request.customerId)),
    h('td', {}, conditionText(request)),
    h('td', {}, formatTimeOfDay(request.requestedAt)),
    h('td', {}, h('span', { class: `mgr-status mgr-status--${request.status.toLowerCase()}` }, A.requestStatus[request.status]),
      rank && h('span', { class: 'mgr-sub' }, A.rank(rank))));
}

function render() {
  const state = getState();
  const restaurant = managerRestaurant(state);
  const manager = state.managers.find((m) => m.id === state.meta.activeManagerId);
  if (!restaurant) {
    app.replaceChildren(h('main', { class: 'mgr' }, h('p', { class: 'notice' }, STRINGS.manager.noRestaurant), h('a', { href: pageUrl('index.html') }, STRINGS.manager.hubLink)));
    return;
  }
  const slots = state.releasedSlots.filter((s) => s.restaurantId === restaurant.id).sort((a, b) => b.releasedAt.localeCompare(a.releasedAt));
  const requests = state.cancellationRequests.filter((r) => r.restaurantId === restaurant.id).sort((a, b) => a.requestedAt.localeCompare(b.requestedAt));
  app.replaceChildren(h('main', { class: 'mgr' },
    managerHeader(restaurant, manager, 'reservations'),
    h('section', { class: 'mgr-section', 'aria-labelledby': 'slots-heading' },
      h('h2', { class: 'mgr-section__title', id: 'slots-heading' }, A.slotsHeading),
      h('p', { class: 'mgr-section__hint' }, A.slotsHint),
      table(A.slotColumns, slots.map((slot) => slotRow(state, slot)), A.emptySlots, A.slotsHeading)),
    h('section', { class: 'mgr-section', 'aria-labelledby': 'requests-heading' },
      h('h2', { class: 'mgr-section__title', id: 'requests-heading' }, A.requestsHeading),
      table(A.requestColumns, requests.map((request) => requestRow(state, request)), A.emptyRequests, A.requestsHeading))));
}

document.title = A.pageTitle;
reconcileOffers();
render();
subscribe(render);
// Each second: hand expired offers on (writes only when due), then repaint only the countdowns.
window.setInterval(() => {
  reconcileOffers();
  app.querySelectorAll('[data-expires]').forEach((cell) => { cell.textContent = remainingText(cell.dataset.expires); });
}, 1000);
