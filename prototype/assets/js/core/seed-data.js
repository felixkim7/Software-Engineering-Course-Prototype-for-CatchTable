// Deterministic fixture factory. The same reset instant always yields the same snapshot;
// every date is derived from that instant (never a frozen calendar date).
// People are fictional; restaurant sources are in restaurant-fixtures.js.
// Fixture IDs are the stable keys used in docs/data-model.md.

import { SCHEMA_VERSION, POLICY } from './config.js';
import { seoulDateKey, addDays } from './format.js';
import { restaurants } from './restaurant-fixtures.js';

// Domain collections start empty; each phase seeds its own records and presets.
export const DOMAIN_COLLECTIONS = [
  'releasedSlots', 'cancellationRequests', 'priorityOffers', 'paymentOperations',
  'reservations', 'waitingTickets', 'waitingStatistics', 'lateCoordinations', 'notifications',
  'savedRestaurants', 'couponClaims', 'recentViews',
];
export const FIXTURE_COLLECTIONS = ['customers', 'managers', 'restaurants'];

function customers() {
  return [
    { id: 'c1', displayName: '김하늘' },  // presenter customer
    { id: 'c2', displayName: '이도윤' },  // next eligible applicant
    { id: 'c3', displayName: '박서연' },  // older applicant with a mismatched party size
  ];
}

function managers() {
  return [
    { id: 'm1', restaurantId: 'r1', displayName: '월화식당 매장 관리자' },
    { id: 'm2', restaurantId: 'r2', displayName: 'vivo pizza 매장 관리자' },
  ];
}

// MOCK waiting statistics: per hour [base average minutes, base record count, base average
// teams], scaled per weekday, matching the app's "요일별 평균 웨이팅 시간" (평균 N팀 | M분).
// r1 (dinner only) peaks at 19-20h; its weekday opening and closing hours get few
// registrations and stay below the record minimum. r2 and r11 keep every cell collecting.
const WEEKDAY_FACTOR = [1.3, 0.8, 0.8, 0.9, 1.0, 1.3, 1.5];  // Sunday..Saturday
const STAT_PATTERNS = {
  r1: { 16: [10, 4, 1], 17: [25, 12, 4], 18: [45, 22, 8], 19: [60, 24, 11], 20: [50, 18, 9], 21: [25, 9, 4], 22: [10, 3, 1] },
  r2: { 11: [10, 1, 1], 12: [30, 2, 4], 13: [20, 2, 3], 14: [10, 1, 1], 15: [5, 0, 1], 16: [5, 1, 1], 17: [15, 1, 2], 18: [30, 2, 4], 19: [30, 2, 4], 20: [15, 1, 2] },
  r6: { 16: [5, 3, 1], 17: [15, 8, 2], 18: [35, 18, 5], 19: [50, 22, 7], 20: [40, 16, 6], 21: [20, 9, 3], 22: [10, 4, 1] },
  r7: { 12: [10, 6, 1], 13: [15, 9, 2], 14: [20, 11, 3], 15: [20, 10, 3], 16: [15, 8, 2], 17: [15, 7, 2], 18: [25, 12, 4], 19: [40, 16, 6], 20: [40, 15, 6], 21: [25, 9, 3], 22: [10, 4, 1] },
  r11: { 11: [10, 1, 1], 12: [20, 2, 3], 13: [15, 1, 2], 14: [10, 0, 1], 15: [5, 0, 1], 16: [5, 0, 1], 17: [15, 1, 2], 18: [25, 2, 3], 19: [30, 2, 4], 20: [20, 1, 2], 21: [10, 1, 1] },
  r13: { 16: [5, 4, 1], 17: [20, 10, 3], 18: [40, 20, 7], 19: [55, 24, 9], 20: [45, 18, 7], 21: [20, 8, 3] },
  r14: { 11: [10, 6, 1], 12: [30, 18, 5], 13: [20, 12, 3], 14: [10, 6, 1], 15: [5, 4, 1], 16: [10, 5, 1], 17: [15, 8, 2], 18: [30, 16, 5], 19: [35, 18, 6], 20: [25, 12, 4], 21: [15, 7, 2], 22: [10, 5, 1] },
};

function waitingStatistics(baseDate) {
  const period = {
    periodStart: addDays(baseDate, -7 * POLICY.statsPeriodWeeks),
    periodEnd: addDays(baseDate, -1),
    updatedAt: new Date(`${baseDate}T00:00:00+09:00`).toISOString(),
  };
  return Object.entries(STAT_PATTERNS).flatMap(([restaurantId, pattern]) =>
    WEEKDAY_FACTOR.flatMap((factor, weekday) =>
      Object.entries(pattern).map(([hour, [minutes, samples, teams]]) => {
        const sampleCount = Math.round(samples * factor);
        return {
          restaurantId,
          weekday,
          timeSlot: `${hour}:00`,
          avgMinutes: sampleCount ? Math.max(5, Math.round((minutes * factor) / 5) * 5) : null,
          avgTeams: sampleCount ? Math.max(1, Math.round(teams * factor)) : null,
          sampleCount,
          ...period,
        };
      })));
}

// MOCK on-site queues at reset time: other parties (walk-ins and other app users) with fictional
// masked phone numbers. [number, channel, adults, infants, status, registered min ago, ended min ago]
// r1: one called, six waiting, plus seated/cancelled history for the manager tabs. #6 is the
// app ticket the waiting-active preset assigns to c1 (3rd in line, as capture 183416).
// r2: a single party, so vivo's "2팀 이상부터 온라인 웨이팅 가능" rule applies at first.
const QUEUE_FIXTURES = {
  r1: [
    [1, 'onsite', 2, 0, 'SEATED', 70, 30], [2, 'onsite', 3, 0, 'CANCELLED', 65, 40], [3, 'manual', 4, 0, 'SEATED', 60, 20],
    [4, 'onsite', 2, 0, 'CALLED', 50, null], [5, 'onsite', 2, 1, 'WAITING', 42], [6, 'app', 2, 0, 'WAITING', 38],
    [7, 'onsite', 2, 0, 'WAITING', 28], [8, 'manual', 4, 0, 'WAITING', 20], [9, 'onsite', 2, 0, 'WAITING', 12], [10, 'app', 3, 0, 'WAITING', 5],
  ],
  r2: [[1, 'onsite', 2, 0, 'WAITING', 10]],
  r6: [[1, 'onsite', 2, 0, 'WAITING', 15], [2, 'onsite', 3, 0, 'WAITING', 8], [3, 'onsite', 2, 0, 'WAITING', 3]],
  r13: [[1, 'onsite', 2, 0, 'SEATED', 40, 10], [2, 'onsite', 4, 0, 'WAITING', 20], [3, 'app', 2, 0, 'WAITING', 12], [4, 'onsite', 3, 0, 'WAITING', 6], [5, 'onsite', 2, 0, 'WAITING', 2]],
  r14: [[1, 'onsite', 2, 0, 'WAITING', 9], [2, 'onsite', 2, 0, 'WAITING', 4]],
};
const MINUTE_MS = 60 * 1000;

function waitingTickets(resetAtMs) {
  const at = (minutesAgo) => new Date(resetAtMs - minutesAgo * MINUTE_MS).toISOString();
  return Object.entries(QUEUE_FIXTURES).flatMap(([restaurantId, rows]) =>
    rows.map(([number, channel, adults, infants, status, registeredAgo, endedAgo = null]) => ({
      id: `w-${restaurantId}-${number}`,
      restaurantId,
      ticketNumber: number,
      customerId: null,
      guest: `010-****-${String(4000 + number * 137).slice(-4)}`,  // fictional
      channel,
      party: { adults, infants },
      partySize: adults + infants,
      queueOrder: number,
      status,
      postponementCount: 0,
      callCount: status === 'CALLED' ? 1 : 0,
      registeredAt: at(registeredAgo),
      calledAt: status === 'CALLED' ? at(3) : null,
      endedAt: endedAgo === null ? null : at(endedAgo),
      endedBy: endedAgo === null ? null : status === 'SEATED' ? 'manager' : 'customer',
    })));
}

// A confirmed ordinary booking of c1 (tomorrow 18:00, 2 people, deposit paid earlier) for the
// 마이다이닝 list now and late-arrival coordination in Phase 5 (data-model fixture set).
function reservations(baseDate, resetAtMs) {
  return [{
    id: 'rv-1', customerId: 'c1', restaurantId: 'r1', serviceDate: addDays(baseDate, 1), originalTime: '18:00', currentTime: '18:00',
    partySize: 2, depositKRW: 20000, status: 'CONFIRMED', sourceOfferId: null, paymentOperationId: null,
    purposes: [], requestNote: '', createdAt: new Date(resetAtMs - 2 * 24 * 60 * MINUTE_MS).toISOString(),
  }];
}

export function createSeed(resetAtMs, scenarioEpoch = 1) {
  const baseDate = seoulDateKey(resetAtMs);
  return {
    meta: {
      schemaVersion: SCHEMA_VERSION,
      revision: 0,
      scenarioEpoch,
      clockOffsetMs: 0,
      resetAt: new Date(resetAtMs).toISOString(),
      baseDate,
      activeRole: 'customer',
      activeCustomerId: 'c1',
      activeManagerId: 'm1',
      failNextNotification: false,  // presenter one-shots (services/notification.js, services/payment.js)
      failNextPayment: false,
      deferNextPayment: false,
      failNextCommit: false,
    },
    customers: customers(),
    managers: managers(),
    restaurants: restaurants(),
    ...Object.fromEntries(DOMAIN_COLLECTIONS.map((name) => [name, []])),
    waitingStatistics: waitingStatistics(baseDate),
    waitingTickets: waitingTickets(resetAtMs),
    reservations: reservations(baseDate, resetAtMs),
  };
}
