# CatchTable Prototype Development Kit

This package contains English instructions for phased development in VS Code with
Claude Code. It does NOT contain a completed application. Phase 0 creates the scaffold.

## Start

1. Extract this directory and open it as the VS Code workspace root.
2. Keep `CLAUDE.md`, `docs/` and `.claude/` at this level.
3. Add your actual app screenshots and logo to `docs/reference-screens/` as described there.
4. Start Claude Code in this workspace and paste the Phase 0 prompt below.
5. Review that phase, then request the next phase explicitly.

```text
Read CLAUDE.md, docs/PROGRESS.md, docs/requirements.md, docs/decisions.md,
and docs/phases/phase-0-foundation.md. Implement Phase 0 only.
First summarize the scope and intended files, then proceed in small steps.
If screenshots are missing, use documented provisional values and continue.
Do not implement later-phase features. Run the phase checks, update PROGRESS.md,
report any unverified checks, and stop when Phase 0 is complete.
```

After Phase 0, use VS Code Live Server on `prototype/index.html`, or run this from
the workspace root and visit http://localhost:5500/prototype/:

```sh
python -m http.server 5500
```

On Windows, `py -m http.server 5500` is an alternative if `python` is unavailable.
The server must remain running. Use the same host and port to retain the same browser data.
No npm installation is required by this specification.

## Files to read

| File | Purpose |
|---|---|
| CLAUDE.md | Always-read development contract |
| docs/PROGRESS.md | Phase status and session handoff |
| docs/requirements.md | Scope and original FR/QR traceability |
| docs/use-cases.md | Priority-booking description and other demo flows |
| docs/data-model.md | Entities, lifecycle transitions and invariants |
| docs/decisions.md | Explicit mock policy defaults, not actual CatchTable policies |
| docs/architecture.md | Browser-only implementation and persistence boundaries |
| docs/screen-map.md | Routes, states, links and implementation phase |
| docs/design-system.md | UI principles and screenshot comparison workflow |
| docs/visual-spec.md | Provisional tokens to verify during Phase 0 |
| docs/test-plan.md | Meaningful manual/domain checks |
| docs/demo-script.md | Rehearsable presentation paths |
| docs/prompts.md | Copy/paste prompts for each phase and review |
| docs/phases/ | Seven bounded implementation specifications |
| docs/source-notes.md | Decisions carried forward from the project |

All instruction files are English. Product UI is specified as Korean, matching the
previous prototype convention and the class audience. Ask Claude to change the UI language
explicitly if you want an English product demo as well.

Do not upload the old KakaoTalk CLAUDE.md into this root: it would conflict with this one.
No reference screenshots, brand logo, dependencies, credentials, or application code are bundled.
