import { prisma } from "@/src/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(){
  const orders = await prisma.order.findMany({
    where: {
      status: { in: ["pending", "preparing"] }
    },
    include: {
      OrderProducts: {
        include: {
          product: true,
        }
      }
    }
  });
  return Response.json(orders);
}