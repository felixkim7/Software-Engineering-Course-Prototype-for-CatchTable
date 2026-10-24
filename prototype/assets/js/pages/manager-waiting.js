// M02 Manager waiting dashboard (desktop), modelled on CatchTable's store dashboard help screenshots:
// 접수 status, totals, 웨이팅 중 / 착석 / 취소 tabs, a row per party with 호출 / 착석 / 취소.
// It acts as the presenter-selected manager and only on that manager's restaurant.
import { POLICY } from '../core/config.js';
import { STRINGS } from '../core/strings.js';
import { getState, subscribe } from '../core/store.js';
import { now } from '../core/clock.js';
import { formatTimeOfDay, minutesBetween } from '../core/format.js';
import { pageUrl } from '../core/nav.js';
import { activeQueue, queueSummary, managerRestaurant, callTicket, seatTicket, managerCancelTicket, setAccepting } from '../services/waiting.js';
import { h } from '../ui/dom.js';
import { confirmDialog } from '../ui/modal.js';
import { showToast, notInDemo } from '../ui/toast.js';
import { managerHeader } from '../ui/manager-header.js';

const T = STRINGS.manager;
const app = document.getElementById('app');
let tab = 'active';
let focusKey = null;  // restores keyboard focus to the same control after a re-render

function ended(state, restaurantId, status) {
  return state.waitingTickets.filter((t) => t.restaurantId === restaurantId && t.status === status)
    .sort((a, b) => b.endedAt.localeCompare(a.endedAt));
}

function customerCell(state, ticket) {
  const customer = state.customers.find((c) => c.id === ticket.customerId);
  return customer ? T.appCustomer(customer.displayName) : ticket.guest;
}

async function act(ticket, action) {
  focusKey = `${ticket.id}:${action}`;
  if (action === 'cancel') {
    const confirmed = await confirmDialog({
      title: T.cancelDialogTitle(ticket.ticketNumber), message: T.cancelDialogBody,
      confirmLabel: T.cancelYes, cancelLabel: T.cancelNo, tone: 'danger',
    });
    if (!confirmed) return;
  }
  const run = { call: callTicket, seat: seatTicket, cancel: managerCancelTicket }[action];
  const done = { call: T.callDone, seat: T.seatDone, cancel: T.cancelDone }[action];
  const result = run(ticket.id);
  showToast(result.ok ? done(ticket.ticketNumber) : STRINGS.errors[result.reason]);
}

function actionButton(ticket, action, disabled = false) {
  return h('button', {
    class: `mgr-action mgr-action--${action}`, type: 'button', disabled, 'data-focus': `${ticket.id}:${action}`,
    'aria-label': T.actionLabel(T[action], ticket.ticketNumber), onclick: () => act(ticket, action),
  }, T[action]);
}

function row(state, ticket, order) {
  const nowMs = now();
  const live = ticket.status === 'WAITING' || ticket.status === 'CALLED';
  const minutes = minutesBetween(ticket.registeredAt, live ? nowMs : ticket.endedAt);
  return h('tr', { class: `mgr-row${ticket.status === 'CALLED' ? ' is-called' : ''}`, 'data-ticket': ticket.id },
    h('td', { class: 'mgr-row__order' }, String(order)),
    h('td', { class: 'mgr-row__number' }, h('strong', {}, String(ticket.ticketNumber)), h('span', {}, T.channel[ticket.channel])),
    h('td', { class: 'mgr-row__party' }, h('strong', {}, T.partyTotal(ticket.partySize)), h('span', {}, T.partyDetail(ticket.party.adults, ticket.party.infants))),
    h('td', { class: 'mgr-row__status' },
      ticket.status === 'CALLED' && h('span', { class: 'mgr-badge' }, T.calledBadge(ticket.callCount)),
      h('strong', {}, T.elapsed(minutes), ticket.postponementCount > 0 && h('span', { class: 'mgr-flag' }, ` ${T.postponed(ticket.postponementCount)}`)),
      h('span', {}, formatTimeOfDay(ticket.registeredAt))),
    h('td', { class: 'mgr-row__customer' }, customerCell(state, ticket)),
    h('td', { class: 'mgr-row__actions' }, live
      ? h('div', { class: 'mgr-actions' },
        actionButton(ticket, 'call', ticket.callCount >= POLICY.waitingCallLimit),
        actionButton(ticket, 'seat'),
        actionButton(ticket, 'cancel'))
      : h('span', { class: 'mgr-ended' }, `${T.endedBy[ticket.endedBy]} · ${formatTimeOfDay(ticket.endedAt)}`)));
}

function render() {
  const state = getState();
  const restaurant = managerRestaurant(state);
  const manager = state.managers.find((m) => m.id === state.meta.activeManagerId);
  document.title = T.pageTitle;
  if (!restaurant?.waiting) {
    app.replaceChildren(h('main', { class: 'mgr' }, h('p', { class: 'notice' }, T.noRestaurant), h('a', { href: pageUrl('index.html') }, T.hubLink)));
    return;
  }
  const lists = {
    active: activeQueue(state, restaurant.id),
    seated: ended(state, restaurant.id, 'SEATED'),
    cancelled: ended(state, restaurant.id, 'CANCELLED'),
  };
  const summary = queueSummary(state, restaurant);
  const accepting = restaurant.waiting.accepting;
  const toggle = h('button', {
    class: `mgr-accepting${accepting ? '' : ' is-closed'}`, type: 'button', role: 'switch', 'aria-checked': String(accepting), 'data-focus': 'accepting',
    onclick: () => { focusKey = 'accepting'; const result = setAccepting(!accepting); showToast(result.ok ? (accepting ? T.acceptingOff : T.acceptingOn) : STRINGS.errors[result.reason]); },
  }, h('span', { class: 'mgr-accepting__dot', 'aria-hidden': 'true' }), h('span', { class: 'visually-hidden' }, `${T.toggleLabel}: `),
  accepting ? T.accepting(restaurant.hours.open, restaurant.hours.close) : T.closed);

  const tabs = Object.entries(T.tabs).map(([key, label]) => h('button', {
    class: 'mgr-tab', type: 'button', 'aria-pressed': String(key === tab), 'data-focus': `tab:${key}`,
    onclick: () => { tab = key; focusKey = `tab:${key}`; render(); },
  }, label, h('span', {}, ` ${lists[key].length}`)));

  const rows = lists[tab];
  app.replaceChildren(h('main', { class: 'mgr' },
    managerHeader(restaurant, manager, 'waiting'),
    h('div', { class: 'mgr-toolbar' },
      toggle,
      h('p', { class: 'mgr-stat' }, h('span', {}, T.total), h('strong', {}, T.totalValue(summary.teams, summary.people))),
      h('p', { class: 'mgr-stat' }, h('span', {}, T.estimate), h('strong', {}, T.estimateValue(summary.minutes))),
      h('button', { class: 'mgr-register', type: 'button', onclick: notInDemo }, T.register)),
    h('div', { class: 'mgr-tabs', role: 'group', 'aria-label': T.tabsLabel }, tabs),
    rows.length
      ? h('table', { class: 'mgr-table' },
        h('caption', { class: 'visually-hidden' }, `${T.tabs[tab]} ${rows.length}`),
        h('thead', {}, h('tr', {}, Object.values(T.columns).map((label) => h('th', { scope: 'col' }, label)))),
        h('tbody', {}, rows.map((ticket, index) => row(state, ticket, index + 1))))
      : h('p', { class: 'mgr-empty' }, T.empty[tab])));
  if (focusKey) app.querySelector(`[data-focus="${focusKey}"]:not(:disabled)`)?.focus();
}

render();
subscribe(render);
// Elapsed minutes follow demo time; skip while a confirmation dialog is open.
window.setInterval(() => { if (!document.querySelector('dialog[open]')) render(); }, 30000);
