# ADR 008: Quality Gates

**Status:** Proposed  
**Date:** 2026-04-04

---

## Context

As an automation framework and its surrounding tooling mature, ad hoc checks run manually become insufficient. Quality gates formalise the standards that code must meet before it is pushed, merged, or deployed — and make those standards machine-enforceable rather than dependent on individual discipline.

This ADR covers the full quality gate strategy across both the automation repository and the application repositories it tests.

Two principles drive the design:

**Each enforcement point has a distinct job.** A gate should only check what hasn't already been reliably checked upstream. Repeating the same check at every stage adds noise and latency without increasing confidence. For example, there is no value in running `npm audit` again at pre-deploy if it already blocked the PR merge — the code that reached deployment already passed it.

**Local hooks are fast feedback, not security controls.** Pre-commit and pre-push hooks can be bypassed with `--no-verify`. They exist to catch mistakes early and cheaply, not to enforce policy. CI is the authoritative gate. Any check that must not be skippable belongs in CI.

This ADR is deliberately aspirational. It documents the target state. Current implementation status is noted at the end.

---

## Decision

### Gate model

```
[pre-push] ──► [PR / CI] ──► [merge to main] ──► [pre-deploy]
  local           remote          remote              remote
  fast            full            confirmed           critical only
```

Direct pushes to `main` must be forbidden via branch protection rules. All changes flow through a PR.

---

### Tier 1 — Pre-push (local)

Runs on `git push` via [Husky](https://typicode.com/husky). Scope: the automation repository.

**What runs here:**
- **Linting** (`eslint`) — catches errors before they reach code review. Fast enough for a pre-push hook.
- **Formatting check** (`prettier --check`) — fails if formatting violations exist. Encourages running Prettier on save rather than as a CI surprise.
- **Security audit** (`npm audit --audit-level=high`) — catches high/critical vulnerabilities before the code is visible to others. Uses `npm audit` only — no paid services required locally.

**What does not run here:**
- The full Playwright test suite — too slow and requires the application to be running.
- Snyk or other paid/network-heavy tools — local developer environments should not require service credentials to function.

**Failure behaviour:** Block the push. Developer must resolve before the branch is visible to others.

**Escape hatch:** `git push --no-verify` bypasses all hooks. This is a known and accepted limitation — hooks are developer convenience, not policy enforcement. CI is the backstop.

---

### Tier 2 — PR checks (CI, remote)

Runs on every pull request via GitHub Actions. This is the primary enforcement point — the gate with the most authority and the most complete information.

| Check | Tool | Blocks merge? | Notes |
|---|---|---|---|
| Full test suite | Playwright (all 7 projects) | Yes | All tests must pass across all browser/device configurations |
| Linting | ESLint | Yes | Authoritative check; catches anything that slipped past pre-push |
| Security audit | `npm audit --audit-level=high` | Yes | High/critical only. Low/moderate are advisory |
| Vulnerability scan | Snyk (CI mode) | Yes — high/critical only | Deeper analysis than `npm audit`; evaluates the full transitive dependency tree |
| Code complexity | CodeClimate / SonarCloud | Yes — on threshold violations | Blocks on new violations exceeding agreed thresholds; does not require clearing all pre-existing issues |
| Conventional Commits | `commitlint` | Yes | All commits in the PR must follow the Conventional Commits format |
| Dependency review | Dependabot / Renovate | No — advisory only | Flags outdated or vulnerable dependencies; update PRs are generated separately, not inline |

Linting is repeated here despite running at pre-push because CI is the authoritative gate. A developer who bypassed local hooks with `--no-verify` must still pass CI.

**Branch protection:** All PR checks must pass before merge is permitted. No bypass for repository owners.

---

### Tier 3 — Merge to main (CI, remote)

Merge to `main` is gated by the same status checks as the PR. No additional checks run at this point — the PR gate has already confirmed the code meets the required standard.

The merge to `main` event triggers downstream automation: changelog generation, version tagging, and release artifact creation via `conventional-changelog` or `release-please`.

---

### Tier 4 — Pre-deploy (CD pipeline)

The narrowest gate. By the time code reaches pre-deploy it has already passed linting, full tests, and security audits. The pre-deploy gate runs only the checks that are worth repeating — specifically, those where the answer may have changed since the PR was merged, because time has passed and new vulnerability disclosures happen continuously.

| Check | Tool | Blocks deploy? | Rationale |
|---|---|---|---|
| Security audit | `npm audit --audit-level=critical` | Yes — critical only | Re-runs against the final lockfile. Threshold tightened to critical-only: high-severity was already caught at PR; only newly disclosed critical CVEs should stop a deploy |
| Environment health check | Custom script / smoke test | Yes | Verifies the target environment is reachable and healthy before deployment begins. Prevents deploying into a broken environment and conflating environment failures with deployment failures |

**What does not run at pre-deploy:**
- Linting — code style cannot change between merge and deploy.
- Full Playwright test suite — this was the PR gate's job. Running 21 test runs at deploy time adds latency with no additional confidence; the code is identical to what passed the PR gate.
- Code complexity — a merge-time concern, not a deployment concern.

---

### Tooling decisions

#### Linting and formatting
- **ESLint** with `@typescript-eslint` — TypeScript-aware rules, catches common test antipatterns (e.g. floating promises in async tests, hardcoded locators in spec files).
- **Prettier** — opinionated formatter; eliminates style debates in code review. Integrated with `lint-staged` so only staged files are formatted on commit, and checked wholesale on pre-push and in CI.
- **Husky** — manages git hooks declaratively, committed to the repo so all contributors get the same hooks automatically on `npm install`.

#### Commit standards and changelog
- **Conventional Commits** format (`feat:`, `fix:`, `chore:`, `feat!:` etc.) enforced via `commitlint` as a CI check on PR, not as a local hook. Enforcing commit message format locally during active development (rebases, fixups, `--amend`) is disruptive. The PR boundary is the right enforcement point.
- **`conventional-changelog`** or **`release-please`** generates `CHANGELOG.md` automatically from commit history on merge to `main`.
- Conventional Commits also enables automated semantic versioning: `fix:` → patch, `feat:` → minor, `feat!:` (breaking change) → major.

#### Dependency management
- **Renovate** is preferred over Dependabot for its scheduling and grouping flexibility: all `@playwright/*` packages can be grouped into a single PR, non-critical updates scheduled to weekdays only, and patch updates auto-merged when CI passes.
- Should be configured on both the automation repository and the application repositories it tests.
- Tool choice should account for: hosting platform (GitHub vs GitLab vs Bitbucket), whether a self-hosted option is required, and licensing cost at scale.

#### Security scanning
Each tool has a different scope and cost profile. The right choice depends on factors outside this ADR — technology stack breadth, budget, and whether a centralised security programme already exists.

| Tool | Strengths | Limitations |
|---|---|---|
| `npm audit` | Free, zero setup, built into npm | Limited to the npm advisory database; no licence scanning |
| Snyk | Deep dependency tree analysis, multi-ecosystem, IDE plugin, free tier available | Requires account; some advanced features are paid |
| Depfu | Dependency updates with vulnerability context, lightweight | Less configurable than Renovate |
| GitHub Dependabot security alerts | Native to GitHub, no setup, covers common CVEs | GitHub-only; limited to known CVEs in the advisory database |

**Starting recommendation:** `npm audit --audit-level=high` in CI (free, zero setup) and Dependabot security alerts. Evaluate Snyk when the stack grows beyond Node.js or when centralised vulnerability reporting across multiple repos becomes a requirement.

#### Code complexity analysis
Tools such as **CodeClimate**, **SonarQube**, or **SonarCloud** provide cyclomatic complexity, cognitive complexity, and duplication metrics. Most valuable on application repositories where business logic accumulates fastest; the automation repo is lower priority.

Configuration strategy:
- Enable "no new issues" mode before attempting to clear existing issues. This prevents the codebase from getting worse without requiring a full remediation sprint before the gate is useful.
- Agree on thresholds per metric before enabling the gate. Arbitrary defaults create noise and get bypassed.
- SonarCloud has a free tier for public repositories and integrates with GitHub Actions with minimal setup.

---

### Observability and alerting (future scope)

As the system matures, test failure reporting (see [ADR 007](./007-automated-test-reporting.md)) transitions into a broader observability concern. Key decisions deferred to a future ADR:

- **Alert thresholds by environment.** A failure in a development environment warrants a different response than a failure in a production-like environment. Thresholds should be defined per environment, not universally applied.
- **Alert severity by system criticality.** A failure in the payment flow warrants a different response than a failure in profile settings. Test suites should be tagged by business criticality to enable severity-based routing.
- **On-call integration boundary.** PagerDuty or OpsGenie is appropriate when a failure requires human action outside business hours. The decision criterion: does this failure, in this environment, require someone to act at 2am? If yes, on-call. If no, a Slack notification is sufficient. Applying on-call to all test failures creates alert fatigue and erodes trust in the on-call system itself.

---

## Current implementation status

| Gate | Enforcement point | Status |
|---|---|---|
| Branch protection (forbid direct push to `main`) | Repository settings | Not yet configured |
| Husky git hooks | Pre-push (local) | Not yet implemented |
| ESLint | Pre-push + PR | Not yet implemented |
| Prettier | Pre-push + PR | Not yet implemented |
| `npm audit --audit-level=high` | Pre-push + PR | Not yet implemented |
| Full Playwright test suite on PR | PR | CI workflow exists; push/PR trigger not yet enabled |
| Snyk (high/critical) | PR | Not yet evaluated |
| Code complexity thresholds | PR | Not yet evaluated |
| `commitlint` (Conventional Commits) | PR | Not yet implemented |
| Renovate / Dependabot (advisory) | PR | Not yet implemented |
| `conventional-changelog` / `release-please` | Merge to main | Not yet implemented |
| `npm audit --audit-level=critical` | Pre-deploy | Not yet implemented |
| Environment health check | Pre-deploy | Not yet implemented |

---

## Consequences

**Benefits:**
- Each gate is responsible for what it is uniquely positioned to check. Checks do not repeat unless CI needs to backstop a bypassable local hook.
- Tiered severity (high/critical at PR, critical-only at pre-deploy) keeps the pre-deploy gate narrow and fast, reducing deployment friction without sacrificing safety against newly disclosed vulnerabilities.
- Automated dependency management and changelog generation reduce ongoing maintenance burden as the framework ages.
- Formalising gates removes reliance on reviewer discipline. A PR cannot merge with a failing test, a linting error, or a known high/critical vulnerability regardless of who approves it.

**Trade-offs:**
- Pre-push hooks can be bypassed with `--no-verify`. They are fast-feedback tools, not policy controls.
- Conventional Commits adds friction, particularly on solo projects or during active rebasing. Enforcing via CI rather than a local hook is a deliberate compromise between enforcement and developer experience.
- A gate that is too noisy or too slow gets disabled. Starting with the highest-value checks and adding incrementally is more sustainable than starting strict and having to walk it back.
- Each additional tool is a potential point of failure, misconfiguration, and maintenance. Prefer starting with `npm audit` and ESLint before evaluating Snyk, CodeClimate, and the rest.
