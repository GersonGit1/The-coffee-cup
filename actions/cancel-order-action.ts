"use server";

import { prisma } from "@/src/lib/prisma";
import { pusherServer } from "@/src/lib/pusher-server";

export const cancelOrder = async (orderId: number) => {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "canceled"
      }
    });

    await pusherServer.trigger(`order-${order.id}`, "order-status-changed", order);
    await pusherServer.trigger("orders-channel", "canceled-order", order);
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Something went wrong" };
  }
};
