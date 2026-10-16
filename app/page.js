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

// Shows every saved prompt as a card
async function PromptList() {
  // DATABASE CALL: get all prompts, newest first
  const prompts = await prisma.prompt.findMany({ orderBy: { createdAt: "desc" } });

  if (prompts.length === 0) return <p className="text-zinc-600">No prompts yet. Add the first one!</p>;

  return (
    <ul className="flex flex-col gap-4">
      {/* One card per prompt */}
      {prompts.map((p) => (
        <li key={p.id} className="rounded border p-4">
          <p className="text-sm text-zinc-600">{p.category}</p>
          <h3 className="text-lg font-semibold">{p.title}</h3>
          <p className="mt-2 whitespace-pre-wrap">{p.promptText}</p>
          <p className="mt-2 text-sm"><strong>Why it works:</strong> {p.whyItWorks}</p>

          {/* Clicking the button runs markWorked on the server for this card's id */}
          <div className="mt-3 flex gap-2">
            <form action={markWorked}>
              <input type="hidden" name="id" value={p.id} />
              <button type="submit" className="rounded border px-3 py-1">
                👍 Worked for me ({p.workedCount})
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
    <main className="mx-auto w-full max-w-2xl p-6">
      <h1 className="text-3xl font-bold">Prompt Playbook</h1>
      <p className="mt-1 text-zinc-600">A shared library of AI prompts that work.</p>

      {/* Tips card: the 4 parts of a good prompt, each with an example */}
      <section className="mt-6 rounded border p-4">
        <h2 className="text-xl font-semibold">How to write a good prompt</h2>
        <ul className="mt-2 flex flex-col gap-2">
          {PROMPT_TIPS.map((tip) => (
            <li key={tip.part}>
              <strong>{tip.part}:</strong> {tip.what}
              <p className="text-sm text-zinc-600">Example: “{tip.example}”</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Submitting this form runs createPrompt on the server */}
      <form action={createPrompt} className="mt-6 flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Add a prompt</h2>

        <label className="flex flex-col gap-1">
          Title
          <input
            name="title"
            required
            placeholder="e.g. Practice a job interview answer"
            className="rounded border p-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          Category
          <select name="category" required defaultValue="" className="rounded border p-2">
            {/* Placeholder option: can't be picked, so people must choose a real category */}
            <option value="" disabled>Choose a category...</option>
            {/* One dropdown option per category */}
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          Prompt
          <textarea
            name="promptText"
            required
            rows={4}
            placeholder="e.g. You are a friendly career coach. Help me answer “Tell me about yourself” for a warehouse job. I have 5 years of experience and a forklift certification. Give me 3 short bullet points."
            className="rounded border p-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          Why it works
          <textarea
            name="whyItWorks"
            required
            rows={2}
            placeholder="e.g. It gives the AI a role, a clear task, real details about me, and the format I want back."
            className="rounded border p-2"
          />
        </label>

        <button type="submit" className="rounded bg-black p-2 text-white">
          Save prompt
        </button>
      </form>

      <h2 className="mt-10 mb-3 text-xl font-semibold">Prompts</h2>
      {/* Show "Loading..." while the prompts come from the database */}
      <Suspense fallback={<p>Loading prompts...</p>}>
        <PromptList />
      </Suspense>
    </main>
  );
}
