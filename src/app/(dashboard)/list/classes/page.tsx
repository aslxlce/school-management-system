// import { fetchClasses, IClass } from "@/action/server/class";
// import FormModal from "@/components/FormModal";
// import Pagination from "@/components/Pagination";
// import Table from "@/components/Table";
// import TableSearch from "@/components/TableSearch";
// import { role } from "@/lib/data";
// import Image from "next/image";
// import Link from "next/link";

// interface PageProps {
//     searchParams?: {
//         page?: string;
//     };
// }

// const columns = [
//     { header: "Class Name", accessor: "name" },
//     { header: "Grade", accessor: "grade", className: "hidden md:table-cell" },
//     { header: "Supervisor", accessor: "supervisor", className: "hidden md:table-cell" },
//     { header: "Actions", accessor: "actions" },
// ];

// export default async function ClassListPage({ searchParams }: PageProps) {
//     const pageParam = searchParams?.page ?? "1";
//     const currentPage = parseInt(pageParam, 10);
//     const { data: classes, totalPages } = await fetchClasses(currentPage);

//     const renderRow = (cls: IClass) => {
//         // supervisor may be a string (ID) or populated object
//         const sup = cls.supervisor;
//         const supervisorName =
//             sup && typeof sup !== "string" ? `${sup.name} ${sup.surname}` : "N/A";

//         return (
//             <tr
//                 key={cls.id}
//                 className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[var(--purpleeLight-color)]"
//             >
//                 <td className="p-4">{cls.name}</td>
//                 <td className="hidden md:table-cell">{cls.grade}</td>
//                 <td className="hidden md:table-cell">{supervisorName}</td>
//                 <td>
//                     <div className="flex items-center gap-2">
//                         <Link
//                             href={`/list/classes/${cls.id}`}
//                             className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]"
//                         >
//                             <Image src="/view.png" alt="View" width={14} height={14} />
//                         </Link>
//                         {role === "admin" && (
//                             // delete action omitted because cls.id is string
//                             <FormModal table="class" type="delete" />
//                         )}
//                     </div>
//                 </td>
//             </tr>
//         );
//     };

//     return (
//         <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//             {/* Top Section */}
//             <div className="flex justify-between items-center mb-4">
//                 <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
//                 <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
//                     <TableSearch />
//                     <div className="flex items-center gap-4 self-end">
//                         <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
//                             <Image src="/filter.png" alt="Filter" width={14} height={14} />
//                         </button>
//                         <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
//                             <Image src="/sort.png" alt="Sort" width={14} height={14} />
//                         </button>
//                         {role === "admin" && <FormModal table="class" type="create" />}
//                     </div>
//                 </div>
//             </div>

//             {/* List Table */}
//             <Table columns={columns} renderRow={renderRow} data={classes} />

//             {/* Pagination */}
//             <Pagination currentPage={currentPage} totalPages={totalPages} />
//         </div>
//     );
// }

// app/list/classes/page.tsx

import { fetchClasses, IClass } from "@/action/server/class";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
    searchParams?: {
        page?: string;
    };
}

const columns = [
    { header: "Class Name", accessor: "name" },
    { header: "Grade", accessor: "grade", className: "hidden md:table-cell" },
    {
        header: "Supervisor",
        accessor: "supervisor",
        className: "hidden md:table-cell",
    },
    { header: "Actions", accessor: "actions" },
];

export default async function ClassListPage({ searchParams }: PageProps) {
    const pageParam = searchParams?.page ?? "1";
    const currentPage = parseInt(pageParam, 10);
    const { data: classes, totalPages } = await fetchClasses(currentPage);

    const renderRow = (cls: IClass) => (
        <tr
            key={cls.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[var(--purpleeLight-color)]"
        >
            <td className="p-4">{cls.name}</td>
            <td className="hidden md:table-cell">{cls.grade}</td>
            <td className="hidden md:table-cell">
                {cls.supervisor ? `${cls.supervisor.name} ${cls.supervisor.surname}` : "N/A"}
            </td>
            <td>
                <div className="flex items-center gap-2">
                    <Link
                        href={`/list/classes/${cls.id}`}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]"
                    >
                        <Image src="/view.png" alt="View" width={14} height={14} />
                    </Link>
                    {role === "admin" && (
                        <FormModal table="class" type="delete" id={parseInt(cls.id, 10)} />
                    )}
                </div>
            </td>
        </tr>
    );

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            <div className="flex justify-between items-center mb-4">
                <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
                            <Image src="/filter.png" alt="Filter" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
                            <Image src="/sort.png" alt="Sort" width={14} height={14} />
                        </button>
                        {role === "admin" && <FormModal table="class" type="create" />}
                    </div>
                </div>
            </div>

            <Table columns={columns} renderRow={renderRow} data={classes} />

            <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
    );
}
