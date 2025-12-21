import { prisma } from "@/src/lib/prisma"
import ImageUpload from "./ImageUpload"
import { Product } from "@/generated/prisma/client";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

type props = {
    product? : Product
}

async function getCategories(businessId: string) {
    const categories = await prisma.category.findMany({
        where:{
            isDeleted: false,
            BusinessId: businessId
        }
    })
    return categories
}

export default async function ProductForm({product}:props) {
    const headersList = await headers();
    const business =  headersList.get("x-business-slug");
    const sessionCookie = (await cookies()).get("session");
    if (!sessionCookie) {
        redirect(`/${business}/login`);
    }
    
    const session = JSON.parse(
    decodeURIComponent(sessionCookie.value)
    );
    const businessId =  session.businessId ?? "";
    const categories = await getCategories(businessId);

    return (
        <>
            <div className="space-y-2">
                <label
                    className="text-slate-800"
                    htmlFor="name"
                >Nombre:</label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    className="block w-full p-3 bg-slate-100"
                    placeholder="Nombre Producto"
                    defaultValue={product?.name}
                />
            </div>

            <div className="space-y-2">
                <label
                    className="text-slate-800"
                    htmlFor="price"
                >Precio:</label>
                <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    className="block w-full p-3 bg-slate-100"
                    placeholder="Precio Producto"
                    defaultValue={product?.price}
                />
            </div>

            <div className="space-y-2">
                <label
                    className="text-slate-800"
                    htmlFor="categoryId"
                >Categoría:</label>
                <select
                    className="block w-full p-3 bg-slate-100"
                    id="categoryId"
                    name="categoryId"
                    defaultValue={product?.categoryId}
                >
                    <option value="">-- Seleccione --</option>
                    {categories.map((category) => (
                        <option
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
                    {/**@ts-ignore */}
            <ImageUpload image={product?.image} imagePublicId={product?.imagePublicId}/>
        </>
    )
}