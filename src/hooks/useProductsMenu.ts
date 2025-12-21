"use client";

import { useQuery } from "@tanstack/react-query";
import { ProductMenuSchema } from "../schema";

const getProducts = async (categorySlug:string, businessSlug: string) => {
  const response = await fetch(`/${businessSlug}/order/products/api`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      businessSlug,
      categorySlug
    })
  });

  if (!response.ok) {
    throw new Error("Error en la respuesta del servidor");
  }
  const data = await response.json();  
  const result = ProductMenuSchema.safeParse(data);

  if(!result.success){
    console.log('error en el schema de productos: ', result)
  }
  
  return result.data ?? [];
}

export function useProductsMenu(categorySlug:string, businessSlug: string) {
  const query = useQuery({
    queryKey:['ProductsMenu',categorySlug, businessSlug], //queryKey should be unique in the application
    queryFn : () => getProducts(categorySlug, businessSlug)
  });
  
  return query;
}
