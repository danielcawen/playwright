# ADR 004: Dynamic Test Data Generation with Faker

**Status:** Accepted  
**Date:** 2026-04-04

---

## Context

Tests that create resources (users, accounts, transactions) need unique data on every run. The alternatives are:

1. **Hardcoded static data** — simple but requires teardown between runs and causes collisions in parallel or repeated execution.
2. **Timestamp-based uniqueness** — `user_1714000000` style. Avoids collisions but produces meaningless, hard-to-read test output.
3. **Dynamic generation via a library** — produces realistic, human-readable data that is unique per run.
4. **API-based seeding** — the most robust approach, but requires API access and more setup infrastructure.

---

## Decision

Use `@faker-js/faker` to generate test data for flows that create new entities.

```typescript
const firstName = faker.person.firstName();
const username = faker.internet.username({ firstName, lastName });
const password = faker.internet.password();
```

---

## Consequences

**Benefits:**
- No test data collisions across parallel runs or repeated local execution.
- Test output (logs, reports, traces) contains readable names rather than opaque identifiers, making failure diagnosis faster.
- No teardown logic required for created entities — each run produces a net-new user with no conflicts.
- Zero infrastructure dependency. Works without API access, database connections, or seed scripts.

**Trade-offs:**
- Generated data is not persisted or retrievable after a test run. If a test fails mid-flow, there is no easy way to inspect what data was used without checking the trace or report.
- Not suitable for tests that require a pre-existing, known-state entity (e.g. "log in as a user who already has a transaction history"). Those cases require either static credentials from env variables or API-based seeding.
- Adds a dependency (`@faker-js/faker`) that must be kept up to date.

---

## Notes

Static credentials for pre-existing accounts (e.g. the login tests) are handled separately via environment variables — see [ADR 006](./006-environment-variable-validation.md).
