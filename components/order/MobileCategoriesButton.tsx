'use client';

type Props = {
  onClick: () => void;
};

export function MobileCategoriesButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="fixed top-2 right-2 z-40 bg-black shadow-xl rounded-full w-14 h-14 flex items-center justify-center text-xl md:hidden"
      aria-label="Categorías"
    >
      <div className="flex flex-col gap-1">
        <div className="h-1 w-9 bg-white"></div>
        <div className="h-1 w-9 bg-white"></div>
        <div className="h-1 w-9 bg-white"></div>
      </div>
    </button>
  );
}
