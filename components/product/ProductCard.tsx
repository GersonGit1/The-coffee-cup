import { Product } from "@/generated/prisma/client";
import { formatCurrency, getImagePath } from "@/src/utils/currency"
import Image from "next/image"
import AddProductButton from "./AddProductButton"

type ProductCardProps = {
    product : Product
}

export default function ProductCard({product}: ProductCardProps) {
  const imagePath = getImagePath(product.image);
  return (
    <div className="border bg-white">
      <Image
        src={imagePath}
        alt={product.name}
        width={400}
        height={500}
        priority
        className="w-full h-64 object-cover"
      />
      <div className="p-5">
        <h3 className="text-2xl font-bold">{product.name}</h3>
        <p className="mt-5 font-black text-4xl text-amber-500">
          {formatCurrency(product.price)}
        </p>
        <AddProductButton product={product}/>  
      </div>
    </div>
  )
}
