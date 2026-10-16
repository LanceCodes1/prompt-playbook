import { defineConfig } from "prisma/config";

// Load DATABASE_URL from .env using Node's built-in loader (no extra library needed)
process.loadEnvFile();

// Tells Prisma where the schema lives, where to save migrations, and which database to use
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
