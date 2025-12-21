"use client";

import { createCategory } from "@/actions/create-category-action";
import { useBusiness } from "@/src/context/BusinessContextType";
import { CategorySchema } from "@/src/schema";
import { toast } from "react-toastify";
import { Category } from "./CategoriesCard";
import { generateSlug } from "@/src/utils/generateSlug";
import { updateCategory } from "@/actions/update-category-action";
import { motion, AnimatePresence } from "framer-motion";


interface CategoryFormModalProps {
  isOpen: boolean;
  category?: Category | null;
  onClose: () => void;
}

export function CategoryModal({
  isOpen,
  category,
  onClose,
}: CategoryFormModalProps) {
    const business = useBusiness();    
    const handleSubmit = async (formData: FormData) => {
        
        let response;
        const data = {
            name: formData.get('name') as string,
            slug: generateSlug(formData.get('name') as string),
            BusinessId: business.id,
        }
        const result = CategorySchema.safeParse(data)
        if (!result.success) {            
            result.error.issues.forEach((issue) => {
                toast.error(issue.message)
            })
            return;
        }
        if(!category)
            response = await createCategory(result.data);
        else
            response = await updateCategory(result.data, category.id);

        if (response?.errors) {
            response.errors.forEach((error) => {
                toast.error(error.message)
            });
            return;
        }
        onClose();
        toast.success('Categoría guardada correctamente');
        window.location.reload();
    }

  return (
    <AnimatePresence>
    {isOpen && (
        <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        >
        <motion.div
            className="bg-white p-6 rounded-xl w-80"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
        >
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="w-full max-w-md rounded-2xl bg-white p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        {category ? "Editar categoría" : "Nueva categoría"}
                    </h2>
            
                    <form
                        action={handleSubmit}
                        className="space-y-4"
                    >
                    <div>
                        <label className="block text-sm font-medium">
                            Nombre
                        </label>
                        <input
                            name="name"
                            defaultValue={category?.name || ""}
                            className="mt-1 w-full rounded-lg border px-3 py-2"
                            required
                        />
                    </div>
            
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-gray-100 cursor-pointer"
                            >
                            Cancelar
                        </button>
            
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white cursor-pointer"
                            >
                            Guardar
                        </button>
                    </div>
                    </form>
                </div>
            </div>
        </motion.div>
        </motion.div>
    )}
    </AnimatePresence>
  );
}
