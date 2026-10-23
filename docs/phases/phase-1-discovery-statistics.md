# Phase 1 - Discovery, restaurant detail and statistics

## Entry condition

Phase 0 is completed or its limitations are explicitly recorded; user requests this phase.

## Read first

Read CLAUDE.md and docs/PROGRESS.md, then: docs/screen-map.md; docs/design-system.md; docs/requirements.md (FR-09, FR-10); docs/decisions.md.
Inspect matching screenshots listed in docs/reference-screens/README.md if supplied.

## Implementation steps

1. Create C01 and C02 with local filters and stable restaurantId links.
2. Create r1/r2/r3 fixtures and render booking/waiting capability independently.
3. Add weekday and time-slot selection, historical median chart/list, sample count, period and update timestamp.
4. Render collecting-data for r2 and sparse cells; do not render a waiting section for r3.
5. Keep future registration/booking buttons unavailable until their phases; do not simulate success with a toast.

## Acceptance criteria

- [ ] All restaurant cards open the correct detail and back navigation works.
- [ ] Both waiting-enabled fixtures show the same statistics component.
- [ ] Sparse samples are labelled collecting, never zero.
- [ ] Period/update timestamp and median units are visible.
- [ ] Booking-only fixture has no waiting registration or statistics.
- [ ] At 360px, labels and sticky layout do not overlap.

## Out of scope

No working waiting registration, cancellation queue, payment or ETA forms.

## Handoff

Update docs/PROGRESS.md with files, test evidence, unverified items and decisions.
Report the exact page/actions to review. Suggest `phase-1: <completed scope>` as a
commit message. Stop after this phase; do not automatically begin the next one.
