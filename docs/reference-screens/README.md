# App Reference Screens

User-supplied captures of the real CatchTable Android app, added on 2026-10-23 (captured
2026-10-16). Source: user's own device, not the website. Raw size 1080 px wide (status bar
included). Measurements in `../visual-spec.md` map raw pixels to the 390 px reference
viewport with factor 390/1080 (about 2.77 raw px per CSS px); this is a proportional mapping,
not the device's real density. No account names, phone numbers or payment data are visible.
The restaurants shown are real businesses: use them as layout references only, never as fixtures.

Filenames are kept as supplied. Suggested-name column maps each file to the kit's slots.

| File | Suggested slot | Screen and observed state | Phase |
|---|---|---|---|
| Screenshot_20261016_161246_CatchTable.jpg | customer-discovery | Home: C logo, pill search field, brand tabs, location row, hero banner, category icon grid, 5-tab bottom nav | 1 |
| Screenshot_20261016_183123_CatchTable.jpg | (party selection) | Back-arrow header "방문 인원 선택", question title, four +/- stepper rows, divider, total row, full-width orange CTA "다음" | 2 |
| Screenshot_20261016_183144_CatchTable.jpg | restaurant-booking | Long capture, vivo pizza detail, booking tab: photo pair, name/rating/meta rows, grey chips, 5 tabs, segmented 예약/웨이팅, date chips, outline orange button, AI summary card, bottom bar (save count, phone, CTA "예약하기") | 1 |
| Screenshot_20261016_183200_CatchTable.jpg | restaurant-waiting-before | vivo pizza waiting tab: refresh link, list card "매장 식사 1팀 · 20분" with pale-orange badge, disabled grey CTA "2팀 이상부터 온라인 웨이팅 가능" | 1-2 |
| Screenshot_20261016_183234_CatchTable.jpg | (waiting confirm) | "웨이팅 정보 확인": two-cell stat card (current teams / estimate, orange numerals), 8 px band, key-value rows, muted notice panel with check list, CTA "웨이팅 등록하기" | 2 |
| Screenshot_20261016_183347_CatchTable.jpg | restaurant-booking | Long capture, 월화식당 detail, booking tab; coupon card with orange border, Blue Ribbon chip, "N명이 보고 있어요" photo overlay | 1 |
| Screenshot_20261016_183357_CatchTable.jpg | restaurant-waiting-before | 월화식당 waiting tab before registration: "2팀 · 45분", enabled CTA "웨이팅하기" | 1-2 |
| Screenshot_20261016_183404_CatchTable.jpg | (waiting confirm) | Same confirm screen for 월화식당 (2팀 / 45분, no adult breakdown row) | 2 |
| Screenshot_20261016_183410_CatchTable.jpg | (registration result) | 방문예정 page under 60% scrim with ad modal and bottom sheet "웨이팅이 등록되었어요" (blue info text), dark tooltip, CTA "실시간 순서 함께 확인하기" | 2 |
| Screenshot_20261016_183416_CatchTable.jpg | my-waiting | 방문예정: restaurant link, muted band with white shadowed card "웨이팅 순서 / 3번째" (large orange numeral), ticket number, remaining time, registration timestamp, info box, two outlined buttons 웨이팅 취소 / 웨이팅 미루기 | 2 |
| Screenshot_20261016_183425_CatchTable.jpg | restaurant-waiting-after-as-is | After registration, detail reopens on booking tab with CTA "예약하기"; no active waiting indicator | 2 (flaw) |
| Screenshot_20261016_183433_CatchTable.jpg | restaurant-waiting-after-as-is | After registration, waiting tab still shows "3팀 · 60분" and CTA "웨이팅하기"; the active ticket is not visible | 2 (flaw) |
| Screenshot_20261016_183438_CatchTable.jpg | restaurant-waiting-after-as-is | Pressing 웨이팅하기 again opens sheet "웨이팅 등록이 불가합니다 / 이미 웨이팅을 신청한 매장입니다" + 확인 | 2 (flaw) |
| Screenshot_20261016_183450_CatchTable.jpg | (cancel confirm) | Centered dialog "…웨이팅을 취소할까요?", buttons 아니요 (outlined) / 네, 취소할게요 (red fill) over 60% scrim | 2 |

The three "as-is" captures are evidence of the problem the To-Be design fixes. Do not reproduce
that behavior: the To-Be detail page shows the active ticket and changes the CTA to View My Waiting.

## Not yet supplied

| Suggested file | What to capture |
|---|---|
| waiting-postpone-sheet.png | Existing postponement range options |
| waiting-statistics.png | Existing weekday/time-slot statistics at a supporting restaurant |
| reservation-detail.png | Confirmed reservation detail and existing actions |
| checkout.png | Booking policy and deposit screen, with private data removed |
| manager-reference.png | Manager layout if available; otherwise design an explicitly inferred layout |

## Official website

`https://app.catchtable.co.kr/` responded on 2026-10-23 to a plain HTTP fetch of its HTML
shell only: it sets `html { font-size: 10px }` and preloads Pretendard (Regular, Medium,
SemiBold, Bold) subsets. The rendered website pages were NOT visually inspected or captured
in Phase 0; the supplied app screenshots take priority for the tokens recorded so far.

Keep only files relevant to the task. Do not include account names, phone numbers, real
reservation codes or payment information in public demo assets. Record approved asset
provenance in `docs/assets.md`.
