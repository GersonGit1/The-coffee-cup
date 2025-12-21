import { prisma } from "@/src/lib/prisma";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export async function GET(){
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

    const orders = await prisma.order.findMany({
        take: 10,
        where:{
            BusinessId: businessId!,
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