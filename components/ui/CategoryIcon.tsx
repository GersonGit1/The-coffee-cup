"use client" 

import { Category } from "@/generated/prisma/client"
import { useBusiness } from "@/src/context/BusinessContextType"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"

type CategoryIconProps = {
    name: string;
    slug: string;
}
export default function CategoryIcon({name, slug}: CategoryIconProps) {
  const params = useParams();
  const business = useBusiness();
  const isActive = params.category === slug;
  return (
    <div
        className={`${isActive ? 'bg-amber-400' : ''} flex items-center gap-4 w-full border-t border-gray-200 p-3 last-of-type:border-b`}
    >
        {/* <div className="w-16 h-16 relative">
            <Image
                fill
                src={`/icon_${category.slug}.svg`}
                alt="Image Category"
            />
        </div> */}
        <Link className="text-xl font-bold" href={`/${business.slug}/order/${slug}`}>
            {name}
        </Link>
    </div>
  )
}
