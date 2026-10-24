// M01 예약 · 빈자리 (desktop), allocation section: released slots of the manager's restaurant with
// their live offer and deadline, and the restaurant's cancellation-seat requests in FIFO order.
// It reads the same records as the customer pages (same request IDs). Allocation is automatic,
// so the manager only observes it here, plus the restaurant's confirmed reservations (UC-PB 12).
import { STRINGS } from '../core/strings.js';
import { getState, subscribe } from '../core/store.js';
import { now } from '../core/clock.js';
import { formatKRW, formatTimeOfDay } from '../core/format.js';
import { pageUrl } from '../core/nav.js';
import { findOffer, findRequest, matchingQueue, queueRank } from '../services/allocation.js';
import { reconcile } from '../services/reconcile.js';
import { managerRestaurant } from '../services/waiting.js';
import { h } from '../ui/dom.js';
import { managerHeader } from '../ui/manager-header.js';
import { coordinationFor } from '../services/late-arrival.js';
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
    h('td', {}, offer?.status === 'OFFERED' ? h('span', { 'data-expires': offer.expiresAt }, remainingText(offer.expiresAt))
      : A.holdDetail[offer?.status] ? h('strong', { class: 'mgr-hold' }, A.holdDetail[offer.status])
        : slot.reservationId ? A.bookedAs(slot.reservationId) : '–'),
    h('td', {}, waiting.length
      ? [h('strong', {}, A.queueCount(waiting.length)), h('span', { class: 'mgr-sub' }, waiting.map((r) => `${customerName(state, r.customerId)} (${r.id})`).join(', '))]
      : '0'));
}

function reservationRow(state, reservation) {
  return h('tr', { 'data-reservation': reservation.id },
    h('td', {}, h('strong', {}, reservation.id)),
    h('td', {}, customerName(state, reservation.customerId)),
    h('td', {}, conditionText({ serviceDate: reservation.serviceDate, serviceTime: reservation.currentTime, partySize: reservation.partySize })),
    h('td', {}, reservation.depositKRW ? formatKRW(reservation.depositKRW) : '–'),
    h('td', {}, reservation.sourceOfferId ? [h('strong', {}, A.source.priority), h('span', { class: 'mgr-sub' }, reservation.sourceOfferId)] : A.source.normal),
    h('td', {}, h('span', { class: 'mgr-status mgr-status--booked' }, A.reservationStatus[reservation.status])),
    h('td', {}, lateCell(state, reservation)));
}

// Late-arrival badge (M01 list) with a link to the M03 detail where the manager answers.
function lateCell(state, reservation) {
  const record = coordinationFor(state, reservation.id);
  const L = STRINGS.late;
  return [
    record && h('span', { class: `mgr-status mgr-status--late-${record.status.toLowerCase()}` }, L.badge[record.status]),
    h('a', { class: 'mgr-link', href: pageUrl('manager/reservation.html', { reservationId: reservation.id }), 'aria-label': `${reservation.id} ${L.open}` }, L.open),
  ];
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
  const reservations = state.reservations.filter((r) => r.restaurantId === restaurant.id)
    .sort((a, b) => `${a.serviceDate}${a.currentTime}`.localeCompare(`${b.serviceDate}${b.currentTime}`));
  app.replaceChildren(h('main', { class: 'mgr' },
    managerHeader(restaurant, manager, 'reservations'),
    h('section', { class: 'mgr-section', 'aria-labelledby': 'reservations-heading' },
      h('h2', { class: 'mgr-section__title', id: 'reservations-heading' }, A.reservationsHeading),
      table(A.reservationColumns, reservations.map((reservation) => reservationRow(state, reservation)), A.emptyReservations, A.reservationsHeading)),
    h('section', { class: 'mgr-section', 'aria-labelledby': 'slots-heading' },
      h('h2', { class: 'mgr-section__title', id: 'slots-heading' }, A.slotsHeading),
      h('p', { class: 'mgr-section__hint' }, A.slotsHint),
      table(A.slotColumns, slots.map((slot) => slotRow(state, slot)), A.emptySlots, A.slotsHeading)),
    h('section', { class: 'mgr-section', 'aria-labelledby': 'requests-heading' },
      h('h2', { class: 'mgr-section__title', id: 'requests-heading' }, A.requestsHeading),
      table(A.requestColumns, requests.map((request) => requestRow(state, request)), A.emptyRequests, A.requestsHeading))));
}

document.title = A.pageTitle;
reconcile();
render();
subscribe(render);
// Each second: hand expired offers on (writes only when due), then repaint only the countdowns.
window.setInterval(() => {
  reconcile();
  app.querySelectorAll('[data-expires]').forEach((cell) => { cell.textContent = remainingText(cell.dataset.expires); });
}, 1000);
