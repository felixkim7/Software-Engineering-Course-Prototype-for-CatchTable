# Phase 6 - Cross-role integration, polish and rehearsal

## Entry condition

Phase 5 is completed or its limitations are explicitly recorded; user requests this phase.

## Read first

Read CLAUDE.md and docs/PROGRESS.md, then: docs/test-plan.md; docs/demo-script.md; docs/design-system.md; docs/PROGRESS.md.
Inspect matching screenshots listed in docs/reference-screens/README.md if supplied.

## Implementation steps

1. Run all domain and navigation checks against a fresh reset; fix regressions only.
2. Review all three theme walkthroughs, empty/error/expired states and role ownership.
3. Compare available references at equal viewports; finish responsive and accessible interaction details.
4. Confirm relative paths, local assets and HTTP-only operation; do not publish automatically.
5. Finalize prototype/README.md with actual routes, supported limitations, reset and rehearsal instructions.

User-requested additions (2026-10-23), built before the final checks:

A. MY tab (C14 `customer/my.html`), modelled on capture 220751.
   - Header with search, bell (→ 나의 알림) and settings.
   - Profile row showing the active demo customer (never the capture's account name), with 수정.
   - 팔로워/팔로잉, the 캐치미식가 배지 row and the CATCH pay banner.
   - 포인트 / 쿠폰함 / 저장 / 최근 본 매장 tiles. 저장 opens the 저장 tab, 최근 본 매장 opens search, and 쿠폰함 shows claimed coupons.
   - 생일·기념일 and 전화 예약 rows.
   - 도움돼요 누른 리뷰 and 내가 쓴 리뷰 with empty states. The capture's own review is personal content and is not reproduced.
   - Controls without a demo behaviour give the shared "not in this demo" message.
   - The bottom nav MY item links here.
B. More restaurants beyond r1-r3, from public sources found online: name, area, cuisine, menu and prices, hours, photos.
   - Record every source URL in docs/assets.md.
   - app.catchtable.co.kr stays off-limits (robots.txt).
   - Photos are used only when their source allows it (official restaurant material or clearly licensed images), or come from user captures. Otherwise the placeholder block is used.
   - Reviews are never invented. Operational data (availability, waiting, statistics) stays mock.
   - CLAUDE.md's fixture rule is updated to match.
6. Update PROGRESS with passed/failed/unverified evidence and a concise final handoff.

## Acceptance criteria

- [ ] All three walkthroughs run without editing source or storage manually.
- [ ] All visible buttons work or intentionally explain unavailability.
- [ ] No console errors, duplicate reservations/payments, stuck unresolved states without resolution controls.
- [ ] 390x844 and 360px customer views, 1440x900 and 1024px manager views are usable.
- [ ] Keyboard dialogs, form labels, focus and status announcements verified.
- [ ] Reset restores a coherent scenario; local assets work without external network.
- [ ] Demo script can be rehearsed within its suggested time allocation.
- [ ] MY tab works from every bottom nav; it shows the active demo customer and no personal capture data.
- [ ] Added restaurants appear in home, search and detail with sourced data; no invented reviews; provenance recorded.

## Out of scope

No new features beyond A and B above, backend, framework migration, deployment or unrelated redesign.

## Handoff

Update docs/PROGRESS.md with files, test evidence, unverified items and decisions.
Report the exact page/actions to review. Suggest `phase-6: <completed scope>` as a
commit message. Stop after this phase; do not automatically begin the next one.
