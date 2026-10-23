# Phase 2 - Waiting registration, visible state and management

## Entry condition

Phase 1 is completed or its limitations are explicitly recorded; user requests this phase.

## Read first

Read CLAUDE.md and docs/PROGRESS.md, then: docs/data-model.md (waiting); docs/screen-map.md (C02, C03, M02); docs/test-plan.md (W cases).
Inspect matching screenshots listed in docs/reference-screens/README.md if supplied.

## Implementation steps

1. Add waiting service and registration sheet to C02; create C03 and M02.
2. Use selectors to show active ticket status/party/current position and switch the bottom action immediately.
3. Implement baseline postpone choices, cancel, manager call and admit against the same records.
4. Read active ticket on every detail visit/reload/focus; implement terminal and registration-closed variants.
5. Add clean and waiting-active presenter presets and manager queue verification.

## Acceptance criteria

- [ ] Register -> leave detail -> revisit shows active banner before any click.
- [ ] View My Waiting opens the original ticket; double registration creates no duplicate.
- [ ] Postpone choices are bounded by actual queue length and configured limits.
- [ ] Manager sees registration, postponement and cancellation changes.
- [ ] Call and admit propagate; seated/cancelled tickets no longer show as active.
- [ ] Different restaurant/customer views do not expose another ticket.

## Out of scope

No cancellation-seat offers or checkout. Existing postponement must not be described as new.

## Handoff

Update docs/PROGRESS.md with files, test evidence, unverified items and decisions.
Report the exact page/actions to review. Suggest `phase-2: <completed scope>` as a
commit message. Stop after this phase; do not automatically begin the next one.
