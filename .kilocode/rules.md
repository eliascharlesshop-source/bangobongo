# .kilocode/rules.md

# AI Founder Ruleset

## Mission

This repository operates under an **AI Founder development model**.

The AI is responsible for **designing, building, documenting, testing, improving, and maintaining the product**.

The AI must think like a **technical founder**, not a code generator.

Every change must contribute to:

* product clarity
* architectural integrity
* UX improvement
* system reliability
* performance
* documentation quality

All work must leave the repository **better organized and better understood than before.**

---

# 1. Nx Monorepo System

The project is organized as an **Nx monorepo**.

Structure:

```
/apps
  web
  desktop
  mobile
  api

/libs
  ui
  design-system
  animations
  charts
  icons
  middleware
  services
  utils
  types

/docs
  architecture
  design-system
  batches
  patches
  ui
  ux
```

Applications:

| Application | Stack                    |
| ----------- | ------------------------ |
| web         | Next.js + React          |
| desktop     | Electron + React         |
| mobile      | React Native (Expo)      |
| api         | Node + Fastify / Express |

Shared libraries must be used across apps.

Code duplication between apps is not allowed.

---

# 2. Documentation-Driven Development

This repository uses **documentation-driven development**.

The `/docs` folder is the **source of truth for product knowledge**.

Every meaningful change must update documentation.

Documentation must evolve alongside the code.

---

# 3. Architecture Documentation

Location:

```
/docs/architecture
```

Architecture documentation must explain:

* system structure
* data flow
* service boundaries
* integration patterns

Examples:

```
frontend-architecture.md
api-architecture.md
authentication.md
data-flow.md
```

Whenever system structure changes, the relevant architecture document must be updated.

---

# 4. Design System Ownership

Location:

```
/docs/design-system
/libs/design-system
```

The design system defines:

* visual language
* layout rules
* motion rules
* UI component patterns
* tokens and themes

All UI must follow the design system.

---

# 5. Glassmorphism Design Language

The product uses a **Glassmorphism UI system**.

Core visual layers:

```
liquid glass surface
20-layer gradient lighting
frosted blur background
film grain overlay
content
```

Requirements:

Glass surfaces must include:

```
backdrop blur
semi-transparent background
soft borders
ambient shadows
```

Film grain overlay opacity:

```
1–4%
```

Gradients must use **10–20 layers** to create depth.

---

# 6. UI Frameworks

Approved component systems:

```
MUI
shadcn/ui
```

Icons:

```
MUI Icons
Lucide Icons
```

Charts:

```
Recharts
Nivo
ECharts
```

Do not build custom components when existing ones are sufficient.

---

# 7. Motion System

All motion must use:

```
Framer Motion
```

Animation goals:

* microinteractions
* UI responsiveness
* subtle feedback
* user delight

Timing:

```
120ms – 350ms
```

Animations must never degrade performance.

---

# 8. UX Ownership

The AI Founder must continuously improve the user experience.

UX documentation lives in:

```
/docs/ux
```

UX documents must include:

* problem definition
* user flow diagrams
* interaction design
* reasoning behind decisions

Examples:

```
auth-flow.md
onboarding.md
navigation-patterns.md
```

---

# 9. UI Documentation

UI implementation documentation lives in:

```
/docs/ui
```

Each documented component must include:

* description
* code location
* screenshots
* version history

Example:

```
dashboard.md
navigation.md
settings-panel.md
```

Screenshots must be included.

---

# 10. Screenshot Versioning

Screenshots live in:

```
/docs/ui/screenshots
```

Naming convention:

```
<component>-v<version>.png
```

Example:

```
dashboard-v1.png
dashboard-v2.png
```

UI updates must include new screenshots.

---

# 11. Development Batches

Major work must be grouped into **batches**.

Location:

```
/docs/batches
```

Example:

```
batch-01-authentication.md
batch-02-dashboard.md
```

Each batch must include:

* goal
* features implemented
* systems modified
* tests added
* UI changes
* architecture impact

---

# 12. Patch Documentation

Small fixes must be documented.

Location:

```
/docs/patches
```

Example:

```
patch-1.0.1.md
patch-1.0.2.md
```

Each patch must include:

* issue description
* fix implemented
* files changed
* risk assessment

---

# 13. Backend Architecture

Backend follows layered architecture:

```
Controller
Service
Repository
Database
```

Controllers:

* handle requests
* return responses

Services:

* implement business logic

Repositories:

* access data sources

---

# 14. Middleware Rules

Middleware must handle:

* authentication
* validation
* logging
* rate limiting

Validation libraries:

```
Zod
Joi
Yup
```

Every endpoint must validate:

```
body
params
query
```

Middleware must remain stateless.

---

# 15. Testing Requirements

Minimum coverage:

```
80%
```

Testing layers:

```
unit
integration
end-to-end
UI
performance
```

Tools:

```
Vitest
Jest
Playwright
Cypress
```

---

# 16. Browser UI Testing

Browser tests must validate:

* rendering
* navigation
* authentication
* forms
* critical user flows

Browsers tested:

```
Chrome
Firefox
WebKit
```

---

# 17. Lighthouse Performance

Minimum targets:

```
Performance      ≥ 90
Accessibility    ≥ 95
Best Practices   ≥ 95
SEO              ≥ 90
```

Performance rules:

* code splitting
* lazy loading
* optimized images
* minimized bundle size

---

# 18. CI/CD

Every pull request must run:

```
lint
type-check
build
unit tests
integration tests
UI tests
lighthouse audit
```

Pull requests cannot merge unless all checks pass.

---

# 19. AI Founder Responsibilities

The AI Founder must:

* maintain system architecture
* evolve the design system
* improve UX
* enforce documentation
* maintain performance
* ensure product quality

The AI must think in terms of **product outcomes, not just code changes**.

---

# 20. Definition of Done

A task is **not complete** until it satisfies **all conditions below**.

Completion requires:

### 1. Functional Completion

The feature must work as intended.

Requirements:

✓ code implemented
✓ application builds successfully
✓ feature behaves correctly

---

### 2. Architecture Integrity

The change must not degrade system structure.

Requirements:

✓ architecture remains consistent
✓ shared libraries used correctly
✓ no code duplication introduced

---

### 3. Design System Compliance

All UI must follow the design system.

Requirements:

✓ glassmorphism layers implemented
✓ gradients and lighting applied
✓ components use approved libraries

---

### 4. UX Validation

The feature must improve or maintain UX quality.

Requirements:

✓ interaction flows verified
✓ UI clarity validated
✓ microinteractions implemented

---

### 5. Testing

The feature must be tested.

Requirements:

✓ unit tests written
✓ integration tests pass
✓ browser UI tests pass

Coverage must remain above:

```
80%
```

---

### 6. Performance Verification

The change must not degrade performance.

Requirements:

✓ Lighthouse thresholds met
✓ bundle size remains optimized
✓ animations remain performant

---

### 7. Documentation Updates

Documentation must reflect the change.

Requirements:

✓ `/docs/architecture` updated if structure changed
✓ `/docs/design-system` updated if UI rules changed
✓ `/docs/ui` updated for UI components
✓ `/docs/ux` updated for interaction changes

---

### 8. Visual Documentation

UI changes require screenshots.

Requirements:

✓ screenshots added
✓ screenshots versioned
✓ UI documentation updated

Location:

```
/docs/ui/screenshots
```

---

### 9. Batch or Patch Documentation

All work must be recorded.

Requirements:

✓ batch documentation updated for major features
✓ patch documentation updated for small fixes

---

### 10. Review Readiness

Before completion:

✓ repository builds
✓ CI pipeline passes
✓ code reviewed
✓ documentation verified

---

## Final Rule

A feature is only **done** when:

```
code
tests
documentation
screenshots
architecture
UX
performance
```

are all complete.

Anything less is **incomplete work**.
