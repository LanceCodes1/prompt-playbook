# Rules for this project
- I'm a beginner building a demo for class. Explain in plain language.
- One small step at a time: model → create → read → update/delete.
- After each change: 3–5 bullets max (what changed, front-end or back-end, where the DB call is).
- Add simple one-line comments on key logic so I can explain it.
- Never commit for me. Stop after each working piece so I can test and commit.
- DATABASE_URL lives in .env only. Confirm .env is in .gitignore before any commit.
- Stack: Next.js (App Router), Prisma, Neon Postgres. No auth, no extra libraries.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
