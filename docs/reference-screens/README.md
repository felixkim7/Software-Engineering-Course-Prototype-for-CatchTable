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

## Second batch: captured 2026-10-23 (49 files, requested by the checklist below)

Same device and size (1080 px wide). Files are `Screenshot_20261023_<time>_CatchTable.jpg`; only
the time is listed. 월화식당 (r1), vivo pizza (r2) and 스시렌 (r3) are real listings and are used
as fixtures (CLAUDE.md, docs/assets.md). Rows marked *personal* show the user's own account
content (saved list, recent searches, name-based suggestions, visit history). They are layout
evidence only; the prototype never reproduces them. Review bodies and reviewer nicknames are
not reproduced either.

| Time | Screen and observed state | Used for |
|---|---|---|
| 170629 | Home below the categories: "어디로 가시나요?" area tiles with 인기/핫플 badges and a 내 주변 pill, recently-viewed rows, price-band BEST, Michelin section (long capture) | Home areas, 1 |
| 170655 | Home top, brand tabs scrolled to 쿠폰 · 예약맛집 · 웨이팅맛집 · 캐치단독 · 피드 | Brand tabs |
| 171054, 171056 | 월화식당 detail top: photo carousel, Blue Ribbon 2027 chip, name, rating, station/price/hours rows, tags; 171056 has a "캡쳐해서 보내던 매장을…" app banner | r1 summary |
| 171105 | 월화식당 홈 tab (long): coupon, 예약/웨이팅 segmented, date chips, AI summary, Blue Ribbon banner, menu preview, reviews, photos, facilities, location, details | r1 홈 previews |
| 171138, 171143, 171148 | 월화식당 메뉴 tab: 메뉴판 thumbnails, category chips, menu items with prices and thumbnails, collapsed drink categories | r1 menu (15 items + sides) |
| 171211 - 171243 | 메뉴판 viewer 1/10 - 10/10 (full-screen menu boards) | Menu prices and names |
| 171255 - 171306 | Full-screen photo viewer 1/4 - 4/4 (food) | r1 photos |
| 171320 | 월화식당 사진 tab: filter chips with counts, two-column grid | Photos panel |
| 171325 | 월화식당 리뷰 tab top: average, 5-step distribution, sort/filters, 방문목적 chips | Reviews panel |
| 171341 | 월화식당 매장정보 (long): intro, award, map, address/copy, stations, 길찾기, directions, facilities, guides, phone | Info panel |
| 171359 | 월화식당 홈 with the tab bar pinned under the header (hours row still collapsed) | Sticky tabs |
| 171404 | 날짜·인원·시간 sheet: "오늘" link, month nav, calendar (selected day orange circle, past days grey), party circles 1-6, pale-orange time chips (available times only), 닫기 | Booking sheet |
| 171532 | vivo pizza photo viewer 1/8 (storefront) | r2 photo |
| 171546 | vivo pizza 홈 (long): summary with expanded weekly hours, booking area with 예약 오픈 일정, AI summary | r2 summary |
| 171613 | vivo pizza 메뉴 tab: Pizza / Pasta / Appetizer & Side / Beverage, 아이들 메뉴 없음 note | r2 menu |
| 171630 | vivo pizza 사진 tab: filters 업체 8 · 동영상 4 · 음식 202 · 내부 12 | r2 photos |
| 171635 | vivo pizza 리뷰 tab top | r2 reviews |
| 171646 | vivo pizza 매장정보 (long): closed days, notices, capacity | r2 info |
| 171732 | Visit confirmation sheet "내일 방문이 맞으신가요?": restaurant card, date/time/party icons, no-show note, 취소/확인 | Confirm sheet |
| 171739 | 예약금 안내: 1인당 10,000원 × 2 = 20,000원, refund policy | Phase 4 |
| 171752 | Checkout: 7분 hold timer, 예약 정보, 방문 목적, 결제 수단 (no card data visible) | Phase 4 |
| 173157 | 스시렌 detail top: 스시로드 TOP100 and 더들리 chips, ribbon "최근 인기 급상승! 2달 평점 4.7점 돌파" above the bottom bar | r3 summary, ribbon |
| 173218, 173253 | 스시렌 홈 and 메뉴 tabs: 7 tabs (소식, 방송), 런치/디너 오마카세, 알러지 note | r3 tabs, menu |
| 173303, 173308 | 스시렌 사진 and 리뷰 tabs (counts only are used) | r3 photos, reviews |
| 173324 | 스시렌 매장정보 (long): facilities (7), guides (6), weekly hours, notices, capacity | r3 info |
| 173403 | Search screen before typing: bordered search box with blue 날짜·인원, recent searches, 최근 본 매장 chips, suggestion chips (pink), "어떤 매장을 찾으세요?", hashtags. *personal*: recent searches, name-based title | Search screen |
| 173436 | 저장 tab: 저장/추천, "새로 생겼어요!", 새 컬렉션, 최근 본 매장 collection, 저장한 매장 N, 함께고르기, sort chips, entries with photos and date chips. *personal*: the saved list | Saved page |
| 173449 | 저장 tab scrolled (same layout; *personal*) | Saved page |
| 173505 | 마이다이닝 나의 예약 / 방문예정 empty state "예약한 매장이 없어요. 가까운 맛집을 지금 찾아보세요!" + orange button; recommended searches card (*personal* title) | My-dining |
| 173513, 173524 | 마이다이닝 방문완료 and 취소/노쇼 filters. *personal*: visit history including a past 현장웨이팅 ticket | My-dining; Phase 2 visited state |
| 173602 | Another restaurant's waiting area: 웨이팅 queue by party size (1인 / 2인 / 3인 이상), "요일별 평균 웨이팅 시간 Beta" line chart with tooltip "평균 10팀 \| 16분", weekday circles with "대기 많음" | Statistics chart; Phase 2 queue list |

## Online references (not stored in the repo)

Searched on 2026-10-23 for screens no capture covers. Images were viewed for reference only and
kept outside the repository (third-party copyright); nothing from them is shipped.

| Source | What it shows | Used for |
|---|---|---|
| raonblog.com, "캐치테이블 웨이팅 방법 · 예약 꿀팁 · 예약금 주의사항" (May 2024) | 방문예정 waiting card "현재 나의 순서 82번째" with "순서가 다가오고 있어요!" tooltip, "잠깐, 노쇼는 안돼요" box, 웨이팅 취소 / 웨이팅 미루기 buttons, KakaoTalk "방문 가능 여부 입력하기" prompt, 방문 완료 "웨이팅을 완료했어요! 총 대기시간" | Phase 2 reference |
| it.dategom.com, "캐치테이블 예약방법 · 웨이팅 성공률" | 웨이팅 미루기 described as moving to the back of the queue | Postponement rule (see below) |
| zzalmunga.com and gunmaria.com, 예약방법 · 웨이팅 순서 미루기 posts | Same description: postpone moves you to the end of the line, limited number of times | Postponement rule |
| a-ha.io question 424172ee0914ce708dee90edb5741ccd | User answer: postponement is possible about twice and not after being called; store-dependent | Postponement rule |
| designcompass.org, 2023-10-24 CatchTable design articles | Brand and UI overview | General visual language |

| velog.io/@noeyhgnas, "서비스 기획 - 서비스 비교: 캐치테이블 vs 테이블링" (supplied by the user) | 웨이팅 순서 미루기 page (radio list "22번째로 미루기 +2분" ... to the last position, "남은 미루기 횟수 : 2회", 취소 / 순서 미루기, confirm sheet "38번째로 웨이팅을 미룰까요?" 취소 / 네, 미룰게요), 방문예정 page with 웨이팅 취소 / 웨이팅 미루기, cancel dialog and cancelled state ("웨이팅 취소", 등록 \| 취소 times), KakaoTalk texts ("순서를 미뤘어요", "한 매장 당 순서를 2번 미룰 수 있어요", "입장할 순서예요! 지금 매장으로 와주세요"), duplicate-registration sheet | Phase 2 customer screens |
| docs.channel.io/catchtable, "대시보드 > 내역/정보 확인" and "대시보드 > 호출/착석/취소/되돌리기 방법" (CatchTable's own store help centre) | Store waiting dashboard: 접수중 (hours), 총 웨이팅 N팀 / N명, 웨이팅 등록, tabs 웨이팅 중 / 착석 / 취소, columns 순서 · 호출번호 (현장/수기/원격) · 웨이팅 정보 · 웨이팅상태 (elapsed, 미루기/되돌리기 flags) · 고객정보, buttons 호출 / 착석 / 취소, call limit 2 | M02 manager waiting page |

| Search 2026-10-23 for 캐치테이블 빈자리 알림 (gogumafarm.kr, acoustic42.com, enolja.com, carfinance.co.kr, velog k-skill notes) | Text only, no usable screenshots: alerts are set per restaurant/date/time, everyone alerted races to book ("by the time you open it, it is gone") | As-Is evidence for Phase 3; its To-Be screens are provisional |

**웨이팅 미루기 resolved (2026-10-23).** The user pointed to the velog post: the customer chooses how far
back to move ("N번째로 미루기"), at most twice, never after being called. decisions.md now follows it.

## Capture checklist (requested 2026-10-23)

The official site's robots.txt disallows automated agents (`User-agent: * / Disallow: /`), so
Claude does not crawl or download from app.catchtable.co.kr. Real content comes from these
manual captures.

- Save them in this folder with any name that says what they show; long scroll captures are fine.
- Do not book, register or pay anything.
- Crop out your name, phone number and any reservation or waiting codes.
- Review text is not needed.

**Priority:** items 1-7 and 14.

**Status (2026-10-23 batch):** supplied: 1-5, 7 (sheet; the app lists only open times, so no
마감 chips exist to capture), 8-14. Still missing: 6 for 월화식당 (expanded weekly hours; vivo and
스시렌 are covered), more vivo full-screen photos (one of 3 supplied), and 15 (postpone sheet).

**A. For each of 월화식당 마포본점 and vivo pizza 공덕점**

| # | Screen | How to get there |
|---|---|---|
| 1 | 메뉴 tab | Long capture of the whole menu (names, prices) |
| 2 | 사진 tab | The photo grid |
| 3 | 2-3 full-screen photos | Tap photos (food, interior); these become the real images |
| 4 | 리뷰 tab, top only | Rating summary and keywords |
| 5 | 매장정보 tab | Long capture: address, phone, weekly hours, closed days, parking, facilities |
| 6 | Expanded hours | 홈 tab: tap ⌄ next to "오늘 (금) · …" |
| 7 | Booking sheet | 예약 tab, tap 날짜 · 인원 · 시간. Capture the sheet, then again after picking a date, showing time slots (ideally some 마감) |

**B. One booking-only restaurant (no 웨이팅 tab). Replaces the fictional r3.**

| # | Screen | How to get there |
|---|---|---|
| 8 | Detail 홈 tab | Long capture from photos down through the booking area |
| 9 | 메뉴 and 매장정보 tabs | As in 1 and 5 |
| 10 | 2 full-screen photos | As in 3 |

**C. App-wide**

| # | Screen | How to get there |
|---|---|---|
| 11 | Home below the category icons | "어디로 가시나요?" and the following sections |
| 12 | Search screen | Tap the home search bar, before typing |
| 13 | 저장 and 마이다이닝 tabs | Bottom navigation |
| 14 | Existing waiting statistics | Any restaurant showing 요일별·시간대별 대기 정보 (try the 웨이팅맛집 category) |
| 15 | 웨이팅 미루기 sheet (optional) | Next time you have a real waiting registration; needed for Phase 2 |

## Not yet supplied (later phases)

| Suggested file | What to capture |
|---|---|
| reservation-detail.png | Confirmed reservation detail and existing actions |
| postpone-sheet.png | 웨이팅 미루기 sheet (Phase 2) |
| manager-reference.png | Manager layout if available; otherwise design an explicitly inferred layout |

The deposit and checkout screens were supplied as 171739 and 171752.

## Official website

`https://app.catchtable.co.kr/` responded on 2026-10-23 to a plain HTTP fetch of its HTML
shell only: it sets `html { font-size: 10px }` and preloads Pretendard (Regular, Medium,
SemiBold, Bold) subsets. The rendered website pages were NOT visually inspected or captured
in Phase 0; the supplied app screenshots take priority for the tokens recorded so far.

Keep only files relevant to the task. Do not include account names, phone numbers, real
reservation codes or payment information in public demo assets. Record approved asset
provenance in `docs/assets.md`.
