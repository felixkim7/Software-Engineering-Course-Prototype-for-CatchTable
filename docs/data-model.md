# Data Model and State Rules

## Entities

| Entity | Minimum fields |
|---|---|
| Customer | id, displayName |
| Manager | id, restaurantId, displayName |
| Restaurant | id, name, district, cuisine, description, rating, reviewCount, saveCount, photoCount, badges[{kind,label}], photos[], stations[{lines[], name, distanceM}], priceBand, hours {open, close}, weeklyHours?, tags[], ribbon?, coupon, aiSummary, awardBanner?, waitingEnabled, bookingEnabled, booking {maxPartySize, windowDays, times, soldOut [[dayOffset, time or null]], openSchedule?, deposit}, menu {categories[{name, range?, items[{name, price, description, image, badges}]}], notes[], boards[], updatedAt}, reviews {distribution[5..1], purposes[]}, photoFilters[], info {intro, award?, address, map, directions?, facilities[], guides[], phone, closedDays?, notices?, capacity?}, news[], broadcasts[] (fixtures in core/fixtures/) |
| SavedRestaurant | customerId, restaurantId, savedAt |
| CouponClaim | customerId, couponId, claimedAt |
| RecentView | customerId, restaurantId, viewedAt (one per customer and restaurant, newest first) |
| ReleasedSlot | id, restaurantId, serviceDate, serviceTime, partySize, status, offerId, reservationId |
| CancellationRequest | id, customerId, restaurantId, serviceDate, serviceTime, partySize, requestedAt, status |
| PriorityOffer | id, requestId, slotId, ownerId, status, issuedAt, expiresAt, paymentOperationId |
| PaymentOperation | id, offerId, customerId, amountKRW, status, createdAt, resolvedAt, reservationId |
| Reservation | id, customerId, restaurantId, serviceDate, originalTime, currentTime, partySize, depositKRW, status, sourceOfferId |
| WaitingTicket | id, customerId, restaurantId, partySize, queueOrder, status, postponementCount, registeredAt |
| WaitingStatistic | restaurantId, weekday, timeSlot, avgMinutes, avgTeams, sampleCount, periodStart, periodEnd, updatedAt |
| LateCoordination | id, reservationId, version, expectedArrival, status, proposedTime, history[] |
| Notification | id, recipientType, recipientId, entityType, entityId, kind, deliveryStatus, readAt, createdAt |
| StoreMeta | schemaVersion, revision, scenarioEpoch, clockOffsetMs, activeRole, activeCustomerId, activeManagerId |

Queue position is derived from active tickets sorted by queueOrder; it is not a fixed
number written independently into every page. Cancellation FIFO uses requestedAt and
must never reuse the on-site waiting queueOrder.

## Cancellation lifecycle

Request: QUEUED -> OFFERED -> BOOKED | DECLINED | EXPIRED.
QUEUED -> CANCELLED is allowed; withdrawing an OFFERED request also terminates its offer
and releases the slot unless payment is already being resolved.

Offer: OFFERED -> PAYMENT_PENDING -> BOOKED.
OFFERED -> DECLINED | EXPIRED.
PAYMENT_PENDING -> PAYMENT_UNKNOWN | RECOVERY_PENDING | BOOKED.
A known failed/cancelled payment returns to OFFERED only while the original deadline is
still valid; otherwise EXPIRED. A zero-deposit confirmation goes from OFFERED to BOOKED.
PAYMENT_UNKNOWN -> BOOKED | RECOVERY_PENDING | known failure resolution.
RECOVERY_PENDING -> BOOKED after a successful retry, or REFUNDED after mock compensation.
Only after compensation is resolved may the slot be offered again.

Slot: AVAILABLE -> HELD -> BOOKED, or HELD -> AVAILABLE after safe termination.
The HELD state covers unresolved payment and recovery; stale background callbacks cannot
turn a BOOKED slot back to AVAILABLE.

## Waiting lifecycle

WAITING -> CALLED -> SEATED; WAITING or CALLED -> CANCELLED by permitted ticket action.
Postpone keeps WAITING but changes queueOrder and increments postponementCount.
Active for detail banners: WAITING or CALLED. Terminal: SEATED or CANCELLED.
After terminal state, remove the active banner; show Register Waiting only if the restaurant
is accepting registrations. Registration availability and active-ticket status are distinct.
Repeated register, postpone, call, admit or cancel commands must validate latest state.

## Late-arrival lifecycle

SUBMITTED -> RETAINED | CHANGE_PROPOSED | CANNOT_RETAIN.
CHANGE_PROPOSED -> CHANGE_ACCEPTED | CHANGE_REJECTED.
A new ETA creates a new version in SUBMITTED and archives the prior exchange.
Only CHANGE_ACCEPTED updates reservation.currentTime to proposedTime.
RETAINED stores the manager's explicit retention decision; originalTime remains auditable.
SUBMITTED, CANNOT_RETAIN and CHANGE_REJECTED do not auto-cancel or approve the reservation.
Both parties see history entries with actor, timestamp, version and action.
Reject a response to an obsolete version with a useful refresh message.

## Invariants

1. At most one live holder per slot; a confirmed slot has exactly one linked reservation.
2. The active offer owner must match the booking requester and payment customer.
3. A request's conditions match the offered slot exactly in this simplified demo.
4. A successful operation can create at most one charge and reservation.
5. A terminal waiting ticket cannot be postponed or admitted twice.
6. A manager cannot change another restaurant's records.
7. Accepting a time proposal checks customer ownership and coordination version.
8. Reset and stale callbacks cannot mix scenario epochs.
9. Notifications point to authoritative records; delivery failure does not roll them back.

## Required fixture set

People and operational records are fictional; restaurants r1-r3 are real public listings (see CLAUDE.md). IDs below are stable technical fixture keys.

- r1 월화식당 마포본점 (real listing): booking + waiting, sufficient statistics, deposit 20000 KRW (mock).
- r2 vivo pizza 공덕점 (real listing): booking + waiting, insufficient statistics; same statistics section with collecting state.
- r3 스시렌 (real listing): booking-only, zero deposit; no irrelevant waiting section.
- c1: presenter customer; active role switches between reservation and waiting experiences.
- c2: next eligible customer; selectable only in presenter tools.
- c3: an older applicant with a mismatched party size, proving matching before FIFO.
- m1 assigned r1; m2 assigned r2 for an ownership-negative check.
- A released r1 slot for two people on reset day + 1 at 19:00.
- Independent waiting tickets for r1 with enough parties to exercise 1/2-place postponement.
- A confirmed r1 reservation on reset day + 1 at 18:00 for late-arrival coordination.
- Statistics fixture cells with both sufficient and insufficient samples.

Scenario presets: clean-start, waiting-active, cancellation-ready, offer-active,
payment-unknown, late-ready. Build presets only when their phase is implemented.
A preset creates a coherent snapshot, not a visual-only screen override.
