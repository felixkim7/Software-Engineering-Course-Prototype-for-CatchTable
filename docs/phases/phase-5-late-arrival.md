# Phase 5 - Customer-manager late-arrival coordination

## Entry condition

Phase 4 is completed or its limitations are explicitly recorded; user requests this phase.

## Read first

Read CLAUDE.md and docs/PROGRESS.md, then: docs/requirements.md (FR-11..14); docs/data-model.md (late coordination); docs/test-plan.md (L cases).
Inspect matching screenshots listed in docs/reference-screens/README.md if supplied.

## Implementation steps

1. Extend C07 with ETA submission and history; create M03 and add manager list request badges.
2. Implement retain, propose-new-time and cannot-retain responses with restaurant ownership checks.
3. Implement customer accept/reject and only update currentTime upon valid acceptance.
4. Create versioned histories and stale proposal guards; an updated ETA starts a fresh version.
5. Add local response notifications and late-ready preset. Keep unanswered/cannot-retain guidance explicit.

## Acceptance criteria

- [ ] ETA submission stays awaiting response until manager acts.
- [ ] All three manager branches work and remain visible after reload.
- [ ] Accept changes currentTime; reject and cannot-retain do not silently change/cancel booking.
- [ ] Both views show identical final agreement and timestamps.
- [ ] Another manager cannot act; an obsolete proposal cannot be accepted.
- [ ] No automatic fee waiver, approval or refund is introduced.

## Out of scope

No automatic GPS tracking, travel-time prediction, real calls/messages or cancellation policy engine.

## Handoff

Update docs/PROGRESS.md with files, test evidence, unverified items and decisions.
Report the exact page/actions to review. Suggest `phase-5: <completed scope>` as a
commit message. Stop after this phase; do not automatically begin the next one.
