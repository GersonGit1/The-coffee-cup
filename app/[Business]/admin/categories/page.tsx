
import { getCategories } from "@/actions/get-categories-action";
import CategoryClient from "@/components/category/CategoryClient";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function page() {
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
  
  const categories = await getCategories(businessId!);
  return (
    <>
      <CategoryClient categories={categories}/>
    </>
  )
}
