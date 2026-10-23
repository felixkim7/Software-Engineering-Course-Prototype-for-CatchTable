# Phase 0 - Foundation and visual specification

## Entry condition

User explicitly requests Phase 0. No application code is assumed.

## Read first

Read CLAUDE.md and docs/PROGRESS.md, then: CLAUDE.md; docs/requirements.md; docs/architecture.md; docs/design-system.md; docs/reference-screens/README.md.
Inspect matching screenshots listed in docs/reference-screens/README.md if supplied.

## Implementation steps

1. Inspect available screenshots and create an honest reference inventory; fill visual-spec.md with measured or provisional tokens.
2. Create prototype/index.html, base CSS tokens/layout, store/seed/clock/format/strings/config modules and shared header/modal/toast primitives.
3. Create a tiny neutral sample screen for spacing and components; do not build domain flows yet.
4. Implement a presenter hub with reset, identity/role selection and disabled future scenarios. Add the actual run instructions in prototype/README.md.
5. Create versioned storage, reset epochs and shared navigation helpers; prepare empty domain collections and minimal restaurant/customer fixtures.

## Acceptance criteria

- [ ] The root instruction file and all spec paths resolve.
- [ ] The demo hub opens over HTTP with no console errors.
- [ ] Reset restores the same deterministic starting state with dates based on reset time.
- [ ] Reload restores preferences; reset invalidates pending mock callbacks.
- [ ] Basic dialog works with keyboard and returns focus.
- [ ] Visual-spec records which details are assumptions.

## Out of scope

No discovery, registration, allocation, checkout or lateness implementation.

## Handoff

Update docs/PROGRESS.md with files, test evidence, unverified items and decisions.
Report the exact page/actions to review. Suggest `phase-0: <completed scope>` as a
commit message. Stop after this phase; do not automatically begin the next one.
