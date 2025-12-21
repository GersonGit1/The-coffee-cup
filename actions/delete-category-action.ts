'use server'

import { prisma } from "@/src/lib/prisma"

export async function deleteCategory(id: string) {
  // Soft delete  
  await prisma.category.update({
    where: { id },
    data: {
      isDeleted : true,
      deletedAt: new Date(),
    }
  });
}