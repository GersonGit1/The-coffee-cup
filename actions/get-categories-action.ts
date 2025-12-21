"use server"

import { prisma } from "@/src/lib/prisma";

export async function getCategories(businessId: string) {
  const categories = await prisma.category.findMany({
    where: {
      BusinessId: businessId!,
      isDeleted : false
    }
  });
  return categories;
}