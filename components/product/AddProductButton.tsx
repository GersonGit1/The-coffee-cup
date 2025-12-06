"use client"

import { useStore } from "@/src/store"
import { Product } from "@/generated/prisma/client";
type Props = {
    product : Product
}

export default function AddProductButton({product}: Props) {
  const addToOrder = useStore((state) => state.addToOrder);
  return (
    <button type="button" className="bg-indigo-600 hover:bg-indigo-800 rounded-lg text-white w-full mt-5 p-3 uppercase font-bold cursor-pointer"
     onClick={() => addToOrder(product)}>
        Agregar
    </button>
  )
}
