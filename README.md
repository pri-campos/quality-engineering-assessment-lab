# Quality Engineering Assessment Lab

A structured monorepo designed to evaluate test tools, agent-based testing approaches, and quality engineering strategies in controlled environments.

This lab uses purpose-built applications with varying levels of complexity to generate **evidence-based insights** and support **architectural decision-making (ADRs)** through systematic analysis of capabilities, limitations, and trade-offs.

---

## 🧠 Purpose

Quality engineering is fundamentally about understanding system behavior, constraints, and impact. Tools are secondary — they exist to support that understanding, not to define it.

This repository exists to:

- Evaluate testing tools (Playwright, Cypress, Postman, etc.)
- Assess agent-based testing approaches (AI-driven tools)
- Compare strategies across different contexts (API, UI, E2E, distributed systems)
- Generate structured findings and architectural decisions
- Build reproducible experiments for continuous learning

---

## 🧱 Monorepo Structure

This repository follows a **monorepo architecture**, separating:

- systems under test
- evaluation experiments
- shared artifacts
- documentation and findings

```txt
.
├─ apps/            # Systems under test (SUT)
├─ assessments/     # Tool-based evaluations with consistent scenarios and datasets
├─ shared/          # Shared artifacts (test data, scenarios, contracts)
├─ docs/            # Documentation, ADRs, and findings
├─ package.json     # Root configuration
├─ pnpm-workspace.yaml
```

---

## 📦 Folder Overview

`apps/`

Contains applications used as test targets.

Examples:

 - backend APIs
 - frontend applications
 - distributed system simulations

Each app is designed to expose realistic failure modes and business rules.

`assessments/`

Contains evaluations of testing tools and approaches.

Assessments are organized by **tool**, while preserving consistency through shared scenarios and datasets.

Each tool is evaluated across comparable contexts (API, UI, end-to-end) using the same underlying system behavior, enabling:

- consistent comparison across tools
- reproducible experiments
- evidence-based analysis of capabilities and trade-offs

Tools may include both traditional frameworks (e.g., Playwright, Cypress, Postman) and agent-based solutions, treated as part of the same evaluation space.

`shared/`

Reusable assets across experiments:

 - test data
 - scenario definitions
 - contracts (API / domain)
 - utilities

This layer ensures consistency and comparability across evaluations

`docs/`

Centralized knowledge base:

 - architecture decisions (ADRs)
 - evaluation methodology
 - scenario catalog
 - findings and insights

---

## ⚙️ Tech Stack

 - Node.js + TypeScript
 - Fastify (HTTP layer)
 - Prisma (data layer)
 - pnpm (workspace management)

---

## 🚀 Getting Started

Install dependencies:
```shell
pnpm install
```

Run backend example:
```shell
pnpm --filter @apps/atelier-booking-backend dev
```

---

## 🔬 Evaluation Philosophy

This lab is built on a few principles:

Context over tools
Evidence over opinion
Trade-offs over absolutes
Reproducibility over one-off experiments

---

## 📌 Status

Active and evolving.
New systems, tools, and evaluation models are continuously added.
