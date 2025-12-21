"use client";

import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

export type Category = {
    isDeleted: boolean;
    id: string;
    name: string;
    deletedAt: Date | null;
    BusinessId: string;
    slug: string;
}

export default function CategoryCards({
  categories,
  onEdit,
  onDelete,
}: {
  categories: Category[];
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
}) {
  if (categories.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Aún no hay categorías creadas.
      </p>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-10">
      {categories.map((category) => (
        <div
          key={category.id}
          className="rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-base text-gray-900">
                {category.name}
              </p>
              <p className="text-xs text-gray-400">
                /{category.slug}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>onEdit(category)}
                className="rounded-lg p-2 hover:bg-gray-100 transition cursor-pointer"
                title="Editar"
              >
                <CiEdit className="w-7 h-7"/>
              </button>

              <button
                onClick={() => onDelete(category)}
                className="rounded-lg p-2 hover:bg-red-50 transition text-red-500 cursor-pointer"
                title="Eliminar"
              >
                <MdDelete className="w-7 h-7"/>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
    
  );
}
