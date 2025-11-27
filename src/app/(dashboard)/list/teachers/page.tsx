// // app/list/teachers/page.tsx

// export const dynamic = "force-dynamic";

// import Image from "next/image";
// import Pagination from "@/components/Pagination";
// import Table from "@/components/Table";
// import { fetchTeachers } from "@/action/server/teacher";
// import FormModal from "@/components/FormModal";
// import { getSession } from "@/lib/auth";

// const columns = [
//     { header: "Info", accessor: "info" },
//     { header: "Username", accessor: "username", className: "hidden md:table-cell" },
//     { header: "Subject", accessor: "subject", className: "hidden md:table-cell" },
//     { header: "Grade Level", accessor: "gradeLevel", className: "hidden lg:table-cell" },
//     { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
//     { header: "Sex", accessor: "sex", className: "hidden lg:table-cell" },
//     { header: "Birthday", accessor: "birthday", className: "hidden lg:table-cell" },
//     { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
//     { header: "Actions", accessor: "actions" },
// ];

// type IUserTeacher = {
//     id: string;
//     username: string;
//     name: string;
//     surname: string;
//     email?: string;
//     subject: string;
//     gradeLevel: string;
//     phone: string;
//     sex: string;
//     birthday: string;
//     address: string;
//     img?: string;
// };

// export default async function TeachersPage({
//     searchParams,
// }: {
//     // Next.js now provides this as a Promise
//     searchParams: Promise<Record<string, string | string[] | undefined>>;
// }) {
//     // 1) Await searchParams and parse current page
//     const resolvedSearchParams = await searchParams;
//     const pageRaw = resolvedSearchParams.page;

//     const currentPage = Array.isArray(pageRaw)
//         ? parseInt(pageRaw[0] || "1", 10)
//         : parseInt(pageRaw || "1", 10);

//     const limit = 10;

//     // 2) Fetch session and paginated teachers data in parallel
//     const [session, teacherData] = await Promise.all([
//         getSession(),
//         fetchTeachers(currentPage, limit),
//     ]);

//     const { data: teachers, totalPages } = teacherData;

//     // 3) Render each teacher row
//     const renderRow = (teacher: IUserTeacher) => (
//         <tr
//             key={teacher.id}
//             className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[var(--purpleeLight-color)]"
//         >
//             <td className="flex items-center gap-4 p-4">
//                 <Image
//                     src={
//                         typeof teacher.img === "string" && teacher.img.startsWith("/")
//                             ? teacher.img
//                             : "/default-avatar.jpg"
//                     }
//                     alt="Teacher"
//                     width={40}
//                     height={40}
//                     className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
//                 />
//                 <div className="flex flex-col">
//                     <h3 className="font-semibold">{`${teacher.name} ${teacher.surname}`}</h3>
//                     <p className="text-xs text-gray-500">{teacher.email}</p>
//                 </div>
//             </td>
//             <td className="hidden md:table-cell">{teacher.username}</td>
//             <td className="hidden md:table-cell">{teacher.subject}</td>
//             <td className="hidden lg:table-cell capitalize">{teacher.gradeLevel}</td>
//             <td className="hidden lg:table-cell">{teacher.phone}</td>
//             <td className="hidden lg:table-cell capitalize">{teacher.sex}</td>
//             <td className="hidden lg:table-cell">
//                 {new Date(teacher.birthday).toLocaleDateString()}
//             </td>
//             <td className="hidden lg:table-cell">{teacher.address}</td>
//             <td>
//                 <div className="flex items-center gap-2">
//                     <a href={`/list/teachers/${teacher.id}`}>
//                         <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[var(--sky-color)]">
//                             <Image src="/view.png" alt="View" width={16} height={16} />
//                         </button>
//                     </a>
//                     {session?.role === "admin" && (
//                         <FormModal table="teacher" type="delete" id={parseInt(teacher.id, 10)} />
//                     )}
//                 </div>
//             </td>
//         </tr>
//     );

//     return (
//         <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//             <div className="flex justify-between items-center mb-4">
//                 <h1 className="text-lg font-semibold">All Teachers</h1>
//                 <div className="flex items-center gap-4">
//                     <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
//                         <Image src="/filter.png" alt="Filter" width={14} height={14} />
//                     </button>
//                     <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
//                         <Image src="/sort.png" alt="Sort" width={14} height={14} />
//                     </button>
//                     {session?.role === "admin" && <FormModal table="teacher" type="create" />}
//                 </div>
//             </div>

//             {Array.isArray(teachers) && (
//                 <Table<IUserTeacher> columns={columns} renderRow={renderRow} data={teachers} />
//             )}

//             <Pagination currentPage={currentPage} totalPages={totalPages} />
//         </div>
//     );
// }

// app/list/teachers/page.tsx

export const dynamic = "force-dynamic";

import Image from "next/image";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { fetchTeachers } from "@/action/server/teacher";
import FormModal from "@/components/FormModal";
import { getSession } from "@/lib/auth";

const columns = [
    { header: "Info", accessor: "info" },
    { header: "Username", accessor: "username", className: "hidden md:table-cell" },
    { header: "Subject", accessor: "subject", className: "hidden md:table-cell" },
    { header: "Grade Level", accessor: "gradeLevel", className: "hidden lg:table-cell" },
    { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
    { header: "Sex", accessor: "sex", className: "hidden lg:table-cell" },
    { header: "Birthday", accessor: "birthday", className: "hidden lg:table-cell" },
    { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
    { header: "Actions", accessor: "actions" },
];

type IUserTeacher = {
    id: string;
    username: string;
    name: string;
    surname: string;
    email?: string;
    subject: string;
    gradeLevel: string;
    phone: string;
    sex: string;
    birthday: string;
    address: string;
    img?: string;
};

export default async function TeachersPage({
    searchParams,
}: {
    // Next.js now provides this as a Promise
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    // 1) Await session first and block non-admins
    const session = await getSession();
    const role = session?.role;

    if (!session || role !== "admin") {
        return (
            <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                <h1 className="text-lg font-semibold mb-2">Teachers</h1>
                <p className="text-sm text-gray-500">
                    You don&apos;t have permission to view the teachers list.
                </p>
            </div>
        );
    }

    // 2) Await searchParams and parse current page
    const resolvedSearchParams = await searchParams;
    const pageRaw = resolvedSearchParams.page;

    const currentPage = Array.isArray(pageRaw)
        ? parseInt(pageRaw[0] || "1", 10)
        : parseInt(pageRaw || "1", 10);

    const limit = 10;

    // 3) Fetch paginated teachers data
    const teacherData = await fetchTeachers(currentPage, limit);
    const { data: teachers, totalPages } = teacherData;

    // 4) Render each teacher row
    const renderRow = (teacher: IUserTeacher) => (
        <tr
            key={teacher.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[var(--purpleeLight-color)]"
        >
            <td className="flex items-center gap-4 p-4">
                <Image
                    src={
                        typeof teacher.img === "string" && teacher.img.startsWith("/")
                            ? teacher.img
                            : "/default-avatar.jpg"
                    }
                    alt="Teacher"
                    width={40}
                    height={40}
                    className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                    <h3 className="font-semibold">{`${teacher.name} ${teacher.surname}`}</h3>
                    <p className="text-xs text-gray-500">{teacher.email}</p>
                </div>
            </td>
            <td className="hidden md:table-cell">{teacher.username}</td>
            <td className="hidden md:table-cell">{teacher.subject}</td>
            <td className="hidden lg:table-cell capitalize">{teacher.gradeLevel}</td>
            <td className="hidden lg:table-cell">{teacher.phone}</td>
            <td className="hidden lg:table-cell capitalize">{teacher.sex}</td>
            <td className="hidden lg:table-cell">
                {new Date(teacher.birthday).toLocaleDateString()}
            </td>
            <td className="hidden lg:table-cell">{teacher.address}</td>
            <td>
                <div className="flex items-center gap-2">
                    <a href={`/list/teachers/${teacher.id}`}>
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[var(--sky-color)]">
                            <Image src="/view.png" alt="View" width={16} height={16} />
                        </button>
                    </a>
                    {/* Admin can delete */}
                    <FormModal
                        table="teacher"
                        type="delete"
                        // if FormModal expects string IDs now, change this to: id={teacher.id}
                        id={parseInt(teacher.id, 10)}
                    />
                </div>
            </td>
        </tr>
    );

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-semibold">All Teachers</h1>
                {/* Only admin (we already know it is) → create button, no filter/sort */}
                <FormModal table="teacher" type="create" />
            </div>

            {Array.isArray(teachers) && (
                <Table<IUserTeacher> columns={columns} renderRow={renderRow} data={teachers} />
            )}

            <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
    );
}
