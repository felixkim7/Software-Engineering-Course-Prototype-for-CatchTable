# Copy/Paste Prompts for Claude Code

Paste one prompt at a time. Phase completion is a stopping point, not permission to
continue. Start each new session by reading the current progress file.

## Phase 0

```text
Read CLAUDE.md, docs/PROGRESS.md, docs/requirements.md and
 docs/phases/phase-0-foundation.md. Implement Phase 0 only.
Summarize the intended files, then work in small increments. Inspect supplied visual
references; if missing, document provisional values and continue. Run the acceptance
checks, record evidence and unverified items in PROGRESS.md, and stop.
```

## Phase 1

```text
Read CLAUDE.md and docs/PROGRESS.md. Implement only
 docs/phases/phase-1-discovery-statistics.md. Build discovery, restaurant detail and
weekday/time-slot statistics including collecting-data and booking-only variants.
Do not implement ticket registration yet. Verify, update progress and stop.
```

## Phase 2

```text
Read CLAUDE.md, docs/PROGRESS.md and docs/phases/phase-2-waiting.md.
Implement this phase only. Prioritize register -> navigate away -> revisit detail:
the active status and View My Waiting action must appear without another registration
attempt. Preserve baseline postponement and sync manager queue state. Verify and stop.
```

## Phase 3

```text
Read CLAUDE.md, docs/PROGRESS.md and docs/phases/phase-3-cancellation-queue.md.
Implement this phase only. Separate cancellation requests from on-site waiting tickets.
Demonstrate exact matching, FIFO exclusive offers, absolute deadlines and safe handoff.
Do not build checkout yet. Verify the queue cases, update progress and stop.
```

## Phase 4

```text
Read CLAUDE.md, docs/PROGRESS.md and docs/phases/phase-4-priority-booking.md.
Implement this phase only against docs/use-cases.md. Include mock checkout, idempotency,
unknown payment holds and post-payment reservation recovery. Do not claim localStorage
is a transactional backend. Run the relevant tests, update progress and stop.
```

## Phase 5

```text
Read CLAUDE.md, docs/PROGRESS.md and docs/phases/phase-5-late-arrival.md.
Implement this phase only. Support retain, propose and cannot-retain responses plus
customer accept/reject and versioned history. Reporting ETA is not approval; only
acceptance changes the proposed booking time. Verify both roles, update progress and stop.
```

## Phase 6

```text
Read CLAUDE.md, docs/PROGRESS.md and docs/phases/phase-6-integration.md.
Run the test plan and rehearse the demo script. Fix concrete defects, visual mismatches,
accessibility and dead navigation only. Add no new features and do not publish.
Record actual evidence, limitations and unverified checks, then provide final handoff.
```

## Review the current phase without changing files

```text
Read CLAUDE.md, docs/PROGRESS.md and the active phase spec. Review the implementation
against each acceptance criterion. Report concrete defects with file/route and reproduction
steps, separate unverified checks from failures, and propose the smallest fixes.
Do not modify files or implement later phases during this review.
```

## Resume an interrupted phase

```text
Read CLAUDE.md and docs/PROGRESS.md. Inspect the existing code before editing.
Summarize what is complete and the next unfinished step of the current requested phase.
Continue only that phase, preserve working functionality, verify and update the handoff.
```

## Fix one defect

```text
Read CLAUDE.md and docs/PROGRESS.md. Reproduce this issue: [describe issue and route].
Identify the root cause, make the smallest scoped fix, verify the affected behavior and
its immediate regressions, then update PROGRESS.md. Do not start a new phase.
```

## Add screenshot references later

```text
Inspect the new files in docs/reference-screens/. Update docs/visual-spec.md and
 docs/assets.md with observed values and provenance. Compare only the implemented
screens and correct visual mismatches while preserving the approved To-Be behavior.
Do not copy the As-Is unchanged waiting button or add unrelated features.
```
