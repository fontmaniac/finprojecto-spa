# 🛠️ FinprojectoSPA

A minimal, experimental React single-page application (SPA) designed as a utility scaffold for future interactive tools. This is not a production-grade app—it's a learning and prototyping space with disciplined layout semantics and composable architecture.

## 📐 Project Structure

```plaintext
src/
├── models/
│   ├── Definitions.js                      # Common definitions
│   ├── LoanSimulationModel.js              # Lifetime simulation structures
│   ├── LoanTermsModel.js                   # Loan terms data model
│   └── ParabolaModel.js                    # Domain model for y = ax² + bx + c
├── utils/
│   └── useStagedModel.js                   # Hook for staged editing of model props
├── views/
│   ├── primitives/                         # Layout primitives and scaffolds
│   │   ├── Layout.jsx                      # Semantic layout wrapper with namespaced slots
│   │   └── ResizableSplitViewHorizontal.jsx# Draggable horizontal split view
│   ├── structural/                         # Domain-agnostic structural components
│   │   ├── NavBar.jsx                      # Container for navigation panes
│   │   └── MainView.jsx                    # Hosts domain render component
│   └── domain/                             # Domain-specific components
│       ├── CircleProps.jsx                 # Circle input group (x, y, radius, key)
│       ├── LoanSimulationOutcomeProps.jsx  # Display of computed loan outcome
│       ├── LoanSimulationPlotlyRender.jsx  # Plotly visualisation of loan slices
│       ├── LoanSliceProps.jsx              # Staged editing of individual loan slices
│       ├── LoanTermsProps.jsx              # Input UI for loan terms sheet
│       ├── ParabolaInputs.jsx              # Parabola input group (a, b, c)
│       └── ParabolaRender.jsx              # SVG renderer for parabola
├── assets/                                 # Static assets (currently empty)

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
├── package.json                            # Project manifest
├── package-lock.json                       # Dependency lockfile
├── README.md                               # Project overview and dev philosophy
├── scrape-fm.ps1                          
```

## 🧠 Architectural Notes

- **Layout is centralized** in `App.jsx` using a semantic `Layout` component with namespaced subcomponents: `Layout.Sidebar` and `Layout.Main`.
- **Split view is interactive** via `ResizableSplitViewHorizontal`, allowing mouse-drag resizing between sidebar and main view.
- **CSS Modules** are used for scoped styling and visual debugging.
- **Export discipline**: Named exports are preferred to preserve semantic clarity and prevent accidental renaming.
- **No backend**: All logic resides in the front-end. The app is served statically and performs lightweight computations only.

## 🧹 Dev Scripts (PowerShell)

To clean Vite cache and reinstall dependencies:

```powershell
powershell -NoProfile -Command "Remove-Item node_modules,.vite,dist -Recurse -Force -ErrorAction SilentlyContinue; npm install"

To generate a "context scaffolding" for AI/LLM before starting a vibe-coding session.

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File ./scrape-fm.ps1

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

