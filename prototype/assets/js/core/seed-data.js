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
// registrations and stay below the record minimum. r2 keeps every cell collecting.
const WEEKDAY_FACTOR = [1.3, 0.8, 0.8, 0.9, 1.0, 1.3, 1.5];  // Sunday..Saturday
const STAT_PATTERNS = {
  r1: { 16: [10, 4, 1], 17: [25, 12, 4], 18: [45, 22, 8], 19: [60, 24, 11], 20: [50, 18, 9], 21: [25, 9, 4], 22: [10, 3, 1] },
  r2: { 11: [10, 1, 1], 12: [30, 2, 4], 13: [20, 2, 3], 14: [10, 1, 1], 15: [5, 0, 1], 16: [5, 1, 1], 17: [15, 1, 2], 18: [30, 2, 4], 19: [30, 2, 4], 20: [15, 1, 2] },
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
    },
    customers: customers(),
    managers: managers(),
    restaurants: restaurants(),
    ...Object.fromEntries(DOMAIN_COLLECTIONS.map((name) => [name, []])),
    waitingStatistics: waitingStatistics(baseDate),
  };
}
