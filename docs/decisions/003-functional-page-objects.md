# ADR 003: Functional Page Objects Over Class-Based

**Status:** Accepted  
**Date:** 2026-04-04

---

## Context

Page Object Model (POM) is the standard pattern for abstracting UI interactions in E2E frameworks. The conventional implementation uses classes — one class per page, with locators as properties and interactions as methods. Playwright's own documentation defaults to this style.

The alternative is to implement page objects as plain TypeScript modules: exported functions and module-level constants, with no class instantiation.

---

## Decision

Implement page objects as functional modules rather than classes.

Each page object is a `.ts` file that exports named async functions (e.g. `login()`, `verifyErrorMessage()`) and declares locators as module-level string constants.

```typescript
// locators are constants, not class properties
const submitButtonLocator = '[data-test="signin-submit"]';

// interactions are exported functions, not methods
export async function login(page, username, password) { ... }
```

---

## Consequences

**Benefits:**
- No instantiation boilerplate in tests. Functions are imported and called directly, keeping specs clean.
- Locators are easy to scan — they sit at the top of the file as plain constants, not buried in a constructor or spread across properties.
- Tree-shaking friendly. Tests only import the functions they use; unused page interactions don't add overhead.
- Avoids inheritance misuse. Class-based POM often tempts developers to build `BasePage` hierarchies that become brittle and hard to reason about.

**Trade-offs:**
- No shared state across interactions within a page object. If state needs to be passed between functions (e.g. a dynamically generated selector), it must be passed explicitly as a parameter.
- Less familiar to engineers coming from Java/C# test frameworks (e.g. Selenium with JUnit), where class-based POM is the norm. There is a short onboarding adjustment.
- Some Playwright examples and tutorials use classes, so the pattern occasionally requires explanation in code reviews.
