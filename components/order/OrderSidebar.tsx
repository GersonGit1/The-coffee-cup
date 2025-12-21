'use client';

import { useEffect, useState } from "react";
import CategoryIcon from "../ui/CategoryIcon";
import Logo from "../ui/Logo";
import { CategoryIconSchema } from "@/src/schema";
import { useBusiness } from "@/src/context/BusinessContextType";

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function OrderSideBar() {
  const business = useBusiness().slug;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <aside className="md:w-72 md:h-screen bg-white p-5">
      <Logo />

      <nav className="mt-10 space-y-1">
        {loading ? (
          <p className="text-sm text-gray-400">Cargando categorías…</p>
        ) : (
          categories.map((category) => (
            <CategoryIcon
              key={category.id}
              name={category.name}
              slug={category.slug}
            />
          ))
        )}
      </nav>
    </aside>
  );
}
