import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    const {businessSlug, categorySlug} = await request.json();
    
    if (businessSlug == null) {
        return new Response("Error getting products", {status: 500});
    }

    try {
        const products = await prisma.product.findMany({
            where:{
                isAvailable:true,
                isDeleted: false,
                category : {
                    slug : categorySlug
                },
                business:{
                    slug: businessSlug
                }
            },
            
        });
        
        return NextResponse.json(products);
    } catch (error) {
        console.log('error al obtener los productos del menú',error);
        
        return new Response("Error getting products", {status: 500});
    }
}