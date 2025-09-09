# 🛠️ Finprojecto.SPA

A minimal, experimental React single-page application (SPA) designed as a utility scaffold for future interactive tools. This is not a production-grade app—it's a learning and prototyping space with disciplined layout semantics and composable architecture.

## Notice

This project is public and intentionally permissive. You are welcome to use, remix, and build upon it freely.

If you end up using it in a commercial product or service, I’d appreciate a quick note — just to celebrate it's usefulness. Attribution is required, and notification is requested via the method specified in the LICENSE.txt file.

[![License: MIT+Notice](https://img.shields.io/badge/license-MIT%2BNotice-blue.svg)](LICENSE.txt)

## 📐 Project Structure

```plaintext
src/
├── models/                                 # Domain models and simulation logic
│   ├── Definitions.js                      # Common definitions
│   ├── LoanSimulationModel.js              # Lifetime simulation structures
│   ├── LoanTermsModel.js                   # Loan terms data model
│   └── ParabolaModel.js                    # Parabola computation model (y = ax² + bx + c)
│
├── utils/                                  # Declarative bridges and editing hooks
│   ├── useImperativeModel.jsx              # Hosts imperative renderers inside React
│   └── useStagedModel.js                   # Staged editing of model props
│
├── views/
│   ├── primitives/                         # Layout scaffolds and semantic wrappers
│   │   ├── Layout.jsx                      # Central layout authority with namespaced slots
│   │   └── ResizableSplitViewHorizontal.jsx# Draggable horizontal split view
│
│   ├── structural/                         # Domain-agnostic structural components
│   │   ├── BlurbDisplay.jsx                # Wrapper for index.html blurb content
│   │   ├── NavBar.jsx                      # Container for navigation panes
│   │   ├── NavRaft.jsx                     # Floating nav raft with icons and active state
│   │   └── MainView.jsx                    # Hosts domain render component
│
│   ├── domain/                             # Domain-specific UI and renderers
│   │   ├── HelpDisplay.jsx                 # Static help capsule for first-time visitors
│   │   ├── LoanTermsProps.jsx              # Input UI for loan terms sheet
│   │   ├── LoanSliceProps.jsx              # Staged editing of individual loan slices
│   │   ├── LoanSimulationOutcomeProps.jsx  # Display of computed loan outcome
│   │   ├── LoanSimulationPlotlyRender.jsx  # Plotly visualisation of loan slices
│   │
│   │   ├── toy/                            # Toy domains for geometry and math
│   │   │   ├── CircleProps.jsx             # Circle input group (x, y, radius, key)
│   │   │   ├── ParabolaInputs.jsx          # Parabola input group (a, b, c)
│   │   │   └── ParabolaRender.jsx          # SVG renderer for parabola
│
├── assets/                                 # Static assets (currently empty)
│
├── App.jsx                                 # React Application "root"
├── App.css                                 # Global styles
├── index.css                               # Base styles
├── main.jsx                                # Vite entry point

root/
├── backlog.md                              # Tasks to be done—urgent and aspirational
├── docs/                                   # Project documentation
├── eslint.config.js                        # ESLint configuration
├── for-ai.md                               # Context scaffold for LLM assistants
├── index.html                              # HTML entry point
├── LICENSE.txt                             # Modified MIT license with commercial-use notification clause
├── NOTICES.txt                             # Commercial usage log (via pull request)
├── package.json                            # Project manifest
├── package-lock.json                       # Dependency lockfile
├── README.md                               # Project overview and dev philosophy
├── scrape-fm.ps1                           # Utility script (PowerShell)
```

## 🧠 Architectural Notes

- **Layout is centralized** in `App.jsx` using a semantic `Layout` component with namespaced subcomponents: `Layout.Sidebar` and `Layout.Main`.
- **Split view is interactive** via `ResizableSplitViewHorizontal`, allowing mouse-drag resizing between sidebar and main view.
- **CSS Modules** are used for scoped styling and visual debugging.
- **Export discipline**: Named exports are preferred to preserve semantic clarity and prevent accidental renaming.
- **No backend**: All logic resides in the front-end. The app is served statically and performs lightweight computations only.

### 🧠🚧 Development Philosophy (for LLM assistants)

> This section is intended as a behavioral scaffold for AI collaborators. Human adherence is optional; LLM adherence is mandatory.

- **Avoid preemptive suggestions** unless explicitly requested.
- **Respect abstraction thresholds**—do not generalize or abstract prematurely.
- **Preserve semantic clarity** in naming, layout, and component boundaries.
- **Favor incremental refinement** over wholesale rewrites.
- **Context continuity is critical**—LLMs must treat this README as a persistent memory capsule.
- **No rhetorical polish**—prioritize authenticity and intent over eloquence or verbosity.
- **Do not flatten nuance**—preserve ambiguity where appropriate.

This project is exploratory and iterative. It prioritizes:

- **Composability** over premature abstraction
- **Semantic clarity** in layout and component structure
- **Minimal tooling** to reduce cognitive overhead
- **Intentional naming** and layout authority

## 🤖 LLM Collaboration Notes

- This README is the canonical context capsule. Always ingest it fully.
- Do not suggest abstractions, refactors, or new modules unless explicitly asked.
- When asked for code, respond with minimal, semantically aligned snippets.
- Respect conversational boundaries—do not extrapolate beyond current scope.
- Preserve authorial voice in comments and naming.

