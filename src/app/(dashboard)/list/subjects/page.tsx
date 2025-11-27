// // app/list/subjects/page.tsx

// export const dynamic = "force-dynamic";

// import Image from "next/image";
// import Link from "next/link";

// import Table from "@/components/Table";
// import Pagination from "@/components/Pagination";
// import TableSearch from "@/components/TableSearch";
// import { fetchSubjects, ISubjectRow } from "@/action/server/subject";
// import { getSession } from "@/lib/auth";

// interface PageProps {
//     // Next 15+: searchParams is async — match what you did on other list pages
//     searchParams: Promise<{ page?: string }>;
// }

// const columns = [
//     { header: "Subject Name", accessor: "name" },
//     {
//         header: "Teachers",
//         accessor: "teachers",
//         className: "hidden md:table-cell",
//     },
//     {
//         header: "Actions",
//         accessor: "actions",
//     },
// ];

// export default async function SubjectListPage({ searchParams }: PageProps) {
//     const resolved = await searchParams;
//     const pageParam = resolved.page ?? "1";
//     const currentPage = Number.parseInt(pageParam, 10) || 1;
//     const limit = 10;

//     const [session, subjectData] = await Promise.all([
//         getSession(),
//         fetchSubjects(currentPage, limit),
//     ]);

//     const { data: subjects, totalPages } = subjectData;
//     const role = session?.role;

//     const renderRow = (item: ISubjectRow) => (
//         <tr
//             key={item.name}
//             className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[var(--purpleeLight-color)]"
//         >
//             {/* Subject name → link to subject details page */}
//             <td className="flex items-center gap-4 p-4">
//                 <Link
//                     href={`/list/subjects/${encodeURIComponent(item.name)}`}
//                     className="hover:underline"
//                 >
//                     {item.name}
//                 </Link>
//             </td>

//             {/* Teachers list / count */}
//             <td className="hidden md:table-cell">
//                 {item.teacherNames.length ? item.teacherNames.join(", ") : "No teachers"}
//             </td>

//             {/* Actions (currently only "view"; you can add more later) */}
//             <td>
//                 <div className="flex items-center gap-2">
//                     <Link
//                         href={`/list/subjects/${encodeURIComponent(item.name)}`}
//                         className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]"
//                     >
//                         <Image src="/view.png" alt="View" width={14} height={14} />
//                     </Link>

//                     {/* If you still have a Subject model + FormModal, keep this.
//                        If not, you can safely remove these lines. */}
//                     {role === "admin" && (
//                         <>
//                             {/* <FormModal table="subject" type="update" data={item as any} /> */}
//                             {/* <FormModal table="subject" type="delete" id={item.id} /> */}
//                         </>
//                     )}
//                 </div>
//             </td>
//         </tr>
//     );

//     return (
//         <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//             {/* Top bar */}
//             <div className="flex justify-between items-center">
//                 <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
//                 <div className="flex flex-col md:flex-row gap-4  w-full md:w-auto">
//                     <TableSearch />
//                     <div className="flex items-center gap-4 self-end">
//                         <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
//                             <Image src="/filter.png" alt="Filter" width={14} height={14} />
//                         </button>
//                         <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
//                             <Image src="/sort.png" alt="Sort" width={14} height={14} />
//                         </button>
//                         {/* If you later add a real Subject CRUD, you can re-enable create */}
//                         {/* {role === "admin" && <FormModal table="subject" type="create" />} */}
//                     </div>
//                 </div>
//             </div>

//             {/* Subjects table */}
//             <Table<ISubjectRow>
//                 columns={columns}
//                 renderRow={renderRow}
//                 data={subjects ?? []} // ✅ always an array
//             />

//             {/* Pagination */}
//             <Pagination currentPage={currentPage} totalPages={totalPages} />
//         </div>
//     );
// }

// app/list/subjects/page.tsx

export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";

import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import { fetchSubjects, ISubjectRow } from "@/action/server/subject";
import { getSession } from "@/lib/auth";

interface PageProps {
    // Next 15+: searchParams is async — match what you did on other list pages
    searchParams: Promise<{ page?: string }>;
}

const columns = [
    { header: "Subject Name", accessor: "name" },
    {
        header: "Teachers",
        accessor: "teachers",
        className: "hidden md:table-cell",
    },
    {
        header: "Actions",
        accessor: "actions",
    },
];

export default async function SubjectListPage({ searchParams }: PageProps) {
    const resolved = await searchParams;
    const pageParam = resolved.page ?? "1";
    const currentPage = Number.parseInt(pageParam, 10) || 1;
    const limit = 10;

    const [session, subjectData] = await Promise.all([
        getSession(),
        fetchSubjects(currentPage, limit),
    ]);

    const { data: subjects, totalPages } = subjectData;
    const role = session?.role;

    // Restrict students from accessing this page
    if (!session || role === "student") {
        return (
            <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                <h1 className="text-lg font-semibold mb-2">Subjects</h1>
                <p className="text-sm text-gray-500">
                    You don&apos;t have permission to view the subjects list.
                </p>
            </div>
        );
    }

    const renderRow = (item: ISubjectRow) => (
        <tr
            key={item.name}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[var(--purpleeLight-color)]"
        >
            {/* Subject name → link to subject details page */}
            <td className="flex items-center gap-4 p-4">
                <Link
                    href={`/list/subjects/${encodeURIComponent(item.name)}`}
                    className="hover:underline"
                >
                    {item.name}
                </Link>
            </td>

            {/* Teachers list / count */}
            <td className="hidden md:table-cell">
                {item.teacherNames.length ? item.teacherNames.join(", ") : "No teachers"}
            </td>

            {/* Actions (currently only "view") */}
            <td>
                <div className="flex items-center gap-2">
                    <Link
                        href={`/list/subjects/${encodeURIComponent(item.name)}`}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]"
                    >
                        <Image src="/view.png" alt="View" width={14} height={14} />
                    </Link>

                    {/* If you later add a real Subject CRUD, you can re-enable admin actions here */}
                    {/* {role === "admin" && (
                        <>
                            <FormModal table="subject" type="update" data={item as any} />
                            <FormModal table="subject" type="delete" id={item.id} />
                        </>
                    )} */}
                </div>
            </td>
        </tr>
    );

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* Top bar (no search / filter / sort) */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
            </div>

            {/* Subjects table */}
            <Table<ISubjectRow>
                columns={columns}
                renderRow={renderRow}
                data={subjects ?? []} // ✅ always an array
            />

            {/* Pagination */}
            <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
    );
}
