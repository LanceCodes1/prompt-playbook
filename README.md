# Prompt Playbook

A shared library of AI prompts that actually work, written for people who are new to AI.

Anyone can add a prompt that helped them, browse what others saved, mark one as "👍 Worked for me", or delete one. Each prompt comes with a short note on **why it works**, so people learn the skill instead of just copying text.

## The problem it solves

Many people starting out with AI, including returning citizens and the reentry staff who support them, stare at an empty chat box and don't know what to type. Generic advice like "be specific" doesn't help much. Seeing real prompts that worked for someone in a similar situation does.

Prompt Playbook collects those prompts in one place, sorted into everyday categories: **Job Search, Resume, Music, Sports, LA Life, Learning**. A "How to write a good prompt" card at the top teaches the four parts of a strong prompt: **Role, Task, Context, Format**.

## Stack

| Part | What it does |
|---|---|
| [Next.js 16](https://nextjs.org) (App Router) | The web app: pages, forms and server code in one project |
| [Tailwind CSS](https://tailwindcss.com) | Styling |
| [Prisma 7](https://www.prisma.io) | Talks to the database, so we write `prisma.prompt.create(...)` instead of raw SQL |
| [Neon](https://neon.tech) Postgres | The hosted database where prompts are saved |

No login, no live AI calls, no extra libraries.

## Run it locally

You need **Node.js 20.12 or newer** (it was built with Node 24) and a free [Neon](https://neon.tech) database.

1. **Get the code and install packages**
   ```bash
   git clone https://github.com/LanceCodes1/prompt-playbook.git
   cd prompt-playbook
   npm install
   ```
   `npm install` also runs `prisma generate`, which builds the database helper code into `lib/generated/`.

2. **Add your database link.** Create a file named `.env` in the project folder:
   ```
   DATABASE_URL="postgresql://user:password@your-project.neon.tech/neondb?sslmode=require"
   ```
   Use the connection string from your Neon dashboard (**Connect** button). `.env` is listed in `.gitignore`, so your password is never committed. Prisma commands need this file to exist.

3. **Create the table in your database**
   ```bash
   npx prisma migrate deploy
   ```

4. **Start the app**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.

Optional: `npx prisma studio` opens a browser view of the database table.

## How the data flows

Every action follows the same path:

```
Browser  →  Server  →  Prisma  →  Neon database  →  back to the screen
```

Here's what happens when you click **Save prompt**:

1. **Browser:** the form in `app/page.js` sends the fields to the server. The form's `action` is a server function, so no API route or fetch code is needed.
2. **Server:** `createPrompt` in `app/actions.js` reads the fields and checks that none are empty and the category is valid.
3. **Prisma:** `prisma.prompt.create(...)` turns that into a database command, using the shared connection in `lib/prisma.js`.
4. **Database:** Neon saves a new row in the `Prompt` table.
5. **Screen:** `revalidatePath("/")` tells Next.js to rebuild the home page. The page runs `prisma.prompt.findMany(...)` again, and the new card appears without a manual refresh.

The 👍 and Delete buttons work the same way. Each is a tiny form with a hidden `id` that calls its own server function.

## Full CRUD

| Operation | What the user does | Server function | Database call |
|---|---|---|---|
| **Create** | Fills in the form and clicks **Save prompt** | `createPrompt` | `prisma.prompt.create(...)` |
| **Read** | Opens the home page and sees every prompt, newest first | `PromptList` in `app/page.js` | `prisma.prompt.findMany(...)` |
| **Update** | Clicks **👍 Worked for me** | `markWorked` | `prisma.prompt.update(...)` with `increment: 1` |
| **Delete** | Clicks **Delete** on a card, then **OK** on "Are you sure?" | `deletePrompt` | `prisma.prompt.deleteMany(...)` |

Data stays after a refresh because it lives in Neon, not in the browser.

### The data model (`prisma/schema.prisma`)

```
Prompt
  id           number, given out automatically
  title        text
  category     one of the 6 categories
  promptText   the prompt to copy into an AI
  whyItWorks   short explanation
  workedCount  "worked for me" count, starts at 0
  createdAt    set automatically when saved
```

## Project files

```
app/page.js           the home page: tips card, form, list of prompt cards
app/actions.js        server functions: createPrompt, markWorked, deletePrompt
app/DeleteButton.js   the Delete button; asks "Are you sure?" in the browser first
lib/prisma.js         the one shared database connection
lib/categories.js     the 6 categories (used by the form and the server check)
prisma/schema.prisma  what the Prompt table looks like
prisma/migrations/    the SQL that created the table
prisma.config.mjs     tells Prisma where the database is (reads .env)
```

## Known limitations

This is a class demo, so some things are left out on purpose:

- **No login.** Anyone who can open the site can add, 👍 or delete any prompt.
- **👍 has no limit.** One person can click it as many times as they want.
- **No editing.** To fix a typo in a prompt, delete it and add it again.
- **No search or category filter.** All prompts show in one list, newest first.
- **Quiet validation.** The browser stops empty fields, but if the server ever rejects a prompt, it just doesn't save, with no error message.

## How it was built

This app was built step by step with an AI coding assistant (Claude Code), one small piece per commit. Every prompt, what was done, how it was checked and what issues came up are recorded in **[PROMPT_LOG.md](PROMPT_LOG.md)**.
