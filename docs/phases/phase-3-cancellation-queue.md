# Phase 3 - Cancellation requests, allocation and exclusive offers

## Entry condition

Phase 2 is completed or its limitations are explicitly recorded; user requests this phase.

## Read first

Read CLAUDE.md and docs/PROGRESS.md, then: docs/requirements.md (FR-01..06); docs/data-model.md; docs/use-cases.md; docs/test-plan.md (Q cases).
Inspect matching screenshots listed in docs/reference-screens/README.md if supplied.

## Implementation steps

1. Create C04, C05, C09 and the allocation section of M01.
2. Implement condition entry, duplicate prevention, cancellation, FIFO matching and slot-specific exclusive offers.
3. Create presenter release-slot and advance-clock controls, plus a normal notification service and inbox.
4. Implement decline/expiry, ownership guards and exactly-once successor allocation; use absolute deadlines.
5. Display checkout as unavailable until Phase 4; do not mark an offer accepted/booked yet.

## Acceptance criteria

- [ ] Older mismatched request is skipped while eligible requests retain application order.
- [ ] One release gives exactly one live offer to its actual owner.
- [ ] Current presenter identity cannot steal another customer offer.
- [ ] Refresh preserves remaining time; expiry/decline generates one successor.
- [ ] No eligible request leaves an available slot without booking.
- [ ] Manager status and customer request view refer to the same IDs.

## Out of scope

No real or simulated successful checkout until Phase 4. No broadcast booking race.

## Handoff

Update docs/PROGRESS.md with files, test evidence, unverified items and decisions.
Report the exact page/actions to review. Suggest `phase-3: <completed scope>` as a
commit message. Stop after this phase; do not automatically begin the next one.
