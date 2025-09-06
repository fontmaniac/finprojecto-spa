# Tasks to be done. Put emerging urgent and aspirational stuff here.

## [2025-08-27] Proposal: Generalize staged input pipeline via `useStagedModel`

**Context:**  
Current domain editors (e.g. `CircleProps`) implement a staged input model: props are received, edits are locally staged, and updates are committed explicitly. This pattern is semantically clean but currently duplicated across components.

**Proposal:**  
Sketch a reusable hook `useStagedModel(initialModel)` that encapsulates:

- Initial sync from props to local state
- Local mutation via controlled inputs
- Optional dirty tracking or reset logic
- Explicit commit interface (e.g. `getStagedModel()` or `commit()`)

**Benefits:**  

- Reduces boilerplate in domain editors  
- Preserves semantic clarity of staged editing  
- Enables future extensions (e.g. undo, validation, autosave)  
- Aligns with broader goal of composable, intention-revealing architecture

**Next Steps:**  

- Draft initial API surface for `useStagedModel`  
- Refactor `CircleProps` to use the hook  
- Evaluate generalization across other domain editors (e.g. parabola inputs)

**🔮 Future Extensions:**

- `validate()` → returns errors or validity
- `undo() / redo()` → staged history
- `autosave()` → debounce + commit
- `useStagedModel.withSchema(schema)` → typed validation

> This entry formalizes the staged editing pattern as a reusable abstraction, paving the way for cleaner input pipelines and future extensibility.

## [2025-09-01]

- Tie "tick density" along x-axis to repayment frequency.

### 🪞 Backlog Item: Shared Visual Grammar Capsule  

**Type:** Architectural Enhancement  
**Status:** Deferred  
**Priority:** Medium  
**Context:**  
Current styling across `LoanTermsProps` and `LoanSimulationOutcomeProps` is manually aligned but lacks a formalized shared grammar. Visual consistency is maintained ad hoc, without a composable abstraction.

**Intent:**  
Introduce a semantic styling capsule (e.g. `PropsGrid.module.css`) to unify layout primitives, label alignment, input treatment, and background theming across domain props components. Enable variant-based extension (e.g. `editable`, `readonly`, `highlighted`) while preserving authorial control.

**Notes:**  

- Consider FM-aligned naming for variants and layout roles.  
- Avoid premature abstraction—only extract once 3+ components converge.  
- May benefit from scoped CSS modules or context-aware styling hooks.  
- Align with future mutation provenance indicators or semantic overlays.

---

“No more rain in this cloud” is poetic perfection—your wife’s phrasing deserves a place in the commit log. Here's a quick architectural sketch to get your gears turning for the next phase:

---

### 🧮 1. Tabular View + CSV Export

**Approach:**

- **Component:** Create a `<DataTableView />` React component that receives the same `slice` data as the chart.
- **Rendering:** Use a `<table>` or a lightweight grid (e.g. `react-table` if you want sorting/filtering later).
- **CSV Export:** Add a “Save as CSV” button that triggers `URL.createObjectURL(new Blob(...))` and anchors a download.

**Key Capsule Ideas:**

- `useCSVExport(data, filename)` → encapsulates export logic.
- `formatTableData(sliceArray)` → mirrors your tooltip formatters for consistency.

---

### 🌗 2. Homebrew Theming (Light/Dark)

**Approach:**

- **State:** Use a `useTheme()` hook with `theme === 'light' | 'dark'`.
- **CSS Variables:** Define `--bg-color`, `--text-color`, etc. in `:root` and toggle via a `data-theme` attribute.
- **Persistence:** Store theme in `localStorage` or `useEffect` hydration logic.

**Key Capsule Ideas:**

- `useThemeToggle()` → handles switching and persistence.
- `ThemeProvider` → wraps app and applies `data-theme`.

---

### 🧭 3. Right-Aligned Nav Bar with Mode Switches

**Approach:**

- **Layout:** Fixed-position vertical bar on the right (`position: fixed; right: 0; top: 50%; transform: translateY(-50%)`).
- **Buttons:** Four icon/text buttons:
  - Chart View
  - Table View
  - Light Theme
  - Dark Theme

**State Coordination:**

- `viewMode: 'chart' | 'table'`
- `theme: 'light' | 'dark'`

**Key Capsule Ideas:**

- `useViewMode()` → toggles between chart/table.
- `NavBarButton({ icon, label, onClick })` → reusable button component.

---

You’re architecturally close to a semantic closure here. Want to sketch out the `useThemeToggle()` capsule next time, or explore how to keep tooltip formatting consistent across chart and table views?

