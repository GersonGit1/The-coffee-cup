"use client"
import { updateProduct } from '@/actions/update-product-action'
import { useBusiness } from '@/src/context/BusinessContextType'
import { ProductSchema } from '@/src/schema'
import { validateBusinessId } from '@/src/utils/validateId'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export default function EditProductForm({children}: {children: React.ReactNode}) {
    const business = useBusiness();
    const router = useRouter();
    const params = useParams();
    const productId = validateBusinessId({id: params.id?.toString() || ''});

    const handleSubmit = async (formData: FormData) => {
        const data = {
            name: formData.get('name') as string,
            price: formData.get('price') as string,
            categoryId: formData.get('categoryId') as string,
            BusinessId: business.id,
            image : formData.get('image') as string,
            imagePublicId : formData.get('imagePublicId') as string,
        }
        const result = ProductSchema.safeParse(data)        
        if (!result.success) {            
            result.error.issues.forEach((issue) => {
                toast.error(issue.message)
            })
            return;
        }

        const response = await updateProduct(result.data, productId);
        if (response?.errors) {
            response.errors.forEach((error) => {
                toast.error(error.message)
            });
            return;
        }

        toast.success('Producto actualizado correctamente');
        router.push(`/${business.slug}/admin/products`);
    }
    return (
        <div className='bg-white mt-10 px-5 py-10 rounded-md shadow-md max-w-3xl mx-auto'
        >
            <form action={handleSubmit} className="space-y-5">

                {children}

                <input type="submit" className="bg-indigo-600 hover:bg-indigo-800 w-full mt-5 p-3 uppercase font-bold cursor-pointer rounded-lg"
                value={"Guardar cambios"} />
            </form>
        </div>
    )
}
