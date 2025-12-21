import { cache } from "react";
import { prisma } from "@/src/lib/prisma";

export const getBusinessBySlug = cache(async (businessSlug: string) => {
  return prisma.business.findUnique({
    where: { slug: businessSlug ?? "" },
    select: {
      id: true,
      slug: true,
      nombre: true,
      logo: true,
    },
  });
});
