import Link from 'next/link'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
type Props = {
    page: number;
    totalPages: number;
}
export default function ProductsPagination({page,totalPages}: Props) {
    const windowSize = 4;

  let start = Math.max(1, page - Math.floor(windowSize / 2));
  let end = start + windowSize - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - windowSize + 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav className="flex justify-center items-center gap-2 py-10">
      {/* Prev */}
      {page > 1 && (
        <Link
          href={`/admin/products?page=${page - 1}`}
          className="p-2 bg-white ring-1 ring-gray-300 rounded hover:bg-gray-100"
        >
          <HiChevronLeft size={20} />
        </Link>
      )}

      {/* Page Numbers */}
      {pages.map((p) => (
        <Link
          key={p}
          href={`/admin/products?page=${p}`}
          className={`px-4 py-2 ring-1 ring-gray-300 rounded text-sm ${
            p === page
              ? "bg-gray-900 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          {p}
        </Link>
      ))}

      {/* Next */}
      {page < totalPages && (
        <Link
          href={`/admin/products?page=${page + 1}`}
          className="p-2 bg-white ring-1 ring-gray-300 rounded hover:bg-gray-100"
        >
          <HiChevronRight size={20} />
        </Link>
      )}
    </nav>
  );
}
