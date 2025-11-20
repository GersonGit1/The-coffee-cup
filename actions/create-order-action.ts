"use server"

import { prisma } from "@/src/lib/prisma";
import { pusherServer } from "@/src/lib/pusher-server";
import { OrderSchema } from "@/src/schema"
import { OrderItem } from "@/src/types";

type OrderData = {
    name: FormDataEntryValue;
    total: number;
    order: OrderItem[];
}
export async function createOrder(data: OrderData) {
    const result = OrderSchema.safeParse(data);
    if(!result.success){
        return { errors: result.error.issues };
    }

    try {        
        const order = await prisma.order.create({
            data: {
                name: data.name as string,
                total: data.total,
                OrderProducts: {
                    create: data.order.map(item => ({
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

        await pusherServer.trigger("orders-channel", "new-order", order);
        return {order}
    } catch (error) {
        console.log(error);
        return { errors: [{ message: "Something went wrong"}] };
    }
}