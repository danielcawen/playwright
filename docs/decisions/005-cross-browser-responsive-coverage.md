# ADR 005: Cross-Browser and Responsive Coverage via Playwright Projects

**Status:** Accepted  
**Date:** 2026-04-04

---

## Context

Modern web applications are accessed across a wide range of browsers and device types. Responsive behaviour — particularly mobile navigation patterns like hamburger menus — can break independently of core functionality. The question is how much of this variation to cover in E2E tests, and how to do so without duplicating test code.

Playwright's `projects` configuration allows a single test suite to run across multiple browser/device configurations with no changes to test logic.

---

## Decision

Configure 7 browser/device projects covering three form factors:

| Category | Projects |
|---|---|
| Desktop | Chrome, Firefox, Safari |
| Tablet | Chrome (Galaxy Tab S4), Safari (iPad Pro 11) |
| Mobile | Chrome (Pixel 5), Safari (iPhone 12) |

Where behaviour differs by viewport (e.g. mobile sidebar is hidden behind a hamburger menu), tests detect the active form factor at runtime and adapt:

```typescript
const isMobile = page.viewportSize()!.width < 768;
if (isMobile) await page.click(hamburgerMenuLocator);
```

---

## Consequences

**Benefits:**
- Every test runs across all 7 configurations automatically. 3 specs produce 21 test runs with no duplication.
- Responsive regressions are caught at the same time as functional ones — no separate mobile test suite to maintain.
- Real device emulation (via Playwright's `devices` presets) uses production browser engines, not polyfills.
- Viewport-aware logic is co-located with the test, making the behaviour explicit rather than hidden in configuration.

**Trade-offs:**
- Test execution time scales linearly with the number of projects. 7 projects means 7× the run time compared to a single-browser suite. This is mitigated by `fullyParallel: true` locally, though CI currently uses `workers: 1` to avoid resource contention.
- Viewport detection via pixel width is a heuristic. If the app changes its responsive breakpoints, the constant `768` must be updated manually. A more robust approach would query a CSS custom property or use a dedicated test attribute.
- Not all browsers behave identically in emulation. Cross-browser failures require careful triage to distinguish genuine browser bugs from emulation artefacts.
- The 7-project configuration is a sensible default, but it is not data-driven. **In a production application, analytics and real user monitoring (RUM) data — device types, OS versions, browser market share — should inform which configurations are worth covering.** Testing an iPad Pro and a Galaxy Tab equally makes sense as a baseline; it may not reflect actual user behaviour. Prioritising automation effort toward the devices real users are on increases the signal-to-noise ratio of the suite and reduces unnecessary CI cost.
