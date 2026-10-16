import { Suspense } from "react";
import { createPrompt, markWorked, deletePrompt } from "./actions";
import DeleteButton from "./DeleteButton";
import { CATEGORIES } from "@/lib/categories";
import { prisma } from "@/lib/prisma";

// The 4 parts of a good prompt, shown in the tips card above the form
const PROMPT_TIPS = [
  { part: "Role", what: "Tell the AI who to be.", example: "You are a friendly career coach." },
  { part: "Task", what: "Say exactly what you want.", example: "Help me answer “Tell me about yourself.”" },
  { part: "Context", what: "Give real details about you.", example: "I have 5 years of warehouse experience and a forklift certification." },
  { part: "Format", what: "Describe how the answer should look.", example: "Give me 3 short bullet points I can practice out loud." },
];

// Shared looks (styling only)
const panelClass = "rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.4)]";
const fieldClass =
  "rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-ink placeholder:text-muted/80 transition duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";
const labelClass = "flex flex-col gap-2 text-sm font-medium text-muted";

// Shows every saved prompt as a card
async function PromptList() {
  // DATABASE CALL: get all prompts, newest first
  const prompts = await prisma.prompt.findMany({ orderBy: { createdAt: "desc" } });

  if (prompts.length === 0)
    return (
      <p className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-muted">
        No prompts yet. Add the first one!
      </p>
    );

  return (
    <ul className="flex flex-col gap-5">
      {/* One card per prompt */}
      {prompts.map((p) => (
        <li
          key={p.id}
          className={`${panelClass} p-6 transition duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.15),0_16px_40px_rgba(34,211,238,0.08)]`}
        >
          <span className="inline-block rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-medium tracking-wide text-accent">
            {p.category}
          </span>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink">{p.title}</h3>
          <p className="mt-4 whitespace-pre-wrap rounded-xl border border-white/5 bg-black/30 p-4 text-[15px] leading-relaxed text-ink">
            {p.promptText}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            <span className="font-semibold text-ink">Why it works:</span> {p.whyItWorks}
          </p>

          {/* Clicking the button runs markWorked on the server for this card's id */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <form action={markWorked}>
              <input type="hidden" name="id" value={p.id} />
              <button
                type="submit"
                className="flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-2 pr-2 pl-4 text-sm font-medium text-ink transition duration-200 hover:border-accent/40 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              >
                👍 Worked for me
                <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent">{p.workedCount}</span>
              </button>
            </form>

            {/* Delete asks "Are you sure?" first, then runs deletePrompt on the server for this card's id */}
            <form action={deletePrompt}>
              <input type="hidden" name="id" value={p.id} />
              <DeleteButton />
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main className="relative mx-auto w-full max-w-[720px] px-4 py-16 sm:px-6 sm:py-24">
      {/* Faint cyan glow behind the title (decoration only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(closest-side,rgba(34,211,238,0.16),transparent)] blur-2xl"
      />

      <header className="relative motion-safe:animate-fade-in">
        <h1 className="bg-linear-to-r from-ink via-ink to-accent bg-clip-text pb-1 text-5xl font-bold tracking-tighter text-transparent sm:text-6xl">
          Prompt Playbook
        </h1>
        <p className="mt-4 text-lg text-muted">A shared library of AI prompts that work.</p>
      </header>

      {/* Tips card: the 4 parts of a good prompt, each with an example */}
      <section className={`${panelClass} relative mt-12 p-6 motion-safe:animate-fade-in [animation-delay:100ms]`}>
        <h2 className="text-lg font-semibold tracking-tight text-ink">How to write a good prompt</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {PROMPT_TIPS.map((tip) => (
            <li key={tip.part} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm text-ink">
                <strong className="font-semibold text-accent">{tip.part}:</strong> {tip.what}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">Example: “{tip.example}”</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Submitting this form runs createPrompt on the server */}
      <form
        action={createPrompt}
        className={`${panelClass} relative mt-8 flex flex-col gap-5 p-6 motion-safe:animate-fade-in [animation-delay:200ms]`}
      >
        <h2 className="text-lg font-semibold tracking-tight text-ink">Add a prompt</h2>

        <label className={labelClass}>
          Title
          <input
            name="title"
            required
            placeholder="e.g. Practice a job interview answer"
            className={fieldClass}
          />
        </label>

        <label className={labelClass}>
          Category
          <select name="category" required defaultValue="" className={`${fieldClass} [&_option]:bg-bg [&_option]:text-ink`}>
            {/* Placeholder option: can't be picked, so people must choose a real category */}
            <option value="" disabled>Choose a category...</option>
            {/* One dropdown option per category */}
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className={labelClass}>
          Prompt
          <textarea
            name="promptText"
            required
            rows={4}
            placeholder="e.g. You are a friendly career coach. Help me answer “Tell me about yourself” for a warehouse job. I have 5 years of experience and a forklift certification. Give me 3 short bullet points."
            className={fieldClass}
          />
        </label>

        <label className={labelClass}>
          Why it works
          <textarea
            name="whyItWorks"
            required
            rows={2}
            placeholder="e.g. It gives the AI a role, a clear task, real details about me, and the format I want back."
            className={fieldClass}
          />
        </label>

        <button
          type="submit"
          className="mt-1 min-h-12 rounded-xl bg-accent px-4 py-3 text-base font-semibold text-bg shadow-[0_8px_24px_rgba(34,211,238,0.25)] transition duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Save prompt
        </button>
      </form>

      <h2 className="relative mt-16 mb-5 text-2xl font-semibold tracking-tight text-ink">Prompts</h2>
      {/* Show "Loading..." while the prompts come from the database */}
      <Suspense fallback={<p className="text-muted">Loading prompts...</p>}>
        <PromptList />
      </Suspense>
    </main>
  );
}
