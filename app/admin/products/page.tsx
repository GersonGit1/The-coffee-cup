import ProductSeachForm from "@/components/product/ProductSeachForm";
import ProductsPagination from "@/components/product/ProductsPagination";
import ProductTable from "@/components/product/ProductsTable";
import Heading from "@/components/ui/Heading";
import { prisma } from "@/src/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

async function productCount() {
  const count = await prisma.product.count({
    where: {
      isDeleted : false
    }
  });
  return count;
}

async function getProducts(page: number, limit: number) {
  const skip = (page - 1) * limit;
  const products = await prisma.product.findMany({
    take: limit,
    skip: skip,
    where: {
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
  const { page } = await searchParams;
  const pageNumber = Number(page) || 1;
  
  const limit = 10;
  if(pageNumber < 1){
    redirect('/admin/products');
  }

  const productsData = getProducts(pageNumber, limit);
  const totalProductsData = productCount();
  const [products, totalProducts] = await Promise.all([productsData, totalProductsData]); // las dos promesas se resuelven al mismo tiempo

  const totalPages = Math.ceil(totalProducts / limit);

  if(pageNumber > totalPages && totalPages !== 0){
    redirect('/admin/products');
  }
  return (
    <>
      <Heading>
        Administrar Productos
      </Heading>

      <div className="flex flex-col lg:flex-row lg:justify-between gap-5">
        <Link href="/admin/products/new" className="bg-amber-400 w-full rounded-lg lg:w-auto text-xl px-10 py-3 text-center font-bold cursor-pointer">
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
