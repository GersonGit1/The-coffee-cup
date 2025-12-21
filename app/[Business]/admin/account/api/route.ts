import { NextResponse } from "next/server";
import { headers } from "next/headers";
import bcrypt from "bcrypt";
import { prisma } from "@/src/lib/prisma";
import { ChangePasswordSchema } from "@/src/schema";
import { getBusinessBySlug } from "@/src/utils/GetBusinessBySlug";

export async function POST(req: Request) {
  const body = await req.json();

  const parsed = ChangePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { currentPassword, newPassword } = parsed.data;

  // session
  const session = JSON.parse(
    req.headers.get("cookie")!
      .split("session=")[1]
      .split(";")[0]
  );

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    return NextResponse.json(
      { error: "Password actual incorrecta" },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: await bcrypt.hash(newPassword, 10),
    },
  });

  return NextResponse.json({ success: true });
}

//endponint to log out user
export async function GET(request: Request) {
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
  const url = new URL(request.url);

  const response = NextResponse.redirect(
    new URL(`/${business?.slug}/login`, request.url)
  );

  response.cookies.set("session", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return response;
}
