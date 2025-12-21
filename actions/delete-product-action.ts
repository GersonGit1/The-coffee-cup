'use server'

import { prisma } from "@/src/lib/prisma"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers";

export async function deleteProduct(id: string) {
  const business = (await headers()).get("x-business-slug");
  // Soft delete
  await prisma.product.update({
    where: { id },
    data: {
      isDeleted : true,
      deletedAt: new Date(),
    }
  });

  revalidatePath(`/${business}/admin/products`)
}