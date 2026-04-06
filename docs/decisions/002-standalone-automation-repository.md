# ADR 002: Standalone Automation Repository

**Status:** Accepted  
**Date:** 2026-04-04

---

## Context

When setting up E2E automation, the first structural decision is where the tests live: inside the application repository, or in a dedicated one.

The system under test ([Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app)) is a third-party repository. Even in projects where the app is owned internally, co-locating automation with the application creates coupling that becomes a problem at scale: test suites tied to app release cycles, shared CI pipelines that slow each other down, and difficulty testing across service boundaries in distributed systems.

---

## Decision

Keep automation in a standalone repository, separate from the application codebase.

---

## Consequences

**Benefits:**
- Automation can evolve independently — new tests, refactors, and tooling upgrades don't require app deployments or coordination with app teams.
- CI pipelines are decoupled. The automation pipeline can be triggered on its own schedule, on demand, or against any deployed environment.
- The pattern scales naturally to distributed systems, where a single automation repo can test multiple services.
- Secrets and test infrastructure are managed in one place, not scattered across multiple repos.

**Trade-offs:**
- Local setup requires running two repos simultaneously (app + automation).
- Environment coordination is the developer's responsibility — the automation has no awareness of whether the app is running or which version is deployed.
- There is no automatic signal when an app change breaks tests. This must be addressed with CI triggers or scheduled runs against a stable environment.
