# Development Progress

Current phase: Phase 6 COMPLETE (2026-10-23). All planned phases (0-6) are complete.
No further phase is defined; any new work starts only on an explicit user request.
Post-Phase 6 addition (2026-10-23): seven more restaurants, 14 in total (session below).

| Phase | Status | Verification evidence |
|---|---|---|
| 0 Foundation | Complete | 38/38 headless Edge checks, 12/12 self-check page, 2 extra store checks (2026-10-23); 38/38 regression rerun after Phase 1 |
| 1 Discovery and statistics | Complete | 40/40 headless Edge checks, 17/17 self-check page, accessible-name and contrast checks (2026-10-23); after the 49-capture pass: 52/52 acceptance checks, 20/20 self-check page |
| 2 Waiting | Complete | 22/22 Phase 2 acceptance (W01-W08), 26/26 self-check page, 52/52 fidelity and 38/38 Phase 0 regression, accessible-name and contrast checks (2026-10-23) |
| 3 Cancellation queue | Complete | 16/16 Phase 3 acceptance (Q01-Q08 through the UI), 35/35 self-check page, 22/22 Phase 2, 53/53 fidelity and 38/38 Phase 0 regression, accessible-name and contrast checks (2026-10-23) |
| 4 Priority booking | Complete | 16/16 Phase 4 acceptance (UC-PB, P01-P12 through the UI), 44/44 self-check page, 16/16 Phase 3, 22/22 Phase 2, 53/53 fidelity, 38/38 Phase 0, accessible-name and contrast checks (2026-10-23) |
| 5 Late arrival | Complete | 11/11 Phase 5 acceptance (L01-L08 through the UI, two roles), 50/50 self-check page, 16/16 Phase 4, 16/16 Phase 3, 22/22 Phase 2, 53/53 fidelity, 38/38 Phase 0 (2026-10-23) |
| 6 Integration | Complete | Integration sweep 6/6 (246 buttons on 22 routes + 18 hub buttons respond, 22 links, offline, 23 routes x 2 viewports), a11y sweep 2/2 (23 routes; 18 keyboard dialogs), demo rehearsal 13/13 (A/B/C twice), self-check 50/50, Phase 5 11/11, Phase 4 16/16, Phase 3 16/16, Phase 2 22/22, fidelity 53/53, Phase 0 38/38 (2026-10-23) |

## Current session (2026-10-23, after Phase 6: more restaurants)

- Request: "식당 더 추가해봐, 총 15개 정도로" (add more restaurants, about 15 in total).
- Result: 14 restaurants. Capture 170629 shows eight unused restaurants; 리틀에마스 appears only as the user's
  own recently viewed chip (personal history), so it was skipped. No other capture lists restaurants.
  A 15th would need a restaurant with no captured photo (placeholder block) - not added without asking.

**Files**
- New: `core/fixtures/more-restaurants.js` (r8 이자카야나무 사당역2호점, r9 돌판장 양재, r10 팔향, r11 마담풍천 보라매,
  r12 투머트, r13 월화고기 보라매점, r14 화포식당 한남점); 7 photo crops in `images/restaurants/`.
- Changed:
  - restaurant-fixtures (register r8-r14); web-sourced (exports its helpers); seed-data (statistics for r11 collecting,
    r13, r14; queues for r13, r14);
  - statistics: hour slots follow `waiting.hours` first (화포식당 is open 24 hours, mock waiting 11-23);
  - detail panels: menu preview, location, facilities and details sections hide when empty; the menu tab says
    the menu was not found (r9, r11);
  - restaurant card: `thumbnailOnly` row layout (가격대별 BEST style, 76px); detail photo 152px for those;
    long names wrap without squeezing the rating;
  - strings (menuMissing; reviewsMissing no longer claims the count is missing); CSS mobile, detail.
- Docs: assets (crops, per-restaurant sources), data-model, decisions, screen-map, visual-spec,
  reference-screens README, CLAUDE.md fixture rule, prototype/README.

**Data**
- From the capture: name, one-liner, rating, review count, cuisine, area, photo.
- From public pages (docs/assets.md): address, phone, hours, closing days, facilities, menu and prices for
  r8, r10, r12, r13; address, phone, 24 hours and a partial menu for r14.
- No public page was found for the 돌판장 양재 and 마담풍천 보라매 branches: address, phone, hours and menu stay null
  and those sections are hidden. Other branches' menus were not reused.
- Mock: r8, r9, r10, r12 booking-only; r11 booking + waiting (statistics collecting); r13 booking + waiting;
  r14 waiting-only. Deposits 0 or 10,000 KRW per person.

**Evidence** (headless Edge, server `python -m http.server 5577`)
- Run: self-check 50/50 (all waiting restaurants have every weekday x hour cell); Phase 0 38/38; Phase 2 22/22;
  fidelity 53/53 after its capability-filter check was changed to derive the expected lists from the fixtures.
- Smoke of r8-r14: home lists 14 restaurants; every tab of each new detail page opens with no horizontal
  overflow at 390px; search 장어 finds 돌판장 and 마담풍천; r11 statistics collecting, r13/r14 charts; hub
  without overflow; no console or HTTP errors. Screenshots checked: home list, r8, r9, r10 menu, r14 waiting.
- Finished on 2026-10-24 at the user's request: Phase 3 16/16 (four runs in a row), Phase 4 16/16, Phase 5 11/11;
  integration sweep 6/6 (374 buttons on 29 routes and 21 hub buttons respond, 29 link targets, offline,
  no overflow on 30 routes at 390/360 and 1440/1024, no console errors); accessibility sweep 2/2 (30 routes,
  24 keyboard dialogs); demo rehearsal 13/13 (A/B/C twice).
- Phase 3 flake explained and fixed in the test: it confirmed the 신청 취소 dialog and read the result after a fixed
  150 ms while the manager tab was in front. Chromium then delivers this background tab's dialog close event
  about a second late (measured: submit -> close 990 ms; 50 ms once the tab is brought to front), so the test
  navigated away before the withdrawal ran. The test now waits for the result toast. Not an app defect: the tab a
  person clicks is always in front.

**Open items**
- The BEST thumbnails are 151px: sharp in the row card, slightly soft as the 152px detail photo on 2x screens.
- 화포식당 한남점: the official page was indexed but returned 404 when fetched; two phone numbers exist online.
- No manager accounts for r3-r14 (unchanged).

## Phase 6 session record (2026-10-23: integration, polish, MY tab, more restaurants)

- Request: "now do the phase 6".
- References: capture 220751 (MY) and 170629 (home list with the four added restaurants); public pages for
  r4-r7 (docs/assets.md). app.catchtable.co.kr was not accessed.

**Files**
- New:
  - `core/fixtures/web-sourced.js` (r4 밍글스, r5 Restaurant EVETT, r6 우월소곱창 신도림본점, r7 작은따옴표 도림천점);
  - `pages/my.js` + `customer/my.html` (C14 MY tab);
  - images: `restaurants/{mingles,evett,woowol,jageun}-1.jpg` (170629 crops), `my/{badges.png,cake.png,benefit-banner.jpg}` (220751 crops).
- Changed:
  - fixtures index and seed (r6 queue of 3, r6/r7 statistics patterns); statistics (falls back to waiting hours);
  - booking.js (closed weekdays: `isClosedDay`, `closed` flag, `dayStatus`); booking-panel and saved chips (휴무, 정기 휴무일이에요);
  - detail summary/panels and restaurant cards (Michelin badge, weekday hours, every unknown field optional);
  - bottom nav (MY → my.html); icons (point, ticket, alert, settings gear);
  - dom.js `refocus`, sheet.js, modal.js, store.js `subscribe` (focus survives re-renders, see Behaviour);
  - search.js (visually hidden h1); strings; CSS: detail (Michelin chip), mobile (MY; single-photo card grid fix);
  - tests/self-check.js (closed-weekday assertions in the booking check).
- Docs: assets (crops, r4-r7 sources), screen-map (C14, stale rows, CTA rules), data-model (nullable fields,
  hours shapes, r4-r7), decisions (added restaurants, closed weekdays, MY, focus), visual-spec (MY, r4-r7),
  reference-screens README, demo-script (walk-in step, clean-start for C, rehearsal record),
  CLAUDE.md fixture rule, prototype/README.md (final routes, rehearsal, sources, limits).

**Behaviour**
- MY shows the presenter-selected customer, the claimed-coupon count (sheet), and links to 저장 / search / 나의 알림.
  Points, badges, CATCH pay, edit, settings, birthday, phone booking and the banner say they are not in this demo.
  The capture's account name, review and photo are not reproduced.
- r4-r7 appear on home, search and detail. Unknown fields stay null and are hidden (no review counts, distributions,
  AI summary or invented reviews). Mock settings: r4/r5 booking-only, 50,000 KRW per person; r6 booking + waiting;
  r7 waiting-only. r5's Sunday/Monday closing days read 휴무 with no times.
- Keyboard focus: a store-driven re-render (other-tab write, window focus, commit) no longer drops focus to the page;
  dialogs return focus to the re-rendered opener.

**Fixes found by the Phase 6 checks**
- Dialog focus was lost when a re-render replaced the opener (MY 쿠폰함, waiting cancel, 신청 취소, offer decline,
  ETA update). Window-focus renders now run after focus settles; the twin match includes aria-label so row
  buttons (M02 호출) keep their own focus restore.
- search.html had no h1.
- r5 closed days showed 예약 마감 (sold out), implying a cancellation seat could appear.
- MY: CATCH pay and 전화 예약 lines wrapped (a selector also matched the chevron); the settings icon looked like a sun.
- Demo script A could not postpone a fresh last-in-line ticket; the script now adds a hub walk-in first
  (the app already explained why postponing was impossible).

**Evidence** (headless Edge via playwright-core, server `python -m http.server 5577`)
- Integration sweep 6/6: every visible enabled button on 22 routes (246) and the hub (18) navigates, opens a
  dialog, changes the page or shows a message; nothing covered at the tap point; 22 link targets answer 200;
  with every non-local request blocked nothing was requested; no horizontal overflow on 23 routes at
  390/360 (customer) and 1440/1024 (manager, hub); no console errors.
- Accessibility sweep 2/2: named controls, one h1, alt on every image, labelled fields and unique ids on 23
  routes; 18 dialogs opened by keyboard are named and modal, take focus, keep Tab inside, close on Escape and
  return focus.
- Demo rehearsal 13/13: A, B and C through hub and UI, twice in one browser context from presets with no
  manual cleanup (A 20 presenter actions, B 10, C 13), no console errors.
- Self-check 50/50; Phase 5 11/11, Phase 4 16/16, Phase 3 16/16, Phase 2 22/22, fidelity 53/53, Phase 0 38/38.
  Phase 3 stopped once without a result while several suites ran in parallel (the known `.offer__ended`
  timing flake) and passed 16/16 when rerun alone.
- MY compared side by side with 220751 at 390px; r5 closed-day chips and calendar checked by screenshot.

**Unverified**
- Spoken timing of the demo (only presenter actions were counted; A may exceed 50 seconds).
- Real devices, screen readers and forced-colors mode.
- Concurrent writers (one active writer tab is supported).

**Open items / limitations**
- r3-r7 have no manager account; their waiting queues and bookings are visible to customers only.
- No photo licence for reuse was found for r4-r7, so each has one capture crop; detail layouts for them are provisional.
- Online images found while researching stay outside the repo. Capture-derived images and restaurant
  photos belong to their owners; whether to push them to the public repository is the user's decision.

## Final handoff

- Start: serve the repository root (`python -m http.server 5500`), open http://localhost:5500/prototype/,
  press 데모 초기화, then follow docs/demo-script.md (A waiting, B cancellation seat, C late arrival).
- Pages to review first: customer/my.html; customer/restaurant.html?restaurantId=r5 (휴무 days) and r6
  (waiting with statistics); the three rehearsal paths in prototype/README.md.
- Tests: open /prototype/tests/ for the 50 self-checks; the browser suites used here live in the session
  scratchpad, not the repository.

## Phase 5 session record (2026-10-23, late-arrival coordination)

- Request: "add [the MY tab] to phase 6, i put the new screenshot. also for phase 6 add more restaurants than just
  having 3. search online for name, menu, photos, etc. now work on phase 5".
- Phase 6 spec updated with both additions: A, MY tab from capture 220751; B, more restaurants from public sources
  with provenance and photo-licence limits. Capture 220751 is inventoried, and its account name and review are marked personal.
- References: CatchTable has no late-arrival feature (searched, see reference-screens/README.md). Screens are provisional.

**Files**
- New:
  - `services/late-arrival.js`: submitEta, respondToLate, decideProposal, version guards;
  - `ui/late-ui.js`: ETA sheet, status card, shared history;
  - `pages/manager-reservation.js` + `manager/reservation.html` (M03).
- Changed:
  - reservation.js (C07 late section, changed-time display);
  - manager-reservations.js (지각 조율 badge and 상세 link);
  - inbox (LATE_RESPONSE);
  - presets (lateReady);
  - hub (M03 link; all presets now implemented);
  - strings;
  - CSS: components (history), checkout (C07 late), desktop (M03);
  - tests/self-check.js (6 late-arrival checks).

**Behaviour** (FR-11..14)
- The customer sends an ETA (after the booked time, same day) with an optional reason. It stays SUBMITTED and is shown as not approved.
- The manager of that restaurant answers the current version once: retain, propose a different same-day time, or cannot retain. The customer is notified.
- Only accepting a proposal changes currentTime; originalTime stays. Reject and cannot-retain change nothing. No cancellation, refund or fee waiver anywhere.
- A new ETA opens the next version; answers or decisions carrying an older version are refused.
- Both roles render the same history entries (version, actor, timestamp, action).

**Evidence** (headless Edge via playwright-core in the session scratchpad, server `python -m http.server 5577`)
- Phase 5 acceptance 11/11:
  - L01: sheet → SUBMITTED with a not-approval note; M01 badge; M03 ETA, delay and reason;
  - L02: retain reaches the open customer tab and inbox, time unchanged;
  - L03: propose 18:40 and accept; both views show 18:40 with original 18:00 and identical history;
  - L04: reject keeps 18:00;
  - L05: no-answer guidance; cannot-retain leaves the booking CONFIRMED with deposit and no payment operations;
  - L06: updating the ETA after a proposal opens version 2, the customer's accept button disappears and the manager answers 2차;
  - L07: other manager and customer get no actions;
  - L08: after reloads both histories match;
  - no overflow (360px, 1024px); no unnamed controls; no console errors.
- Self-check 50/50, including stale-version and stale-proposal refusals and no mutation by the wrong manager or customer.
- Regressions: Phase 4 16/16, Phase 3 16/16, Phase 2 22/22 (preset count updated to 6), fidelity 53/53, Phase 0 38/38.

**Unverified**
- Real devices and screen readers.
- Concurrent writers (one active writer tab is supported).

**Open items**
- No phone/call integration: guidance only, as specified.
- An ETA can be sent any time before the visit; there is no time-window policy.

## Phase 4 session record (2026-10-23)

- Request: "now go with phase 4".
- References:
  - the user's captures 171732, 171739 (예약금 안내) and 171752 (checkout);
  - no confirmation or reservation-detail screens were found online, so C07 is provisional.

**Files**
- New:
  - `services/payment.js` (ledger, checkout, settle, resolve, retry, compensate, flags);
  - `services/reconcile.js` (settle payments, then expire offers);
  - `ui/deposit-sheet.js`;
  - `pages/checkout.js` + `customer/checkout.html` (C06);
  - `pages/reservation.js` + `customer/reservation.html` (C07);
  - `css/checkout.css`.
- Changed:
  - allocation: exported hand-off; withdraw and decline refused while payment resolves;
  - fixtures: per-person deposits;
  - config: schema 6, removed the flat deposit;
  - seed: rv-1 reservation, payment flags;
  - presets: paymentUnknown;
  - offer page: 예약금 안내 → checkout; payment and booked views;
  - 마이다이닝: reservations in 방문예정 (C08);
  - inbox: confirmation and refund notices;
  - M01: 예약 목록, payment holds and booked slots;
  - hub: payment controls;
  - all pages now call `reconcile()`;
  - strings, CSS;
  - self-check: 9 payment checks.

**Behaviour** (UC-PB 7-12)
- Confirming:
  - checks owner, deadline (now < expiresAt) and the 4 required consents;
  - zero deposit books at once (8b);
  - otherwise one PENDING PaymentOperation stores the mock processor's answer;
  - a repeat returns that operation.
- `settlePayments()` applies due answers in a separate command, so reloads and other tabs find the same result.
  - Success saves one reservation, ends the offer and request (BOOKED), books the slot and notifies.
  - A known failure charges nothing and returns to OFFERED while the deadline holds, else EXPIRED with one successor.
  - DEFERRED becomes UNKNOWN and holds the slot past the deadline.
  - An armed commit failure leaves RECOVERY_PENDING (charged, held). Retry reuses the charge; a mock refund ends the offer as REFUNDED and only then hands off.
- Reset invalidates the epoch-guarded payment callback, and a stale callback has no operation to settle.

**Evidence** (headless Edge via playwright-core in the session scratchpad, server `python -m http.server 5577`)
- Phase 4 acceptance 16/16:
  - P01/P02: deposit sheet values; pay disabled until the required consents; double-click gives 1 operation, 1 charge, 1 reservation; request text shown as text;
  - confirmation in the inbox, the 마이다이닝 card, and the manager booking plus BOOKED slot with the same IDs;
  - P12: reopening checkout or going back redirects; reloading mid-payment settles once;
  - 8a: the wrong owner sees nothing; passing the deadline on the form expires the offer with no charge and hands off;
  - P03: failure, form kept, retry;
  - P04: 스시렌 zero deposit with no operation;
  - P05/P06: unknown held past the deadline, resolved as success;
  - P07: unknown resolved as failure after the deadline gives one successor;
  - P08: commit failure held past the deadline, retry with the same charge;
  - P09: refund recorded and notified, then c2 gets the offer;
  - P10: failed confirmation notice, booking intact, retry delivers;
  - P11: reset mid-payment leaves no trace;
  - no overflow (360px, 1024px);
  - no console errors.
- Self-check 44/44, including P01-P11 domain checks and the expiry boundary.
- Regressions: Phase 3 16/16, Phase 2 22/22, fidelity 53/53, Phase 0 38/38. Updated for intended changes: 예약하기 now opens the deposit sheet, 마이다이닝 shows rv-1, 5 presets, the seeded reservation time is relative to reset. One Phase 2 run failed once on a toast-timing check; it passed in three reruns.
- No unnamed controls on checkout, offer, reservation, 마이다이닝, hub or M01. New colour pairs at least 5.1:1.

**Unverified**
- Real devices and screen readers.
- Concurrent writers: one active writer tab is supported. localStorage is not a transactional backend; the ledger only prevents double effects within this model.
- Payment timing is mock: answers after 600 ms of demo time; no real 60 s processor timeout.

**Open items**
- Ordinary (non-priority) booking still stops at the visit confirmation, by design (out of scope).
- Reservation cancel/change is not offered.

## Phase 3 session record (2026-10-23)

- Request: "now go with phase 3".
- References: there are no captures of 빈자리 알림, and web sources are text only (listed in
  reference-screens/README.md). They describe the As-Is broadcast race. The To-Be screens are
  provisional and use the captured visual language (visual-spec.md).

**Files**
- New:
  - `services/allocation.js`: matching, FIFO, offers, decline/withdraw, `reconcileOffers`, `releaseSlot`;
  - `services/notification.js`;
  - `ui/cancellation-ui.js`: condition labels, join sheet, detail strips;
  - `ui/manager-header.js`;
  - `pages/cancellation-queue.js` + `customer/cancellation-queue.html` (C04);
  - `pages/offer.js` + `customer/offer.html` (C05);
  - `pages/inbox.js` + `customer/inbox.html` (C09);
  - `pages/manager-reservations.js` + `manager/reservations.html` (M01);
  - `css/cancellation.css`.
- Changed:
  - config (offer lifetime);
  - seed (`failNextNotification`);
  - booking service: `soldOut` flag; an AVAILABLE released slot reopens its time;
  - booking panel: sold-out days selectable, sold-out times tappable;
  - restaurant.js: strips, join, reconcile;
  - waiting.js: a call creates a notification;
  - presets: cancellationReady, offerActive;
  - hub: release form, notification failure/retry, reconcile after a clock jump, new links;
  - 마이다이닝: 빈자리 대기 entry, 나의 알림 tab;
  - home bell: inbox link with unread dot;
  - strings, CSS;
  - tests/self-check.js: 9 queue checks.

**Behaviour**
- Requests: one live request per customer per exact condition. Open, past or out-of-window times and party sizes over the maximum are refused.
- A released slot unit is offered to the earliest QUEUED request with the same restaurant, date, time and party (requestedAt, then id). It is held for 120 s against an absolute expiresAt.
- Live means now < expiresAt.
- Decline, expiry or withdrawal of an offered request ends it and runs allocation once more. With nobody eligible, the slot becomes AVAILABLE and that time is bookable again.
- Only the owner can see or act on an offer. 예약하기 explains that checkout is Phase 4, and the offer is never marked accepted.

**Evidence** (headless Edge via playwright-core in the session scratchpad, server `python -m http.server 5577`)
- Phase 3 acceptance 16/16:
  - join from a sold-out time, shown in time order with a hint;
  - duplicate prevented;
  - the detail strip before any click;
  - Q01 hub release goes to c1, skipping the older 4-person c3;
  - the manager view shows the same cr-/of- IDs;
  - Q04 reload after +30 s continues the same deadline;
  - checkout explained;
  - Q03 a non-owner sees nothing and changes nothing;
  - Q05 decline gives one successor, shown live to c2 and the manager;
  - Q05/Q07 expiry by clock gives AVAILABLE and the time reopens, with c2 notified;
  - Q02 repeated reconcile;
  - Q08 a failed notification stays visible in the app, retry delivers it to the inbox and bell;
  - withdraw hands on, and rejoining creates a new request;
  - no overflow (360px, 1024px);
  - no console errors.
- Self-check 35/35, including Q01-Q08 domain checks and the deadline boundary (now == expiresAt is expired).
- Regressions: Phase 2 22/22, fidelity 53/53, Phase 0 38/38. Updated for intended changes: the home bell and 나의 알림 are now links, and there are 4 presets.
- No unnamed controls on C04, C05, C09, 마이다이닝, detail, home, hub or M01. Contrast computed for the new pairs (all at least 4.5:1).

**Unverified**
- Real devices and screen readers.
- Concurrent writers: one active writer tab is the supported model. Reconcile runs from whichever page is open, so with no page open nothing expires until one is opened. Pages reconcile on load.
- QR-08 timing: the next offer is created within the reconcile interval (1 s on C05/M01, 5 s elsewhere); not measured.

**Open items**
- Booking date chips on the detail page are computed when the page loads (the calendar re-reads), so a reopened time shows in the chips after a reload.

## Phase 2 session record (2026-10-23)

- Request: use the velog post the user supplied (웨이팅 미루기 lets you choose how many teams back) and
  web screenshots for screens not captured, then continue with Phase 2.
- References used:
  - the user's 10-16 captures 183123-183450;
  - velog postpone, cancel, KakaoTalk and duplicate screenshots;
  - CatchTable's store dashboard help screenshots (docs.channel.io).
  All are listed in reference-screens/README.md. Online images stay outside the repo.
- Decision changed at the user's direction: the postponement rule now follows the real app.
  - The customer picks any later place down to the last party.
  - At most 2 postponements, and none after being called.
  - Recorded in decisions.md and source-notes.md #2.

**Files**
- New:
  - `services/waiting.js` (selectors and commands);
  - `services/presets.js`;
  - `pages/waiting-register.js` + `customer/waiting-register.html` (C13);
  - `pages/waiting.js` + `customer/waiting.html` (C03);
  - `ui/postpone-view.js`, `ui/waiting-live.js`;
  - `pages/manager-waiting.js` + `manager/waiting.html` (M02);
  - `css/waiting.css`.
- Changed:
  - config (schema 5, postpone/call limits);
  - fixtures (`waiting` settings);
  - seed-data (r1/r2 queues);
  - strings (waiting, manager, errors, hub);
  - format (ticket timestamps);
  - modal (optional message, multi-line title);
  - icons (alert);
  - `ui/dom.js`: built inputs get autocomplete="off". This fixes a real back-navigation bug where Chrome restored a stale radio after render.
  - restaurant.js: ticket strip, queue card, CTA rules, waiting mode preselected;
  - my-dining.js (ticket cards);
  - hub.js (presets, walk-in tool, manager link);
  - desktop.css (dashboard);
  - tests/self-check.js (6 waiting checks).

**Behaviour** (all against one store, so customer and manager tabs agree)
- Registration rejects a second live ticket (ALREADY_WAITING → open the ticket).
  - The party must be 1+ adults, within the restaurant maximum.
  - 접수마감 and r2's "2팀 이상부터 온라인 웨이팅 가능" block new registrations but never hide a live ticket.
- Position is derived from queueOrder. Postpone validates:
  - the place the customer saw (QUEUE_CHANGED otherwise);
  - the target range;
  - the limit;
  - that the party is not CALLED.
- Manager commands act only on the active manager's restaurant (FORBIDDEN otherwise).
  - 호출 at most 2 times.
  - 착석 and 취소 are terminal; repeating them gives TICKET_ENDED.
- Estimates are MOCK (position × minutes per team), always "약 N분" with a may-differ note.

**Evidence** (headless Edge via playwright-core in the session scratchpad, server `python -m http.server 5577`)
- Phase 2 acceptance 22/22:
  - register flow with bounded steppers;
  - double-click registers once;
  - the strip and 내 웨이팅 보기 appear on revisit and reload, before any click;
  - View My Waiting opens the original ticket, and the register URL redirects to it;
  - W03 isolation (other customer, other restaurant, ticket URL, 마이다이닝);
  - W04 postpone to 5th with the manager list agreeing;
  - W05 limit and after-call refusals;
  - W07 the call reaches the open customer tab through the storage event, and seat completes the ticket;
  - W08 접수마감 keeps the holder's CTA;
  - W06 cancel with no stale banner;
  - the r2 rule plus the hub walk-in;
  - m2 sees only vivo pizza;
  - presets;
  - no overflow at 1024px (manager) or 360px (waiting pages);
  - no console errors.
- Self-check 26/26. Fidelity regression 52/52: the waiting CTA check was updated because it now opens registration. Phase 0 regression 38/38: the determinism check now compares ticket times relative to the reset instant.
- Accessibility tree: no unnamed controls on register, ticket, postpone, detail, my-dining or manager.
- Contrast computed for every new pair: dashboard buttons 4.32-4.99:1 with 20px bold labels; tab and number text pass as large text.
- Screenshots were compared with the captures and dashboard references (see visual-spec.md).

**Unverified**
- Real devices and real screen readers.
- Two writer tabs at once: the supported model is one active writer (architecture.md). The test drives the manager and customer tabs alternately.

**Open items**
- Notifications (KakaoTalk-style) are not modeled. The ticket page and detail strip are the authoritative state; the inbox arrives in Phases 3-5.
- 되돌리기 (undo), the dashboard's manual registration, and the cross-restaurant limit of 3 are not built. 웨이팅 등록 explains that.

## 49-capture fidelity pass record (2026-10-23)

- Request: "i put the new 49 requested screenshots. some are missing like 웨이팅 미루기 and etc.
  search for those screen online and use them as reference. use them before proceeding to phase 2".
- Captures inventoried in docs/reference-screens/README.md. Missing screens were searched online;
  sources are listed there with what they show. Their images stay outside the repo.
- Phase 2 was NOT started.

**What changed**

- Fixtures moved to `core/fixtures/{wolhwa,vivo,sushiren}.js`.
  - r3 is now the real booking-only 스시렌.
  - Each fixture carries menus (with thumbnails and boards), review distribution and purposes, photo filters, store info (address, map, directions, facilities, guides, phone, notices, capacity), weekly hours, stations, badges, ribbon, news and broadcasts.
  - Review bodies are not reproduced.
- Store schema 4:
  - waiting statistics are averages (`avgMinutes`, `avgTeams`, `sampleCount`), matching the app's chart;
  - new `recentViews` collection;
  - booking window per restaurant;
  - r2 sold out today only.
- Detail page (`pages/restaurant.js`, `ui/detail-summary.js`, `ui/detail-panels.js`):
  - Tabs became a WAI-ARIA tablist that switches panels (7 tabs for 스시렌), pinned under the header.
  - Station and weekly-hours rows expand.
  - 위치 opens 매장정보 at the location section.
  - Address copy.
  - Ribbon above the bottom bar.
- Booking (`ui/booking-panel.js`, `ui/sheet.js`):
  - The calendar sheet follows 171404: month view, party circles, open times only.
  - A time opens the visit confirmation (171732); 확인 explains that booking payment is not in this demo.
  - With a selection, the CTA reopens the confirmation.
- Statistics (`ui/waiting-stats.js`): the line chart of 173602 with weekday circles and 대기 많음. To-Be additions are listed in visual-spec.md.
- New C12 search page (`customer/search.html`, `pages/search.js`). Saved and my-dining were restyled to 173436 and 173505.
- Home gains the 7 brand tabs, a search link and the 어디로 가시나요? area tiles.
- CSS:
  - detail.css rewritten;
  - new `panels.css` and `sheet.css`;
  - shared chips, picker and date chips moved to mobile.css;
  - global `[hidden] { display: none !important }` added.
- Removed: `ui/restaurant-detail.js`, `restaurants/vivo-1.jpg`, the obsolete stepper, time-grid and bar-chart CSS.
- New assets: 4 월화 photos, vivo-3, 3 스시렌 photos, 26 menu thumbnails, 6 menu boards, 3 maps, 8 area tiles, ribbon mark, award banner. Provenance is in assets.md.
- Docs updated: CLAUDE.md (r3), decisions.md, data-model.md, screen-map.md (C12), visual-spec.md, assets.md, reference-screens/README.md, prototype/README.md.

**Evidence** (headless Edge via playwright-core in the session scratchpad, server `python -m http.server 5577`)

- New acceptance script: 52/52. It covers:
  - home: tabs, categories, areas, filters, not-in-demo toasts, banner counter;
  - search: focus, recent views, multi-term match, empty state, suggestion chip;
  - saved and my-dining;
  - detail: save, share, phone, coupon, disclosure, tabs with arrow keys, 위치 jump, address copy, reviews;
  - booking: past days disabled, party 1-6 or 1-10, day+1 19:00 sold out, confirm → explanation, Escape focus return, date chip opens that day;
  - statistics: chart tap, 수집 중, tooltip, keyboard radios, no 0분;
  - r2 collecting; r3 tabs and calendar;
  - 360px overflow, clipped-label and sticky-bar checks on 9 page states;
  - no console errors.
- Phase 0 regression 38/38. Self-check page 20/20, including a new recent-views check and updated statistics and availability checks.
- Contrast computed for every new colour pair:
  - time chip lightened to 4.64:1;
  - saved "추천" darkened to 4.54:1;
  - chart line 4.46:1 (graphics need 3:1).
- Screenshots compared side by side with 171404, 171732, 173403, 173436, 173505 and 173602 (differences in visual-spec.md).

**Unverified**

- Real devices: checked only in headless Edge at 390x844 and 360x780.
- Screen-reader output: only the accessibility tree was inspected.

**Open issues for the user**

- **웨이팅 미루기 rule conflict.** Public posts say postponement moves you to the back of the queue, about 2 times, not after being called. decisions.md says "behind 1 or 2 parties, selectable". Unchanged; decide before Phase 2. No source shows the postpone sheet itself.
- Still missing: 월화 expanded weekly hours, more vivo full-screen photos, the postpone sheet, a reservation detail screen.
- Mock values that differ from the app:
  - vivo's real deposit is 10,000원 per person (171739); the fixture deposit stays 0 until Phase 4.
  - r1's mock deposit is 20,000원.

## Fidelity pass 1 record (2026-10-23)

- Request: home extras, detail extras, booking date/time picker, Pretendard, real restaurant info and photos, "as close to the real app as possible", guidelines may be edited.
- Constraint found: app.catchtable.co.kr robots.txt disallows automated agents. Nothing was crawled or downloaded from it.
  - Web search did not give verified address/phone/menu data, so none was added.
  - Real data comes only from the user's captures; a capture checklist was added to docs/reference-screens/README.md.

**Files created**

- Pages: `customer/saved.html`, `customer/my-dining.html` (+ `pages/saved.js`, `pages/my-dining.js`)
- Data and services: `core/restaurant-fixtures.js`, `services/booking.js`, `services/customer.js`
- UI: `ui/bottom-nav.js`, `ui/sheet.js`, `ui/booking-panel.js`, `ui/restaurant-detail.js`
- CSS: `css/detail.css`
- Fonts: `assets/fonts/PretendardVariable.woff2` + `OFL.txt`
- Images: `assets/images/home/*` (banner, 3 brand icons, 20 category icons), `assets/images/restaurants/*` (3 photos)

**Files rewritten or updated**

- Pages: `pages/discovery.js` (home), `pages/restaurant.js`
- UI: `ui/restaurant.js`, `ui/icons.js`, `ui/toast.js` (`notInDemo`)
- Core: `core/seed-data.js`, `config.js` (schema 3), `strings.js`, `format.js`
- CSS: `mobile.css`, `tokens.css`, `base.css`
- Tests: `tests/self-check.js` (19 checks)
- Docs: `CLAUDE.md`, `requirements.md`, `design-system.md`, `decisions.md`, `data-model.md`, `screen-map.md`, `source-notes.md`, `visual-spec.md`, `assets.md`, `reference-screens/README.md`, `prototype/README.md`

**What changed for the user**

- **Home:** logo, search, history/bell, brand tabs, location row, banner carousel with live counter, 20 category icons, restaurant list, bottom nav.
- **Detail:**
  - Header icons; the title appears on scroll.
  - Photo carousel, Blue Ribbon chip, 함께 고르기, rating/review count, subway badges, tags.
  - Sticky 홈/메뉴/사진/리뷰/매장정보 tabs that scroll to sections.
  - Coupon claim (persisted), mock booking picker (party, date, time), AI summary.
  - Save (persisted, count +1), share (copies link), phone (explains).
- **r1/r2 are real listings:** 월화식당 마포본점 and vivo pizza 공덕점, with ratings, counts, hours, tags, AI summaries, coupon and photos from the captures. r3 stays fictional.
- **Brand color:** CTA fill is now the app's #FF3D00 with 19px bold labels (large-text contrast).

**Checks actually run and outcomes.** Headless Edge on 127.0.0.1:5577.

| Check | Result |
|---|---|
| Fidelity suite | 44/44, run 3 times in a row (one earlier failure was a test timing issue, fixed in the test) |
| Phase 0 regression | 38/38 |
| Self-check page | 19/19 |
| All Phase 1 acceptance criteria re-verified (cards and back, same statistics component, collecting never zero, period/units, r3 no waiting, 360px layout) | Pass |
| Every new control works locally or shows the shared "not in this demo" message | Pass |
| Save, coupon and booking selection persist or apply; final booking/waiting steps explain rather than fake success | Pass |
| Tabs jump under the sticky header and mark the current tab | Pass after a fix: the last section now has a min-height so later tabs can reach the top |
| Escape closes the sheet with focus return; Pretendard loads from the local file | Pass |
| Accessible names re-checked | Pass |
| Contrast | Pass after darkening the AI accent end color. Subway badges are a documented exception |
| Side-by-side image comparisons against 161246 and 183425 | Done; text sizes reduced about 10% to match proportions |

**Unverified checks (not run, so not passed)**

- Headed browser via Live Server on port 5500; Firefox and Safari; a real phone.
- Actual screen-reader speech.
- Clipboard copy on non-localhost origins.
- Whether the presenter's projector shows the about-10% smaller text comfortably.

**Known issues and gaps (need captures)**

- Menu, review text, address, phone and weekly hours are not shown; sections say they are being prepared.
- Only 1-2 photos per restaurant.
- The booking sheet design is provisional.
- r3 is still fictional.
- The statistics chart form is still provisional.
- Real CatchTable artwork and photos sit in a public repo once pushed: the user's decision.

**Next exact action:** user captures the checklist items (priority 1-7 and 14), or starts Phase 2.

## Phase 1 session record (2026-10-23)

- Requested phase: Phase 1 only. Phase 0 had been committed by the user as `c628344`.

**Files created**

- `prototype/customer/discovery.html`, `prototype/customer/restaurant.html`
- `prototype/assets/js/pages/discovery.js`, `prototype/assets/js/pages/restaurant.js`
- `prototype/assets/js/services/statistics.js`
- `prototype/assets/js/ui/`: waiting-stats.js, icons.js, restaurant.js

**Files updated**

- `core/`: config.js (schema 2, statistics policy), seed-data.js (restaurant hours/description, statistics fixtures), store.js ('outdated' status), format.js (date helpers), strings.js, nav.js (`queryParam`)
- `ui/header.js`: title now optional, uses icons.js
- `pages/hub.js`: customer-app and r1-r3 links
- CSS: `tokens.css`, `mobile.css`
- Tests: `tests/foundation.test.js` renamed to `tests/self-check.js`; `tests/index.html` updated
- Docs: `prototype/README.md`, `docs/visual-spec.md`, `docs/assets.md`, this file

**Completed steps (phase-1 spec)**

1. C01 discovery:
   - Fictional list with text search and a 전체/예약/웨이팅 filter.
   - Cards are links to `restaurant.html?restaurantId=…`.
   - Empty state with a clear action.
   - The logo returns to the presenter hub.
2. C02 detail renders booking and waiting capability independently:
   - r1 gets a 예약/웨이팅 segmented control.
   - r2 shows waiting only; r3 shows booking only.
   - A missing or invalid ID shows a not-found screen with a working return link.
3. Statistics:
   - Weekday picker and hourly selection.
   - Summary tile with median, unit ("약 N분") and record count.
   - Bar list, with the period and update timestamp in the caption.
   - An uncertainty note says the values are historical, not a forecast.
4. Collecting states:
   - r1's sparse cells (weekday 15-16시) show "수집 중" with no bar.
   - r2 shows the collecting panel inside the same component.
   - r3 has no waiting section.
5. The booking and waiting CTAs are disabled and their labels say they are not available in this demo. No success is simulated.

**Checks actually run and outcomes.** Headless Edge, repo served by `python -m http.server` on 127.0.0.1:5577.

| Check | Result |
|---|---|
| Each of the 3 cards opens the matching detail (h1 and restaurantId); back returns to discovery | Pass |
| Filters (웨이팅 gives r1, r2; 예약 gives r1, r3), search "라멘", empty state "식당 0곳", clear restores 3 | Pass |
| r1: segmented 예약/웨이팅; deposit 20,000원; booking CTA disabled "…일반 예약을 할 수 없어요"; statistics hidden on booking tab | Pass |
| r1 waiting tab: caption "최근 4주(9월 25일 ~ 10월 22일) 웨이팅 기록 기준 · 10월 23일 00:00 업데이트"; 7 weekdays; 10 hourly rows | Pass |
| r1 ready cell 금 19시: "약 60분 / 최근 4주 중앙값 · 기록 31건" | Pass |
| r1 sparse cell 월 15시: "수집 중 / 기록 2건 · 5건 이상 모이면 보여드려요", bar width 0 | Pass |
| No "0분" anywhere on r1 or r2 | Pass |
| Keyboard: arrow keys change weekday and slot, focus stays on the radio, summary follows | Pass |
| r2: same section title and component, collecting panel "기록 108건"; waiting CTA unavailable | Pass |
| r3: no statistics, no segmented control, no waiting text; deposit 없음 | Pass |
| Invalid and missing restaurantId give not-found, and its link reaches discovery | Pass |
| 360x780 (discovery, r1 waiting, r2, r3): no horizontal overflow, no clipped labels, no overlap among row time/bar/value, sticky bar never covers the last content | Pass |
| Hub links to discovery and r1-r3 | Pass |
| Schema-1 (Phase 0) data shows the "이전 버전" banner; customer pages still render; reset clears it | Pass |
| No console errors, warnings, failed requests or 4xx on any page | Pass |
| Self-check page: 17/17, including 5 new statistics checks | Pass |
| Phase 0 regression suite | 38/38. The first rerun failed 2 checks only because the test script hard-coded schemaVersion 1; script updated |
| Accessible names (aria snapshot): radios "예약"/"웨이팅", "월요일"…"일요일" (fixed from "월 요일"), "15시 수집 중", "19시 약 60분" | Pass |
| Contrast, text pairs: segmented inactive #656565/#EAEFF3 5.03; selected-row text 5.25; chip 4.69 | Pass |
| Contrast, search placeholder | Was 4.17, fixed to #656565 (5.4) |
| Contrast, non-text: selected border 3.41; selected bar 3.20; unselected bars 1.58 (values always also in text) | Accepted |

Screenshots were reviewed at 390 and 360 for discovery, r1 booking, r1 statistics (ready and sparse), r2 and r3. Full-page captures draw sticky bars mid-page; that is a capture artifact, and the scroll test confirms nothing is covered.

**Unverified checks (not run, so not passed)**

- Headed browser via Live Server on port 5500.
- Firefox, Safari, and a real phone with touch.
- Actual screen-reader speech, including whether the summary's `aria-live` announcement on weekday change is too chatty.
- Back/forward cache restoring filter state. Filters intentionally reset on return.
- Statistics against a real CatchTable statistics screen: no reference exists.

**Known issues**

- Restaurant photos are neutral placeholders until real or licensed images are supplied.
- The 홈/메뉴/사진/리뷰 tabs, header icons, rating, save/phone buttons and home bottom nav are omitted rather than shown dead.
- The detail page's "today" label uses the demo clock at page load; it does not update if the clock advances while the page is open.

**Next exact action:** user reviews discovery and detail, then sends the Phase 2 prompt from `docs/prompts.md`.

## Phase 0 session record (2026-10-23)

- Requested phase: Phase 0 only.

**Files created**

- `prototype/index.html`: presenter hub.
- `prototype/README.md`
- `prototype/customer/ui-sample.html`
- `prototype/tests/index.html`, tests/foundation.test.js (renamed to `prototype/tests/self-check.js` in Phase 1)
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
- 2026-10-23 (Phase 1): Schema version 2. Data from an older schema gets status 'outdated'.
  - It is left untouched, writes are refused, and the hub asks for a reset.
  - There is no automatic migration: demo data is disposable, but silently replacing stored data is not allowed.
- 2026-10-23 (Phase 1): Statistics fixtures use per-hour cells over opening hours, last 4 weeks ending the day before reset, updated at 00:00 KST on the reset day.
  - A cell needs at least 5 records (decisions.md).
  - `services/statistics.js` never returns a number for a sparse cell.
  - r2's story ("최근 문을 연") explains why it is still collecting.
- 2026-10-23 (Phase 1): Chart form is provisional: a horizontal bar list where the selected hour is brand orange and the rest grey, with values in text colors. Orange numerals are reserved for the live queue (Phase 2).
- 2026-10-23 (Phase 1): Ordinary booking is outside the demo scope (requirements.md). The booking panel shows the deposit policy, and the CTA says booking is unavailable in this demo.
- 2026-10-23 (Phase 1): The default 예약/웨이팅 tab is 예약, as in the app. The statistics default to today's weekday and the current hour (nearest open hour) from the demo clock.
- 2026-10-23 (Phase 1): The discovery logo links to the presenter hub, so product screens need no visible presenter control.

## Visual references

- 14 app screenshots were added on 2026-10-23 and inventoried in `reference-screens/README.md`. Measured tokens are in visual-spec.md.
- Missing references: postpone sheet, waiting statistics, reservation detail, checkout, manager screens.
- Reviewed against references: `customer/ui-sample.html`, `customer/discovery.html`, `customer/restaurant.html` (see visual-spec.md, Screen comparisons).
- Still wanted: a capture of the existing weekday/time-slot statistics screen, to replace the provisional chart form.

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
- 2026-10-23, Phase 1:
  - Discovery, restaurant detail (r1/r2/r3 variants, not-found), and weekday/time-slot statistics with collecting states are complete.
  - 40/40 Phase 1 checks, 38/38 Phase 0 regression, 17/17 self-check.
  - Nothing committed.
  - Suggested commit: `phase-1: discovery, restaurant detail, waiting statistics with collecting states`.
- 2026-10-23, visual-fidelity pass (user request, before Phase 2):
  - App-like home and detail, real r1/r2 listing details and photos from captures, booking picker, Pretendard.
  - Guidelines updated (CLAUDE.md, requirements, design-system, decisions, data-model, screen-map, source-notes).
  - robots.txt respected.
  - 44/44 fidelity, 38/38 Phase 0, 19/19 self-check.
  - Nothing committed.
  - Suggested commit: `phase-1: app-fidelity home and detail with real listings, booking picker, Pretendard`.
- 2026-10-23, 49-capture fidelity pass (user request, before Phase 2):
  - Tabbed detail panels, calendar and confirm sheets, the app's statistics chart, search, saved and my-dining from the new captures; r3 = 스시렌.
  - Online references recorded; the 웨이팅 미루기 conflict is flagged for the user.
  - 52/52 acceptance, 38/38 Phase 0, 20/20 self-check.
  - Nothing committed.
  - Suggested commit: `phase-1: apply 49 app captures (tabbed detail, calendar sheet, statistics chart, search, saved, my-dining)`.
- 2026-10-23, Phase 2 (user request after the velog reference):
  - Waiting registration, the To-Be ticket strip and View My Waiting CTA, the ticket page with cancel and 웨이팅 순서 미루기, my-dining tickets, the manager dashboard, presets.
  - 22/22 Phase 2, 26/26 self-check, 52/52 fidelity, 38/38 Phase 0.
  - Nothing committed.
  - Suggested commit: `phase-2: waiting registration, visible ticket on detail, postpone/cancel, manager queue`.
- 2026-10-23, Phase 3:
  - Cancellation-seat requests from sold-out times, FIFO exclusive offers with absolute deadlines, decline/expiry/withdraw handoff, 빈자리 대기 / 우선 예약 기회 / 나의 알림 pages, manager 예약 · 빈자리, hub release and notification-failure tools.
  - 16/16 Phase 3, 35/35 self-check, 22/22 Phase 2, 53/53 fidelity, 38/38 Phase 0.
  - Nothing committed.
  - Suggested commit: `phase-3: cancellation-seat queue, FIFO exclusive offers, inbox and manager allocation view`.
- 2026-10-23, Phase 4:
  - Mock priority checkout (예약금 안내, consents, demo card), payment ledger with success/failure/unknown/commit-failure paths, recovery and refund, reservation detail, 마이다이닝 reservations, manager bookings, hub payment controls.
  - 16/16 Phase 4, 44/44 self-check, all regressions green.
  - Nothing committed.
  - Suggested commit: `phase-4: priority checkout with mock payment ledger, unknown holds, commit recovery and reservations`.
- 2026-10-23, Phase 5:
  - Late-arrival coordination: ETA from C07, manager M03 retain / propose / cannot-retain, customer accept / reject, versioned shared history, notifications, late-ready preset.
  - Phase 6 spec extended with the MY tab and more restaurants.
  - 11/11 Phase 5, 50/50 self-check, all regressions green.
  - Nothing committed.
  - Suggested commit: `phase-5: late-arrival coordination with versioned ETA, manager responses and shared history`.
