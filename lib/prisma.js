import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

// The adapter is how Prisma connects to our Postgres database on Neon
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// Reuse one database connection while developing, instead of opening a new one on every code change
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
