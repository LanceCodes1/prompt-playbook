# Prompt Log: Prompt Playbook

A record of every prompt I gave Claude Code while building this app, what it did, and how we checked it worked.
Date: Thursday, October 15, 2026 (times are Pacific, taken from file timestamps and git history).

---

## Step 0: Research request (no code) · ~7:38 PM

**My prompt (word for word)**
> /anthropic-skills:deep-research

(I ran the command without a question.)

**What Claude did**
- Saw that no research question was included and didn't start any research.
- Suggested 4 topics that could help the app (seed prompts, AI for reentry, teaching AI to beginners, fair-chance hiring in LA).

**What I verified**
- Nothing to verify. No files were created.

**Issues caught**
- The command needs a question after it. Without one there's nothing to research.

**Commit message**
- None (no changes).

---

## Step 0.5: Make the plan (no code) · ~7:39 PM

**My prompt (word for word)**
> /plan Read CLAUDE.md. Build Prompt Playbook step by step. Give me the plan first, one small step per commit. Don’t write code yet. If create-next-app complains the folder isn’t empty, work around it and keep CLAUDE.md.

**What Claude did**
- Looked at the folder (only `CLAUDE.md` and `AGENTS.md`, not a git repo yet) and read both rule files.
- Wrote a 7-step plan, one commit per step: setup → database/model → create → read → "worked for me" → delete → styling.
- Decided to use Server Actions (a form calls a server function directly) instead of separate API routes, to keep the code small.

**What I verified**
- Read the plan and approved it.

**Issues caught**
- `CLAUDE.md` had been shortened right before planning, and the app details were no longer in it (the Prompt fields and the 6 categories). Claude kept the details from the earlier version and said so in the plan.
- Added a `workedCount` field to the plan from the start, so we wouldn't need a second database change for the stretch goal.

**Commit message**
- None (planning only).

---

## Step 1: Set up the Next.js project · 7:40 PM → committed 8:01 PM

**My prompt (word for word)**
> (Approved the plan in plan mode. No typed message.)

**What Claude did**
- Built the Next.js starter project (version 16.4.2, JavaScript, App Router, Tailwind, ESLint) in a temporary folder.
- Copied it into `prompt-playbook/` without touching `CLAUDE.md` or `AGENTS.md`, then installed the packages and ran `git init` (no commit).
- Renamed the project from `scaffold` to `prompt-playbook` in `package.json`.

**What I verified**
- Claude started the app for a moment and checked that the home page loaded (HTTP 200).
- Claude checked that `.gitignore` already blocks `.env*`, which covers `.env`.
- I made the commit myself. The output showed 18 files, with no `.env` and no `node_modules`.

**Issues caught**
- **create-next-app won't run in a folder that already has files.** Claude avoided this up front by building in a temporary folder and copying the files over. It never ran the tool in the real folder, so it never actually saw the error.
- **`next dev` adds text to `AGENTS.md`.** This version of Next.js appends a "This is NOT the Next.js you know" note to `AGENTS.md` every time the app runs. Claude read the Next.js code to confirm it only adds the note below my rules and never replaces them. Decision: commit the note along with everything else.
- **My first commit attempt didn't run.** I typed the git command as a chat message. Claude didn't run it, because my rules say never commit for me. It showed me to put `!` in front so the command runs myself.

**Commit message**
- `Set up Next.js project` (92b1587)

---

## Step 2: Database and Prompt model · ~8:05 PM → committed 9:19 PM

**My prompt (word for word)**
> Ready

(That meant my Neon database was created. I pasted the connection string into `.env` myself, so it never went into the chat.)

**What Claude did**
- Created `.env` with a placeholder line for me to fill in, installed Prisma, and wrote three files:
  - `prisma/schema.prisma`: the Prompt table.
  - `prisma.config.mjs`: tells Prisma where the database is.
  - `lib/prisma.js`: the one shared database connection.
- Ran the migration, which created the `Prompt` table in Neon (`prisma/migrations/20261016032922_init`).
- Added `lib/generated/` to `.gitignore` and added a `postinstall` script, so Prisma's generated code rebuilds itself after `npm install`.

**What I verified**
- Claude checked that `.env` was filled in and looked like a Postgres link, without ever printing it.
- Claude added a temporary test page to my running app. It asked the database how many prompts exist and got back `{"ok":true,"count":0}`, which is correct for a new table. Claude deleted the test page afterward.
- Claude checked that no `tsconfig.json` appeared, so Next.js didn't try to switch the project to TypeScript.
- I made the commit myself. 8 files, with no `.env` and no generated code.
- I may also have checked the table in Prisma Studio (`npx prisma studio`): _(fill in if you did)_.

**Issues caught**
- **Prisma 8.0 release candidate.** A plain `npm install prisma` installed `8.0.0-rc.23`, an unfinished test version, because Prisma's "latest" tag pointed to it. Claude saw this, checked the version tags, and switched to the stable **7.10.1** so the demo wouldn't break.
- **Prisma 7 needs a connection adapter.** Claude installed `@prisma/adapter-pg`, a small package from the Prisma team that connects Prisma to Postgres.
- **Prisma's setup command would have added extra files.** Claude ran `prisma init` in a throwaway folder first. It created AI-agent files and expected a `dotenv` package. Claude copied only the settings it needed, and used Node's built-in `process.loadEnvFile()` instead of `dotenv` (no extra library).
- **Migrating didn't build the helper code.** In Prisma 7, running the migration no longer builds the database helper automatically. Claude ran `npx prisma generate` separately.
- **The first connection test failed.** Claude's test server couldn't start because my own `npm run dev` was already running on port 3000. Claude left my server alone and ran the test against it instead.
- **My commit didn't run.** I put a space before the `!`, so the command went to the chat instead of running. Claude checked `git log`, saw nothing had been committed, and I retyped it.

**Commit message**
- `Add Prisma and Prompt model` (11c9b9a)

---

## Step 3: Create, the add-prompt form · started ~9:20 PM (in progress)

**My prompt (word for word)**
> (Went ahead after the Step 2 commit. No typed message.)

**What Claude did**
- Started reading the Next.js docs that come with this version (the forms and Server Actions guides), as `AGENTS.md` says to.
- I stopped it before any code was written. Then I asked for this log.

**What I verified**
- Not yet.

**Issues caught**
- None yet.

**Commit message**
- Not committed yet.
