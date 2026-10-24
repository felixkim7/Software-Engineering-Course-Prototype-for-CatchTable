// Live waiting pieces of the C02 detail page: the queue card of the 웨이팅 area (183200) and the
// To-Be ticket strip above the bottom bar, visible on load whenever the customer holds a ticket.
import { STRINGS } from '../core/strings.js';
import { pageUrl } from '../core/nav.js';
import { queueSummary, queuePosition } from '../services/waiting.js';
import { h } from './dom.js';
import { icon } from './icons.js';

const W = STRINGS.waiting;

export function queueBlock(state, restaurant, onRefresh) {
  const { teams, minutes } = queueSummary(state, restaurant);
  return h('section', { class: 'detail-block queue-block', 'aria-labelledby': 'queue-title' },
    h('div', { class: 'detail-block__head' },
      h('h2', { class: 'detail-block__title', id: 'queue-title' }, W.sectionTitle),
      h('button', { class: 'refresh-link', type: 'button', onclick: onRefresh }, W.refresh, icon('refresh'))),
    h('div', { class: 'queue-card' },
      h('span', { class: 'queue-card__badge' }, W.storeBadge),
      h('span', { class: 'queue-card__type' }, W.dineIn),
      h('span', { class: 'queue-card__value' }, W.queueLine(teams, minutes))),
    h('p', { class: 'detail-caption' }, W.estimateNote));
}

/** Link to the customer's live ticket, or null. */
export function ticketStrip(state, ticket) {
  if (!ticket) return null;
  const called = ticket.status === 'CALLED';
  return h('a', { class: `ticket-strip${called ? ' ticket-strip--called' : ''}`, href: pageUrl('customer/waiting.html', { ticketId: ticket.id }) },
    h('span', { class: 'ticket-strip__label' }, called ? W.calledLabel : W.activeLabel),
    h('span', { class: 'ticket-strip__text' }, called ? W.calledLine : W.activeLine(queuePosition(state, ticket), ticket.partySize, ticket.ticketNumber)),
    icon('chevronRight'));
}
