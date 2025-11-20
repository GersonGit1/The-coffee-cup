import { PrismaClient } from "@/src/generated/prisma/client";

declare global {
  // allow global prisma to survive module reloads during dev
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
