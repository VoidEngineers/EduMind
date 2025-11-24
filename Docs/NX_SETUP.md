```markdown
# Nx Monorepo Setup for EduMind

This repository was migrated from Turborepo to Nx. The minimal migration includes replacing `turbo.json` with Nx workspace configuration and updating root scripts to use `nx` commands.

Quick start:

1. Install dependencies:

```bash
pnpm install
```

2. Run Nx migrations (optional, keeps workspace up-to-date):

```bash
npx nx migrate latest
pnpm install
npx nx migrate --run-migrations
```

3. Run common commands:

```bash
# Build all projects that provide a build target
pnpm build

# Start dev targets across projects (projects need a `dev` target)
pnpm dev

# Lint/test/type-check across projects
pnpm lint
pnpm test
pnpm type-check
```

Notes:
- Nx will discover projects in `apps/*`, `packages/*`, and `backend/services/*`.
- For more control, use `nx graph` to inspect the dependency graph and `nx run <project>:<target>` to run a specific target.
- You may want to add `project.json` files for each project to declare specific targets (build/dev/lint/test).

If you want, I can:
- Add `project.json` entries for `apps/web` and a few packages.
- Update `Docs/MONOREPO.md` to reflect the Nx workflow.

```
