// Shared pieces of the cancellation-seat flow: condition labels, the remaining-time format,
// the join sheet opened from a sold-out time, and the detail-page strips for a live request/offer.
import { POLICY } from '../core/config.js';
import { STRINGS } from '../core/strings.js';
import { getState } from '../core/store.js';
import { now } from '../core/clock.js';
import { addDays, formatClockTime, formatShortDate, seoulDateKey, weekdayOf } from '../core/format.js';
import { pageUrl } from '../core/nav.js';
import { customerRequests, isLiveRequest, joinQueue, liveOffersFor, matchingQueue, queueRank, findOffer, offerIsLive } from '../services/allocation.js';
import { h } from './dom.js';
import { icon } from './icons.js';
import { openSheet } from './sheet.js';
import { showToast } from './toast.js';

const C = STRINGS.cancellation;
const B = STRINGS.booking;

export function dateLabel(dateKey) {
  const today = seoulDateKey(now());
  const prefix = dateKey === today ? B.today : dateKey === addDays(today, 1) ? B.tomorrow : formatShortDate(dateKey);
  return `${prefix} (${STRINGS.weekdays[weekdayOf(dateKey)]})`;
}

/** '내일 (토) 오후 7:00 · 2명' */
export const conditionText = (c) => C.condition(dateLabel(c.serviceDate), formatClockTime(c.serviceTime), c.partySize);

/** Remaining milliseconds -> '1:52' (never negative). */
export function formatRemaining(ms) {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

/** Clock time of an ISO instant in Seoul, as '오후 7:42'. */
export function clockOf(instant) {
  const time = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(instant));
  return formatClockTime(time);
}

/** Join sheet for one exact condition. `onJoined(requestId)` runs after a successful join. */
export function openJoinSheet(restaurant, condition, onJoined) {
  const ahead = matchingQueue(getState(), condition).length;
  const submit = h('button', {
    class: 'button button--primary', type: 'button',
    onclick: () => {
      submit.disabled = true;
      const result = joinQueue(condition);
      dialog.close();
      showToast(result.ok ? C.joinedToast : STRINGS.errors[result.reason] ?? STRINGS.errors.INVALID_STATE);
      if (result.ok) onJoined(result.requestId);
    },
  }, C.joinSubmit);
  const dialog = openSheet({
    title: C.joinTitle,
    className: 'sheet--join',
    body: h('div', { class: 'join' },
      h('div', { class: 'join__card' },
        h('p', { class: 'join__name' }, restaurant.name),
        h('p', { class: 'join__condition' }, conditionText(condition)),
        h('p', { class: 'join__ahead' }, C.joinAhead(ahead))),
      h('p', { class: 'join__intro' }, C.joinIntro),
      h('ul', { class: 'join__rules' }, C.joinRules(POLICY.offerLifetimeMs / 60000).map((rule) => h('li', {}, icon('check'), h('span', {}, rule))))),
    footer: h('div', { class: 'sheet__actions' },
      h('button', { class: 'button', type: 'button', onclick: () => dialog.close() }, STRINGS.common.cancel), submit),
  });
}

/** Strips above the detail bottom bar: a live offer first, otherwise the earliest live request. */
export function cancellationStrip(state, restaurant) {
  const [offer] = liveOffersFor(state, restaurant.id);
  if (offer) {
    return h('a', { class: 'ticket-strip ticket-strip--called', href: pageUrl('customer/offer.html', { offerId: offer.id }) },
      h('span', { class: 'ticket-strip__label' }, C.stripOffer),
      h('span', { class: 'ticket-strip__text' }, C.stripOfferText(clockOf(offer.expiresAt))),
      icon('chevronRight'));
  }
  const request = customerRequests(state).filter((r) => r.restaurantId === restaurant.id && r.status === 'QUEUED')
    .sort((a, b) => a.requestedAt.localeCompare(b.requestedAt))[0];
  if (!request) return null;
  return h('a', { class: 'ticket-strip', href: pageUrl('customer/cancellation-queue.html') },
    h('span', { class: 'ticket-strip__label' }, C.stripQueued),
    h('span', { class: 'ticket-strip__text' }, C.stripQueuedText(conditionText(request), queueRank(state, request))),
    icon('chevronRight'));
}

/** Live requests of the active customer and whether any holds an offer (마이다이닝 entry card). */
export function liveRequestSummary(state) {
  const live = customerRequests(state).filter(isLiveRequest);
  const nowMs = now();
  return { count: live.length, offer: live.some((r) => r.status === 'OFFERED' && offerIsLive(findOffer(state, r.offerId), nowMs)) };
}
