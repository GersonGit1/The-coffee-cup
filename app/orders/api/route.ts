import { prisma } from "@/src/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(){
    const orders = await prisma.order.findMany({
        take: 10,
        where:{
            status: 'ready'
        },
        include:{
            OrderProducts:{
                include:{
                    product:true
                }
            }
        },
        orderBy: {
            readyAt: "desc"
        }
    });
    return Response.json(orders);
}