// On-site waiting tickets (NOT cancellation-seat requests). One queue per restaurant ordered by
// queueOrder; a ticket's position is always derived from the live queue, never stored.
// Customer commands act for the active presenter customer, manager commands for the active
// manager and only on that manager's restaurant. Every command re-validates the newest state.
import { POLICY } from '../core/config.js';
import { commit } from '../core/store.js';
import { now } from '../core/clock.js';
import { notify } from './notification.js';

const ACTIVE = new Set(['WAITING', 'CALLED']);
export const isActive = (ticket) => ACTIVE.has(ticket.status);
const customerId = (state) => state.meta.activeCustomerId;
const reject = (reason, extra = {}) => ({ ok: false, reason, ...extra });

export function findTicket(state, ticketId) {
  return state.waitingTickets.find((t) => t.id === ticketId) ?? null;
}

export function activeQueue(state, restaurantId) {
  return state.waitingTickets.filter((t) => t.restaurantId === restaurantId && isActive(t)).sort((a, b) => a.queueOrder - b.queueOrder);
}

/** 1-based place in line, or null when the ticket has ended. */
export function queuePosition(state, ticket) {
  const index = activeQueue(state, ticket.restaurantId).findIndex((t) => t.id === ticket.id);
  return index < 0 ? null : index + 1;
}

/** MOCK estimate: teams x the restaurant's minutes per team. Always displayed as approximate. */
export const estimateMinutes = (restaurant, teams) => teams * restaurant.waiting.minutesPerTeam;

export function queueSummary(state, restaurant) {
  const queue = activeQueue(state, restaurant.id);
  return { teams: queue.length, people: queue.reduce((sum, t) => sum + t.partySize, 0), minutes: estimateMinutes(restaurant, queue.length) };
}

/** The active customer's live ticket at this restaurant, if any. */
export function activeTicketFor(state, restaurantId) {
  return state.waitingTickets.find((t) => t.restaurantId === restaurantId && t.customerId === customerId(state) && isActive(t)) ?? null;
}

export function customerTickets(state) {
  return state.waitingTickets.filter((t) => t.customerId === customerId(state)).sort((a, b) => b.registeredAt.localeCompare(a.registeredAt));
}

/** Whether the active customer could register now. Independent of any ticket they already hold. */
export function registrationStatus(state, restaurant) {
  if (!restaurant.waitingEnabled) return { open: false, reason: 'NOT_WAITING_RESTAURANT' };
  if (!restaurant.waiting.accepting) return { open: false, reason: 'WAITING_CLOSED' };
  if (activeQueue(state, restaurant.id).length < restaurant.waiting.remoteMinTeams) return { open: false, reason: 'WAITING_MIN_TEAMS' };
  return { open: true };
}

/** Later places the ticket may move to (next one down to the last party) and remaining uses. */
export function postponeChoices(state, ticket, restaurant) {
  const remaining = POLICY.waitingPostponeLimit - ticket.postponementCount;
  const reason = ticket.status === 'CALLED' ? 'POSTPONE_CALLED'
    : !isActive(ticket) ? 'TICKET_ENDED'
      : remaining <= 0 ? 'POSTPONE_LIMIT' : null;
  const position = queuePosition(state, ticket);
  const last = activeQueue(state, ticket.restaurantId).length;
  const positions = reason || !position ? [] : Array.from({ length: last - position }, (_, i) => ({
    position: position + 1 + i,
    extraMinutes: estimateMinutes(restaurant, 1 + i),
  }));
  return { position, remaining: Math.max(remaining, 0), positions, reason: reason ?? (positions.length ? null : 'POSTPONE_NO_CHOICE') };
}

// ---- Customer commands ----

/** Appends a ticket at the end of the restaurant's queue with the next ticket number. */
function appendTicket(state, restaurantId, fields) {
  const ticketNumber = Math.max(0, ...state.waitingTickets.filter((t) => t.restaurantId === restaurantId).map((t) => t.ticketNumber)) + 1;
  const ticket = {
    id: `w-${restaurantId}-${ticketNumber}`, restaurantId, ticketNumber,
    queueOrder: Math.max(0, ...activeQueue(state, restaurantId).map((t) => t.queueOrder)) + 1,
    status: 'WAITING', postponementCount: 0, callCount: 0,
    registeredAt: new Date(now()).toISOString(), calledAt: null, endedAt: null, endedBy: null,
    ...fields,
  };
  state.waitingTickets.push(ticket);
  return ticket;
}

/** Registers the active customer. A second attempt returns ALREADY_WAITING with the live ticket. */
export function registerWaiting(restaurantId, party) {
  let ticketId = null;
  const result = commit((state) => {
    const restaurant = state.restaurants.find((r) => r.id === restaurantId);
    if (!restaurant) return reject('NOT_FOUND');
    const existing = activeTicketFor(state, restaurantId);
    if (existing) return reject('ALREADY_WAITING', { ticketId: existing.id });
    const status = registrationStatus(state, restaurant);
    if (!status.open) return reject(status.reason);
    const { adults, infants } = party;
    const valid = Number.isInteger(adults) && Number.isInteger(infants) && adults >= 1 && infants >= 0
      && adults + infants <= restaurant.waiting.maxPartySize;
    if (!valid) return reject('INVALID_PARTY');
    ticketId = appendTicket(state, restaurantId, {
      customerId: customerId(state), guest: null, channel: 'app', party: { adults, infants }, partySize: adults + infants,
    }).id;
  });
  return result.ok ? { ok: true, ticketId } : result;
}

function ownTicket(state, ticketId) {
  const ticket = findTicket(state, ticketId);
  if (!ticket) return { error: reject('NOT_FOUND') };
  if (ticket.customerId !== customerId(state)) return { error: reject('TICKET_NOT_OWNED') };
  return { ticket };
}

/**
 * Moves the ticket to `targetPosition`. `expectedPosition` is the place the customer saw; if the
 * queue moved since, the request is rejected instead of guessing what they meant.
 */
export function postponeWaiting(ticketId, expectedPosition, targetPosition) {
  return commit((state) => {
    const { ticket, error } = ownTicket(state, ticketId);
    if (error) return error;
    const restaurant = state.restaurants.find((r) => r.id === ticket.restaurantId);
    const choices = postponeChoices(state, ticket, restaurant);
    if (choices.reason) return reject(choices.reason);
    if (choices.position !== expectedPosition) return reject('QUEUE_CHANGED');
    if (!choices.positions.some((p) => p.position === targetPosition)) return reject('QUEUE_CHANGED');
    const queue = activeQueue(state, ticket.restaurantId).filter((t) => t.id !== ticket.id);
    queue.splice(targetPosition - 1, 0, ticket);
    queue.forEach((t, index) => { t.queueOrder = index + 1; });
    ticket.postponementCount += 1;
  });
}

export function cancelWaiting(ticketId) {
  return commit((state) => {
    const { ticket, error } = ownTicket(state, ticketId);
    if (error) return error;
    if (!isActive(ticket)) return reject('TICKET_ENDED');
    Object.assign(ticket, { status: 'CANCELLED', endedAt: new Date(now()).toISOString(), endedBy: 'customer' });
  });
}

// ---- Manager commands (assigned restaurant only) ----

export function managerRestaurant(state) {
  const manager = state.managers.find((m) => m.id === state.meta.activeManagerId);
  return state.restaurants.find((r) => r.id === manager?.restaurantId) ?? null;
}

function managedTicket(state, ticketId) {
  const ticket = findTicket(state, ticketId);
  if (!ticket) return { error: reject('NOT_FOUND') };
  if (ticket.restaurantId !== managerRestaurant(state)?.id) return { error: reject('FORBIDDEN') };
  if (!isActive(ticket)) return { error: reject('TICKET_ENDED') };
  return { ticket };
}

export function callTicket(ticketId) {
  return commit((state) => {
    const { ticket, error } = managedTicket(state, ticketId);
    if (error) return error;
    if (ticket.callCount >= POLICY.waitingCallLimit) return reject('CALL_LIMIT');
    Object.assign(ticket, { status: 'CALLED', callCount: ticket.callCount + 1, calledAt: new Date(now()).toISOString() });
    if (ticket.customerId) {
      notify(state, {
        customerId: ticket.customerId, kind: 'WAITING_CALLED', entityType: 'waitingTicket', entityId: ticket.id,
        data: { restaurantId: ticket.restaurantId, ticketNumber: ticket.ticketNumber },
      });
    }
  });
}

function endTicket(ticketId, status) {
  return commit((state) => {
    const { ticket, error } = managedTicket(state, ticketId);
    if (error) return error;
    Object.assign(ticket, { status, endedAt: new Date(now()).toISOString(), endedBy: 'manager' });
  });
}

export const seatTicket = (ticketId) => endTicket(ticketId, 'SEATED');
export const managerCancelTicket = (ticketId) => endTicket(ticketId, 'CANCELLED');

/** 접수중 / 접수마감. Existing tickets are unaffected. */
export function setAccepting(accepting) {
  return commit((state) => {
    const restaurant = managerRestaurant(state);
    if (!restaurant?.waiting) return reject('FORBIDDEN');
    restaurant.waiting.accepting = accepting;
  });
}

// ---- Presenter tool ----

/** Adds one fictional walk-in party (2 adults) to the end of a restaurant's queue. */
export function addWalkIn(restaurantId) {
  return commit((state) => {
    const restaurant = state.restaurants.find((r) => r.id === restaurantId);
    if (!restaurant?.waitingEnabled) return reject('NOT_FOUND');
    const ticket = appendTicket(state, restaurantId, { customerId: null, guest: null, channel: 'onsite', party: { adults: 2, infants: 0 }, partySize: 2 });
    ticket.guest = `010-****-${String(4000 + ticket.ticketNumber * 137).slice(-4)}`;  // fictional
  });
}
