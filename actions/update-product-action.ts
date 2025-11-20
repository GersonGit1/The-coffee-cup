"use server"

import cloudinary from "@/src/lib/cloudinary";
import { prisma } from "@/src/lib/prisma";
import { ProductSchemaServer } from "@/src/schema";
import { revalidatePath } from "next/cache";

type data = {
    name: string;
    price: number;
    categoryId: number;
    image: string;
    imagePublicId: string | null
}

export async function updateProduct(data:data, id: number){
    const result = ProductSchemaServer.safeParse(data);
    console.log(result);
    if(!result.success){
        return { errors: result.error.issues };
    }

    const product = await prisma.product.findUnique({
        where: { id },
        select: { imagePublicId: true },
    });

    console.log(result.data.imagePublicId);
    console.log(product?.imagePublicId);
    
    // Si el producto tenía imagen previa y subiste una nueva → eliminar la vieja
    if (product?.imagePublicId && result.data.imagePublicId !== product.imagePublicId) {
        console.log('destruyendo imagen');
        
        await cloudinary.uploader.destroy(product.imagePublicId);
    }

    await prisma.product.update({
        where: { id },
        data: {
        ...result.data,
        },
    });
  
    revalidatePath('/admin/products');
}