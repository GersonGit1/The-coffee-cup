"use client"

import { ProductsWithCategory } from "@/app/admin/products/page"
import { formatCurrency } from "@/src/utils/currency"
import { CiEdit } from "react-icons/ci";
import Link from "next/link"
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { DeleteProductModal } from "./DeleteProductModal";
import { deleteProduct } from "@/actions/delete-product-action";
import { redirect } from "next/navigation";

type Props = {
    products: ProductsWithCategory
}

export default function ProductTable({products}: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null)
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
                                        <td className="relative flex justify-center whitespace-nowrap py-4 text-right text-sm font-medium sm:pr-0">
                                            <Link href={`/admin/products/${product.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
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
                    redirect('/admin/products')
                }}
            />

        </div>
    );
}