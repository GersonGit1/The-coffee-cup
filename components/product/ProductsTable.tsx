"use client"

import { ProductsWithCategory } from "@/app/[Business]/admin/products/page";
import { formatCurrency } from "@/src/utils/currency"
import { CiEdit } from "react-icons/ci";
import Link from "next/link"
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { DeleteProductModal } from "./DeleteProductModal";
import { deleteProduct } from "@/actions/delete-product-action";
import { redirect } from "next/navigation";
import { useBusiness } from "@/src/context/BusinessContextType";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductMenuWhitCategorySlugSchema } from "@/src/schema";

type Props = {
    products: ProductsWithCategory
}

async function changeProductAvailability (
        { businessSlug, productId, isAvailable }: 
        {businessSlug: string, productId: string, isAvailable: boolean}
    ) {
        const res = await fetch(`/${businessSlug}/admin/products/api`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, isAvailable })
        });
        if (!res.ok) throw new Error("Error en el servidor");
        return res.json();
    }

export default function ProductTable({products}: Props) {
    const business = useBusiness();
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: changeProductAvailability,
        onSuccess: (data) => {
            const result = ProductMenuWhitCategorySlugSchema.safeParse(data);
            if (result.success) {
                const categorySlug = result.data?.category.slug;
                console.log('query key a invalidar: ', 'ProductsMenu',categorySlug, business.slug);
                
                queryClient.invalidateQueries({
                    queryKey: ['ProductsMenu', categorySlug, business.slug]
                });
            }
            window.location.reload();
        },
        onError: () => {
            toast.error('error al actualizar la disponibilidad');
        }
    });

    return (
        <div className="px-4 sm:px-6 lg:px-8 mt-20">
            <div className="mt-8 flow-root ">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 bg-white p-5 ">
                        <table className="min-w-full divide-y divide-gray-300 ">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                        Producto
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Precio
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Categoría
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Disponible
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        <span className="">Acciones</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                            {product.name}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {formatCurrency(product.price)}
                                        </td> 
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {product.category.name}
                                        </td>
                                        <td>
                                            <button 
                                                name="availability"
                                                onClick={() => mutation.mutate({ 
                                                    businessSlug: business.slug, 
                                                    productId: product.id, 
                                                    isAvailable: !product.isAvailable 
                                                })}
                                                className={`${product.isAvailable ? 'text-black' : 'text-red-600'} rounded-lg p-2 text-xs uppercase font-bold w-full border
                                                border-black cursor-pointer`} >
                                                {mutation.isPending ? 'Cargando...' : (product.isAvailable ? 'Disponible' : 'No Disponible')}
                                            </button>
                                        </td>
                                        <td className="relative flex justify-center whitespace-nowrap py-4 text-right text-sm font-medium sm:pr-0">
                                            <Link href={`/${business.slug}/admin/products/${product.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                                                <CiEdit className="w-7 h-7"/>
                                            </Link>
                                            <button onClick={() => setDeleteId(product.id)} className="text-red-600 hover:text-red-800 cursor-pointer">
                                                <MdDelete className="w-7 h-7"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <DeleteProductModal 
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={async () => {
                    await deleteProduct(deleteId!)
                    setDeleteId(null)
                    redirect(`/${business.slug}/admin/products`)
                }}
            />

        </div>
    );
}