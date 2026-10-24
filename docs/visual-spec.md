# Visual Spec

Revised in Phase 0 (2026-10-23) from the 14 app screenshots in `reference-screens/`.
Status legend:
- **Measured**: pixel-sampled color from a JPEG capture (compression noise of about ±2 per channel).
- **Estimated**: size measured in raw pixels and mapped by 390/1080 (±1-2 px).
- **Assumption**: not observable in the references.
- **Deviation**: intentionally differs from the reference, with the reason stated.

Implemented tokens live in `prototype/assets/css/tokens.css`. Values below that are not yet
in that file are recorded for the phase that first needs them.

## Color

| Token | Value | Status | Evidence |
|---|---|---|---|
| brand | #FF3D00 | Measured | CTA fill (183123, 183234), user logo.svg fill |
| primary (button fill) | #FF3D00 | Measured (since fidelity pass 2026-10-23) | Matches the app. White labels on it are 19px bold, which counts as large text, so 3.55:1 meets the 3:1 rule. #DD3500 is kept as `primary-strong` for small white text such as banner tags (4.58:1) |
| primary-text (small orange text) | #C93000 | Deviation | Badge text measured #F83F06 on #FFF0EB is 3.32:1; #C93000 gives 4.84:1 |
| brand-soft | #FFF0EB | Measured | "매장" badge background (183200) |
| danger | #DC1B1C | Measured | "네, 취소할게요" fill (183450); white text 4.98:1 |
| ink | #1E212A | Measured | Active tab underline (161246, 183200) |
| text | #111111 | Estimated | Darkest glyph pixels #000000-#212121 |
| text-secondary | #656565 | Measured | Descriptions, notice text, sheet labels (consistent in 4 screens); 5.83:1 |
| text-tertiary | #767676 | Deviation | Timestamp grey #B6BABB (1.96:1) and inactive tab #82878B (3.63:1) fail; lightest passing grey used |
| text-disabled | #A9A9A9 | Measured | Disabled CTA label (183200); inactive control, exempt from contrast |
| link | #426396 | Measured | "위치" link (183200) |
| info-blue | #407FAB | Measured | Registration sheet info text (183410); not yet implemented |
| background | #FFFFFF | Measured | |
| surface-muted | #F7F8FA | Measured | My-waiting band and info box (183416); notice panel #F9F9F9 treated as same |
| surface-disabled | #F4F4F4 | Measured | Disabled CTA fill (183200) |
| chip | #F3F4F6 (text #626F78) | Measured | Feature chips (183200); 4.69:1 |
| segmented-bg | #EAEFF3 | Measured | 예약/웨이팅 control (183200); also used for the statistics weekday picker |
| segmented selected border | #7F8D96 | Measured | Selected option outline (183200); 3.41:1 non-text |
| segmented inactive text | #656565 | Deviation | Measured #A8B0B3 is about 2:1 on #EAEFF3; secondary grey gives 5.03:1 |
| search field | #F5F5F5 | Measured | Home search pill (161246); placeholder uses #656565 (5.4:1) instead of a lighter grey |
| filter chip (selected) | ink fill, white text | Assumption | Discovery filters are not in the references |
| chart line / area | #3375DB / #ECF3FD | Measured | Waiting chart (173602); line 4.46:1 on white (graphics need 3:1); selected point and dashed marker in brand orange |
| time chip | #FFEAE2 fill, #F9B9A3 border, #C93000 text | Measured, lightened | Booking sheet (171404); fill lightened from about #FED8CB so the text reaches 4.64:1 |
| suggestion chip | #FCEFF6 fill, #8E2A6B text | Measured | Search (173403); 6.99:1 |
| border | #E4E4E7 | Measured | Outlined buttons #E4E4E4 / #DEDFE3, list card #E9E9EB |
| divider / section band | #F0F0F0 | Measured | Card border, 8 px section band (183234) |
| toast / tooltip | #474747 | Measured | Tooltip (183410); used for toast |
| star | #F5C618 | Measured | Rating star; not yet implemented |
| scrim | rgb(0 0 0 / 0.6) | Measured | White under scrim renders #666666 (183450) |
| focus ring | ink, 2 px, 2 px offset | Assumption | Focus states are not visible in touch screenshots |
| warning bg / border | #FFF8E1 / #F0C36D | Assumption | Presenter hub storage banner only; not an app element |

## Typography

| Role | Value | Status |
|---|---|---|
| font stack | "Pretendard Variable" (bundled woff2, OFL), then "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", system-ui | Official web preloads Pretendard; bundled locally since the fidelity pass |
| caption / chip | 12px | Estimated |
| body-sm | 14px | Estimated (descriptions) |
| body | 15px / 1.5 | Estimated (meta rows) |
| button | 16px, 600 | Estimated (tabs, outlined buttons) |
| cta | 19px, 700 | Deviation: app looks about 17px; 19px bold makes white-on-#FF3D00 large text |
| header | 18px, 700 | Estimated (back-arrow page titles) |
| section | 20px / 1.4, 700 | Estimated (confirm-screen question, section titles) |
| title | 24px / 1.3, 700 (detail name 22px) | Estimated; detail text calibrated by matching text widths against 183425 |
| display | 32px, 700 | Estimated ("3번째" numeral) |

## Size, spacing and shape

| Token | Value | Status |
|---|---|---|
| side gutter | 20px | Estimated (54 raw px) |
| section band | 8px | Estimated (21 raw px) |
| spacing scale | 4, 8, 12, 16, 20, 24, 32px | Assumption, consistent with gutter |
| control height | 48px | Estimated CTA 44-46 px at the 390 mapping (47-48 dp at a typical 2.625 density); 48 kept for touch comfort |
| header height | 56px | Assumption |
| radius-sm | 4px | Estimated (chips) |
| radius-md | 8px | Estimated (CTA, outlined buttons, list cards) |
| radius-lg | 12px | Estimated (ticket card, dialog 10-12) |
| radius-xl | 16px | Estimated (bottom-sheet top corners) |
| radius-pill | 999px | Observed (search field, segmented control, round steppers) |
| card shadow | 0 2px 12px rgb(0 0 0 / 0.06) | Estimated (soft shadow under ticket card) |
| customer width | 390px reference, fluid 360-430px | Project target |

## Component observations

- Page header: back arrow at the left, bold title left-aligned next to it. No bottom border.
- Primary CTA: full width inside 20 px gutters, sticky at the bottom, label centered and bold.
- Bottom action bar on detail: save icon with count, phone icon, then CTA filling the rest.
- Dialog: centered white card inside 20 px gutters, centered bold title, two equal buttons
  (outlined secondary left, filled action right).
- Bottom sheet: white, 16 px top radius. The 날짜·인원·시간 sheet (171404) has no title row: "오늘" link, month
  navigation, 7-column calendar (selected day = filled orange circle, past days grey), party circles,
  open times only as pale-orange chips, 닫기. Tapping a time closes it and opens the visit
  confirmation sheet (171732: title with close icon, orange rule, restaurant card, 취소/확인).
- Detail tabs switch panels (171138: the 메뉴 tab shows only menu content); the tab bar sticks
  under the header and scrolls horizontally when a restaurant has 7 tabs (스시렌, 173218).
- Section separation: full-bleed 8 px #F0F0F0 band, not cards with margins.
- Status uses text plus color (orange numerals with units), never color alone.

## Fidelity-pass deviations (2026-10-23)

- **Home header icons:** 40px wide (the app spaces its two icons 34px apart). Above the WCAG 2.2 AA 24px target; below our 44px default.
- **Small app-sized controls** (함께 고르기, Blue Ribbon chip, review link, 위치) keep their size, with an invisible 44px hit area.
- **Subway line badges** use official Seoul line colors with white text (2.1-4.1:1), as in the app. The adjacent station text carries the information.
- **AI summary accent** gradient is #E8366F to #E5512A (both at least 3:1 at 20px bold).
- **Text-size calibration:** the capture device is wider than 390px, so app text measures about 10-15% smaller relative to screen width. Detail and home text sizes were reduced by about 10%, but not below 11px.

## Waiting statistics (from capture 173602)

The app's own chart, "요일별 평균 웨이팅 시간 Beta", replaced the provisional bar list:
- Single-series line + area over hours 6-24 (x labels every 2 h), recessive grid, no legend.
- Selected hour: orange point with halo and a dashed orange marker; tooltip "평균 N팀 | M분".
- Weekday circles Monday first; the selected one has an orange ring; "대기 많음" badge on the
  busiest weekday.

To-Be additions:
- A caption with the 4-week period and update time.
- Hours with fewer than 5 records break the line and read "수집 중"; they never draw at 0.
- The tooltip sits in a band above the plot, so unlike the app it never hides a nearby peak.
- A live text line repeats the selection with the record count.
- A note says it is not a real-time forecast.
- Keyboard and screen-reader access through a visually hidden radio group of hours.
- A restaurant with no sufficient cell shows a collecting panel in the same section.

## On-site waiting (Phase 2)

Customer screens follow the user's captures 183123 (방문 인원 선택), 183234 (웨이팅 정보 확인),
183410 (registered sheet), 183416 (방문예정), 183450 (cancel dialog) and 183200 (detail queue card),
plus the velog screenshots for 웨이팅 순서 미루기 and the cancelled state. The manager page
follows CatchTable's store dashboard help screenshots. Measured or chosen values:
- Position numeral: 44px, weight 800, brand orange, with "번째" at 18px in #C93000.
- Ticket card: white, 16px radius, soft shadow, on a #F7F8FA band. The notice box is #F3F4F6 with an "!" icon.
- Postpone list rows: 60px, a native radio with brand accent, "+ N분" in #C93000. The current-place bar is #F7F8FA between borders.
- Cancelled title: "웨이팅 취소" at 28px/800 in #8C8C8C (large text, 3.36:1).
- To-Be ticket strip above the bottom bar:
  - white with a 16px top radius;
  - "웨이팅 중" pill in #DD3500 with white 12px bold text;
  - the called state uses #FFF0EB.
- Manager dashboard:
  - The row number is #E8572F at 30px/800.
  - Channel labels are 현장/수기/원격 in #C93000.
  - Action buttons are 64px high with 20px bold labels:
    - 호출 #00897B (4.32:1);
    - 착석 #5C63D6 (4.99:1);
    - 취소 #D63A52 (4.58:1).
  - A called row is tinted #FFF7F3.
  - The app's navy seat-type cards are omitted (this demo has a single 매장 식사 queue).

## Cancellation-seat queue (Phase 3, provisional)

There is no capture of the app's 빈자리 알림, and online sources are text only. These To-Be screens reuse
the captured language: bottom sheets, chips, outlined cards, #FFF0EB/#FFF7F3 orange tints for
"your turn", and orange (#C93000) status text.
- Booking sheet: sold-out times sit in time order between open ones. They use #F4F4F4 with a "마감"
  tag; after joining, a brand border and an orange "대기 중" tag. Sold-out days stay selectable and are
  struck through in #767676.
- Join sheet: condition card with "같은 조건 … 번째" in #C93000, then three check-mark rules.
- 빈자리 대기 cards: 56px photo, status line, name, condition, request ID. An offered card gets a 2px
  brand outline and a #FFF0EB deadline line.
- 우선 예약 기회: "빈자리가 생겼어요!" at 24px/800; a countdown card in #FFF7F3 with a 44px/800
  tabular timer and the absolute deadline under it. The timer has role=timer and no live
  announcements.
- 나의 알림: rows with a 40px round tinted icon; unread rows are tinted #FFF7F3.
- Manager 예약 · 빈자리: plain white tables in the dashboard palette, with orange (held/offered) and
  blue #1F5FD1 on #E8F1FD (available/queued) status pills.

## Priority checkout and reservation (Phase 4)

- 예약금 안내 sheet follows 171739:
  - header with the orange rule (shared with the visit-confirmation sheet);
  - "!" notice;
  - a bordered table of 1인당 예약금 / x 총 예약 인원 / 합계;
  - a grey 환불정책 box;
  - "총 예약금" with the amount in #C93000;
  - 이전 / 확인.
- Checkout follows 171752:
  - X close and restaurant title;
  - timer chip in #1F5FD1 on #E8F1FD (5.1:1) with the offer's remaining time instead of the app's "7분간 예약 찜";
  - sections separated by 8px bands;
  - 방문 목적 pill chips, selected = brand border on #FFF0EB;
  - one 데모 카드 radio instead of CATCH pay / 일반결제;
  - total in #C93000 20px/800;
  - request textarea on #F5F5F5;
  - "모두 동의합니다." box, consent checkboxes, and the bordered refund table;
  - fixed bottom summary (예약 정보, 결제금액).
- The app's "밀어서 결제하기" slider is a normal button ("20,000원 결제하기"). It stays keyboard-operable and is disabled until the required consents are checked, with a visible hint.
- State screens (processing with a spinner, unknown, recovery, refunded) are centred text blocks with one action. The spinner respects reduced motion.
- Reservation detail (provisional): a confirmation badge (check on #FFF0EB) shown once, then the 방문예정 ticket layout with a fact list and the refund table.

## Late-arrival coordination (Phase 5, provisional)

CatchTable has no such feature, so there is no reference. The screens reuse the captured language.
- C07: a white "늦게 도착할 것 같나요?" card in the 방문예정 band.
- ETA sheet: 2-column time chips ("오후 6:30 (30분 늦음)"), selected = brand border on #FFF0EB; reason chips like 방문 목적.
- Status card: grey for waiting, retained or decided states, #FFF7F3 with #C93000 title for a proposal or "cannot retain". Accept / reject buttons are outlined / primary.
- A changed time shows "변경됨 · 처음 예약 …" in #C93000 under the new time.
- 조율 기록: the same ordered list on both roles, version · actor · timestamp over the action. Customer entries have a grey left rule, restaurant entries an orange one.
- M03: dashboard palette. Facts grid; 예약 유지 (#5C63D6), a time select plus 시간 변경 제안 (#00897B), and 유지 어려움 (#D63A52, with confirmation) as 64px buttons.

## Reference inventory

See `reference-screens/README.md` for the per-file inventory and missing references.
Manager screens have no reference: the desktop workspace is an inferred layout using
the same palette.

## Screen comparisons

| Route | Reference | Viewport | Differences | Status |
|---|---|---|---|---|
| customer/ui-sample.html | 183123 (header, CTA), 183450 (dialog), 183416 (card, band) | 390x844, 360x780 | Neutral sample only. Header, gutter, 8 px bands, sticky CTA and centered two-button dialog match the references; CTA orange is darker (deviation above); Noto Sans KR renders instead of Pretendard; dialog radius 12 vs about 10 measured | Checked from headless Edge screenshots 2026-10-23 |
| index.html (hub) | none (presenter tool, not an app screen) | 1440x900, 1024x768 | Inferred layout using the same tokens | Checked from headless Edge screenshots 2026-10-23 |
| customer/discovery.html (fidelity pass) | 161246, 183416 | 390x844, 360x780, side-by-side image | Matches header, brand tabs, location row, banner (real crop), 20 category icons, bottom nav. Our banners 2-3 are restaurant photos with our copy. "맛집 둘러보기" list replaces the uncaptured "어디로 가시나요?" section. Text sizes calibrated about 10% down toward the capture's proportions | Checked 2026-10-23 |
| customer/discovery.html (49-capture pass) | 170629, 170655 | 390x844, 360x780 | Adds the "어디로 가시나요?" area tiles (real crops) with the 내 주변 pill, 7 brand tabs, a search link to C12, and review counts on cards. Price-band BEST and Michelin sections are not reproduced | Checked 2026-10-23 |
| customer/restaurant.html (49-capture pass) | 171054-171404, 171546-171646, 171732, 173157-173324, 173602 | 390x844, 360x780 | Tabs switch panels: menu with thumbnails and boards, photo filters and grid, review distribution (no bodies), store info with map, facilities, guides and details, plus 소식/방송 for 스시렌. Calendar sheet and visit confirmation match 171404/171732; statistics match 173602 apart from the To-Be additions; ribbon above the bar for 스시렌. The weekly-hours and second-station rows expand. Not reproduced: the app-install banner, review bodies, live viewer counts | Checked 2026-10-23 |
| customer/search.html | 173403 | 390x844, 360x780 | Matches the bordered box with blue 날짜·인원, recent-view chips, pink suggestion chips and hashtags. Recent searches and name-based suggestions (personal) are replaced by generic suggestions; the "어떤 매장을 찾으세요?" cards and benefit banner are omitted | Checked 2026-10-23 |
| customer/saved.html | 173436 | 390x844, 360x780 | Matches header (저장/추천, badge, 새 컬렉션), collections, 저장한 매장 N, 함께고르기, picker bar, sort chips, entries with photos and date chips. Lists the demo customer's saves, not the capture's. "추천" grey darkened to 4.5:1 | Checked 2026-10-23 |
| customer/waiting-register.html, waiting.html (Phase 2) | 183123, 183234, 183410, 183416, 183450; velog postpone/cancel screenshots | 390x844, 360x780 | Steppers, confirm card, rules box, registered sheet, ticket card, notice, cancel dialog, postpone list and confirm sheet match. Not reproduced: ads, "주변 맛집" map, KakaoTalk live-activity CTA (실시간 순서 함께 확인하기 → 확인). To-Be: ticket strip on the detail page | Checked 2026-10-23 |
| manager/waiting.html (Phase 2) | CatchTable dashboard help screenshots (channel.io) | 1440x900, 1024x768 | 접수 switch, totals, tabs, columns and 호출/착석/취소 colours match. Seat-type cards, 3-second undo and 되돌리기 omitted; 웨이팅 등록 explains it is not in the demo | Checked 2026-10-23 |
| customer/cancellation-queue.html, offer.html, inbox.html; booking sheet sold-out times (Phase 3) | none (provisional, see above) | 390x844, 360x780 | Consistent with the captured sheets, cards and chips; no overflow at 360px | Checked 2026-10-23 |
| customer/offer.html deposit sheet, checkout.html (Phase 4) | 171739, 171752 | 390x844, 360x780 | Matches the sheet and the checkout structure; demo card and button instead of CATCH pay and the slide control; no overflow at 360px | Checked 2026-10-23 |
| customer/reservation.html (Phase 4) | none (183416 layout) | 390x844, 360x780 | Provisional | Checked 2026-10-23 |
| customer/reservation.html late section, manager/reservation.html (Phase 5) | none (provisional) | 390x844, 360x780; 1440x900, 1024x768 | Identical history on both roles; no overflow | Checked 2026-10-23 |
| manager/reservations.html (Phase 3) | none (dashboard palette) | 1440x900, 1024x768 | Allocation tables; no overflow at 1024px | Checked 2026-10-23 |
| customer/my-dining.html | 173505, 173513, 173524 | 390x844, 360x780 | Matches title, 나의 예약/나의 알림 underline tabs, filled filter chips, empty-state copy and button. Benefit banner and personal recommended searches omitted | Checked 2026-10-23 |
| customer/my.html (Phase 6) | 220751 | 390x844, 360x780 | Matches header (search, bell, gear), profile row with 수정, 팔로워/팔로잉, badge card (real crop), CATCH pay card on one line, four tiles, 생일·기념일 card (real cake crop), 전화 예약 row, benefit banner (real crop), 도움돼요 누른 리뷰. Shows the demo customer instead of the capture's account; 내가 쓴 리뷰 is an empty state instead of the user's own review and photo | Checked side by side 2026-10-23 |
| customer/discovery.html, search.html, restaurant.html for r4-r7 (Phase 6) | 170629 (cards only) | 390x844, 360x780 | Cards match the capture's photo, name, rating and Michelin label. Detail pages reuse the r1-r3 components; fields without a public source are left out (no review counts, distributions or AI summary). r5 closed days read 휴무 on chips and the calendar. No detail capture exists for these restaurants | Checked 2026-10-23 (provisional detail layout) |
| customer/discovery.html, search.html, restaurant.html for r8-r14 | 170629 (가격대별 BEST rows, 비슷한 곳 cards) | 390x844 | r8-r12 use the BEST list's row layout (76px thumbnail beside name, rating, count, one-liner) because only 151px thumbnails exist; their detail photo is 152px. r13/r14 use the normal card. Sections without data are hidden (r9/r11: no menu, location or details) | Checked 2026-10-23 (provisional detail layout) |
| customer/restaurant.html (fidelity pass) | 183144, 183200, 183347, 183357, 183425, 183433 | 390x844, 360x780, side-by-side image | Matches header icons and scrolled title, photo carousel, Blue Ribbon chip, name + 함께 고르기, rating row, subway badges, info rows, tag chips, tabs, coupon, segmented control, date chips, 예약 오픈 일정, AI summary, save/phone/CTA bar. Not reproduced: "N명이 보고 있어요" (fake live data), app-install banner. Picker sheet, menu/review/info sections and statistics are provisional until captured | Checked 2026-10-23 |
