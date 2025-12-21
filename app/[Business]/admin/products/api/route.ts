import { prisma } from "@/src/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH (request: Request) {
  const {productId, isAvailable} = await request.json();
    try {
        const updatedProduct = await prisma.product.update({
            where: {
                id: productId
            },
            data: {
                isAvailable: isAvailable
            },
            include:{
                category: {
                    select :{
                        slug: true
                    }
                }
            },
        });
        return new Response(JSON.stringify(updatedProduct), {status: 200});
    } catch (error) {
        return new Response("Error updating product availability", {status: 500});
    }
}