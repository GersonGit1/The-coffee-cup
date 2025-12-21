import ProductSeachForm from "@/components/product/ProductSeachForm";
import ProductTable from "@/components/product/ProductsTable";
import Heading from "@/components/ui/Heading";
import { prisma } from "@/src/lib/prisma";
import { headers } from "next/headers";

async function searchProduct(searchTerm : string) {
    const businessId = (await headers()).get("x-business-id");
    const products = await prisma.product.findMany({
        where: {
            BusinessId: businessId!,
            name: {
                contains: searchTerm,
                mode: 'insensitive',
            },
            isDeleted: false
        },
        include: {
            category: true,
        },
    });
    return products;
}

export default async function page({searchParams}: {searchParams: Promise<{search: string}>}) {
    const {search} = await searchParams;
    const products = await searchProduct(search);
    return (
        <>
            <Heading>Resultados de Búsqueda: {search}</Heading>
            <div className="flex flex-col lg:flex-row lg:justify-end gap-5">

                <ProductSeachForm/>
            </div>

            {products.length ? (
                <ProductTable products={products}/>
            ) : <p className="text-center mt-10 text-lg">No se encontraron productos que coincidan con "{search}"</p>}
        </>
    )
}