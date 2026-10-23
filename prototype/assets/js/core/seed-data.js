// Deterministic fixture factory. The same reset instant always yields the same snapshot;
// every date is derived from that instant (never a frozen calendar date).
// Names are fictional. Fixture IDs are the stable keys used in docs/data-model.md.

import { SCHEMA_VERSION, POLICY } from './config.js';
import { seoulDateKey } from './format.js';

// Domain collections start empty; each phase seeds its own records and presets.
export const DOMAIN_COLLECTIONS = [
  'releasedSlots', 'cancellationRequests', 'priorityOffers', 'paymentOperations',
  'reservations', 'waitingTickets', 'waitingStatistics', 'lateCoordinations', 'notifications',
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
    { id: 'm1', restaurantId: 'r1', displayName: '하루담 식당 관리자' },
    { id: 'm2', restaurantId: 'r2', displayName: '모래시계 라멘 관리자' },
  ];
}

function restaurants() {
  return [
    {
      id: 'r1', name: '하루담 식당', district: '마포', cuisine: '한식', priceBand: '2-3만원',
      image: null, waitingEnabled: true, bookingEnabled: true,
      policies: { depositKRW: POLICY.bookingDepositKRW },
    },
    {
      id: 'r2', name: '모래시계 라멘', district: '성수', cuisine: '라멘', priceBand: '1-2만원',
      image: null, waitingEnabled: true, bookingEnabled: false,
      policies: { depositKRW: 0 },
    },
    {
      id: 'r3', name: '구름정원 비스트로', district: '한남', cuisine: '양식', priceBand: '4-5만원',
      image: null, waitingEnabled: false, bookingEnabled: true,
      policies: { depositKRW: 0 },
    },
  ];
}

export function createSeed(resetAtMs, scenarioEpoch = 1) {
  return {
    meta: {
      schemaVersion: SCHEMA_VERSION,
      revision: 0,
      scenarioEpoch,
      clockOffsetMs: 0,
      resetAt: new Date(resetAtMs).toISOString(),
      baseDate: seoulDateKey(resetAtMs),
      activeRole: 'customer',
      activeCustomerId: 'c1',
      activeManagerId: 'm1',
    },
    customers: customers(),
    managers: managers(),
    restaurants: restaurants(),
    ...Object.fromEntries(DOMAIN_COLLECTIONS.map((name) => [name, []])),
  };
}
