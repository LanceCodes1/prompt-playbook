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
- I opened Prisma Studio (`npx prisma studio`) and saw the empty Prompt table.

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

## Side step: Prompt log + log rule · ~9:25 PM → committed 9:28 PM and ~9:30 PM

**My prompt (word for word)**
> Create PROMPT_LOG.md and backfill tonight’s work. For each step, include: Step + time, My prompt (word for word), What you did (2–3 bullets), What I verified (how I checked it worked), Issues caught (e.g., the Prisma 8.0 release candidate we switched to stable 7.10.1, and create-next-app refusing a non-empty folder), Commit message

**What Claude did**
- Created this file and filled it in for everything up to Step 2, using file timestamps and git history for the times.
- I then added a "Prompt log" rule to `CLAUDE.md` myself, so a new entry gets written after every step.

**What I verified**
- Read the log, and filled in the Prisma Studio check that Claude had left blank.

**Issues caught**
- Claude marked the Prisma Studio check as "fill in" because it couldn't know whether I'd done it, instead of guessing.
- My `CLAUDE.md` commit was typed without `!`, so it went to the chat. Claude didn't commit for me and told me to retype it.

**Commit message**
- `Add prompt log` (a68e116) and `Add prompt log rule` (c19fa92)

---

## Step 3: Create, the add-prompt form · ~9:20 PM → ready to commit 9:37 PM

**My prompt (word for word)**
> Yes, I opened Prisma Studio and saw the empty Prompt table. Update that line in the log. Go to step 3. Read the Next.js docs only if you need them for this step.

**What Claude did**
- **Back end:** in `app/actions.js`, added `createPrompt`, a server function. It reads the form, skips saving if any field is empty or the category isn't one of the 6, then saves with `prisma.prompt.create(...)` (**the database call**).
- **Front end:** replaced the Next.js starter page in `app/page.js` with an "Add a prompt" form: title, a category dropdown, prompt text and "why it works". Every field is required.
- Put the 6 categories in their own file, `lib/categories.js`, so the dropdown and the server check use the same list. Also changed the browser tab title to "Prompt Playbook".

**What I verified**
- Claude: the linter passed, and the page loaded on my running server with all 4 fields and the 6 categories.
- Me: submitted the form, refreshed Prisma Studio, and the new prompt showed up as a row in the Prompt table.

**Issues caught**
- **Docs reading stopped.** Claude started reading the bundled Next.js docs first, and I stopped it. Rule from then on: only read the docs when the step needs them. This step didn't, so no docs were read.
- **The category list needed its own file.** A `"use server"` file is only allowed to share functions, not plain lists, so the category list couldn't live in `actions.js`.
- **No list on the page yet.** After saving, the form clears, but the prompt doesn't show up on the page until Step 4. For now, Prisma Studio is how to check it saved.

**Commit message**
- `Add create prompt form`

---

## Step 4: Read, list the prompts · ~9:55 PM → ready to commit 10:09 PM

**My prompt (word for word)**
> go

**What Claude did**
- **Back end:** a `PromptList` section in `app/page.js` gets every prompt with `prisma.prompt.findMany({ orderBy: { createdAt: "desc" } })`, newest first (**the database call**).
- **Back end:** `createPrompt` in `app/actions.js` now calls `revalidatePath("/")` after saving, so the new prompt appears right away without a manual refresh.
- **Front end:** each prompt shows as a simple card (category, title, prompt text, "why it works"), with a "No prompts yet" message when the list is empty and "Loading prompts..." while the list loads.

**What I verified**
- Claude: the linter passed. The live page showed my saved prompt from Step 3 as a card. A production build (`next build`) passed, and my dev server still worked afterward.
- Me: added a prompt and its card appeared right away. I refreshed the browser and it was still there.

**Issues caught**
- **This project has `cacheComponents: true` turned on.** It comes with this version of the Next.js starter. In this mode, a database read has to be wrapped in `<Suspense>`, which shows a loading message while the data arrives. The docs say to do this for any uncached database read. Claude did not test what happens without it. Claude found this in the config, read only the docs needed for this step (fetching data, `revalidatePath`, refreshing after a save), and wrapped the list.
- **Build warning about `sslmode=require`.** The Postgres connection package warns that `sslmode=require` in the Neon link will mean something slightly different in a future version. Nothing is broken. Optional fix: change it to `sslmode=verify-full` in `.env`.

**Commit message**
- `Show saved prompts on home page`

---

## Side step: Push to GitHub · ~10:15 PM

**My prompt (word for word)**
> Yes, the card appeared right away and stayed after refresh. Update the log. Before Step 5, help me push to a new public GitHub repo called prompt-playbook. Confirm .env is not tracked first. Then go to Step 5, the 👍 Worked for me counter.

**What Claude did**
- Checked that `.env` is safe: git doesn't track it, it was never in any commit, and `.gitignore` blocks it. Also scanned every commit for database links or passwords and found none.
- Created the public repo with the GitHub CLI and pushed the 6 commits: https://github.com/LanceCodes1/prompt-playbook
- Afterward, asked GitHub directly for `.env`, and it answered "Not Found".

**What I verified**
- Claude: the file list on GitHub, with no `.env` in it. Local `main` matches `origin/main`.
- Me: open the repo page on GitHub. _(fill in after checking)_

**Issues caught**
- Before creating the repo, Claude checked that I didn't already have one called `prompt-playbook`.
- The Step 4 log update wasn't committed yet, so it wasn't pushed. It goes in with the Step 5 commit.

**Commit message**
- None (push only, no new commit).

---

## Step 5: "Worked for me" counter, Update · ~10:20 PM → ready to commit 10:52 PM

**My prompt (word for word)**
> (Same prompt as the GitHub side step above: "...Then go to Step 5, the 👍 Worked for me counter.")

**What Claude did**
- **Back end:** a `markWorked` server function in `app/actions.js` adds 1 to that prompt's count with `prisma.prompt.update({ where: { id }, data: { workedCount: { increment: 1 } } })` (**the database call**), then refreshes the page with `revalidatePath("/")`.
- **Front end:** each card in `app/page.js` has a "👍 Worked for me (N)" button. It's a tiny form with a hidden `id` field, so the server knows which prompt was clicked, and it needs no extra JavaScript.
- Used `increment: 1`, so the database does the adding. Two people clicking at the same moment both get counted.

**What I verified**
- Claude: the linter passed, all 3 cards on the live page showed "👍 Worked for me (0)", and the production build passed.
- Me: click 👍 and check the number goes up, then refresh and check it stays. _(fill in after testing)_

**Issues caught**
- No database change was needed, because `workedCount` was added back in Step 2.
- Added a guard so a click without a valid id is ignored instead of causing an error.

**Commit message**
- `Add worked for me counter`
