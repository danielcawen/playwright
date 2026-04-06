# ADR 001: Automation Framework Selection

**Status:** Accepted  
**Date:** 2026-04-04

> **Note:** This project uses Playwright for demonstration purposes. The decision process below reflects how this choice should be made in a real production context, where the right answer depends on factors specific to each team and application.

---

## Context

Choosing an automation framework is one of the highest-leverage decisions in a test strategy. It is expensive to reverse — tests, page objects, CI pipelines, and team knowledge are all built on top of it.

The following factors should drive the evaluation:

### Browser and platform support

List what browsers the application actually needs to support — base it on production RUM (Real User Monitoring) data if available: device types, OS versions. Ideally, consider browser market share broken down by the actual user base, not global averages.

Each automation framework has a different browser support matrix. The framework's browser support must cover what the application needs.

### Framework capabilities and ecosystem

Evaluate what each framework can do and at what cost:

- **Core features:** Does it support the interactions the application requires? iframes, shadow DOM, multiple tabs, file upload, SSO/OAuth flows, and WebSocket testing are not universally supported or equally well-implemented across frameworks.
- **AI and tooling integrations:** Some frameworks are beginning to offer AI-assisted test generation. Evaluate whether these are genuinely useful or vendor lock-in dressed up as productivity.
- **Plugins and extensions:** What does the ecosystem look like? A framework with a rich plugin ecosystem (reporters, visual regression tools, accessibility checkers) reduces the amount of custom tooling you need to build.
- **Paid vs free features:** Understand feature pricings, how costs scale with team size and test volume, and adjust to the budget.
- **Community health:** Check GitHub stars and trajectory, frequency of releases, age of open issues, and whether the maintainers are responsive. A framework that is slow to adopt new browser versions or has hundreds of unresolved bugs is a liability.

### Team and hiring considerations

The best framework for your team is not necessarily the technically superior one — it is the one your team can use effectively and that you can hire for.

- **Existing knowledge:** A team already proficient in Cypress will ship faster with Cypress, even if Playwright has better cross-browser support on paper. The migration cost is real.
- **Learning curve:** Some frameworks are more approachable for developers new to automation. Others are more powerful but require deeper understanding to use correctly.
- **Hiring pool:** If you need to scale the team, consider how many candidates in your market have experience with the framework. Choosing an obscure framework optimises for capability at the cost of hirability. Playwright and Cypress have large, active communities; niche frameworks narrow the candidate pool.
- **Solo vs team context:** For a solo engineer or a small team, community resources and documentation quality matter more than enterprise support contracts.

### Application-specific requirements

Some application features require explicit framework support that is easy to overlook during a generic evaluation:

- **iframes:** Playwright has native iframe support; some frameworks require workarounds.
- **SSO and OAuth flows:** Authentication flows that redirect to a third-party IdP (Okta, Auth0, Google) can be difficult to automate. Evaluate whether the framework supports intercepting or mocking these flows, or whether you need an API-based workaround.
- **Multi-origin navigation:** Strict same-origin policies in some frameworks (Cypress, historically) block tests that cross domains. Verify this against your application's actual navigation patterns.
- **Mobile:** If the application has a native mobile counterpart, consider whether a unified framework (Appium, Detox) is preferable to separate web and mobile stacks.
- **Accessibility testing:** If accessibility is a requirement (legal or otherwise), check whether the framework integrates with tools like Axe or Lighthouse.

---

## Decision

Playwright was selected for this project. In the context of a real production decision, the factors above would be weighted against the specific application, team, and budget. Playwright's strengths that made it appropriate here:

- Native cross-browser support including WebKit, enabling the responsive coverage strategy in [ADR 005](./005-cross-browser-responsive-coverage.md).
- First-class TypeScript support with no additional configuration.
- Strong network interception and tracing capabilities built in.
- Active development and a growing community, with frequent releases and good responsiveness to issues.
- Free and open source with no features gated behind a paid tier.

---

## Consequences

**Benefits:**
- A structured evaluation process produces a decision that is defensible and revisitable. When the framework becomes a limitation, the original reasoning is documented and can be challenged with new evidence.
- Considering hiring and team knowledge upfront avoids the trap of choosing a technically superior framework that the team cannot use effectively or cannot hire for.

**Trade-offs:**
- No framework satisfies every requirement. Documenting the trade-offs explicitly (rather than pretending the chosen framework has no weaknesses) sets realistic expectations and surfaces future risks early.
- The evaluation is only as good as the data behind it. RUM data, accurate team skill assessment, and realistic budget projections are prerequisites for a sound decision. Skipping them produces a choice based on recency bias or personal preference dressed up as evaluation.
