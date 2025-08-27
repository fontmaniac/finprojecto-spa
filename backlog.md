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
