# Phase 6 - Cross-role integration, polish and rehearsal

## Entry condition

Phase 5 is completed or its limitations are explicitly recorded; user requests this phase.

## Read first

Read CLAUDE.md and docs/PROGRESS.md, then: docs/test-plan.md; docs/demo-script.md; docs/design-system.md; docs/PROGRESS.md.
Inspect matching screenshots listed in docs/reference-screens/README.md if supplied.

## Implementation steps

1. Run all domain and navigation checks against a fresh reset; fix regressions only.
2. Review all three theme walkthroughs, empty/error/expired states and role ownership.
3. Compare available references at equal viewports; finish responsive and accessible interaction details.
4. Confirm relative paths, local assets and HTTP-only operation; do not publish automatically.
5. Finalize prototype/README.md with actual routes, supported limitations, reset and rehearsal instructions.
6. Update PROGRESS with passed/failed/unverified evidence and a concise final handoff.

## Acceptance criteria

- [ ] All three walkthroughs run without editing source or storage manually.
- [ ] All visible buttons work or intentionally explain unavailability.
- [ ] No console errors, duplicate reservations/payments, stuck unresolved states without resolution controls.
- [ ] 390x844 and 360px customer views, 1440x900 and 1024px manager views are usable.
- [ ] Keyboard dialogs, form labels, focus and status announcements verified.
- [ ] Reset restores a coherent scenario; local assets work without external network.
- [ ] Demo script can be rehearsed within its suggested time allocation.

## Out of scope

No new features, backend, framework migration, deployment or unrelated redesign.

## Handoff

Update docs/PROGRESS.md with files, test evidence, unverified items and decisions.
Report the exact page/actions to review. Suggest `phase-6: <completed scope>` as a
commit message. Stop after this phase; do not automatically begin the next one.
