import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const formData = await req.json();
    const email = formData.email;
    const password = formData.password;
    const businessId = formData.BusinessId;
    console.log('form data', formData);
    
    if (!email || !password) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
  
    console.log('business id: ', businessId);
    
    if (!businessId) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }
  
    const user = await prisma.user.findUnique({
      where: {
        email,
        BusinessId: businessId,
      },
      include:{
        business: true,
      },
    });
    
    console.log('user: ', user);
    
    if (!user) {
      console.log('user not found');
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
  
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log('Invalid credentials');
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
  
    // crear sesión
    const res = NextResponse.redirect(
      new URL(`/${user.business.slug}/admin/products`, req.url)
    );
  
    res.cookies.set("session", JSON.stringify({
      userId: user.id,
      businessId: user.BusinessId,
      businessSlug: user.business.slug,
    }), 
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    
    console.log('Login successful, creating session cookie', res);
    return res;
  } catch (error) {
    console.log('An error occurred while trying login', error);
  }
}
