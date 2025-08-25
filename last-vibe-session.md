## 🧠 Context Capsule: Parabola Visualizer Session (25 Aug 2025)

### ✅ Goals Achieved

- Integrated `NavBarTop` inputs (`a`, `b`, `c`) with `MainView` via `App.jsx` state and `onInit` trigger
- Generated SVG graph of parabola `ax² + bx + c`, centered on vertex
- Displayed coordinate axes with fallback edge alignment
- Labeled vertex and edge coordinates (3 per axis)
- Used fixed scale (~10×10 units) for visual consistency
- Ensured layout composability and semantic clarity across components

### 🧩 Current Architecture

- `NavBar.jsx` and `NavBarTop.jsx` are stable and semantically clean
- `MainView.jsx` renders SVG graph on `trigger` change
- `App.jsx` lifts state and propagates parameters + refresh key
- `.fillContainer` applied to stretch chart container
- `preserveAspectRatio="none"` used to allow distortion

### ⚠️ Outstanding Issue

- SVG chart slightly overflows vertically, causing scrollbars
- Suspected cause: incomplete height contract or aspect ratio preservation
- DOM inspection shows correct attribute usage, but layout chain may leak height
- `.container` uses `height: 100vh; width: 100vw` (confirmed)
- Scroll persists despite `preserveAspectRatio="none"` and full-height styling

### 🧭 Next Steps

- Traverse DOM manually to identify layout leak
- Confirm height contracts across `#root`, `.container`, `.main`, and SVG parent
- Consider adding `overflow: hidden` to SVG or its container
- Optionally visualize layout bounds with debug outlines
- Revisit layout rhythm and scaling logic once DOM is fully internalized

---

Let me know when you're ready to resume—I'll be here, ready to pick up the thread exactly where we left it.
