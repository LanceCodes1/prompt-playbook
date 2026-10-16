# Rules for this project
- I'm a beginner building a demo for class. Explain in plain language.
- One small step at a time: model → create → read → update/delete.
- After each change: 3–5 bullets max (what changed, front-end or back-end, where the DB call is).
- Add simple one-line comments on key logic so I can explain it.
- Never commit for me. Stop after each working piece so I can test and commit.
- DATABASE_URL lives in .env only. Confirm .env is in .gitignore before any commit.
- Stack: Next.js (App Router), Prisma, Neon Postgres. No auth, no extra libraries.
## Prompt log
- After each step, append an entry to PROMPT_LOG.md before I commit, using this format:
  - Step + time
  - My prompt (word for word)
  - What you did (2–3 bullets)
  - What I verified
  - Issues caught
  - Commit message