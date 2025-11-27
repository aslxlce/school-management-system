// // app/list/classes/page.tsx

// export const dynamic = "force-dynamic";

// import Image from "next/image";
// import Link from "next/link";

// import { fetchClasses, IClass } from "@/action/server/class";
// import FormModal from "@/components/FormModal";
// import Pagination from "@/components/Pagination";
// import Table from "@/components/Table";
// import TableSearch from "@/components/TableSearch";
// import { getSession } from "@/lib/auth";

// interface PageProps {
//     // searchParams is now a Promise in Next 15+
//     searchParams: Promise<{
//         page?: string;
//     }>;
// }

// // Locally extend IClass to include teacherIds for teacher filtering
// interface IClassWithTeacherIds extends IClass {
//     teacherIds?: { id: string }[];
// }

// const columns = [
//     { header: "Class Name", accessor: "name" },
//     { header: "Grade", accessor: "grade", className: "hidden md:table-cell" },
//     {
//         header: "Supervisor",
//         accessor: "supervisor",
//         className: "hidden md:table-cell",
//     },
//     { header: "Actions", accessor: "actions" },
// ];

// export default async function ClassListPage({ searchParams }: PageProps) {
//     // resolve page
//     const resolvedSearchParams = await searchParams;
//     const pageParam = resolvedSearchParams.page ?? "1";
//     const currentPage = Number.parseInt(pageParam, 10) || 1;

//     // ─────────────────────────────────────
//     // Session & role
//     // ─────────────────────────────────────
//     const session = await getSession();
//     const role = session?.role;
//     const userId = session?.id;

//     const isAdmin = role === "admin";
//     const isTeacher = role === "teacher";
//     const isStudentOrParent = role === "student" || role === "parent";

//     // Students & parents: not allowed to see classes page
//     if (!session || isStudentOrParent) {
//         return (
//             <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//                 <h1 className="text-lg font-semibold mb-2">Classes</h1>
//                 <p className="text-sm text-gray-500">
//                     You don&apos;t have permission to view the classes list.
//                 </p>
//             </div>
//         );
//     }

//     // ─────────────────────────────────────
//     // Fetch classes
//     // ─────────────────────────────────────
//     const { data, totalPages: totalPagesInitial } = await fetchClasses(currentPage);
//     const allClasses = data as IClassWithTeacherIds[];

//     // Admin → all classes (keep pagination)
//     // Teacher → only classes where they teach, no pagination (single page)
//     let classesToShow: IClassWithTeacherIds[] = [];
//     let totalPages = totalPagesInitial;

//     if (isAdmin) {
//         classesToShow = allClasses;
//     } else if (isTeacher && userId) {
//         classesToShow = allClasses.filter((cls) =>
//             Array.isArray(cls.teacherIds) ? cls.teacherIds.some((t) => t.id === userId) : false
//         );
//         totalPages = 1; // we filtered in memory; treat as single-page list
//     }

//     const renderRow = (cls: IClassWithTeacherIds) => (
//         <tr
//             key={cls.id}
//             className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[var(--purpleeLight-color)]"
//         >
//             <td className="p-4">{cls.name}</td>
//             <td className="hidden md:table-cell">{cls.grade}</td>
//             <td className="hidden md:table-cell">
//                 {cls.supervisor ? `${cls.supervisor.name} ${cls.supervisor.surname}` : "N/A"}
//             </td>
//             <td>
//                 <div className="flex items-center gap-2">
//                     <Link
//                         href={`/list/classes/${cls.id}`}
//                         className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]"
//                     >
//                         <Image src="/view.png" alt="View" width={14} height={14} />
//                     </Link>

//                     {/* Optional: keep delete only for admin if FormModal supports it */}
//                     {isAdmin && (
//                         <FormModal
//                             table="class"
//                             type="delete"
//                             // if your FormModal now expects string IDs, pass cls.id directly
//                             id={cls.id as unknown as number}
//                         />
//                     )}
//                 </div>
//             </td>
//         </tr>
//     );

//     return (
//         <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//             <div className="flex justify-between items-center mb-4">
//                 <h1 className="hidden md:block text-lg font-semibold">Classes</h1>
//                 <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
//                     <TableSearch />
//                     <div className="flex items-center gap-4 self-end">
//                         <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
//                             <Image src="/filter.png" alt="Filter" width={14} height={14} />
//                         </button>
//                         <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
//                             <Image src="/sort.png" alt="Sort" width={14} height={14} />
//                         </button>

//                         {/* Only admin can create classes */}
//                         {isAdmin && <FormModal table="class" type="create" />}
//                     </div>
//                 </div>
//             </div>

//             <Table<IClassWithTeacherIds>
//                 columns={columns}
//                 renderRow={renderRow}
//                 data={classesToShow}
//             />

//             <Pagination currentPage={currentPage} totalPages={totalPages} />
//         </div>
//     );
// }

// app/list/classes/page.tsx

export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";

import { fetchClasses, IClass } from "@/action/server/class";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { getSession } from "@/lib/auth";

interface PageProps {
    // searchParams is now a Promise in Next 15+
    searchParams: Promise<{
        page?: string;
    }>;
}

// Locally extend IClass to include teacherIds for teacher filtering
interface IClassWithTeacherIds extends IClass {
    teacherIds?: { id: string }[];
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
    // resolve page
    const resolvedSearchParams = await searchParams;
    const pageParam = resolvedSearchParams.page ?? "1";
    const currentPage = Number.parseInt(pageParam, 10) || 1;

    // ─────────────────────────────────────
    // Session & role
    // ─────────────────────────────────────
    const session = await getSession();
    const role = session?.role;
    const userId = session?.id;

    const isAdmin = role === "admin";
    const isTeacher = role === "teacher";
    const isStudentOrParent = role === "student" || role === "parent";

    // Students & parents: not allowed to see classes page
    if (!session || isStudentOrParent) {
        return (
            <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                <h1 className="text-lg font-semibold mb-2">Classes</h1>
                <p className="text-sm text-gray-500">
                    You don&apos;t have permission to view the classes list.
                </p>
            </div>
        );
    }

    // ─────────────────────────────────────
    // Fetch classes
    // ─────────────────────────────────────
    const { data, totalPages: totalPagesInitial } = await fetchClasses(
        currentPage,
        isTeacher ? 100 : 5 // teacher: fetch many, admin: normal pagination
    );
    const allClasses = data as IClassWithTeacherIds[];

    // Admin → all classes (keep pagination)
    // Teacher → only classes where they teach, no pagination (single page)
    let classesToShow: IClassWithTeacherIds[] = [];
    let totalPages = totalPagesInitial;

    if (isAdmin) {
        classesToShow = allClasses;
    } else if (isTeacher && userId) {
        classesToShow = allClasses.filter((cls) =>
            Array.isArray(cls.teacherIds) ? cls.teacherIds.some((t) => t.id === userId) : false
        );
        totalPages = 1; // filtered in memory; treat as single-page list
    }

    const renderRow = (cls: IClassWithTeacherIds) => (
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

                    {/* Optional: keep delete only for admin if FormModal supports it */}
                    {isAdmin && (
                        <FormModal
                            table="class"
                            type="delete"
                            // adjust if your FormModal expects a string id instead of number
                            id={cls.id as unknown as number}
                        />
                    )}
                </div>
            </td>
        </tr>
    );

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-semibold">Classes</h1>

                {/* Only admin can create classes */}
                {isAdmin && <FormModal table="class" type="create" />}
            </div>

            <Table<IClassWithTeacherIds>
                columns={columns}
                renderRow={renderRow}
                data={classesToShow}
            />

            <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
    );
}
