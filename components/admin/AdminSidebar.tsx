'use client';
import { useEffect, useState } from "react";
import Logo from "../ui/Logo"
import AdminRoute from "./AdminRoute"
import { useBusiness } from "@/src/context/BusinessContextType";
import { CategoryToSidebar } from "@/src/types";
import { CategoryIconSchema } from "@/src/schema";

export default function AdminSidebar() {
    const business = useBusiness().slug;
    const [categories, setCategories] = useState<CategoryToSidebar[]>([]);
    useEffect(() => {
        const fetchCategories = async () => {
          try {
            const res = await fetch(`/${business}/order/api`);
            const data = await res.json();
            
            const categories = CategoryIconSchema.safeParse(data);
            if (!categories.success) {
              console.error("Invalid categories data", categories.error);
              return;
            }
            setCategories(categories.data);
          } catch (error) {
            console.error("Error loading categories", error);
          }
        };
    
        fetchCategories();
      }, []);
    const firstCategorie = categories[0];
    const adminNavigation = [
        {url: `/${business}/admin/orders`, text: 'Cocina', blank: false},
        {url: `/${business}/orders`, text: 'Ordenes listas', blank: true},
        {url: `/${business}/admin/products`, text: 'Productos', blank: false},
        {url: `/${business}/admin/categories`, text: 'Categorías', blank: false},
        {url: `/${business}/order/${firstCategorie?.slug}`, text: 'Quiosco', blank: true},
        {url: `/${business}/admin/account`, text: 'Perfil', blank: false},
    ];

    return (
        <>
            <Logo />
            <div className="space-y-3 ">
                <p className="mt-10 uppercase font-bold text-sm text-gray-600 text-center">Navegación</p>
                <nav className="flex flex-col">
                    {adminNavigation.map(link => (
                        <AdminRoute
                            key={link.url}
                            link={link}
                        />
                    ))}

                    <a
                        href={`/${business}/admin/account/api`}
                        className="mt-10 text-red-600 font-bold text-center hover:underline"
                    >
                        Cerrar sesión
                    </a>
                </nav>
            </div>
        </>

    )
}