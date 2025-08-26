## 🧠 Context Capsule: Domain Detachment & State Wiring Session (26 Aug 2025)

### ✅ Goals Achieved

- **Extracted domain logic** from `NavBarTop` into `ParabolaInputs.jsx`, placed under `views/domain`
- **Refactored `NavBarTop`** into a structural shell accepting `children`, enabling domain injection
- **Rewired state**: introduced `committedParams` in `App.jsx` to gate rendering of `MainView`
- **Established shared state** between `ParabolaInputs` and `MainView`, with optional reactive behavior
- **Resolved React warning** by adding `key` props to `<text>` elements in SVG label array

### 🧩 Architectural Shifts

- `NavBar.jsx` now composes `NavBarTop` and `NavBarBottom`, with `NavBarTop` parametrized via `children`
- `ParabolaInputs.jsx` handles domain-specific input logic, using `params` object and `setParams` updater
- `App.jsx` lifts state and separates transient input (`params`) from committed render state (`committedParams`)
- `MainView.jsx` receives `a`, `b`, `c`, and `trigger` from `committedParams`, preserving Init-gated behavior

### 🧭 Behavioral Notes

- `params` updates immediately on input change; `committedParams` updates only on Init
- `trigger` remains relevant for manual re-rendering, but could be removed if reactive behavior is desired
- `ParabolaInputs` uses a DRY `handleChange` pattern keyed by param name
- SVG rendering in `MainView` is stable and intention-revealing, with labeled vertex and axis ticks

### 📁 Updated File Roles

| File                     | Role                                                                 |
|--------------------------|----------------------------------------------------------------------|
| `ParabolaInputs.jsx`     | Domain input group for parabola parameters; updates shared state     |
| `NavBarTop.jsx`          | Structural wrapper for top navbar content; accepts domain children   |
| `NavBar.jsx`             | Composes top and bottom navbar sections; injects domain logic        |
| `App.jsx`                | Root component; lifts state, gates rendering, and wires layout       |
| `MainView.jsx`           | Renders SVG parabola based on committed parameters and refresh key   |

---

Let me know if you'd like to snapshot this capsule into `for-ai.md`, or if we’re ready to move forward—perhaps toward modularizing `MainView`, introducing domain toggles, or scaffolding a new visualizer.
