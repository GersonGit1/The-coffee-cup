'use client';

type props ={
    onClick: () => void;
}

export default function AddCategoryButton({onClick: onclick}: props) {
  return (
    <div className="flex flex-col lg:flex-row lg:justify-between gap-5">
        <button onClick={onclick} className="bg-amber-400 w-full rounded-lg lg:w-auto text-xl px-10 py-3 text-center font-bold cursor-pointer">
          Crear Categoría
        </button>
      </div>
  )
}
