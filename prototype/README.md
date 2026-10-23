# CatchTable Rebuild Prototype

Front-end-only class prototype (vanilla HTML/CSS/ES modules). No build step, no install,
no backend. All data is fictional and lives in this browser's localStorage.

## Run

ES modules do not load from `file://`, so serve the repository root over HTTP:

```sh
# from the repository root (the folder that contains prototype/)
python -m http.server 5500
# Windows alternative if `python` is not on PATH:
py -m http.server 5500
```

Open http://localhost:5500/prototype/ and keep the server running.
VS Code Live Server also works: open `prototype/index.html` with "Open with Live Server".

Demo data is stored per origin. Use the same host and port every time (e.g. always
`localhost:5500`) to keep it; `127.0.0.1:5500` is a different origin with separate data.

## Pages (Phase 0)

| Route | Purpose |
|---|---|
| `index.html` | Presenter hub: reset, demo clock, role and account selection, scenario/route status |
| `customer/ui-sample.html` | Neutral mobile sample of shared components (390px reference width) |
| `tests/index.html` | Foundation self-check (store, seed, clock, format). Restores your demo data afterwards |

Customer and manager screens arrive in later phases; the hub lists them as unavailable.

## Data and limits

- One snapshot under the localStorage key `catchtable-prototype:v1`
  (`schemaVersion`, `revision`, `scenarioEpoch`, demo-clock offset, presenter selections).
- "데모 초기화" (reset) rebuilds the same fixtures with dates from the reset time and starts a
  new scenario epoch; delayed mock results from before the reset are discarded.
- If stored data is unreadable, the hub says so and leaves it untouched until you reset.
  If the browser blocks storage, the hub warns that changes will not survive a reload.
- Use one active tab for actions. Other tabs update when data changes, but localStorage is
  not a transactional database and concurrent writers are not supported.
- Role checks run in local code only; browser data can be inspected and edited. This is a
  demonstration, not a secure or production system.
