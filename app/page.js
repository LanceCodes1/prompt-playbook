import { Suspense } from "react";
import { createPrompt, markWorked } from "./actions";
import { CATEGORIES } from "@/lib/categories";
import { prisma } from "@/lib/prisma";

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
          <form action={markWorked} className="mt-3">
            <input type="hidden" name="id" value={p.id} />
            <button type="submit" className="rounded border px-3 py-1">
              👍 Worked for me ({p.workedCount})
            </button>
          </form>
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

      {/* Submitting this form runs createPrompt on the server */}
      <form action={createPrompt} className="mt-6 flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Add a prompt</h2>

        <label className="flex flex-col gap-1">
          Title
          <input name="title" required className="rounded border p-2" />
        </label>

        <label className="flex flex-col gap-1">
          Category
          <select name="category" required className="rounded border p-2">
            {/* One dropdown option per category */}
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          Prompt
          <textarea name="promptText" required rows={4} className="rounded border p-2" />
        </label>

        <label className="flex flex-col gap-1">
          Why it works
          <textarea name="whyItWorks" required rows={2} className="rounded border p-2" />
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
