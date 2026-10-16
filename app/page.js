import { createPrompt } from "./actions";
import { CATEGORIES } from "@/lib/categories";

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
    </main>
  );
}
