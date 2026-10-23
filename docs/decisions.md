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
| Postponement | Move behind 1 or 2 additional eligible waiting parties; offered choices depend on queue length |
| Postponement limits | WAITING tickets only; at most two demo postponements; configurable |
| Statistics | Fixture median minutes, grouped by weekday/time; last 4 weeks; minimum 5 samples per cell |
| Sparse statistics | Mark collecting data for sparse cells/restaurant; never invent zero or precise forecasts |
| Reservation deposit | KRW 20,000 for booking fixture; zero-deposit fixture for alternative flow |
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

Open choices to confirm during visual review: exact screenshot-derived font, logo variant,
spacing, manager layout, and statistics chart form. They do not block building a provisional shell.
