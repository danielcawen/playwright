# ADR 006: Fail-Fast Environment Variable Validation

**Status:** Accepted  
**Date:** 2026-04-04

---

## Context

E2E tests that depend on credentials or environment-specific configuration are vulnerable to a specific failure mode: a missing or misconfigured environment variable causes a test to fail mid-execution, often with a confusing error far removed from the actual cause (e.g. "Cannot read property 'username' of undefined" deep inside a page object).

This is especially problematic in CI, where secrets injection can silently fail, and in onboarding, where a developer may not realise which variables are required.

The alternatives are:

1. **Access `process.env` directly in tests** — simple but fails late and obscures the root cause.
2. **Default to empty strings** — masks misconfiguration entirely, producing subtle assertion failures.
3. **Validate at module load time and throw immediately** — surfaces the problem before any test runs.

---

## Decision

Centralise all environment variable access behind a `requireEnv()` function that throws a descriptive error if a variable is missing:

```typescript
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
```

All env-dependent constants are resolved at module load time, not lazily inside test functions. If any required variable is absent, the process fails immediately with a clear message identifying exactly which variable is missing.

---

## Consequences

**Benefits:**
- Misconfiguration is caught before any browser is launched or any test begins. The error message names the missing variable directly.
- The `constants/users.ts` file acts as a single, scannable registry of all required environment variables. Onboarding a new developer is a matter of pointing them to that file and `.env.example`.
- No silent failures. An empty string is treated as missing, preventing the common mistake of setting `VALID_USERNAME=` in `.env` and having tests proceed with blank credentials.

**Trade-offs:**
- Module-level evaluation means there is no way to conditionally require a variable (e.g. "only needed if running the payment suite"). All variables in `constants/users.ts` are validated on every run, even if only a subset of tests execute. This is an acceptable trade-off at current scale; a more granular approach would be needed for a large multi-suite framework.
- Throws at import time, which can produce unfamiliar stack traces in some test runners. Playwright handles this cleanly, but it is worth noting for teams evaluating framework portability.

---

## Security Considerations

Correct validation is only part of the picture. How secrets are handled throughout the project matters equally:

- **`.env` is gitignored and must never be committed.** Secrets in version control is the most common and most damaging env variable mistake — once committed, a secret is compromised even if the commit is later removed from history.
- **`.env.example` contains placeholder values only**, never real credentials. It exists solely to document which variables are required.
- **In CI, secrets are injected via GitHub Actions repository secrets** and referenced in the workflow `env` block. They are never hardcoded in workflow files or printed in logs.
- **`requireEnv()` must never log the value it is validating.** The current implementation throws with the variable *name* on failure, not its value. This is intentional — a stack trace or error log that surfaces a credential defeats the purpose of keeping it secret.
- **`process.env` values should not appear in test output, traces, or reports.** Playwright's trace viewer and HTML reporter can capture network requests and page state; care should be taken that credentials are not transmitted or stored in a way that ends up in an artifact.

---

## Related

- `.env.example` documents all required variables with placeholder values.
- Secrets in CI are injected via GitHub Actions repository secrets and referenced in the workflow `env` block — they are never stored in the repository.
