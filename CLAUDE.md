# CLAUDE.md - CatchTable Rebuild Prototype

Read this file at the start of every session, then read `docs/PROGRESS.md`.

## 1. Project

Build a clickable, front-end-only prototype for the Sogang University CSE4115
individual midterm replacement assignment. This is CatchTable, NOT KakaoTalk Gift.
The analysis, To-Be context diagram, use case model, and one detailed use case
(Cancellation-seat Priority Booking) have already been prepared. Do not redo them.
The prototype demonstrates restaurant discovery, booking, waiting, and the selected
improvements. The full use case model is broader than the implementation scope.
Do not implement every administrative feature merely because it exists in that model.

Three demonstration themes:
1. Cancellation-seat queue: condition-matched applicants receive an exclusive,
   time-limited booking opportunity in application order, instead of simultaneous competition.
2. Waiting experience: show an active waiting registration directly on the restaurant
   detail page, change its bottom action to View My Waiting, and provide consistent
   weekday/time-slot statistics at all waiting-enabled mock restaurants.
3. Late-arrival coordination: customer ETA, restaurant response, customer acceptance
   or rejection of a proposed time, and a shared final record.

Reservation customer and waiting customer are roles of the same customer account.
The restaurant manager uses a separate desktop workspace. Payment and notification
systems are simulated services, never live integrations.

## 2. Non-negotiable constraints

- Vanilla HTML, CSS, and JavaScript with ES modules. No framework, TypeScript,
  bundler, build step, backend, real login, real booking, real payment, or real messaging.
- Use local mock records and one namespaced localStorage store. Never collect real
  card details or personal information. Customers, managers and every operational record
  (availability, deposits, waiting, statistics, payments, notifications) are fictional.
  Restaurant fixtures r1/r2 show real public CatchTable listing details and photos
  transcribed or cropped from the user's captures (provenance in docs/assets.md); r3 is the
  booking-only 스시렌 (2026-10-23 captures). Never present mock operational
  data as a real restaurant's policy, and never invent reviews or menus for a real restaurant.
- Serve over HTTP with VS Code Live Server or `python -m http.server 5500` from the
  project root. Open `/prototype/`. Do not rely on file://.
- All documentation, code identifiers, comments, and commit suggestions are English.
  Following the supplied previous prototype convention, end-user UI copy is Korean
  for the class presentation; keep it in one strings module. The documents describe
  UI labels by their English meanings. Do not mix developer instructions into the UI.
- Local assets only; no runtime dependency on a CDN. Pretendard (SIL OFL) is bundled in
  prototype/assets/fonts with its licence.
- Reproduce the real app's visual language from user-supplied references, not the
  presentation slides. Orange/white slide styling alone is not an app design spec.
  As of 2026-10-23 the user asked for maximum fidelity: app elements that the demo does
  not implement (brand tabs, most categories, 내 주변, MY, alerts, 함께 고르기, ...) are shown
  and, on tap, give the one shared "not in this demo" message. Never fake a success.
- Do not claim production-grade locking, security, availability, or performance from
  a browser-only simulation. See `docs/architecture.md` for the supported demo model.

## 3. Source of truth

Read `docs/requirements.md`, `docs/decisions.md`, and the current phase specification.
Use `docs/source-notes.md` to understand the prior decisions and their provenance.
User corrections override older documents. For functionality, requirements and domain
rules win; for visuals, supplied screenshots win. Do not copy an As-Is flaw into To-Be.
The user's app captures, the logo and the capture checklist are in
`docs/reference-screens/README.md`. If references are missing, complete a documented
provisional visual spec and continue; do not pretend a placeholder is an official asset
or block unrelated work.

## 4. Incremental workflow

Only implement the phase the user explicitly requests. Start with Phase 0.
Do not build the whole product in one session, silently start the next phase, or mark
future phases complete. A request to start a phase authorizes its specified work;
no second confirmation is needed for routine implementation decisions.

| Phase | Deliverable | Specification |
|---|---|---|
| 0 | Visual inventory, scaffold, shared state, demo hub | docs/phases/phase-0-foundation.md |
| 1 | Restaurant discovery/detail and waiting statistics | docs/phases/phase-1-discovery-statistics.md |
| 2 | Waiting registration, detail state, management and manager queue | docs/phases/phase-2-waiting.md |
| 3 | Cancellation queue, matching, exclusive offers and handoff | docs/phases/phase-3-cancellation-queue.md |
| 4 | Priority checkout, payment outcomes and recovery | docs/phases/phase-4-priority-booking.md |
| 5 | Customer-manager late-arrival coordination | docs/phases/phase-5-late-arrival.md |
| 6 | Integration, visual polish, accessibility and demo rehearsal | docs/phases/phase-6-integration.md |

For each phase:
1. Read progress, phase spec, referenced rules, and relevant screenshots.
2. Give a short plan with files and implementation order. Proceed within scope.
3. Build small increments; identify the page and actions the user can inspect.
4. Verify the phase acceptance criteria and the applicable manual checks.
5. Update PROGRESS with evidence, decisions, unresolved issues and the next phase.
6. Suggest a commit message; do not commit, push, or deploy without user direction.
7. STOP. End with a concise completion report and the next start prompt.

If requested work changes an agreed business rule, explain the conflict rather than
quietly modifying requirements. Record harmless visual or implementation assumptions.
If a browser/test tool is unavailable, record the checks as unverified, not passed.

## 5. Target structure

```text
prototype/
  index.html                    # Presenter-only demo hub
  customer/                     # Mobile layouts, one page module per page
  manager/                      # Desktop layouts, same domain records
  assets/
    css/                        # tokens, base, components, mobile, detail, desktop
    fonts/                      # Pretendard variable woff2 + OFL licence
    images/                     # Local approved assets (crops of user captures; see docs/assets.md)
    js/
      core/                     # store, seed-data, clock, format, strings, state-machine
      services/                 # waiting, allocation, payment, notification, late-arrival
      ui/                       # modal, sheet, toast, header, cards, status badge
      pages/                    # Page controllers; never import another page controller
  tests/                        # Small browser-based checks for risky domain logic
  README.md                     # Created in Phase 0; actual running instructions
```

Each HTML page imports one page controller. Controllers import domain services and
shared UI. State mutations go through store commands and domain transitions, never
page-level localStorage writes. Keep callbacks and fake asynchronous outcomes out
of rendering code. Configure mock policies centrally rather than in page controllers.

## 6. Critical domain boundaries

- Cancellation requests and on-site waiting tickets are DIFFERENT entities and queues.
- An offer is not a confirmed reservation. Only the offer owner can confirm it.
- Only one live offer/payment hold may exist for a particular released slot unit.
- Payment pending/unknown keeps the slot held; do not also offer it to the next user.
- Refresh must not reset an offer deadline or erase a successful operation.
- Waiting postponement and its range selection already exist; they are supporting
  behavior, NOT a newly proposed innovation.
- Waiting statistics already exist for some restaurants. The improvement is consistent
  coverage, not inventing the concept. Insufficient data is not zero wait.
- Reporting lateness is not approval, automatic cancellation, or a fee waiver.
- Proposed reservation time changes take effect only after explicit customer acceptance.
- A manager may operate only on fixtures for their assigned restaurant.
- Every action must be repeatable from a deterministic reset. Reset invalidates pending
  callbacks so a delayed fake payment cannot mutate a fresh scenario.

## 7. Coding and UI conventions

Small named functions; readable modules, normally below 300 lines where practical.
Use semantic HTML, buttons for actions, labels, visible focus, keyboard-operable dialogs,
focus return on close, and status announcements. No native alert/confirm/prompt.
Use textContent for user input; escape it when constructing markup. No inline onclick.
Use CSS custom properties for colors, spacing, radii, typography and layers.
Money is integer KRW. Store timestamps as ISO/epoch values; display Asia/Seoul dates.
Always show uncertainty on estimates. Never show a fake exact real-time waiting forecast.
Payment buttons disable while processing, but domain validation must also reject repeats.

## 8. Session completion

No console errors or broken visible routes. Test at 390x844 and 1440x900; check a narrow
360px mobile viewport and 1024px manager viewport before final completion.
Keep presenter controls on the demo hub or a clearly separate presenter drawer.
Do not place FR IDs, debug logs, scenario controls or architecture notes inside product screens.
Use `docs/prompts.md` for start/review/resume instructions. Slash command files are optional
convenience templates; the plain-text prompts remain the portable fallback.


## Official Website and Visual References

Official CatchTable website:
https://app.catchtable.co.kr/

The site's robots.txt disallows all automated agents except search engines
(`User-agent: * / Disallow: /`, checked 2026-10-23). Do not crawl, script, or download
from it, and do not help bypass it. Real content comes from the user's manual captures
(checklist in docs/reference-screens/README.md). The guidance below applies only to
what a person views manually.

Before implementing the UI for each phase, inspect the relevant
pages on the official website when browser access is available.

Use the website as a visual reference for:
- The CatchTable logo and brand colors
- Typography, spacing, borders, and corner radii
- Restaurant cards and restaurant detail pages
- Navigation, bottom action bars, buttons, and status indicators
- Reservation and waiting interfaces

Save relevant screenshots in `docs/reference-screens/`.
Use descriptive filenames and record the source URL, capture date,
viewport size, and observed UI state in that folder's README.

Store any accessible logo or image assets used by the
prototype locally under `prototype/assets/`. Record their source
URLs in `docs/assets.md`. Avoid hotlinking production assets.

Reference priority:
1. Project requirements define behavior.
2. User-provided screenshots define the corresponding visual details.
3. The official website guides other visual decisions.
4. Unobserved details may use clearly documented provisional designs.

The prototype intentionally improves the existing service.
Do not reproduce existing usability problems when they conflict
with the To-Be requirements. In particular, show the customer's
active waiting status directly on the restaurant detail page
and update the bottom action button accordingly.

If browser access is unavailable, or a page requires authentication,
document the limitation and continue with the available references.
Never claim to have inspected pages that were not accessible.
Do not make real reservations, join live queues, or submit payments
while collecting references.

Inspect only the screens relevant to the current development phase.
Do not begin later phases as part of reference collection.