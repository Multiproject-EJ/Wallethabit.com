# ⚙️ Workflow Overview (Codex-only)

- **Codex edits** the repo; **no local installs**.
- **Actions** run install/lint/test/build; **Pages** deploys.
- Branches: `main`, `feat/<name>`, `fix/<name>`, `docs/<name>`.
- Commits: `feat: ...`, `fix: ...`, `docs: ...`, `refactor: ...`.

## Secrets (add in GitHub → Settings → Secrets → Actions)
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY` (when needed)

## Commands run by CI
- `npm ci`
- `npm run lint` (later)
- `npm run test` (later)
- `npm run build`

