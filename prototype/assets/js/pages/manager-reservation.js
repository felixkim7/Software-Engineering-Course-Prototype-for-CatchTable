// M03 Manager reservation detail with late-arrival coordination: the booking, the customer's
// current ETA (version), the three responses, and the same history the customer sees. Only the
// manager of the reservation's restaurant can open or answer it; every answer names its version.
import { STRINGS } from '../core/strings.js';
import { getState, subscribe } from '../core/store.js';
import { formatClockTime, formatDotDateTime, formatKRW } from '../core/format.js';
import { pageUrl, queryParam } from '../core/nav.js';
import { managerRestaurant } from '../services/waiting.js';
import { coordinationFor, etaOptions, respondToLate } from '../services/late-arrival.js';
import { h } from '../ui/dom.js';
import { confirmDialog } from '../ui/modal.js';
import { showToast } from '../ui/toast.js';
import { managerHeader } from '../ui/manager-header.js';
import { dateLabel } from '../ui/cancellation-ui.js';
import { historyList, lateBy } from '../ui/late-ui.js';

const L = STRINGS.late;
const A = STRINGS.allocation;
const app = document.getElementById('app');
const reservationId = queryParam('reservationId');
const listHref = pageUrl('manager/reservations.html');
let focusKey = null;

function respond(reservation, record, response, proposedTime) {
  focusKey = response;
  const result = respondToLate(reservation.id, record.version, response, proposedTime);  // version on screen
  showToast(result.ok ? L.respondedToast[response] : STRINGS.errors[result.reason]);
}

function requestSection(reservation, record) {
  if (!record) return h('p', { class: 'mgr-empty' }, L.noRequest);
  const answerable = record.status === 'SUBMITTED';
  const proposal = h('select', { id: 'proposal-time', class: 'mgr-select' },
    etaOptions(reservation.currentTime).map((time) => h('option', { value: time, selected: time === record.expectedArrival }, formatClockTime(time))));
  async function cannotRetain() {
    const confirmed = await confirmDialog({ title: L.cannotTitle, message: L.cannotBody, confirmLabel: L.cannotYes, cancelLabel: L.no, tone: 'danger' });
    if (confirmed) respond(reservation, record, 'CANNOT_RETAIN');
  }
  const fact = (label, value) => h('div', {}, h('dt', {}, label), h('dd', {}, value));
  return h('div', { class: 'mgr-late' },
    h('dl', { class: 'mgr-facts' },
      fact(L.eta, `${formatClockTime(record.expectedArrival)} (${L.lateBy(lateBy(reservation, record.expectedArrival))})`),
      fact(L.reason, record.reason || '–'),
      fact(L.submittedAt, formatDotDateTime(record.submittedAt))),
    answerable
      ? h('div', { class: 'mgr-late__actions' },
        h('button', { class: 'mgr-action mgr-action--seat', type: 'button', 'data-focus': 'RETAINED', onclick: () => respond(reservation, record, 'RETAINED') }, L.respond.RETAINED),
        h('div', { class: 'mgr-late__propose' },
          h('label', { for: 'proposal-time' }, L.proposeLabel), proposal,
          h('button', { class: 'mgr-action mgr-action--call', type: 'button', 'data-focus': 'CHANGE_PROPOSED', onclick: () => respond(reservation, record, 'CHANGE_PROPOSED', proposal.value) }, L.respond.CHANGE_PROPOSED)),
        h('button', { class: 'mgr-action mgr-action--cancel', type: 'button', 'data-focus': 'CANNOT_RETAIN', onclick: cannotRetain }, L.respond.CANNOT_RETAIN))
      : h('p', { class: 'mgr-late__state', role: 'status' },
        h('strong', {}, L.badge[record.status]), ' ',
        record.status === 'CHANGE_PROPOSED' ? L.awaitingCustomer : L.answered));
}

function render() {
  const state = getState();
  const restaurant = managerRestaurant(state);
  const manager = state.managers.find((m) => m.id === state.meta.activeManagerId);
  const reservation = state.reservations.find((r) => r.id === reservationId);
  document.title = L.pageTitle;
  if (!restaurant || !reservation || reservation.restaurantId !== restaurant.id) {
    app.replaceChildren(h('main', { class: 'mgr' },
      restaurant && managerHeader(restaurant, manager, 'reservations'),
      h('section', { class: 'mgr-section' },
        h('h2', { class: 'mgr-section__title' }, L.notManagedTitle),
        h('p', { class: 'mgr-section__hint' }, L.notManagedBody),
        h('a', { class: 'mgr-back', href: listHref }, L.backToList))));
    return;
  }
  const record = coordinationFor(state, reservation.id);
  const customer = state.customers.find((c) => c.id === reservation.customerId);
  const fact = (label, value) => h('div', {}, h('dt', {}, label), h('dd', {}, value));
  app.replaceChildren(h('main', { class: 'mgr' },
    managerHeader(restaurant, manager, 'reservations'),
    h('a', { class: 'mgr-back', href: listHref }, `← ${L.backToList}`),
    h('section', { class: 'mgr-section', 'aria-labelledby': 'summary-heading' },
      h('h2', { class: 'mgr-section__title', id: 'summary-heading' }, `${L.summaryHeading} · ${reservation.id}`),
      h('dl', { class: 'mgr-facts mgr-facts--grid' },
        fact(L.fields.customer, customer?.displayName ?? reservation.customerId),
        fact(L.fields.date, dateLabel(reservation.serviceDate)),
        fact(L.fields.original, formatClockTime(reservation.originalTime)),
        fact(L.fields.current, formatClockTime(reservation.currentTime)),
        fact(L.fields.party, STRINGS.checkout.people(reservation.partySize)),
        fact(L.fields.deposit, reservation.depositKRW ? formatKRW(reservation.depositKRW) : '–'),
        fact(L.fields.source, reservation.sourceOfferId ? A.source.priority : A.source.normal))),
    h('section', { class: 'mgr-section', 'aria-labelledby': 'late-heading' },
      h('h2', { class: 'mgr-section__title', id: 'late-heading' }, record ? L.requestHeading(record.version) : L.sectionTitle),
      requestSection(reservation, record),
      record && historyList(record))));
  if (focusKey) (app.querySelector(`[data-focus="${focusKey}"]`) ?? app.querySelector('.mgr-late__state'))?.focus?.();
}

render();
subscribe(render);
