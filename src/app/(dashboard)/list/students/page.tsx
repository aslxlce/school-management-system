// // app/list/students/page.tsx

// export const dynamic = "force-dynamic";

// import React from "react";
// import Image from "next/image";

// import Pagination from "@/components/Pagination";
// import Table from "@/components/Table";
// import FormModal from "@/components/FormModal";

// import { fetchStudents } from "@/action/server/student";
// import { getSession } from "@/lib/auth";
// import type { IUserStudent } from "@/types/user";

// const columns = [
//     { header: "Info", accessor: "info" },
//     { header: "Username", accessor: "username", className: "hidden md:table-cell" },
//     { header: "Grade", accessor: "grade", className: "hidden lg:table-cell" },
//     { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
//     { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
//     { header: "Actions", accessor: "actions" },
// ];

// export default async function StudentsPage({
//     searchParams,
// }: {
//     searchParams: Promise<Record<string, string | string[] | undefined>>;
// }) {
//     // 1) Await searchParams before using `.page`
//     const resolvedSearchParams = await searchParams;
//     const pageRaw = resolvedSearchParams.page;

//     const currentPage = Array.isArray(pageRaw)
//         ? parseInt(pageRaw[0] || "1", 10)
//         : parseInt(pageRaw || "1", 10);

//     const limit = 10;

//     // 2) Fetch session + students
//     const [session, studentData] = await Promise.all([
//         getSession(),
//         fetchStudents(currentPage, limit),
//     ]);

//     const { data: students, totalPages } = studentData;
//     const role = session?.role;

//     const renderRow = (student: IUserStudent) => (
//         <tr
//             key={student.id}
//             className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[var(--purpleeLight-color)]"
//         >
//             <td className="flex items-center gap-4 p-4">
//                 <Image
//                     src={
//                         typeof student.img === "string" && student.img.startsWith("/")
//                             ? student.img
//                             : "/default-avatar.jpg"
//                     }
//                     alt="Student"
//                     width={40}
//                     height={40}
//                     className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
//                 />
//                 <div className="flex flex-col">
//                     <h3 className="font-semibold">{`${student.name} ${student.surname}`}</h3>
//                     <p className="text-xs text-gray-500">{student.email}</p>
//                 </div>
//             </td>

//             <td className="hidden md:table-cell">{student.username}</td>
//             <td className="hidden lg:table-cell">{student.grade}</td>
//             <td className="hidden lg:table-cell">{student.phone ?? "—"}</td>
//             <td className="hidden lg:table-cell">{student.address}</td>

//             <td>
//                 <div className="flex items-center gap-2">
//                     {/* view button */}
//                     <a href={`/list/students/${student.id}`}>
//                         <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[var(--sky-color)]">
//                             <Image src="/view.png" alt="View" width={16} height={16} />
//                         </button>
//                     </a>

//                     {role === "admin" && (
//                         <FormModal table="student" type="delete" id={student.id} />
//                     )}
//                 </div>
//             </td>
//         </tr>
//     );

//     return (
//         <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//             <div className="flex justify-between items-center mb-4">
//                 <h1 className="text-lg font-semibold">All Students</h1>
//                 <div className="flex items-center gap-4">
//                     <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
//                         <Image src="/filter.png" alt="Filter" width={14} height={14} />
//                     </button>
//                     <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
//                         <Image src="/sort.png" alt="Sort" width={14} height={14} />
//                     </button>
//                     {role === "admin" && <FormModal table="student" type="create" />}
//                 </div>
//             </div>

//             {Array.isArray(students) && (
//                 <Table<IUserStudent> columns={columns} renderRow={renderRow} data={students} />
//             )}

//             <Pagination currentPage={currentPage} totalPages={totalPages} />
//         </div>
//     );
// }

// app/dashboard/list/students/page.tsx

export const dynamic = "force-dynamic";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import FormModal from "@/components/FormModal";

import { fetchStudents } from "@/action/server/student";
import { getSession } from "@/lib/auth";
import type { IUserStudent } from "@/types/user";

const columns = [
    { header: "Info", accessor: "info" },
    { header: "Username", accessor: "username", className: "hidden md:table-cell" },
    { header: "Grade", accessor: "grade", className: "hidden lg:table-cell" },
    { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
    { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
    { header: "Actions", accessor: "actions" },
];

export default async function StudentsPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const resolvedSearchParams = await searchParams;
    const rawPage = resolvedSearchParams.page;

    const currentPage = Array.isArray(rawPage)
        ? parseInt(rawPage[0] || "1", 10)
        : parseInt(rawPage || "1", 10);

    const limit = 10;

    const [session, studentData] = await Promise.all([
        getSession(),
        fetchStudents(currentPage, limit),
    ]);

    const { data: students, totalPages } = studentData;
    const role = session?.role;

    const renderRow = (student: IUserStudent) => {
        const img: string = student.img ?? "";

        const isValidImg =
            img.startsWith("/") ||
            img.startsWith("http://") ||
            img.startsWith("https://") ||
            img.startsWith("data:");

        const avatarSrc: string = isValidImg ? img : "/default-avatar.jpg";

        return (
            <tr
                key={student.id}
                className="border-b border-gray-200 bg-white text-sm hover:bg-slate-100"
            >
                {/* Info */}
                <td className="flex items-center gap-4 p-4">
                    <Image
                        src={avatarSrc}
                        alt="Student"
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                    />

                    <div className="flex flex-col">
                        <h3 className="font-semibold">
                            {student.name} {student.surname}
                        </h3>
                        <p className="text-xs text-gray-500">{student.email}</p>
                    </div>
                </td>

                <td className="hidden md:table-cell">{student.username}</td>
                <td className="hidden lg:table-cell">{student.grade}</td>
                <td className="hidden lg:table-cell">{student.phone ?? "—"}</td>
                <td className="hidden lg:table-cell">{student.address}</td>

                {/* Actions */}
                <td>
                    <div className="flex items-center gap-2">
                        {/* View single student */}
                        <Link href={`/list/students/${student.id}`}>
                            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[var(--sky-color)]">
                                <Image src="/view.png" alt="View" width={16} height={16} />
                            </button>
                        </Link>

                        {/* Delete only for admin */}
                        {role === "admin" && (
                            <FormModal table="student" type="delete" id={student.id} />
                        )}
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-semibold">All Students</h1>
                {role === "admin" && <FormModal table="student" type="create" />}
            </div>

            {/* Table */}
            {Array.isArray(students) && (
                <Table<IUserStudent> columns={columns} renderRow={renderRow} data={students} />
            )}

            <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
    );
}
