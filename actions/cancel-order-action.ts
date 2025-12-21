"use server";

import { prisma } from "@/src/lib/prisma";
import { pusherServer } from "@/src/lib/pusher-server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const cancelOrder = async (orderId: string) => {
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
  
  try {
    const order = await prisma.order.update({
      where: {
        BusinessId : businessId!,
        id: orderId 
      },
      data: {
        status: "canceled"
      }
    });

    await pusherServer.trigger(`${businessId}-order-${order.id}`, "order-status-changed", order);
    await pusherServer.trigger(`${businessId}-orders-channel`, "canceled-order", order);
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Something went wrong" };
  }
};
