# Phase 4 - Priority checkout, payment outcomes and recovery

## Entry condition

Phase 3 is completed or its limitations are explicitly recorded; user requests this phase.

## Read first

Read CLAUDE.md and docs/PROGRESS.md, then: docs/use-cases.md (UC-PB); docs/architecture.md; docs/data-model.md; docs/test-plan.md (P cases).
Inspect matching screenshots listed in docs/reference-screens/README.md if supplied.

## Implementation steps

1. Create C06, C07 and C08; connect the offer checkout action.
2. Validate owner/deadline before payment; show conditions/deposit/policies and required consent.
3. Implement mock success, failure/cancel, zero deposit, unknown result and post-payment reservation commit failure.
4. Persist operation IDs and recovery states, block duplicate submits, restore after reload.
5. Complete manager rebooking status and confirmation inbox, including failed-notification retry.
6. Add presenter failure/resolution/recovery controls scoped to one operation and scenario epoch.

## Acceptance criteria

- [ ] The full UC-PB success flow creates exactly one reservation and one required charge.
- [ ] Expired/wrong-owner confirmation is rejected without charging.
- [ ] Decline, expiry and known failed payments hand off only when safe.
- [ ] Unknown payments hold the slot even after original expiry.
- [ ] Commit failure after payment is retried idempotently or compensated before release.
- [ ] Zero-deposit booking skips payment.
- [ ] Failed notification never reverses a confirmed booking.
- [ ] Reload/repeated click/reset-during-payment checks pass.

## Out of scope

No production processor, real card input, general refund engine or additional booking product.

## Handoff

Update docs/PROGRESS.md with files, test evidence, unverified items and decisions.
Report the exact page/actions to review. Suggest `phase-4: <completed scope>` as a
commit message. Stop after this phase; do not automatically begin the next one.
