# Commit & Pre-Commit Rules

Every commit in this repository must strictly adhere to the following rules:

---

### 1. Commit Message Format

* **Single-line title:** The first line must be a concise, single-line summary (under 72 characters).
  * Format: `<type>(<scope>): <short description>`
  * Examples:
    * `feat(mobile): implement hero repository and zustand store`
    * `fix(web): resolve texture loading issue on mars globe`
    * `refactor(data): modularize wiki entries for lunar missions`
* **Optional detailed body:** If extra context or explanation is needed, leave one blank line after the title and write the body in bullet points.
* **NO co-author lines:** Do NOT include `Co-authored-by:` or any AI co-author signatures in commits.

---

### 2. Pre-Commit Verification (Mandatory)

Before running `git commit`, all changes must pass verification:

1. **Typecheck:** Must pass with **0 errors**:
   ```bash
   cd packages/data && bun x tsc --noEmit
   cd ../../apps/mobile && bun x tsc --noEmit
   ```
2. **Lint & Build:** Code must pass linting and build checks without breaking dependencies.
3. **No Unfinished Code:** Do not commit broken imports, missing types, or partial refactors.

---

### 3. Immediate Commit Cadence

* **Commit Instantly:** As soon as a feature is completed or a bug is resolved and passes pre-commit checks, commit immediately.
* **Atomic Commits:** Keep commits focused on one logical unit of work (feature, fix, or refactor).
