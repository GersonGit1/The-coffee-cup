'use server'

import { prisma } from "@/src/lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteProduct(id: number) {
  // Soft delete
  await prisma.product.update({
    where: { id },
    data: {
      isDeleted : true,
      deletedAt: new Date(),
    }
  });

  revalidatePath('/admin/products')
}