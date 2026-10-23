# Architecture Contract

## App shape

Static multi-page HTML with ES modules. No build step. Use relative URLs so a future
GitHub Pages project subpath works. No root-absolute `/assets` paths. Query parameters
carry restaurantId/reservationId/offerId, never the authoritative entity state.
A missing or invalid ID shows a friendly not-found screen with a working return action.

## Modules

- core/store.js: load/validate/migrate/save a single versioned JSON snapshot; dispatch
  domain commands, expose read selectors and subscriptions.
- core/state-machine.js: legal transitions, ownership and invariant guards.
- core/clock.js: now(), advance(), reset(); every domain timer reads this clock.
- core/seed-data.js: deterministic fixture factory based on reset-time Seoul dates.
- core/config.js: mock policy values from decisions.md.
- core/format.js: dates, KRW and HTML escaping.
- core/strings.js: Korean UI messages with English identifier keys.
- services: allocation, waiting, payment, notification and late-arrival operations.
- ui: reusable presentational components; they do not own domain state.
- pages: route parsing, event binding, selectors and rendering only.

## Persistence and consistency

Use a key such as catchtable-prototype:v1. Store schemaVersion, revision and scenarioEpoch.
One synchronous command reads the newest snapshot, checks guards, applies related changes,
checks invariants, increments revision, saves once and notifies observers. Do not save a
partly-updated slot/offer/reservation combination. Async payment is two commands separated
by a mock service result; the second command rechecks the operation and scenario epoch.

localStorage is NOT a transactional database across tabs. The supported presentation
mode is one active writer tab with role switching. A second tab may observe via storage
or BroadcastChannel events, but do not promise concurrent writers. Document this limit.
Same-tab changes require a custom event/subscription because storage events fire elsewhere.
Re-read and reconcile on DOM load, focus, pageshow and return from checkout.

## Mock operations

Persist payment operation IDs and known outcomes. Repeated submit for an existing operation
returns its result, not a second charge. Guard pending buttons AND service commands.
Use one-shot failure flags, consumed by the relevant operation. Keep the ledger separate
from the 'fail reservation commit' simulation so a payment success can be reconciled.
Failure simulation is controlled from presenter tools, never with a real API key.

Offer countdowns derive from expiresAt - now(). A setInterval only refreshes the view;
it is not authoritative and must be cleaned up on navigation. reconcile() expires old
OFFERED records exactly once and allocates successors. It must not release PAYMENT_PENDING,
PAYMENT_UNKNOWN or RECOVERY_PENDING holds merely because the original offer deadline passed.

Clock: now = Date.now() + persisted offset. Advance changes the offset, then reconciles.
Reset replaces the snapshot, zeroes the offset, increments scenarioEpoch and invalidates
old async callbacks. Avoid frozen seed dates and timers that restart on every page.

## Failure and reload

Distinguish domain rejection (wrong owner/expired), mock payment failure (no charge),
unknown payment (held), and reservation commit failure after charge (recovery required).
If storage is unavailable or corrupt, show a clear recovery/reset message rather than
silently claiming persistence or losing a successful transaction.
An unknown operation on reload remains held until an explicit mock resolution occurs.

## Delivery boundaries

No live notifications: a local inbox and optional in-app toast simulate delivery.
A failed push does not remove the offer from the authoritative app view.
No real checkout fields. Use a preset 'Demo card' selection and a mock-payment notice.
No scraping or unofficial live CatchTable API calls. Include only assets the user supplies
or clearly licensed local alternatives. Explain mock data once in the hub.
