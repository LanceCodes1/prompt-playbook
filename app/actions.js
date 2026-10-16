"use server"; // everything in this file runs on the server, never in the browser

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/categories";

// Called when someone submits the "Add a prompt" form
export async function createPrompt(formData) {
  // Read each form field by its "name" and trim extra spaces
  const title = formData.get("title")?.trim();
  const category = formData.get("category");
  const promptText = formData.get("promptText")?.trim();
  const whyItWorks = formData.get("whyItWorks")?.trim();

  // Don't save if anything is empty or the category isn't one of ours
  if (!title || !promptText || !whyItWorks || !CATEGORIES.includes(category)) return;

  // DATABASE CALL: save a new row in the Prompt table
  await prisma.prompt.create({
    data: { title, category, promptText, whyItWorks },
  });

  // Refresh the home page so the new prompt shows up right away
  revalidatePath("/");
}
