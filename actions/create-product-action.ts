"use server"

import { prisma } from "@/src/lib/prisma";
import { ProductSchemaServer } from "@/src/schema";

type data = {
    name: string;
    price: number;
    categoryId: string;
    BusinessId: string;
    image: string;
}

export async function createProduct(data: data) {
    const result = ProductSchemaServer.safeParse(data);
    
    if(!result.success){
        return { errors: result.error.issues };
    }

    await prisma.product.create({
        data: result.data
    });
}