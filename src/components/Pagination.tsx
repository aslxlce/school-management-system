// const Pagination = () => {
//     return (
//         <div className="p-4 flex items-center justify-between text-gray-500">
//             <button
//                 disabled
//                 className="py-2 px-4 rounded-md bg-slate-200 text0xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//                 Prev
//             </button>
//             <div className="flex items-center gap-2 text-sm">
//                 <button className="px-2 rounded-sm bg-[var(--sky-color)]">1</button>
//                 <button className="px-2 rounded-sm ">2</button>
//                 <button className="px-2 rounded-sm ">3</button>
//                 ...
//                 <button className="px-2 rounded-sm ">10</button>
//             </div>
//             <button className="py-2 px-4 rounded-md bg-slate-200 text0xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
//                 Next
//             </button>
//         </div>
//     );
// };

// export default Pagination;

"use client";

import Link from "next/link";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

const Pagination = ({ currentPage, totalPages }: PaginationProps) => {
    const createPageNumbers = () => {
        const pages: number[] = [];

        // Always show first page
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);

            if (currentPage > 3) pages.push(-1); // -1 = "..."

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);

            if (currentPage < totalPages - 2) pages.push(-1); // -1 = "..."

            pages.push(totalPages);
        }

        return pages;
    };

    const pages = createPageNumbers();

    return (
        <div className="p-4 flex items-center justify-between text-gray-500">
            {/* Prev button */}
            <Link
                href={`?page=${currentPage - 1}`}
                className={`py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold ${
                    currentPage === 1 ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
                }`}
            >
                Prev
            </Link>

            {/* Page buttons */}
            <div className="flex items-center gap-2 text-sm">
                {pages.map((page, idx) =>
                    page === -1 ? (
                        <span key={`dots-${idx}`} className="px-2">
                            ...
                        </span>
                    ) : (
                        <Link
                            key={page}
                            href={`?page=${page}`}
                            className={`px-2 rounded-sm ${
                                page === currentPage ? "bg-[var(--sky-color)] text-white" : ""
                            }`}
                        >
                            {page}
                        </Link>
                    )
                )}
            </div>

            {/* Next button */}
            <Link
                href={`?page=${currentPage + 1}`}
                className={`py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold ${
                    currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed pointer-events-none"
                        : ""
                }`}
            >
                Next
            </Link>
        </div>
    );
};

export default Pagination;
