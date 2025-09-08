That’s a satisfying milestone—scaffolding in place, rhythm established, and the architecture breathing on its own. Nicely done.

As for theming: yes, you can absolutely enable external themes without having committed to a component library upfront. The key is to treat theming as a layer—not a constraint. Here are a few paths, depending on how much control or abstraction you want:

---

### 🎨 1. **CSS Variables + Context**

If your components are semantically grouped and layout is centralized (as I know you prefer), you can inject themes via CSS custom properties:

```css
:root {
  --bg-color: white;
  --text-color: black;
}

[data-theme="dark"] {
  --bg-color: #121212;
  --text-color: #e0e0e0;
}
```

Then in React:

```tsx
function ThemeProvider({ theme, children }) {
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return children;
}
```

This keeps styling declarative and composable, and you can switch themes by toggling `data-theme`.

---

### 🧱 2. **Tailwind with Theme Tokens**

If you’re using Tailwind (or willing to), you can configure multiple themes via plugins like `tailwindcss-theming` or `daisyUI`. It’s fast, expressive, and works well with semantic layout control.

---

### 🧰 3. **Styled Components or Emotion**

If you want scoped theming per component tree:

```tsx
const ThemeContext = React.createContext(lightTheme);

const Wrapper = styled.div`
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
`;
```

Then wrap your app in a `ThemeProvider` and switch themes dynamically. This gives you fine-grained control, but introduces runtime styling overhead.

---

### 🧩 4. **Component Libraries (if retrofitting)**

If you ever decide to adopt something like MUI, Chakra, or Radix, they come with built-in theming systems. But you don’t need them unless you want prebuilt components. Your current setup is lean and composable—no need to bloat it unless the UI demands it.

---

### 🧠 Final Thought

Given your architectural clarity and semantic grouping, I’d lean toward CSS variables + a lightweight context. It’s themable, inspectable, and doesn’t entangle your domain logic with styling concerns.

Want a quick capsule to drop into your app for theme toggling? I can sketch one out.

---

Perfect—now that your `ThemeProvider` is wired up and stable, you can make your components theme-aware using **CSS variables scoped to the `data-theme` attribute**. This approach is clean, declarative, and composable—exactly your style.

---

### 🎨 Step 1: Define theme tokens in global CSS

In your main stylesheet (e.g. `App.css`, `index.css`, or `theme.css`), define variables for each theme:

```css
:root[data-theme='light'] {
  --bg-color: #ffffff;
  --text-color: #222222;
  --accent-color: #0077cc;
  --card-bg: #f5f5f5;
}

:root[data-theme='dark'] {
  --bg-color: #1e1e1e;
  --text-color: #eeeeee;
  --accent-color: #66ccff;
  --card-bg: #2a2a2a;
}

:root[data-theme='motley'] {
  --bg-color: #fdf6e3;
  --text-color: #333333;
  --accent-color: #d33682;
  --card-bg: linear-gradient(to right, #f9c74f, #90be6d, #f94144);
}
```

You can define as many tokens as you like—just keep them semantically named (`--card-bg`, `--nav-hover`, `--border-color`, etc.) so they remain intention-revealing.

---

### 🧩 Step 2: Use variables in your component styles

In your CSS modules or global styles:

```css
.container {
  background-color: var(--bg-color);
  color: var(--text-color);
}

.button {
  background-color: var(--accent-color);
  border: none;
  padding: 0.5rem 1rem;
  color: var(--bg-color);
}
```

This makes your components automatically respond to theme changes—no need to pass props or re-render manually.

---

### 🧠 Step 3: Theme-aware components (optional)

If you want to conditionally style components in JS (e.g. inline styles or dynamic classes), you can use the `theme` from `useTheme()`:

```js
import { useTheme } from './ThemeProvider';

function ThemedCard({ children }) {
  const { theme } = useTheme();

  const style = {
    background: theme === 'motley' ? 'var(--card-bg)' : 'var(--bg-color)',
    color: 'var(--text-color)',
    padding: '1rem',
    borderRadius: '8px'
  };

  return <div style={style}>{children}</div>;
}
```

But ideally, you keep most styling in CSS to preserve separation of concerns.

---

### 🧪 Diagnostic tip

To verify theme switching, add this to your layout temporarily:

```css
body::after {
  content: attr(data-theme);
  position: fixed;
  bottom: 0;
  right: 0;
  background: var(--accent-color);
  color: var(--bg-color);
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}
```

It’ll show the active theme in the corner—great for debugging.

---

Let me know if you want to scaffold a `ThemeTokens.md` to document your semantic variables, or build a `useVisualPhase()` hook that syncs theme transitions with UI feedback.

---

Ah, the classic specificity tango. You're bumping into a CSS specificity clash where the dark theme’s `.rdg-row` declaration is overriding your custom row styles. Here's how to make your `modified-row` and `selected-row` classes consistently win across all themes—including the dark one.

---

### 🛠️ Solution: Increase Specificity or Use `!important`

You have two main paths:

#### **Option 1: Increase Selector Specificity**

Make your custom styles more specific than `.rdg-row`. For example:

```css
:root[data-theme='dark'] .rdg-row.modified-row {
  background-color: #yourModifiedColor;
  color: #yourModifiedTextColor;
}

:root[data-theme='dark'] .rdg-row.selected-row {
  background-color: #yourSelectedColor;
  color: #yourSelectedTextColor;
}
```

This way, your styles target `.rdg-row` *with* your custom class, which has higher specificity than the base `.rdg-row`.

#### **Option 2: Use `!important` (sparingly)**

If you want a quick override without restructuring selectors:

```css
.modified-row {
  background-color: #yourModifiedColor !important;
  color: #yourModifiedTextColor !important;
}

.selected-row {
  background-color: #yourSelectedColor !important;
  color: #yourSelectedTextColor !important;
}
```

This brute-forces precedence, but use it judiciously—it can make future overrides harder to manage.

---

### 🧠 Bonus: Theme-Aware Class Composition

If you're already using CSS modules or a theme switcher, you could dynamically compose classes based on theme context:

```js
const getRowStyle = (row) => {
  const base = row.isModified ? 'modified-row' :
               row.sliceIndex === selectedSliceIdx ? 'selected-row' : '';
  return `${styles[base]} ${styles['rdg-row']}`;
};
```

But this only helps if your CSS module includes `.rdg-row` as a local class, which it likely doesn’t—so specificity remains your best bet.

---

### ✨ Vibe-preserving Tip

Since your themes are modular and vibe-coded, you might consider scoping theme overrides to only apply when no custom class is present:

```css
:root[data-theme='dark'] .rdg-row:not(.modified-row):not(.selected-row) {
  background-color: var(--bg-color-0);
  color: var(--text-color);
}
```

This preserves the dark theme’s defaults *only* for unstyled rows, letting your semantic feedback shine through untouched.

---

Let me know if you want to refactor this into a `useRowClass()` hook or encapsulate it for future compositional clarity.
