# Development Progress

Current phase: Phase 0 COMPLETE (2026-10-23). Next authorized candidate: Phase 1, which
starts only on an explicit user request.

| Phase | Status | Verification evidence |
|---|---|---|
| 0 Foundation | Complete | 38/38 headless Edge checks, 12/12 self-check page, 2 extra store checks (2026-10-23) |
| 1 Discovery and statistics | Not started | None |
| 2 Waiting | Not started | None |
| 3 Cancellation queue | Not started | None |
| 4 Priority booking | Not started | None |
| 5 Late arrival | Not started | None |
| 6 Integration | Not started | None |

## Current session (2026-10-23, Phase 0)

- Requested phase: Phase 0 only.

**Files created**

- `prototype/index.html`: presenter hub.
- `prototype/README.md`
- `prototype/customer/ui-sample.html`
- `prototype/tests/index.html`, `prototype/tests/foundation.test.js`
- `prototype/assets/css/`: tokens.css, base.css, components.css, mobile.css, desktop.css
- `prototype/assets/js/core/`: config.js, store.js, seed-data.js, clock.js, format.js, strings.js, nav.js
- `prototype/assets/js/ui/`: dom.js, header.js, modal.js, toast.js
- `prototype/assets/js/pages/`: hub.js, ui-sample.js
- `prototype/assets/images/logo.svg`: user-supplied, byte copy.

**Files updated:** `docs/visual-spec.md`, `docs/reference-screens/README.md`, `docs/assets.md`, this file.

**Completed steps**

1. Inventoried the 14 user screenshots (per-file table in reference-screens/README.md). Pixel-sampled colors and estimated sizes into visual-spec.md, each marked Measured, Estimated, Assumption or Deviation.
2. Scaffolded CSS tokens and layout, core modules (config, store, seed, clock, format, strings, nav) and UI primitives (header, `<dialog>` confirm, toast live region).
3. Built a neutral mobile sample screen (`customer/ui-sample.html`). It contains no domain flow.
4. Built the presenter hub:
   - reset behind a confirmation dialog
   - demo clock +1/+10 min
   - role, customer and manager selection
   - future presets and routes labelled unavailable, with no dead controls
   - storage corrupt/unavailable banner

   Run instructions are in `prototype/README.md`.
5. Store details:
   - Uses the key `catchtable-prototype:v1` with schemaVersion, revision and scenarioEpoch.
   - `commit()` is the single writer.
   - `afterMockDelay()` drops callbacks from an older epoch.
   - `subscribe()` covers same-tab commits, storage events, focus and pageshow.
   - Fixtures r1-r3, c1-c3 and m1-m2 are seeded; all 9 domain collections start empty.

**Checks actually run and outcomes.** All checks ran in headless Microsoft Edge (playwright-core, scratchpad only, not a project dependency), with the repo served by `python -m http.server` on 127.0.0.1:5577.

| Check | Result |
|---|---|
| Spec paths: 28 paths referenced from CLAUDE.md, devREADME.md, docs/**, .claude/commands and prototype/README.md | All exist |
| Hub loads with no console errors or warnings, page errors, failed requests or 4xx (1440x900) | Pass |
| Self-check page initially hit a 404 on /favicon.ico | Fixed by adding an icon link; rerun clean |
| First load seeds schemaVersion 1, revision 0 | Pass |
| Role/customer/manager survive reload (manager/c2/m2) | Pass |
| Clock +10 min sets offset 600000 | Pass |
| Reset sets epoch +1, offset 0, default selections, revision 0 | Pass |
| Two resets differ only in resetAt/epoch; baseDate follows the Seoul date of the reset | Pass |
| Pending mock callback (1.5 s) during a UI reset resolves STALE_EPOCH and never runs | Pass |
| Same after corrupting storage mid-flight (epoch 4 to 5) | Pass |
| Dialog, keyboard: Enter opens; focus starts on cancel; Tab reaches confirm; Tab cycle never reaches page content (exits to browser UI, next Tab returns to cancel) | Pass |
| Dialog, keyboard: Escape closes with no state change; focus returns to the opener after both cancel and confirm; Space on confirm works | Pass |
| Corrupt snapshot: banner shown, raw data left untouched, writes refused, banner reset recovers | Pass |
| Blocked storage (getItem/setItem throw): "cannot save" banner, page renders without errors | Pass |
| Self-check page: 12/12 pass, and previous demo data is restored afterwards | Pass |
| Observer tab follows a write in another tab via the storage event | Pass |
| Mobile sample at 390x844 and 360x780: no horizontal overflow; last row clears the sticky bar after scrolling to the end; every button/link at least 44 px; back link resolves to the hub | Pass |
| Hub at 1024x768: no horizontal overflow | Pass |
| Contrast (WCAG formula on token pairs): white on #DD3500 4.58; #656565 on white 5.83; #626F78 on #F3F4F6 4.69; white on #DC1B1C 4.98 | Pass |

Screenshots were reviewed at 1440, 1024, 390, 360 and with the dialog open. Two defects were found and fixed:
- Hub buttons had no gap.
- The hub mock-data notice blended into the page background.

**Unverified checks (not run, so not passed)**

- Manual run in a headed browser via VS Code Live Server on port 5500 (verification used http.server on 5577).
- Firefox and Safari, and a real phone with touch input.
- Actual screen-reader output. Only the role=status region's text content was checked.
- `prefers-reduced-motion` behavior.
- Back/forward cache (`pageshow`) re-render.
- A GitHub Pages subpath. `nav.js` derives the root from `import.meta.url`, so this rests on reasoning only; tested only at /prototype/ on localhost.
- The official website was not visually inspected. Only its HTML shell was fetched (it shows Pretendard preloads).

**Known issues**

- Pretendard is not bundled. This machine renders Noto Sans KR, so Korean glyph widths differ slightly from the app.
- Dialog radius is 12 px vs about 10 measured.
- The native `<dialog>` lets Tab leave to the browser UI rather than wrapping inside the dialog with a JS trap. Page content stays inert, which is accepted native behavior.
- Screenshots in `docs/reference-screens/` show real restaurants and ads and are not gitignored. Decide whether they belong in a public repo before committing.

**Next exact action:** user reviews the hub and UI sample, then sends the Phase 1 prompt from `docs/prompts.md`.

## Decisions

Initial policies are in decisions.md. Add dated deviations and their reasons here.

- 2026-10-23: Primary button fill is #DD3500, not the measured #FF3D00.
  - Why: white on #FF3D00 is 3.55:1, below design-system.md's 4.5:1 rule.
  - #FF3D00 is kept for logo, icons and large numerals.
  - It is one token (`--color-primary`) if exact app color is preferred over the contrast rule.
- 2026-10-23: Small orange text uses #C93000 and tertiary grey uses #767676; measured values failed contrast (see visual-spec.md).
- 2026-10-23: Fonts are system/local only.
  - Stack: Pretendard Variable, Noto Sans KR, Apple SD Gothic Neo, Malgun Gothic.
  - Static "Pretendard" is excluded because a Regular-only install synthesizes bold.
- 2026-10-23: Scenario presets are listed as unavailable text, not disabled buttons, to avoid dead controls. "clean-start" equals 데모 초기화.
- 2026-10-23: Reset also restores presenter selections (c1, m1, customer role) so the start state is fully deterministic.
- 2026-10-23: `config.js` holds only the policy values used so far (mock delay, deposit). Each phase adds its decisions.md values.
- 2026-10-23: The state-machine module and services are deferred to the phases that need them.
- 2026-10-23: Screenshot filenames are kept as supplied. reference-screens/README.md maps them to the kit's suggested slots.

## Visual references

- 14 app screenshots were added on 2026-10-23 and inventoried in `reference-screens/README.md`. Measured tokens are in visual-spec.md.
- Missing references: postpone sheet, waiting statistics, reservation detail, checkout, manager screens.
- Reviewed against references: `customer/ui-sample.html` (see visual-spec.md, Screen comparisons).

## Backlog

Out-of-scope ideas only; do not implement without a new user request.

- Bundle a local OFL copy of Pretendard if the font difference matters in the recording.
- Single-writer enforcement across tabs (currently documented only).

## Handoff log

Append a short entry at the end of each session. Do not delete prior findings.

- 2026-10-23, Phase 0:
  - Foundation, hub, UI sample, self-check and visual inventory are complete.
  - All executed checks pass; unverified items are listed above.
  - Nothing committed.
  - Suggested commit: `phase-0: visual inventory, scaffold, versioned store, presenter hub`.
