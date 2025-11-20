import EditProductForm from "@/components/product/EditProductForm";
import ProductForm from "@/components/product/ProductForm";
import GoBackButton from "@/components/ui/GoBackButton";
import Heading from "@/components/ui/Heading";
import { prisma } from "@/src/lib/prisma"
import { notFound } from "next/navigation";

async function getProductById(params: Promise<{ id: string }>){
    const {id} = await params;
    const productId = Number(id);
    const product = await prisma.product.findUnique({
        where: {
            id: productId
        }
    });
    if(!product){
        notFound();
    }
    return product;
}
export default async function page({params}:{params : Promise<{id: string}>}) {
    const product = await getProductById(params);
    return (
        <>
            <Heading>Editar {product.name}</Heading>
            
            <GoBackButton/>

            <EditProductForm>
                <ProductForm product={product}/>
            </EditProductForm>
        </>
    )
}
