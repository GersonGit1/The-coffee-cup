import ProductCard from "@/components/product/ProductCard";
import Heading from "@/components/ui/Heading";
import { prisma } from "@/src/lib/prisma"

const getProducts = async (categorySlug:string) => {
  const products = await prisma.product.findMany({
    where: {
      isDeleted: false,
      category : {
        slug : categorySlug
      }
    }
  });
  return products;
}

export default async function OrderPage({params}: {params : {category : string}}) { 
  const {category} = await params;
  const products = await getProducts(category)
  return (
    <>
      <Heading>
        Elige y Personaliza tu pedido
      </Heading>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 items-start">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </>
  )
}
