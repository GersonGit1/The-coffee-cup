'use client'

import ProductCard from "@/components/product/ProductCard";
import Heading from "@/components/ui/Heading";
import Spinner from "@/components/ui/Spinner";
import { useBusiness } from "@/src/context/BusinessContextType";
import { useProductsMenu } from "@/src/hooks/useProductsMenu";
import { ParamString } from "@/src/schema";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

export default function OrderPage() {  
  const params = useParams();
  const categoryParam = params.category;
  const result = ParamString.safeParse({param: categoryParam});
  if(!result.success){
    toast('ha ocurrido un error al obtener el parámetro de la url');
  }
  const category = result.data?.param ?? "";
  const businessSlug = useBusiness().slug;
  
  if (businessSlug == null) {
    return null;
  }
  
  const {data, isLoading, isError} = useProductsMenu(category,businessSlug);
  
  if(isLoading)
    return <Spinner/>
  if(isError)
    return null;  
  if(data)
  return (
    <>
      <Heading>
        Elige y Personaliza tu pedido
      </Heading>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 items-start">
        {data.map(product => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </>
  )
}
