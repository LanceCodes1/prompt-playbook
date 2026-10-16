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
- Me: opened the repo page on GitHub. Everything looked right ("up to par").

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
- Me: clicked 👍, the number went up by 1, and it stayed after a refresh.

**Issues caught**
- No database change was needed, because `workedCount` was added back in Step 2.
- Added a guard so a click without a valid id is ignored instead of causing an error.

**Commit message**
- `Add worked for me counter`

---

## Side step: Prompt tips card + example text in the form · ready to commit 11:02 PM

**My prompt (word for word)**
> Yes, step 5 rendered and Git Hub repo was up to par. Also, after you update both lines, Add a short “How to write a good prompt” card above the form. Use 4 parts, Role, Task, Context, Format, each with a one-line example. Also add example placeholder text inside each form field. Front end only.

**What Claude did**
- **Front end:** added a "How to write a good prompt" card above the form, with 4 parts (Role, Task, Context, Format), each with a short one-line example. All 4 examples build one job-interview prompt, so together they show a complete prompt.
- **Front end:** added grey example text inside each form field. The prompt and "why it works" examples match the tips card. The category dropdown now starts on "Choose a category...", which can't be picked, so people have to choose a real category.
- Only `app/page.js` changed. `app/actions.js` and the database code weren't touched.

**What I verified**
- Claude: the linter passed, and the live page shows the card with all 4 parts plus the example text in every field. `git diff` shows no changes to `actions.js`. The production build passed.
- Me: the tips card and example text look good, and saving a prompt still works.

**Issues caught**
- A dropdown can't hold grey example text like the other fields can. Instead, Claude added a "Choose a category..." first option that can't be selected. The form's `required` rule blocks saving until a real category is picked, and the server already rejected empty categories.

**Commit message**
- `Add prompt tips card and form examples`

---

## Step 6: Delete · ready to commit 11:40 PM

**My prompt (word for word)**
> Log update: I clicked 👍, the number went up by 1, and it stayed after refresh. The tips card and example text look good, and saving a prompt still works. Update the log entries. Go to Step 6: Delete.

**What Claude did**
- **Back end:** a `deletePrompt` server function in `app/actions.js` removes the prompt with `prisma.prompt.deleteMany({ where: { id } })` (**the database call**), then refreshes the page with `revalidatePath("/")`.
- **Front end:** each card in `app/page.js` now has a red "Delete" button next to 👍. It works the same way as 👍: a tiny form with a hidden `id`. It deletes right away, with no "are you sure?" pop-up, as planned.
- Used `deleteMany` instead of `delete`. If the same prompt gets deleted twice (a double-click, or two open tabs), it does nothing instead of crashing.

**What I verified**
- Claude: the linter passed, the live page shows a Delete button on every card, and the production build passed. Claude didn't click Delete, so none of my real prompts were removed.
- Me: deleted a test prompt, and it stayed gone after a refresh.

**Issues caught**
- **Tips card wasn't committed yet.** Before starting, Claude saw that the tips card change hadn't been committed. It waited for me to commit it, so Delete gets its own commit, following my one-piece-per-commit rule.
- **Delete could crash on a double-click.** Plain `delete` throws an error if the prompt is already gone. `deleteMany` just removes zero rows instead.

**Commit message**
- `Add delete button`

---

## Side step: Write the README · ready for review 11:44 PM

**My prompt (word for word)**
> Log update: I deleted a test prompt and it stayed gone after refresh. Update the log. Then write a README: what Prompt Playbook is, the problem it solves, the stack, how to run it locally, the data flow (browser → server → Prisma → database → screen), full CRUD, and known limitations (no login, no delete confirmation). Link PROMPT_LOG.md. Stop so I can review and commit.

**What Claude did**
- Replaced the Next.js starter `README.md` with one for Prompt Playbook. It covers what the app is, the problem it solves, the stack, 4-step local setup, the data flow (walked through with "Save prompt"), a CRUD table showing each database call, the data model, the project files, known limitations, and a link to this log.
- Known limitations: no login and no delete confirmation (as asked), plus no 👍 limit, no editing, no search or filter, and no error message if the server rejects a prompt.

**What I verified**
- Claude: ran the README's `npx prisma migrate deploy` command against my database. It found the 1 migration and reported "No pending migrations to apply", so the command works and changed nothing.
- Me: read the README before committing. _(fill in after review)_

**Issues caught**
- `process.loadEnvFile()` (used in `prisma.config.mjs`) needs Node 20.12 or newer, so the README says so.
- Prisma commands fail if `.env` is missing, so the README tells people to create `.env` before running them.

**Commit message**
- `Write README`

---

## Side step: "Are you sure?" before Delete · ready to commit 11:50 PM

**My prompt (word for word)**
> Add an “Are you sure you want to delete this prompt?” confirmation before Delete runs. If I click Cancel, nothing happens. Keep the change small. Then remove “No delete confirmation” from the README’s known limitations and update the log. Stop so I can test and commit.

**What Claude did**
- **Front end:** added a new file, `app/DeleteButton.js`. It's a small browser-side button that shows "Are you sure you want to delete this prompt?" If you click Cancel, it stops the form from sending, so the server is never called. `app/page.js` now uses `<DeleteButton />` in place of the old button.
- **Back end:** no change. `deletePrompt` in `app/actions.js` is the same.
- **README:** removed "No delete confirmation" from Known limitations, updated the Delete row in the CRUD table ("then **OK** on 'Are you sure?'"), and added `DeleteButton.js` to the project files list.

**What I verified**
- Claude: the linter passed and the production build passed. The live page loaded without errors, but my database was empty ("No prompts yet"), so Claude couldn't see the button on a real card. Claude never clicks Delete or opens pop-ups in the browser.
- Me: add a test prompt, click Delete, then Cancel, and check the card stays. Click Delete, then OK, and check it's gone after a refresh. _(fill in after testing)_

**Issues caught**
- **A pop-up needs browser code.** `app/page.js` runs on the server and can't show a pop-up, so only the button moved into a small `"use client"` file. The form and the server function stayed where they were.
- **Empty database.** The page showed 0 Delete buttons. Claude checked, and the page wasn't broken: all the prompts had been deleted during testing.

**Commit message**
- `Ask before deleting a prompt`
