# Mock Policy Decisions

These are explicit prototype defaults, NOT real CatchTable policies or new course requirements.
Keep all values in `core/config.js` when implemented. User instructions may change them.

| Topic | Demo default |
|---|---|
| Offer lifetime | 120 seconds from allocation; displayed countdown uses absolute deadline |
| Payment processing limit | 60 seconds after a valid accept request; unresolved outcome keeps a hold |
| Mock service delay | 600 ms for normal responses; presenter can force success/failure/unknown |
| Matching | Exact restaurant ID, date, time and party size; one slot unit fits that party |
| FIFO | ascending requestedAt, then stable request ID; never privilege the displayed user |
| Slot model | One released slot unit can produce one reservation; capacity matching is simplified |
| Decline/expiry | End this request as DECLINED/EXPIRED; rejoining creates a new timestamp |
| Empty eligible queue | Slot becomes AVAILABLE; no auto-booking; normal booking is outside core demo |
| Duplicate requests | One active request per customer and exact condition key |
| Deadline boundary | Valid only when now < expiresAt; equality means expired |
| Waiting duplicates | One active ticket per customer per restaurant; cross-restaurant limits (the app allows 3) not modeled |
| Waiting estimate | MOCK: position x the restaurant's minutes per team (r1 15, r2 20), always shown as "약 N분" with a may-differ note |
| Waiting registration | Each waiting restaurant has an `accepting` switch the manager toggles (접수중/접수마감), not tied to the clock. r2 also keeps the captured rule "2팀 이상부터 온라인 웨이팅 가능" (app registration needs 2+ active parties) |
| Calls | A manager may call a party at most 2 times (CatchTable dashboard help); calling makes the ticket CALLED |
| Postponement | As the real app's "웨이팅 순서 미루기" page (velog screenshots, confirmed by the user 2026-10-23): the customer picks any later position from the next one down to the last active party ("N번째로 미루기 +M분"), then confirms. Choices are recomputed from the live queue; a stale choice is rejected |
| Postponement limits | WAITING tickets only (not after being called); at most 2 per ticket ("한 매장 당 순서를 2번 미룰 수 있어요"); `POLICY.waitingPostponeLimit` |
| Statistics | Fixture average wait minutes and average waiting teams per weekday/hour, as the app's "요일별 평균 웨이팅 시간" chart (173602); last 4 weeks; minimum 5 records per cell. Shown as a line chart over hours 6-24; the tooltip sits above the plot so it never hides a peak |
| Sparse statistics | Mark collecting data for sparse cells/restaurant; never invent zero or precise forecasts |
| Reservation deposit | KRW 20,000 for booking fixture; zero-deposit fixture for alternative flow |
| Restaurant fixtures | r1 = 월화식당 마포본점, r2 = vivo pizza 공덕점, r3 = 스시렌 (booking-only); real public listing details, menus and photos from the user's captures of 2026-10-16 and 2026-10-23. Their deposits, availability, waiting and statistics are mock values. Review bodies are not reproduced; only counts and distributions |
| Ordinary booking availability | Computed per restaurant from fixture patterns: booking window per restaurant (r1 30, r2 60, r3 45 days; the page shows 14 date chips, the calendar the whole window), times listed per restaurant, past times closed, sold-out [day offset, time] pairs (r1 day+1 19:00/19:30 and day+2 18:30/19:00, kept for the Phase 3 cancellation demo; r2 today; r3 day+2). The calendar lists only open times, as the app does. Party size only needs to fit the restaurant's maximum |
| Recent views / search | Opening a detail page records a per-customer recent view (newest first, no duplicates); search matches every typed term against name, area, cuisine, description, tags, stations and menu names |
| Saved restaurants / coupons | Per active customer; saving toggles, claiming a coupon twice keeps one claim; save counts show the captured count + 1 when saved |
| Late report | ETA must be later than booked time and within the same service date |
| Proposed new time | Customer must explicitly accept; reject leaves original booking time unchanged |
| Cannot retain | Record response and show contact/next-step guidance; do not auto-cancel or waive fees |
| Manager silence | Show awaiting response and contact guidance; never auto-approve |
| Updated ETA | Create a new coordination version, invalidate obsolete proposed-time actions |
| Time display | Asia/Seoul; seed dates are derived from reset time, never frozen to October 2026 |
| Demo writer | One active editing tab; multiple read-only views may observe state |

Do not implement a production seat optimizer, fee engine, identity service or distributed
lock. If the actual screenshots show different baseline postponement options, update
these demo defaults and document the change; do not change the new waiting visibility requirement.

Open choices to confirm during visual review: none blocking. The manager layout follows CatchTable's dashboard help screenshots.
The font (Pretendard), logo and statistics chart form were settled from captures. They do not block building a provisional shell.
