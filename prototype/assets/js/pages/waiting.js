// C03 My waiting (방문예정), following capture 183416 and the velog screenshots: place in line,
// ticket number, estimate, cancel and postpone; called / seated / cancelled states. The page
// re-reads the ticket on every store change, focus and back/forward visit.
import { STRINGS } from '../core/strings.js';
import { getState, subscribe } from '../core/store.js';
import { formatDotDateTime, minutesBetween } from '../core/format.js';
import { pageUrl, queryParam } from '../core/nav.js';
import { findTicket, queuePosition, estimateMinutes, postponeChoices, cancelWaiting } from '../services/waiting.js';
import { isSaved, toggleSaved } from '../services/customer.js';
import { h } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { pageHeader } from '../ui/header.js';
import { confirmDialog } from '../ui/modal.js';
import { openSheet } from '../ui/sheet.js';
import { showToast, copyWithToast } from '../ui/toast.js';
import { postponeView } from '../ui/postpone-view.js';

const W = STRINGS.waiting;
const R = STRINGS.restaurant;
const app = document.getElementById('app');
const ticketId = queryParam('ticketId');
const myDiningHref = pageUrl('customer/my-dining.html');
let lastStatus = null;

const view = () => new URLSearchParams(window.location.search).get('view');
function go(nextView) {
  const url = new URL(window.location.href);
  if (nextView) url.searchParams.set('view', nextView);
  else url.searchParams.delete('view');
  window.history.pushState(null, '', url);
  render();
}

function header(restaurant) {
  const saved = isSaved(getState(), restaurant.id);
  return h('header', { class: 'page-header page-header--actions' },
    h('a', { class: 'icon-button', href: pageUrl('customer/restaurant.html', { restaurantId: restaurant.id }), 'aria-label': R.back }, icon('back')),
    h('h1', { class: 'page-header__title' }, W.ticketPageTitle),
    h('button', {
      class: 'icon-button', type: 'button', 'aria-label': R.save, 'aria-pressed': String(saved),
      onclick: () => { const result = toggleSaved(restaurant.id); showToast(result.ok ? (saved ? R.unsavedToast : R.savedToast) : STRINGS.errors[result.reason]); },
    }, icon('bookmark', `icon${saved ? ' is-filled' : ''}`)),
    h('button', { class: 'icon-button', type: 'button', 'aria-label': R.share, onclick: () => copyWithToast(window.location.href, R.linkCopied, R.linkCopyFailed) }, icon('share')));
}

function statusCard(state, ticket, restaurant) {
  const meta = (...lines) => lines.filter(Boolean).map((line) => h('p', { class: 'ticket-card__time' }, line));
  const registered = W.registeredAt(formatDotDateTime(ticket.registeredAt));
  const refresh = h('button', { class: 'refresh-link', type: 'button', onclick: () => { render(); showToast(W.refreshed); } },
    W.refresh, icon('refresh'));
  if (ticket.status === 'WAITING') {
    const position = queuePosition(state, ticket);
    return h('section', { class: 'ticket-card', 'aria-labelledby': 'ticket-heading' },
      h('div', { class: 'ticket-card__head' }, h('h2', { id: 'ticket-heading' }, W.orderHeading), refresh),
      h('p', { class: 'ticket-card__position' }, h('strong', {}, String(position)), W.positionUnit),
      h('p', { class: 'ticket-card__facts' }, h('span', {}, W.ticketNumber(ticket.ticketNumber)), h('span', {}, W.remaining(estimateMinutes(restaurant, position)))),
      meta(registered));
  }
  if (ticket.status === 'CALLED') {
    return h('section', { class: 'ticket-card ticket-card--called', 'aria-labelledby': 'ticket-heading' },
      h('div', { class: 'ticket-card__head' }, h('h2', { id: 'ticket-heading' }, W.orderHeading), refresh),
      h('p', { class: 'ticket-card__called' }, icon('bell'), W.calledTitle),
      h('p', { class: 'ticket-card__body' }, W.calledBody),
      h('p', { class: 'ticket-card__facts' }, h('span', {}, W.ticketNumber(ticket.ticketNumber))),
      meta(registered, W.calledAt(formatDotDateTime(ticket.calledAt), ticket.callCount)));
  }
  const ended = W.endedAt[ticket.status](formatDotDateTime(ticket.endedAt));
  if (ticket.status === 'SEATED') {
    return h('section', { class: 'ticket-card', 'aria-labelledby': 'ticket-heading' },
      h('h2', { class: 'ticket-card__done', id: 'ticket-heading' }, icon('check'), W.seatedTitle),
      h('p', { class: 'ticket-card__facts' }, h('span', {}, W.ticketNumber(ticket.ticketNumber)), h('span', {}, W.totalWait(minutesBetween(ticket.registeredAt, ticket.endedAt)))),
      meta(`${registered} | ${ended}`));
  }
  return h('section', { class: 'ticket-card ticket-card--cancelled', 'aria-labelledby': 'ticket-heading' },
    h('h2', { class: 'ticket-card__cancelled', id: 'ticket-heading' }, W.cancelledTitle),
    h('p', { class: 'ticket-card__number' }, W.ticketNumber(ticket.ticketNumber)),
    meta(`${registered} | ${ended}`, ticket.endedBy === 'manager' && W.endedByStore));
}

function ticketView(state, ticket, restaurant) {
  const active = ticket.status === 'WAITING' || ticket.status === 'CALLED';
  async function onCancel() {
    const confirmed = await confirmDialog({ title: W.cancelDialog(restaurant.name), confirmLabel: W.cancelYes, cancelLabel: W.cancelNo, tone: 'danger' });
    if (!confirmed) return;
    const result = cancelWaiting(ticket.id);
    showToast(result.ok ? W.cancelledToast : STRINGS.errors[result.reason]);
  }
  function onPostpone() {
    const { reason } = postponeChoices(getState(), ticket, restaurant);
    if (reason && reason !== 'POSTPONE_NO_CHOICE') showToast(STRINGS.errors[reason]);
    else go('postpone');
  }
  return [
    header(restaurant),
    h('main', { class: 'mobile-content ticket' },
      h('a', { class: 'ticket__store', href: pageUrl('customer/restaurant.html', { restaurantId: restaurant.id }) },
        h('span', { class: 'ticket__name' }, restaurant.name, icon('chevronRight')),
        h('span', { class: 'ticket__meta' }, `${restaurant.cuisine} · ${restaurant.district}`)),
      h('div', { class: 'ticket__band' },
        statusCard(state, ticket, restaurant),
        active && h('div', { class: 'ticket-notice' }, icon('alert'),
          h('div', {}, h('p', { class: 'ticket-notice__title' }, W.noShowTitle), h('p', {}, W.noShowBody)))),
      !active && h('div', { class: 'ticket__after' }, h('a', { class: 'button button--block', href: myDiningHref }, W.toMyDining))),
    active && h('div', { class: 'bottom-bar' },
      h('button', { class: 'button', type: 'button', onclick: onCancel }, W.cancelButton),
      h('button', { class: 'button', type: 'button', 'aria-disabled': String(ticket.status === 'CALLED'), onclick: onPostpone }, W.postponeButton)),
  ];
}

function showRegisteredSheet(ticket, restaurant) {
  const url = new URL(window.location.href);
  url.searchParams.delete('registered');
  window.history.replaceState(null, '', url);  // a reload must not announce it again
  const dialog = openSheet({
    title: W.registeredTitle,
    className: 'sheet--registered',
    body: h('dl', { class: 'registered-facts' },
      h('div', {}, h('dt', {}, W.registeredStore), h('dd', {}, restaurant.name)),
      h('div', {}, h('dt', {}, W.registeredInfo), h('dd', { class: 'registered-facts__info' }, W.registeredInfoValue(ticket.ticketNumber, ticket.partySize)))),
    footer: h('button', { class: 'button button--primary button--block', type: 'button', autofocus: true, onclick: () => dialog.close() }, STRINGS.common.confirm),
  });
}

function message(title, body) {
  document.title = `${title} · ${STRINGS.appName}`;
  app.replaceChildren(
    pageHeader({ backHref: myDiningHref, backLabel: R.back }),
    h('main', { class: 'mobile-content empty-state' },
      h('h1', { class: 'empty-state__title' }, title),
      h('p', { class: 'text-secondary' }, body),
      h('a', { class: 'button button--primary', href: myDiningHref }, W.toMyDining)));
}

function announceChange(ticket) {
  if (lastStatus && lastStatus !== ticket.status) {
    const text = { CALLED: W.calledToast, SEATED: W.seatedToast, CANCELLED: ticket.endedBy === 'manager' ? W.endedByStore : W.cancelledToast }[ticket.status];
    if (text) showToast(text);
  }
  lastStatus = ticket.status;
}

function render() {
  const state = getState();
  const ticket = findTicket(state, ticketId);
  if (!ticket) { message(W.notFoundTitle, W.notFoundBody); return; }
  if (ticket.customerId !== state.meta.activeCustomerId) { message(W.notOwnedTitle, W.notOwnedBody); return; }
  const restaurant = state.restaurants.find((r) => r.id === ticket.restaurantId);
  announceChange(ticket);
  const postponing = view() === 'postpone' && ticket.status === 'WAITING';
  document.title = `${postponing ? W.postponeTitle : W.ticketPageTitle} · ${STRINGS.appName}`;
  app.replaceChildren(...(postponing
    ? postponeView(state, ticket, restaurant, {
      onDone: (text) => { go(null); showToast(text); },
      onBack: () => window.history.back(),
      onRefresh: () => { render(); showToast(W.refreshed); },
    })
    : ticketView(state, ticket, restaurant)).filter(Boolean));
  if (!postponing && view() === 'postpone') window.history.replaceState(null, '', pageUrl('customer/waiting.html', { ticketId }));
  if (queryParam('registered') === '1') showRegisteredSheet(ticket, restaurant);
}

render();
subscribe(render);
window.addEventListener('popstate', render);
