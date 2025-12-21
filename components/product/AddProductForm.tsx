"use client"

import { createProduct } from '@/actions/create-product-action'
import { useBusiness } from '@/src/context/BusinessContextType'
import { ProductSchema } from '@/src/schema'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export default function AddProductForm({children}: {children: React.ReactNode}) {
    const business = useBusiness();
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        const data = {
            name: formData.get('name') as string,
            price: formData.get('price') as string,
            categoryId: formData.get('categoryId') as string,
            BusinessId: business.id,
            image : formData.get('image') as string,
            imagePublicId : formData.get('image') as string,
        }
        
        const result = ProductSchema.safeParse(data)
        
        if (!result.success) {            
            result.error.issues.forEach((issue) => {
                console.log(issue.message);
                toast.error(issue.message)
            })
            return;
        }

        const response = await createProduct(result.data);
        if (response?.errors) {
            console.log('errores: ',);
            
            response.errors.forEach((error) => {
                console.log('errores: ',error.message);
                toast.error(error.message);
            });
            return;
        }

        toast.success('Producto creado correctamente');
        router.push(`/${business.slug}/admin/products`);
    }
    return (
        <div className='bg-white mt-10 px-5 py-10 rounded-md shadow-md max-w-3xl mx-auto'
        >
            <form action={handleSubmit} className="space-y-5">

                {children}

                <input type="submit" className="bg-indigo-600 hover:bg-indigo-800 rounded-lg w-full mt-5 p-3 uppercase font-bold cursor-pointer"
                value={"Registrar producto"} />
            </form>
        </div>
    )
}
