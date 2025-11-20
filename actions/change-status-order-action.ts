"use server"

import { prisma } from "@/src/lib/prisma";
import { pusherServer } from "@/src/lib/pusher-server";
import { OrderCardSchema } from "@/src/schema";

export const changeStatusOrder = async (formData: FormData) => {
    const data = {
        OrderId :  formData.get('orderId'),
        status :  formData.get('orderStatus'),
    }
    const result = OrderCardSchema.safeParse(data);

    if(result.success){
        let status = "";
        let event = "";
        let readyAt : Date | null = null;
        switch (result.data.status) {
            case "pending":
                status = "preparing";
                event = "preparing-order";
                break;
            case "preparing":
                status = "ready"
                event = "ready-order";
                readyAt = new Date(Date.now());
                break;
            default:
                break;
        }

        try {
            const order = await prisma.order.update({
                where: {
                    id: result.data.OrderId,
                },
                data: {
                    status,
                    readyAt
                },
            });

            await pusherServer.trigger("orders-channel", event, order);
            await pusherServer.trigger(`order-${order.id}`, "order-status-changed", order);
        } catch (error) {
            console.log(error);
            //return { errors: [{ message: "Something went wrong"}] };
        }
    }
}