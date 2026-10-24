# Data Model and State Rules

## Entities

| Entity | Minimum fields |
|---|---|
| Customer | id, displayName |
| Manager | id, restaurantId, displayName |
| Restaurant | id, name, district, cuisine, description, rating, reviewCount?, saveCount?, photoCount?, badges[{kind, label, stars?}] (kind `michelin` carries stars), photos[], thumbnailOnly? (true when the only photo is a small list thumbnail: row card, small detail photo), stations[{lines[], name, distanceM}], priceBand?, hours? {open, close, closedWeekdays?[0-6, Sunday 0], byWeekday?{weekday: [open, close]}}, weeklyHours?, tags[], ribbon?, coupon?, aiSummary?, awardBanner?, waitingEnabled, bookingEnabled, booking {maxPartySize, windowDays, times, soldOut [[dayOffset, time or null]], openSchedule?} (null when bookingEnabled is false), policies {depositPerPersonKRW} (mock), menu {categories[{name, range?, items[{name, price, description?, image?, badges}]}], notes[], boards[], updatedAt?}, reviews? {distribution[5..1], purposes[]}, photoFilters[], info {intro, award?, address, map?, directions?, facilities[], guides[], phone?, closedDays?, notices?, capacity?}, news[], broadcasts[], waiting {accepting, minutesPerTeam, remoteMinTeams, maxPartySize, hours?} or null (fixtures in core/fixtures/; `accepting` is changed by the manager). `?` = may be null: r4-r14 leave every field no public source states as null (including info.address for r9/r11) and the UI omits that section (no invented counts, reviews or menus). Booking times are empty on `closedWeekdays`; statistics slots use `waiting.hours`, else `hours` |
| SavedRestaurant | customerId, restaurantId, savedAt |
| CouponClaim | customerId, couponId, claimedAt |
| RecentView | customerId, restaurantId, viewedAt (one per customer and restaurant, newest first) |
| ReleasedSlot | id (`rs-n`), restaurantId, serviceDate, serviceTime, partySize, status (AVAILABLE/HELD/BOOKED), offerId, reservationId, releasedAt |
| CancellationRequest | id (`cr-n`, shown to customer and manager), customerId, restaurantId, serviceDate, serviceTime, partySize, requestedAt, status, offerId, endedAt |
| PriorityOffer | id (`of-n`), requestId, slotId, ownerId, status, issuedAt, expiresAt, endedAt, paymentOperationId |
| PaymentOperation | id (`pay-n`), offerId, customerId, amountKRW, method (DEMO_CARD), status (PENDING/SUCCEEDED/FAILED/UNKNOWN/REFUNDED), processor {outcome SUCCEEDED/FAILED/DEFERRED, readyAt}, details {purposes, requestNote}, createdAt, resolvedAt, reservationId, refundedAt |
| Reservation | id (`rv-n`), customerId, restaurantId, serviceDate, originalTime, currentTime, partySize, depositKRW, status (CONFIRMED), sourceOfferId, paymentOperationId, purposes[], requestNote, createdAt |
| WaitingTicket | id (`w-<restaurant>-<number>`), customerId (null for other parties), guest (fictional masked phone), restaurantId, ticketNumber, channel (app/onsite/manual), party {adults, infants}, partySize, queueOrder, status, postponementCount, callCount, registeredAt, calledAt, endedAt, endedBy |
| WaitingStatistic | restaurantId, weekday, timeSlot, avgMinutes, avgTeams, sampleCount, periodStart, periodEnd, updatedAt |
| LateCoordination | id (`lc-n`), reservationId (one record per reservation), version, expectedArrival, reason, status, proposedTime, submittedAt, respondedAt, decidedAt, history[{version, at, actor customer/manager, actorId, action, eta/proposedTime/previousTime}] |
| Notification | id (`nt-n`), recipientType, recipientId, entityType (offer/waitingTicket), entityId, kind (OFFER_ISSUED/OFFER_EXPIRED/WAITING_CALLED), data (display facts), deliveryStatus (SENT/FAILED), attempts, readAt, createdAt |
| StoreMeta | schemaVersion, revision, scenarioEpoch, clockOffsetMs, resetAt, baseDate, activeRole, activeCustomerId, activeManagerId, failNextNotification, failNextPayment, deferNextPayment, failNextCommit |

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
RECOVERY_PENDING -> BOOKED after a successful retry, or REFUNDED after mock compensation
(the request then ends as REFUNDED and the slot is offered to the next request).
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

People and operational records are fictional; restaurants r1-r14 are real restaurants (r1-r3 from the user's captures, r4-r14 from capture 170629 plus public web pages; see CLAUDE.md and docs/assets.md). IDs below are stable technical fixture keys.

- r1 월화식당 마포본점 (real listing): booking + waiting, sufficient statistics, deposit 10000 KRW per person (mock; 20000 for the seeded party of 2).
- r2 vivo pizza 공덕점 (real listing): booking + waiting, insufficient statistics; same statistics section with collecting state.
- r3 스시렌 (real listing): booking-only, zero deposit; no irrelevant waiting section.
- r4 밍글스, r5 Restaurant EVETT: booking-only fine dining (mock deposits); r5 is closed on Sunday and Monday, so those days offer no times.
- r6 우월소곱창 신도림본점: booking + waiting with a seeded queue of 3 and statistics. r7 작은따옴표 도림천점: waiting-only (`bookingEnabled: false`, `booking: null`).
- r8 이자카야나무 사당역2호점, r9 돌판장 양재, r10 팔향 (closed Sunday), r12 투머트 (closed Monday): booking-only.
- r11 마담풍천 보라매: booking + waiting with every statistics cell collecting. r13 월화고기 보라매점: booking + waiting,
  queue of 4 and statistics. r14 화포식당 한남점: waiting-only, queue of 2 and statistics over mock waiting hours 11-23
  (the restaurant itself is open 24 hours). r9 and r11 have no public address, phone, hours or menu.
- c1: presenter customer; active role switches between reservation and waiting experiences.
- c2: next eligible customer; selectable only in presenter tools.
- c3: an older applicant with a mismatched party size, proving matching before FIFO
  (cancellation-ready: cr-1 c3 4 people, cr-2 c1 2 people, cr-3 c2 2 people, all r1 day+1 19:00).
- m1 assigned r1; m2 assigned r2 for an ownership-negative check.
- A released r1 slot for two people on reset day + 1 at 19:00.
- r1 queue at reset: 1 called + 6 waiting parties (plus seated/cancelled history); #6 is the app
  ticket the waiting-active preset gives to c1 (3rd in line). r2: one party, so its
  "2팀 이상부터 온라인 웨이팅 가능" rule applies until another party arrives.
- A confirmed r1 reservation on reset day + 1 at 18:00 for late-arrival coordination (rv-1, seeded since Phase 4).
- Statistics fixture cells with both sufficient and insufficient samples.

Scenario presets (clean-start and waiting-active in Phase 2, cancellation-ready and offer-active in Phase 3, payment-unknown in Phase 4, late-ready in Phase 5; all implemented): clean-start, waiting-active, cancellation-ready, offer-active,
payment-unknown, late-ready. Build presets only when their phase is implemented.
A preset creates a coherent snapshot, not a visual-only screen override.
