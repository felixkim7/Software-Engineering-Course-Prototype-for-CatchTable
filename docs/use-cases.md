# Use Cases and Demonstration Flows

## UC-PB: Cancellation-seat Priority Booking (formal description)

Primary: reservation customer. Supporting: restaurant manager, payment service,
notification service. Trigger: cancellation releases a slot with matching queue entries.
Preconditions: valid request, enabled restaurant feature, stored conditions/FIFO order,
configured offer/payment policy. Customer must be authenticated as the mock owner to confirm.

| Step | Main success flow |
|---|---|
| 1 | Identify released restaurant/date/time/party conditions. |
| 2 | Select the earliest eligible request. |
| 3 | Grant a time-limited offer and temporarily hold its slot. |
| 4 | Ask mock notification service to deliver offer and deadline. |
| 5 | Customer opens offer from inbox or cancellation request list. |
| 6 | Display conditions, deposit, cancellation rules and remaining time. |
| 7 | Customer agrees to required terms and requests confirmation. |
| 8 | Validate owner/deadline; request payment when a deposit is required. |
| 9 | Mock payment returns success. |
| 10 | Persist reservation, consume offer and end the matching queue request. |
| 11 | Show and notify confirmation to the customer. |
| 12 | Manager sees the confirmed booking in restaurant reservation records. |

| Branch | Required behavior |
|---|---|
| 2a no eligible request | No offer; return slot to normal available status. |
| 4a failed notification | Record/retry delivery; offer remains visible in app; no auto extension. |
| 6a decline | End offer and allocate next eligible request. |
| 7a deadline | Expire unanswered offer and allocate next eligible request. |
| 8a invalid owner/expired | Reject confirmation before payment. |
| 8b zero deposit | Skip payment and commit booking directly. |
| 9a failed/cancelled payment | Do not confirm; retry while deadline valid, otherwise hand off. |
| 9b delayed outcome | Payment-checking state and held slot until resolved. |
| 10a charge succeeded, reservation commit failed | Retry same operation; if unrecoverable, compensate via mock refund before releasing slot. Never double charge. |
| 11a confirmation notification failed | Keep confirmed reservation, retry notification. |

Postconditions: success produces one reservation and required payment, closes the request,
and updates both roles. Failure never falsely displays success; retain the recovery record.
Special requirements: clear states, FIFO among matching requests, no duplicate allocation,
owner/manager guards, and proposed next-offer dispatch within 5 seconds under normal conditions.
Prototype payment timeout behavior follows decisions.md, not an asserted production policy.

## Waiting visibility demonstration

1. Open a waiting restaurant detail page and inspect weekday/time-slot statistics.
2. Register a party and see confirmation.
3. Navigate away to discovery, then revisit the SAME restaurant detail.
4. See active status, party size and current queue position before any button press.
5. Bottom action now opens the existing ticket instead of a second registration form.
6. Use baseline postponement; verify manager queue and derived position update.
7. Manager calls/admit customer, or customer cancels; revisit detail and verify terminal state.
8. Open r2: statistics section exists with a collecting-data state; r3 has no waiting section.

## Late-arrival coordination demonstration

1. Open a seeded confirmed reservation and submit ETA.
2. Show awaiting-manager response, not 'approved'.
3. Switch to manager, inspect original booking and ETA, then choose retain/propose/cannot retain.
4. Switch back to customer; read the actual response.
5. For a proposal, explicitly accept or reject. Only accept changes the booked time.
6. Both roles inspect the same final history.
7. Repeat via reset for other branches. Reporting lateness never triggers automatic refund,
   cancellation, fee waiver, or immediate approval.

## Boundary of the full use case model

The broader model has 22 user-goal use cases after consolidation; only a subset is fully
implemented here. Late coordination and calling/entry each have customer and manager
participants in one shared workflow. Joining, postponing and cancelling waiting remain
separate actions because their outcomes differ. Rebooking status is a manager query,
not a second implementation of customer checkout.
