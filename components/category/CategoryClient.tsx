'use client'

import { useState } from "react";
import AddCategoryButton from "../ui/AddCategoryButton"
import Heading from "../ui/Heading"
import CategoryCards, { Category } from "./CategoriesCard"
import { DeleteCategoryModal } from "./DeleteCategoryModal";
import { CategoryModal } from "./CategoryModal";
import { deleteCategory } from "@/actions/delete-category-action";

interface CategoryCardsProps {
  categories: Category[];
}

export default function CategoryClient({categories}: CategoryCardsProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [categoryToDelete, setDeleteCategory] = useState<Category | null>(null);
  return (
    <>
      <Heading>
        Administrar Categorías
      </Heading>

      <AddCategoryButton onClick={() => setIsCreating(true)} />

      <CategoryCards
        categories={categories}
        onEdit={(cat) => setEditCategory(cat)}
        onDelete={(cat) => setDeleteCategory(cat)}
      />

      {/* CREATE */}
      <CategoryModal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
      />

      {/* EDIT */}
      <CategoryModal
        isOpen={!!editCategory}
        category={editCategory}
        onClose={() => setEditCategory(null)}
      />

      {/* DELETE */}
      <DeleteCategoryModal
        isOpen={!!categoryToDelete}
        onClose={() => setDeleteCategory(null)}
        onConfirm={async () => {
          if (!categoryToDelete) return;          
          await deleteCategory(categoryToDelete.id);
          setDeleteCategory(null);
          window.location.reload();
        }}
      />
    </>
  )
}
