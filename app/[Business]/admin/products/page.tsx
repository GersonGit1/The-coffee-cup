import ProductSeachForm from "@/components/product/ProductSeachForm";
import ProductsPagination from "@/components/product/ProductsPagination";
import ProductTable from "@/components/product/ProductsTable";
import Heading from "@/components/ui/Heading";
import { prisma } from "@/src/lib/prisma";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";


async function productCount(businessId: string) {
  const count = await prisma.product.count({
    where: {
      BusinessId: businessId!,
      isDeleted : false
    }
  });
  return count;
}

async function getProducts(page: number, limit: number, businessId: string) {
  const skip = (page - 1) * limit;
  const products = await prisma.product.findMany({
    take: limit,
    skip: skip,
    where: {
      BusinessId: businessId!,
      isDeleted : false
    },
    include: {
      category: true,
    },
  });
  return products;
}

export type ProductsWithCategory = Awaited<ReturnType<typeof getProducts>>;

export default async function page({searchParams}: {searchParams: Promise<{page: string}>}) {

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
  
  const { page } = await searchParams;
  const pageNumber = Number(page) || 1;
  
  const limit = 10;
  if(pageNumber < 1){
    redirect(`/${business}/admin/products`);
  }

  const productsData = getProducts(pageNumber, limit,businessId!);
  const totalProductsData = productCount(businessId!);
  const [products, totalProducts] = await Promise.all([productsData, totalProductsData]); // las dos promesas se resuelven al mismo tiempo

  const totalPages = Math.ceil(totalProducts / limit);

  if(pageNumber > totalPages && totalPages !== 0){
    redirect(`/${business}/admin/products`);
  }
  return (
    <>
      <Heading>
        Administrar Productos
      </Heading>

      <div className="flex flex-col lg:flex-row lg:justify-between gap-5">
        <Link href={`/${business}/admin/products/new`}className="bg-amber-400 w-full rounded-lg lg:w-auto text-xl px-10 py-3 text-center font-bold cursor-pointer">
          Crear Producto
        </Link>

        <ProductSeachForm/>
      </div>
      <ProductTable
        products={products}
      />
      <ProductsPagination page={pageNumber} totalPages={totalPages}/>
    </>
  )
}
