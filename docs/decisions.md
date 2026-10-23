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
| Waiting duplicates | One active ticket per customer per restaurant; cross-restaurant limits not modeled |
| Postponement | Move behind 1 or 2 additional eligible waiting parties; offered choices depend on queue length. **Open (2026-10-23):** public posts describe the real app as "move to the back of the queue, about 2 times, not after being called" (docs/reference-screens/README.md, Online references). Unchanged until the user decides |
| Postponement limits | WAITING tickets only; at most two demo postponements; configurable |
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

Open choices to confirm during visual review: manager layout and the postponement rule above.
The font (Pretendard), logo and statistics chart form were settled from captures. They do not block building a provisional shell.
