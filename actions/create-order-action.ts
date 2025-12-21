"use server"

import { prisma } from "@/src/lib/prisma";
import { pusherServer } from "@/src/lib/pusher-server";
import { OrderSchema } from "@/src/schema"
import { OrderItem } from "@/src/types";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

type OrderData = {
    name: FormDataEntryValue;
    total: number;
    order: OrderItem[];
}
export async function createOrder(data: OrderData) {
    const headersList = await headers();
    const business =  headersList.get("x-business-slug");
    const sessionCookie = (await cookies()).get("session");
    if (!sessionCookie) {
        redirect(`/${business}/login`);
    }
    
    const session = JSON.parse(
        decodeURIComponent(sessionCookie.value)
    );
    const businessId =  session.businessId ?? "";
    
    const result = OrderSchema.safeParse(data);
    console.log('creando la orden', result.data);
    if(!result.success){
        return { errors: result.error.issues };
    }

    try {
        const productIds = result.data.order.map(item => item.id);

        const dbProducts = await prisma.product.findMany({
            where: {
                id: { in: productIds }
            },
            select: {
                id: true,
                name: true,
                isAvailable: true,
                isDeleted: true
            }
        });

        const unavailableProducts = dbProducts.filter(p => !p.isAvailable || p.isDeleted);
        
        if (dbProducts.length !== productIds.length) {
            return { errors: [{ message: "Algunos productos ya no existen" }] };
        }

        if (unavailableProducts.length > 0) {
            const names = unavailableProducts.map(p => p.name).join(", ");
            return { 
                errors: [{ message: `Los siguientes productos no están disponibles: ${names}` }] 
            };
        }
        
        const order = await prisma.order.create({
            data: {
                BusinessId: businessId!,
                name: result.data.name as string,
                total: result.data.total,
                OrderProducts: {
                    create: result.data.order.map(item => ({
                        productId: item.id,
                        quantity: item.quantity,
                    }))
                }
            },
            include: {
                OrderProducts: {
                    include: {
                        product: true
                    }
                }
            }
        });

        await pusherServer.trigger(`${businessId}-orders-channel`, "new-order", order);
        return {order}
    } catch (error) {
        console.log(error);
        return { errors: [{ message: "Something went wrong"}] };
    }
}