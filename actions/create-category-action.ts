"use server"

import { prisma } from "@/src/lib/prisma";
import { CategorySchema } from "@/src/schema";

type data = {
    name: string;
    slug: string;
    BusinessId: string;
}

export async function createCategory(data: data) {
    console.log('creando categoría', data);
    
    const result = CategorySchema.safeParse(data);
    
    if(!result.success){
        return { errors: result.error.issues };
    }

    await prisma.category.create({
        data: result.data
    });
}