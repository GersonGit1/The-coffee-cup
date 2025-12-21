import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/src/lib/prisma";
import { getBusinessBySlug } from "@/src/utils/GetBusinessBySlug";

export const dynamic = "force-dynamic";

export async function GET() {
  const headersList = await headers();
    const businessSlug =  headersList.get("x-business-slug");
    const business = await getBusinessBySlug(businessSlug || "");
    const businessId =  business ? business.id : null;
  if (!businessId) {
    return NextResponse.json(
      { error: "Business not found" },
      { status: 400 }
    );
  }

  const categories = await prisma.category.findMany({
    where: {
      BusinessId: businessId,
      isDeleted: false,
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return NextResponse.json(categories);
}
