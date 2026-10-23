// Dependency-free checks for risky prototype logic. Open tests/index.html over HTTP.
// Uses the real storage key, and restores whatever demo data was there before.
import { STORAGE_KEY, SCHEMA_VERSION, POLICY } from '../assets/js/core/config.js';
import { createSeed, DOMAIN_COLLECTIONS } from '../assets/js/core/seed-data.js';
import { getState, getStorageStatus, resetDemo, setPreference, afterMockDelay } from '../assets/js/core/store.js';
import { now, advance } from '../assets/js/core/clock.js';
import { seoulDateKey, addDays, weekdayOf, seoulHour, formatKRW, escapeHtml } from '../assets/js/core/format.js';
import { hourSlots, waitingStatistics } from '../assets/js/services/statistics.js';
import { bookingDates, bookingTimes } from '../assets/js/services/booking.js';
import { isSaved, toggleSaved, savedRestaurantList, hasCoupon, claimCoupon, recordView, recentRestaurants } from '../assets/js/services/customer.js';
import {
  activeQueue, activeTicketFor, addWalkIn, callTicket, cancelWaiting, findTicket, isActive, managerCancelTicket,
  postponeChoices, postponeWaiting, queuePosition, registerWaiting, registrationStatus, seatTicket, setAccepting,
} from '../assets/js/services/waiting.js';
import { applyPreset } from '../assets/js/services/presets.js';
import {
  declineOffer, findRequest, joinQueue, offerIsLive, queueRank, reconcileOffers, releaseSlot, withdrawRequest,
} from '../assets/js/services/allocation.js';
import { customerNotifications, retryFailedNotifications, setFailNextNotification } from '../assets/js/services/notification.js';
import {
  chargesForOffer, compensatePayment, REQUIRED_CONSENTS, reservationForOffer, resolveUnknownPayment, retryReservationCommit, setPaymentFlag, startCheckout,
} from '../assets/js/services/payment.js';
import { reconcile } from '../assets/js/services/reconcile.js';
import { coordinationFor, decideProposal, respondToLate, submitEta } from '../assets/js/services/late-arrival.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const results = [];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function check(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true });
  } catch (error) {
    results.push({ name, ok: false, error: error.message });
  }
}

const sameJson = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const backup = localStorage.getItem(STORAGE_KEY);

try {
  await check('seed is identical for the same reset instant', () => {
    const t = Date.parse('2026-10-23T03:00:00Z');
    assert(sameJson(createSeed(t), createSeed(t)), 'two seeds differ');
  });

  await check('seed base date is the Seoul date of the reset instant', () => {
    const afterSeoulMidnight = Date.parse('2026-10-23T15:30:00Z');  // 2026-10-24 00:30 KST
    assert(createSeed(afterSeoulMidnight).meta.baseDate === '2026-10-24', 'wrong Seoul date');
    assert(createSeed(afterSeoulMidnight + DAY_MS).meta.baseDate === '2026-10-25', 'date did not follow reset time');
  });

  await check('seed has required fixtures and empty domain collections', () => {
    const seed = createSeed(Date.now());
    const byId = (list) => Object.fromEntries(list.map((item) => [item.id, item]));
    const r = byId(seed.restaurants);
    const m = byId(seed.managers);
    assert(r.r1.waitingEnabled && r.r1.bookingEnabled && r.r1.policies.depositPerPersonKRW === 10000, 'r1 fixture');
    assert(r.r2.waitingEnabled, 'r2 fixture');
    assert(!r.r3.waitingEnabled && r.r3.bookingEnabled && r.r3.policies.depositPerPersonKRW === 0, 'r3 fixture');
    assert(['c1', 'c2', 'c3'].every((id) => byId(seed.customers)[id]), 'customers');
    assert(m.m1.restaurantId === 'r1' && m.m2.restaurantId === 'r2', 'manager assignment');
    const unseeded = DOMAIN_COLLECTIONS.filter((name) => !['waitingStatistics', 'waitingTickets', 'reservations'].includes(name));
    assert(unseeded.every((name) => seed[name].length === 0), 'later-phase collections not empty');
  });

  await check('reset restores the seed exactly, with a new epoch and default preferences', () => {
    resetDemo();
    const epochBefore = getState().meta.scenarioEpoch;
    setPreference('activeRole', 'manager');
    setPreference('activeCustomerId', 'c2');
    advance(60 * 1000);
    resetDemo();
    const state = getState();
    assert(state.meta.scenarioEpoch === epochBefore + 1, 'epoch not incremented');
    const expected = createSeed(Date.parse(state.meta.resetAt), state.meta.scenarioEpoch);
    assert(sameJson(state, expected), 'reset snapshot differs from seed');
  });

  await check('preferences are written to storage, revision +1 per change', () => {
    resetDemo();
    assert(setPreference('activeManagerId', 'm2').ok, 'rejected');
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    assert(stored.meta.activeManagerId === 'm2', 'not persisted');
    assert(stored.meta.revision === 1, `revision ${stored.meta.revision}`);
  });

  await check('invalid preferences are rejected without mutation', () => {
    const revision = getState().meta.revision;
    assert(setPreference('activeCustomerId', 'c999').reason === 'INVALID_PREFERENCE', 'unknown id accepted');
    assert(setPreference('activeRole', 'admin').reason === 'INVALID_PREFERENCE', 'unknown role accepted');
    assert(setPreference('__proto__', 'x').reason === 'INVALID_PREFERENCE', 'unknown key accepted');
    assert(getState().meta.revision === revision, 'state changed');
  });

  await check('clock advance shifts now(); reset zeroes the offset', () => {
    resetDemo();
    const before = now();
    advance(10 * 60 * 1000);
    const shifted = now() - before;
    assert(shifted >= 600000 && shifted < 605000, `shifted ${shifted} ms`);
    resetDemo();
    assert(getState().meta.clockOffsetMs === 0, 'offset not zeroed');
  });

  await check('mock callback runs when no reset happens', async () => {
    resetDemo();
    const result = await afterMockDelay(() => 'done', 20);
    assert(result.ok && result.value === 'done', 'callback did not run');
  });

  await check('reset invalidates a pending mock callback', async () => {
    resetDemo();
    let ran = false;
    const pending = afterMockDelay(() => { ran = true; }, 20);
    resetDemo();
    const result = await pending;
    assert(!ran && result.reason === 'STALE_EPOCH', 'stale callback ran');
  });

  await check('corrupt snapshot is reported, kept, and blocks writes until reset', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');
    assert(getStorageStatus() === 'corrupt', 'not reported');
    assert(setPreference('activeRole', 'manager').reason === 'STORAGE_CORRUPT', 'write allowed');
    assert(localStorage.getItem(STORAGE_KEY) === '{not json', 'corrupt data overwritten silently');
    resetDemo();
    assert(getStorageStatus() === 'ok', 'reset did not recover');
  });

  await check('older schema is reported as outdated, kept, and blocks writes until reset', () => {
    const old = createSeed(Date.now());
    old.meta.schemaVersion = SCHEMA_VERSION - 1;
    const raw = JSON.stringify(old);
    localStorage.setItem(STORAGE_KEY, raw);
    assert(getStorageStatus() === 'outdated', `status ${getStorageStatus()}`);
    assert(setPreference('activeRole', 'manager').reason === 'STORAGE_OUTDATED', 'write allowed');
    assert(localStorage.getItem(STORAGE_KEY) === raw, 'old data overwritten silently');
    resetDemo();
    assert(getStorageStatus() === 'ok', 'reset did not recover');
  });

  await check('format helpers', () => {
    assert(formatKRW(20000) === '20,000원', formatKRW(20000));
    assert(escapeHtml(`<a href="x">'&'</a>`) === '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;', 'escape');
    assert(seoulDateKey(Date.parse('2026-10-23T14:59:59Z')) === '2026-10-23', 'before Seoul midnight');
    assert(seoulDateKey(Date.parse('2026-10-23T15:00:00Z')) === '2026-10-24', 'at Seoul midnight');
    assert(addDays('2026-10-01', -1) === '2026-09-30' && addDays('2026-12-31', 1) === '2027-01-01', 'addDays');
    assert(weekdayOf('2026-10-23') === 5 && weekdayOf('2026-10-25') === 0, 'weekdayOf (Fri=5, Sun=0)');
    assert(seoulHour(Date.parse('2026-10-23T14:59:00Z')) === 23 && seoulHour(Date.parse('2026-10-23T15:00:00Z')) === 0, 'seoulHour');
  });

  // ---- Waiting statistics (FR-09, FR-10) ----
  const seed = createSeed(Date.parse('2026-10-23T03:00:00Z'));
  const restaurant = (id) => seed.restaurants.find((r) => r.id === id);

  await check('hour slots cover opening hours', () => {
    const slots = hourSlots({ open: '11:00', close: '21:00' });
    assert(slots.length === 10 && slots[0] === '11:00' && slots[9] === '20:00', slots.join(','));
  });

  await check('every waiting-enabled restaurant has a record for every weekday x hour', () => {
    for (const r of seed.restaurants.filter((x) => x.waitingEnabled)) {
      for (const slot of hourSlots(r.hours)) {
        for (let weekday = 0; weekday < 7; weekday += 1) {
          const found = seed.waitingStatistics.some((s) => s.restaurantId === r.id && s.weekday === weekday && s.timeSlot === slot);
          assert(found, `${r.id} missing ${weekday} ${slot}`);
        }
      }
    }
  });

  await check('r1 ready with sparse cells, r2 collecting, r3 not applicable', () => {
    const r1 = waitingStatistics(seed, restaurant('r1'));
    const r2 = waitingStatistics(seed, restaurant('r2'));
    assert(r1.status === 'ready' && r2.status === 'collecting', `${r1.status}/${r2.status}`);
    assert(waitingStatistics(seed, restaurant('r3')) === null, 'r3 has statistics');
    const r1Cells = r1.slots.flatMap((slot) => [0, 1, 2, 3, 4, 5, 6].map((d) => r1.cell(d, slot)));
    assert(r1Cells.some((c) => c.status === 'ready') && r1Cells.some((c) => c.status === 'collecting'), 'r1 lacks a mix of cells');
  });

  await check('sparse cells never expose a number, so they cannot render as zero', () => {
    for (const id of ['r1', 'r2']) {
      const stats = waitingStatistics(seed, restaurant(id));
      for (const slot of stats.slots) {
        for (let weekday = 0; weekday < 7; weekday += 1) {
          const cell = stats.cell(weekday, slot);
          if (cell.sampleCount < POLICY.statsMinSamples) {
            assert(cell.status === 'collecting' && !('avgMinutes' in cell) && !('avgTeams' in cell), `${id} ${weekday} ${slot} leaked a value`);
          } else {
            assert(cell.status === 'ready' && cell.avgMinutes > 0 && cell.avgTeams > 0, `${id} ${weekday} ${slot} ready cell invalid`);
          }
        }
      }
    }
    const empty = waitingStatistics(seed, restaurant('r2')).cell(3, '15:00');
    assert(empty.status === 'collecting' && empty.sampleCount === 0, 'zero-sample cell');
  });

  await check('statistics period is the last 4 weeks before the reset day', () => {
    const stats = waitingStatistics(seed, restaurant('r1'));
    assert(stats.periodEnd === '2026-10-22' && stats.periodStart === '2026-09-25', `${stats.periodStart}~${stats.periodEnd}`);
    assert(Date.parse(stats.updatedAt) <= Date.parse(seed.meta.resetAt), 'updatedAt after reset');
  });

  // ---- Mock booking availability and customer lists ----
  await check('booking availability follows fixture sold-out days, times and the clock', () => {
    const noonSeoul = Date.parse('2026-10-23T03:00:00Z');  // 12:00 KST on the reset day
    const r1Tomorrow = bookingTimes(seed, restaurant('r1'), '2026-10-24', noonSeoul);
    assert(!r1Tomorrow.find((t) => t.time === '19:00').available && r1Tomorrow.find((t) => t.time === '18:00').available, 'r1 day+1 19:00');
    const r2 = bookingDates(seed, restaurant('r2'), noonSeoul);
    assert(r2.length === 14 && !r2[0].available && r2[1].available, 'r2 sold out today only');
    const late = Date.parse('2026-10-23T09:10:00Z');  // 18:10 KST
    const today = bookingTimes(seed, restaurant('r1'), '2026-10-23', late);
    assert(!today.find((t) => t.time === '18:00').available && today.find((t) => t.time === '18:30').available, 'past times not bookable');
  });

  await check('save toggles per customer and coupon claims are idempotent', () => {
    resetDemo();
    assert(toggleSaved('r1').ok && isSaved(getState(), 'r1'), 'save');
    assert(savedRestaurantList(getState()).map((r) => r.id).join() === 'r1', 'saved list');
    setPreference('activeCustomerId', 'c2');
    assert(!isSaved(getState(), 'r1'), 'leaked to another customer');
    setPreference('activeCustomerId', 'c1');
    assert(toggleSaved('r1').ok && !isSaved(getState(), 'r1'), 'unsave');
    assert(toggleSaved('nope').reason === 'NOT_FOUND', 'unknown restaurant accepted');
    assert(claimCoupon('cp-r1-corkage').ok && claimCoupon('cp-r1-corkage').ok, 'claim');
    assert(getState().couponClaims.length === 1 && hasCoupon(getState(), 'cp-r1-corkage'), 'duplicate claim');
    assert(claimCoupon('nope').reason === 'NOT_FOUND', 'unknown coupon accepted');
  });

  await check('recent views: newest first, no duplicates, per customer', () => {
    resetDemo();
    recordView('r1'); recordView('r2'); recordView('r1');
    assert(recentRestaurants(getState()).map((r) => r.id).join() === 'r1,r2', 'order/duplicates');
    setPreference('activeCustomerId', 'c2');
    assert(recentRestaurants(getState()).length === 0, 'leaked to another customer');
    setPreference('activeCustomerId', 'c1');
    assert(recordView('nope').reason === 'NOT_FOUND', 'unknown restaurant accepted');
  });

  // ---- On-site waiting (Phase 2) ----
  const r1 = () => getState().restaurants.find((r) => r.id === 'r1');
  const ticket = (id) => findTicket(getState(), id);

  await check('seed queue: positions derive from queueOrder; called party first', () => {
    resetDemo();
    const queue = activeQueue(getState(), 'r1');
    assert(queue.length === 7 && queue[0].status === 'CALLED', `${queue.length} ${queue[0].status}`);
    assert(queuePosition(getState(), ticket('w-r1-6')) === 3 && queuePosition(getState(), ticket('w-r1-1')) === null, 'positions');
  });

  await check('registration is idempotent per customer and restaurant; party is validated', () => {
    resetDemo();
    assert(registerWaiting('r1', { adults: 0, infants: 1 }).reason === 'INVALID_PARTY', 'zero adults');
    assert(registerWaiting('r1', { adults: 6, infants: 1 }).reason === 'INVALID_PARTY', 'over max');
    const first = registerWaiting('r1', { adults: 2, infants: 0 });
    const second = registerWaiting('r1', { adults: 3, infants: 0 });
    const mine = getState().waitingTickets.filter((t) => t.customerId === 'c1' && isActive(t));
    assert(first.ok && second.reason === 'ALREADY_WAITING' && second.ticketId === first.ticketId && mine.length === 1, JSON.stringify(second));
    assert(queuePosition(getState(), ticket(first.ticketId)) === 8 && ticket(first.ticketId).ticketNumber === 11, 'appended at the end');
  });

  await check('registration rules: r2 needs 2 waiting parties; closing keeps live tickets', () => {
    resetDemo();
    assert(registerWaiting('r2', { adults: 2, infants: 0 }).reason === 'WAITING_MIN_TEAMS', 'r2 min teams');
    assert(addWalkIn('r2').ok && registerWaiting('r2', { adults: 2, infants: 0 }).ok, 'r2 opens at 2 parties');
    const own = registerWaiting('r1', { adults: 2, infants: 0 });
    assert(setAccepting(false).ok && !r1().waiting.accepting, 'close r1 as m1');
    assert(activeTicketFor(getState(), 'r1')?.id === own.ticketId, 'live ticket lost when closing');
    setPreference('activeCustomerId', 'c2');
    assert(registerWaiting('r1', { adults: 2, infants: 0 }).reason === 'WAITING_CLOSED', 'closed still accepts');
    setPreference('activeCustomerId', 'c1');
  });

  await check('postpone: any later place, live-checked, at most 2 times, not after a call', () => {
    applyPreset('waitingActive');
    const id = 'w-r1-6';
    const choices = postponeChoices(getState(), ticket(id), r1());
    assert(choices.position === 3 && choices.positions.map((p) => p.position).join() === '4,5,6,7' && choices.positions[0].extraMinutes === 15, JSON.stringify(choices));
    assert(postponeWaiting(id, 2, 5).reason === 'QUEUE_CHANGED', 'stale expected position accepted');
    assert(postponeWaiting(id, 3, 9).reason === 'QUEUE_CHANGED', 'out-of-range target accepted');
    assert(postponeWaiting(id, 3, 5).ok && queuePosition(getState(), ticket(id)) === 5, 'move to 5th');
    assert(activeQueue(getState(), 'r1')[4].id === id, 'manager queue disagrees');
    assert(postponeWaiting(id, 5, 6).ok && postponeChoices(getState(), ticket(id), r1()).reason === 'POSTPONE_LIMIT', 'limit');
    assert(postponeWaiting(id, 6, 7).reason === 'POSTPONE_LIMIT', 'third postponement accepted');
    applyPreset('waitingActive');
    assert(callTicket(id).ok && postponeWaiting(id, 3, 4).reason === 'POSTPONE_CALLED', 'postponed after call');
  });

  await check('manager: call limit, seat/cancel are terminal, other restaurant forbidden', () => {
    applyPreset('waitingActive');
    const id = 'w-r1-6';
    assert(callTicket(id).ok && callTicket(id).ok && callTicket(id).reason === 'CALL_LIMIT', 'call limit');
    setPreference('activeManagerId', 'm2');
    assert(seatTicket(id).reason === 'FORBIDDEN' && setAccepting(false).ok && r1().waiting.accepting, 'm2 changed r1');
    setPreference('activeManagerId', 'm1');
    assert(seatTicket(id).ok && seatTicket(id).reason === 'TICKET_ENDED', 'seat twice');
    assert(activeTicketFor(getState(), 'r1') === null && ticket(id).status === 'SEATED', 'still active after seat');
    assert(managerCancelTicket('w-r1-7').ok && callTicket('w-r1-7').reason === 'TICKET_ENDED', 'call after cancel');
  });

  await check('customer cancel: owner only, once; other customers never see the ticket', () => {
    applyPreset('waitingActive');
    setPreference('activeCustomerId', 'c2');
    assert(activeTicketFor(getState(), 'r1') === null && cancelWaiting('w-r1-6').reason === 'TICKET_NOT_OWNED', 'c2 sees or cancels c1 ticket');
    setPreference('activeCustomerId', 'c1');
    assert(cancelWaiting('w-r1-6').ok && cancelWaiting('w-r1-6').reason === 'TICKET_ENDED', 'cancel twice');
    assert(activeTicketFor(getState(), 'r1') === null && registrationStatus(getState(), r1()).open, 'register again after cancel');
  });

  // ---- Cancellation-seat queue (Phase 3) ----
  const condition = (partySize = 2, serviceTime = '19:00') => ({ restaurantId: 'r1', serviceDate: addDays(getState().meta.baseDate, 1), serviceTime, partySize });
  const liveOffers = () => getState().priorityOffers.filter((o) => o.status === 'OFFERED');
  const MINUTE = 60 * 1000;

  await check('Q01 one release, one offer: older mismatched request skipped, FIFO kept', () => {
    applyPreset('cancellationReady');
    const result = releaseSlot(condition());
    const state = getState();
    const [offer] = liveOffers();
    assert(result.ok && liveOffers().length === 1 && offer.ownerId === 'c1' && offer.requestId === 'cr-2', JSON.stringify(liveOffers()));
    assert(findRequest(state, 'cr-1').status === 'QUEUED' && findRequest(state, 'cr-3').status === 'QUEUED', 'others changed');
    const slot = state.releasedSlots.find((s) => s.id === result.slotId);
    assert(slot.status === 'HELD' && slot.offerId === offer.id && offer.expiresAt === new Date(Date.parse(offer.issuedAt) + POLICY.offerLifetimeMs).toISOString(), 'hold/deadline');
  });

  await check('Q02 repeated reconcile writes nothing; a second slot goes to the next request', () => {
    applyPreset('offerActive');
    const revision = getState().meta.revision;
    assert(reconcileOffers().expired === 0 && reconcileOffers().expired === 0 && getState().meta.revision === revision, 'reconcile wrote');
    releaseSlot(condition());
    const owners = liveOffers().map((o) => o.ownerId).sort().join();
    const perSlot = getState().releasedSlots.every((s) => liveOffers().filter((o) => o.slotId === s.id).length === 1);
    assert(owners === 'c1,c2' && perSlot, owners);
  });

  await check('Q03 a non-owner cannot decline or withdraw, and nothing changes', () => {
    applyPreset('offerActive');
    const [offer] = liveOffers();
    setPreference('activeCustomerId', 'c2');
    const before = JSON.stringify(getState().priorityOffers);
    assert(declineOffer(offer.id).reason === 'OFFER_NOT_OWNED' && withdrawRequest('cr-2').reason === 'REQUEST_NOT_OWNED', 'non-owner accepted');
    assert(JSON.stringify(getState().priorityOffers) === before, 'state changed');
    setPreference('activeCustomerId', 'c1');
  });

  await check('Q04/Q05 absolute deadline; expiry hands off exactly once', () => {
    applyPreset('offerActive');
    const [offer] = liveOffers();
    advance(MINUTE);
    reconcileOffers();
    assert(liveOffers()[0]?.id === offer.id && liveOffers()[0].expiresAt === offer.expiresAt, 'deadline moved or expired early');
    advance(MINUTE + 1000);
    assert(reconcileOffers().expired === 1 && reconcileOffers().expired === 0, 'expired more than once');
    const [next] = liveOffers();
    assert(findRequest(getState(), 'cr-2').status === 'EXPIRED' && next?.ownerId === 'c2' && liveOffers().length === 1, 'successor');
    assert(Date.parse(next.expiresAt) - Date.parse(next.issuedAt) === POLICY.offerLifetimeMs, 'successor deadline');
  });

  await check('Q05 decline hands off to exactly one successor; c3 (4 people) never matches', () => {
    applyPreset('offerActive');
    const [offer] = liveOffers();
    assert(declineOffer(offer.id).ok && declineOffer(offer.id).reason === 'OFFER_ENDED', 'decline twice');
    assert(findRequest(getState(), 'cr-2').status === 'DECLINED' && liveOffers().map((o) => o.ownerId).join() === 'c2', 'successor');
    setPreference('activeCustomerId', 'c2');
    declineOffer(liveOffers()[0].id);
    setPreference('activeCustomerId', 'c1');
    const slot = getState().releasedSlots[0];
    assert(liveOffers().length === 0 && slot.status === 'AVAILABLE' && findRequest(getState(), 'cr-1').status === 'QUEUED', 'mismatched request offered');
  });

  await check('Q06 deadline boundary: now === expiresAt is expired', () => {
    const offer = { status: 'OFFERED', expiresAt: new Date(1000).toISOString() };
    assert(offerIsLive(offer, 999) && !offerIsLive(offer, 1000) && !offerIsLive({ ...offer, status: 'DECLINED' }, 0), 'boundary');
  });

  await check('Q07 nobody eligible: the slot becomes AVAILABLE and the time reopens', () => {
    resetDemo();
    const time = () => bookingTimes(getState(), r1(), condition().serviceDate, now()).find((t) => t.time === '19:00');
    assert(time().soldOut && !time().available, 'fixture not sold out');
    const result = releaseSlot(condition());
    assert(result.ok && getState().priorityOffers.length === 0 && getState().releasedSlots[0].status === 'AVAILABLE' && time().available, 'not reopened');
  });

  await check('Q08 a failed notification keeps the offer and deadline; retry delivers it', () => {
    applyPreset('cancellationReady');
    setFailNextNotification(true);
    releaseSlot(condition());
    const [offer] = liveOffers();
    const note = getState().notifications.find((n) => n.entityId === offer.id);
    assert(note.deliveryStatus === 'FAILED' && !getState().meta.failNextNotification && customerNotifications(getState()).length === 0, 'delivery');
    assert(retryFailedNotifications().ok && customerNotifications(getState())[0].entityId === offer.id, 'retry');
    assert(liveOffers()[0].expiresAt === offer.expiresAt, 'deadline extended');
  });

  await check('requests: one live per exact condition, open times refused, withdraw hands on, rejoin is new', () => {
    applyPreset('cancellationReady');
    assert(joinQueue(condition()).reason === 'DUPLICATE_REQUEST', 'duplicate');
    assert(joinQueue(condition(2, '18:00')).reason === 'TIME_AVAILABLE', 'open time accepted');
    assert(joinQueue(condition(9)).reason === 'INVALID_CONDITION', 'party over max');
    const other = joinQueue(condition(2, '19:30'));
    assert(other.ok && queueRank(getState(), findRequest(getState(), other.requestId)) === 1, 'other condition');
    releaseSlot(condition());
    assert(withdrawRequest('cr-2').ok && findRequest(getState(), 'cr-2').status === 'CANCELLED' && liveOffers()[0].ownerId === 'c2', 'withdraw offered');
    const again = joinQueue(condition());
    const fresh = findRequest(getState(), again.requestId);
    assert(again.ok && again.requestId !== 'cr-2' && fresh.requestedAt > findRequest(getState(), 'cr-2').requestedAt, 'rejoin');
  });

  // ---- Priority checkout and payment outcomes (Phase 4) ----
  const consented = { consents: REQUIRED_CONSENTS, purposes: ['데이트'], requestNote: '창가 자리 부탁드려요' };
  const offerState = (id = 'of-1') => getState().priorityOffers.find((o) => o.id === id);
  const settle = () => { advance(1000); return reconcile(); };  // the mock processor answers after 600 ms of demo time

  await check('P01/P02 success: one operation, one charge, one reservation; repeats change nothing', () => {
    applyPreset('offerActive');
    const first = startCheckout('of-1', consented);
    const repeat = startCheckout('of-1', consented);
    assert(first.ok && repeat.ok && repeat.operationId === first.operationId && getState().paymentOperations.length === 1, 'double submit');
    settle();
    const reservation = reservationForOffer(getState(), 'of-1');
    assert(offerState().status === 'BOOKED' && reservation?.depositKRW === 20000 && reservation.purposes[0] === '데이트', 'booking');
    assert(chargesForOffer(getState(), 'of-1').length === 1 && getState().reservations.length === 2, 'counts');
    const slot = getState().releasedSlots[0];
    assert(slot.status === 'BOOKED' && slot.reservationId === reservation.id && findRequest(getState(), 'cr-2').status === 'BOOKED', 'slot/request');
    assert(startCheckout('of-1', consented).reservationId === reservation.id && getState().paymentOperations.length === 1, 'repeat after booking');
    assert(reconcile().settled === 0 && getState().reservations.length === 2, 'settled twice');
  });

  await check('8a: expired, wrong-owner or unconsented confirmations are rejected before payment', () => {
    applyPreset('offerActive');
    assert(startCheckout('of-1', { consents: ['refund'] }).reason === 'CONSENT_REQUIRED', 'consent');
    setPreference('activeCustomerId', 'c2');
    assert(startCheckout('of-1', consented).reason === 'OFFER_NOT_OWNED', 'owner');
    setPreference('activeCustomerId', 'c1');
    advance(POLICY.offerLifetimeMs);  // now === expiresAt (plus the ms since issue): expired
    assert(startCheckout('of-1', consented).reason === 'OFFER_EXPIRED' && getState().paymentOperations.length === 0, 'expired');
  });

  await check('P03 known failure: no charge, retry before the deadline can succeed', () => {
    applyPreset('offerActive');
    setPaymentFlag('failNextPayment', true);
    startCheckout('of-1', consented);
    settle();
    assert(offerState().status === 'OFFERED' && chargesForOffer(getState(), 'of-1').length === 0 && !reservationForOffer(getState(), 'of-1'), 'failure');
    assert(startCheckout('of-1', consented).ok && settle() && offerState().status === 'BOOKED', 'retry');
    assert(getState().paymentOperations.length === 2 && chargesForOffer(getState(), 'of-1').length === 1, 'ledger');
  });

  await check('P04 zero deposit books without a payment operation', () => {
    resetDemo();
    const zero = { restaurantId: 'r3', serviceDate: addDays(getState().meta.baseDate, 2), serviceTime: '18:30', partySize: 2 };
    assert(joinQueue(zero).ok && releaseSlot(zero).ok, 'r3 setup');
    const offer = liveOffers()[0];
    const result = startCheckout(offer.id, consented);
    assert(result.ok && result.reservationId && getState().paymentOperations.length === 0 && reservationForOffer(getState(), offer.id).depositKRW === 0, 'zero deposit');
  });

  await check('P05-P07 unknown result holds the slot past the deadline; resolution settles once', () => {
    applyPreset('offerActive');
    setPaymentFlag('deferNextPayment', true);
    const { operationId } = startCheckout('of-1', consented);
    settle();
    advance(3 * MINUTE);
    reconcile();
    assert(offerState().status === 'PAYMENT_UNKNOWN' && getState().releasedSlots[0].status === 'HELD' && findRequest(getState(), 'cr-3').status === 'QUEUED', 'hold');
    assert(resolveUnknownPayment(operationId, 'FAILED').ok && offerState().status === 'EXPIRED', 'P07 known failure after deadline');
    assert(liveOffers().map((o) => o.ownerId).join() === 'c2' && chargesForOffer(getState(), 'of-1').length === 0, 'one successor, no charge');
    assert(resolveUnknownPayment(operationId, 'SUCCEEDED').reason === 'NOTHING_TO_RESOLVE', 'resolved twice');
    applyPreset('offerActive');
    setPaymentFlag('deferNextPayment', true);
    const again = startCheckout('of-1', consented);
    settle();
    assert(resolveUnknownPayment(again.operationId, 'SUCCEEDED').ok && offerState().status === 'BOOKED' && getState().reservations.length === 2, 'P06 success');
  });

  await check('P08/P09 commit failure after charge: retry reuses the charge, or refund before release', () => {
    applyPreset('offerActive');
    setPaymentFlag('failNextCommit', true);
    const { operationId } = startCheckout('of-1', consented);
    settle();
    advance(3 * MINUTE);
    reconcile();
    assert(offerState().status === 'RECOVERY_PENDING' && getState().releasedSlots[0].status === 'HELD' && liveOffers().length === 0, 'held in recovery');
    assert(retryReservationCommit(operationId).ok && retryReservationCommit(operationId).ok, 'retry twice');
    assert(offerState().status === 'BOOKED' && getState().reservations.length === 2 && getState().paymentOperations.length === 1, 'P08 one charge, one reservation');
    applyPreset('offerActive');
    setPaymentFlag('failNextCommit', true);
    const second = startCheckout('of-1', consented);
    settle();
    assert(compensatePayment(second.operationId).ok && compensatePayment(second.operationId).reason === 'NOTHING_TO_RECOVER', 'compensate once');
    const op = getState().paymentOperations[0];
    assert(op.status === 'REFUNDED' && op.refundedAt && offerState().status === 'REFUNDED' && liveOffers()[0]?.ownerId === 'c2', 'P09 refund then hand-off');
  });

  await check('P10 a failed confirmation notification leaves the booking confirmed', () => {
    applyPreset('offerActive');
    startCheckout('of-1', consented);
    setFailNextNotification(true);
    settle();
    const note = getState().notifications.find((n) => n.kind === 'BOOKING_CONFIRMED');
    assert(note.deliveryStatus === 'FAILED' && offerState().status === 'BOOKED', 'booking reversed');
    assert(retryFailedNotifications().ok && reservationForOffer(getState(), 'of-1').status === 'CONFIRMED', 'retry');
  });

  await check('P11 a payment callback scheduled before a reset cannot touch the new scenario', async () => {
    applyPreset('offerActive');
    startCheckout('of-1', consented);
    const pending = afterMockDelay(reconcile, 50);
    resetDemo();
    const outcome = await pending;
    assert(outcome.reason === 'STALE_EPOCH' && getState().paymentOperations.length === 0 && getState().reservations.length === 1, JSON.stringify(outcome));
  });

  await check('withdrawing or declining is refused while a payment resolves', () => {
    applyPreset('offerActive');
    startCheckout('of-1', consented);
    assert(withdrawRequest('cr-2').reason === 'PAYMENT_IN_PROGRESS' && declineOffer('of-1').reason === 'PAYMENT_IN_PROGRESS', 'slot dropped');
  });

  // ---- Late-arrival coordination (Phase 5) ----
  const rv1 = () => getState().reservations.find((r) => r.id === 'rv-1');
  const lc = () => coordinationFor(getState(), 'rv-1');

  await check('L01 an ETA stays SUBMITTED (not approval); invalid ETAs and other customers are refused', () => {
    resetDemo();
    assert(submitEta('rv-1', '18:00').reason === 'LATE_INVALID_ETA' && submitEta('rv-1', '17:50').reason === 'LATE_INVALID_ETA' && submitEta('rv-1', '24:10').reason === 'LATE_INVALID_ETA', 'eta');
    setPreference('activeCustomerId', 'c2');
    assert(submitEta('rv-1', '18:30').reason === 'RESERVATION_NOT_OWNED' && !lc(), 'other customer');
    setPreference('activeCustomerId', 'c1');
    assert(submitEta('rv-1', '18:30', '교통 체증').ok && lc().status === 'SUBMITTED' && lc().version === 1 && rv1().currentTime === '18:00', 'submitted');
  });

  await check('L02 retain: explicit answer, time unchanged, customer notified, one answer per version', () => {
    applyPreset('lateReady');
    assert(respondToLate('rv-1', 1, 'RETAINED').ok && respondToLate('rv-1', 1, 'CANNOT_RETAIN').reason === 'NOTHING_TO_ANSWER', 'answer once');
    const note = getState().notifications.find((n) => n.kind === 'LATE_RESPONSE');
    assert(lc().status === 'RETAINED' && rv1().currentTime === '18:00' && note?.data.response === 'RETAINED', 'retained');
  });

  await check('L03/L04 only an accepted proposal changes currentTime; originalTime stays', () => {
    applyPreset('lateReady');
    assert(respondToLate('rv-1', 1, 'CHANGE_PROPOSED', '18:00').reason === 'INVALID_PROPOSAL', 'same time');
    respondToLate('rv-1', 1, 'CHANGE_PROPOSED', '18:40');
    assert(rv1().currentTime === '18:00' && decideProposal('rv-1', 1, true).ok, 'accept');
    assert(rv1().currentTime === '18:40' && rv1().originalTime === '18:00' && lc().status === 'CHANGE_ACCEPTED' && decideProposal('rv-1', 1, true).reason === 'STALE_PROPOSAL', 'L03');
    applyPreset('lateReady');
    respondToLate('rv-1', 1, 'CHANGE_PROPOSED', '18:40');
    assert(decideProposal('rv-1', 1, false).ok && rv1().currentTime === '18:00' && lc().status === 'CHANGE_REJECTED', 'L04');
  });

  await check('L05 cannot retain: no cancellation, no refund, booking unchanged', () => {
    applyPreset('lateReady');
    const before = JSON.stringify(rv1());
    assert(respondToLate('rv-1', 1, 'CANNOT_RETAIN').ok && lc().status === 'CANNOT_RETAIN' && JSON.stringify(rv1()) === before, 'booking changed');
    assert(getState().paymentOperations.length === 0, 'refund introduced');
  });

  await check('L06 a new ETA makes the old proposal and old responses obsolete', () => {
    applyPreset('lateReady');
    respondToLate('rv-1', 1, 'CHANGE_PROPOSED', '18:40');
    assert(submitEta('rv-1', '18:50').ok && lc().version === 2 && lc().status === 'SUBMITTED' && lc().proposedTime === null, 'new version');
    assert(decideProposal('rv-1', 1, true).reason === 'STALE_PROPOSAL' && respondToLate('rv-1', 1, 'RETAINED').reason === 'STALE_VERSION', 'stale accepted');
    assert(rv1().currentTime === '18:00' && respondToLate('rv-1', 2, 'RETAINED').ok, 'fresh answer');
    assert(lc().history.map((e) => `${e.version}:${e.actor}:${e.action}`).join() === '1:customer:ETA_SUBMITTED,1:manager:CHANGE_PROPOSED,2:customer:ETA_SUBMITTED,2:manager:RETAINED', 'history');
  });

  await check('L07 another manager or customer cannot act, and nothing changes', () => {
    applyPreset('lateReady');
    setPreference('activeManagerId', 'm2');
    const before = JSON.stringify(getState().lateCoordinations);
    assert(respondToLate('rv-1', 1, 'RETAINED').reason === 'FORBIDDEN' && JSON.stringify(getState().lateCoordinations) === before, 'm2 answered');
    setPreference('activeManagerId', 'm1');
    respondToLate('rv-1', 1, 'CHANGE_PROPOSED', '18:40');
    setPreference('activeCustomerId', 'c2');
    assert(decideProposal('rv-1', 1, true).reason === 'RESERVATION_NOT_OWNED' && rv1().currentTime === '18:00', 'c2 decided');
    setPreference('activeCustomerId', 'c1');
    assert(lc().status === 'CHANGE_PROPOSED' && lc().history.length === 2, 'state');
  });
} finally {
  if (backup === null) localStorage.removeItem(STORAGE_KEY);
  else localStorage.setItem(STORAGE_KEY, backup);
}

const failed = results.filter((r) => !r.ok);
document.getElementById('results').append(...results.map((r) => {
  const item = document.createElement('li');
  item.className = r.ok ? 'pass' : 'fail';
  item.textContent = r.ok ? r.name : `${r.name}: ${r.error}`;
  return item;
}));
document.getElementById('summary').textContent = failed.length
  ? `${failed.length} of ${results.length} checks failed`
  : `All ${results.length} checks passed`;
document.body.dataset.result = failed.length ? 'fail' : 'pass';
failed.forEach((r) => console.error(`FAIL ${r.name}: ${r.error}`));
