# arc42 Architecture Documentation — Primary School Semi-Boarding Meal Management System

> Standardized software architecture documentation based on the [arc42](https://arc42.org) template (by Dr. Gernot Starke and Dr. Peter Hruschka) for the **Primary School Semi-Boarding Meal Management System**.

---

## 1. Documentation Index & Section Status

This architecture documentation is tailored to the **ESSENTIAL** detail level, balancing production-grade engineering rigor with operational maintainability:

| Section | Title | Primary Focus | Status |
|:---:|:---|:---|:---:|
| **01** | [Introduction and Goals](01-introduction-and-goals.md) | System purpose, 3 core MVP modules, Q42 quality goals, and stakeholder expectations | ✅ Complete |
| **02** | [Architecture Constraints](02-architecture-constraints.md) | Technical, operational, regulatory (VN Food Safety Law), and timing constraints | ✅ Complete |
| **03** | [Context and Scope](03-context-and-scope.md) | Business and technical context, external integrations (SIS, Inventory, Push Gateway) | ✅ Complete |
| **04** | [Solution Strategy](04-solution-strategy.md) | Fundamental architectural paradigms, decisions, and technology choices | ✅ Complete |
| **05** | [Building Block View](05-building-block-view.md) | Static structure: Level-1 Container view, Level-2 Component views (M1, M2, M3), Level-3 Code | ✅ Complete |
| **06** | [Runtime View](06-runtime-view.md) | Dynamic scenarios: Morning cutoff roll-call, dynamic recipe scaling, emergency amendments | ✅ Complete |
| **07** | [Deployment View](07-deployment-view.md) | Infrastructure, Docker containers, database topology, and client target profiles | ✅ Complete |
| **08** | [Crosscutting Concepts](08-crosscutting-concepts.md) | Security/RBAC, audit logging, allergen tracking, transaction consistency, UX ergonomics | ✅ Complete |
| **09** | [Architecture Decisions](09-architecture-decisions.md) | Architecture Decision Records (ADRs) for cutoff guards, buffer margins, WebSocket sync | ✅ Complete |
| **10** | [Quality Requirements](10-quality-requirements.md) | Detailed quality tree and evaluation scenarios mapped to Section 1.2 quality goals | ✅ Complete |
| **11** | [Risks and Technical Debt](11-risks-and-technical-debt.md) | Operational and architectural risk register, debt remediation roadmap | ✅ Complete |
| **12** | [Glossary](12-glossary.md) | Domain and architectural terminology (cutoffs, buffers, yields, rations) | ✅ Complete |

---

## 2. Architecture Methodology & Upstream Links

This documentation forms the formal architecture synthesis of the repository's top-down engineering artifacts:

```
Business Requirements (docs/01-top-down, docs/02-core-features)
       ↓
Roles & System Use Cases (docs/03-roles-usecases)
       ↓
Software Architecture Models (c4/c4-context.md, c4-containers.md, c4-components-*.md)
       ↓
arc42 Architecture Documentation Suite (arc42/*.md)
       ↓
Relational DDL & Working Prototype (docs/06-database, frontend/)
```

### Key Repository References:
- **C4 Architecture Models:** [c4/README.md](../c4/README.md)
- **Top-Down Requirements Documentation:** [docs/README.md](../docs/README.md)
- **Traceability Matrix:** [docs/traceability.md](../docs/traceability.md)
- **Relational Data Dictionary:** [docs/06-database/data-dictionary.md](../docs/06-database/data-dictionary.md)

---

## 3. Conventions & Standards

- **Detail Level:** `ESSENTIAL` (focused on production system viability, clear boundaries, and measurable quality scenarios).
- **Quality Model:** arc42 **Q42 Quality Properties** (`#reliable`, `#efficient`, `#safe`, `#usable`, `#secure`, `#operable`, `#flexible`, `#suitable`).
- **Diagrams:** Combined visual strategy using high-fidelity rendered PNG assets ([c4/images/](../c4/images/)) and native Mermaid code blocks for immediate in-browser rendering.
