// import FormModal from "@/components/FormModal";
// // import Pagination from "@/components/Pagination";
// import Table from "@/components/Table";
// import TableSearch from "@/components/TableSearch";
// import { role, studentsData } from "@/lib/data";
// import Image from "next/image";
// import Link from "next/link";

// type Student = {
//     id: number;
//     studentId: string;
//     name: string;
//     email?: string;
//     photo: string;
//     phone?: string;
//     grade: number;
//     class: string;
//     adress: string;
// };

// const columns = [
//     {
//         header: "Info",
//         accessor: "info",
//     },
//     {
//         header: "Student ID",
//         accessor: "studentId",
//         className: "hidden md:table-cell",
//     },
//     {
//         header: "Grade",
//         accessor: "grade",
//         className: "hidden md:table-cell",
//     },
//     {
//         header: "Phone",
//         accessor: "phone",
//         className: "hidden lg:table-cell",
//     },
//     {
//         header: "Adress",
//         accessor: "adress",
//         className: "hidden lg:table-cell",
//     },
//     {
//         header: "Actions",
//         accessor: "actions",
//     },
// ];

// const StudentListPage = () => {
//     const renderRow = (item: Student) => (
//         <tr
//             key={item.id}
//             className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[var(--purpleeLight-color)]"
//         >
//             <td className="flex items-center gap-4 p-4">
//                 <Image
//                     src={item.photo}
//                     alt=""
//                     width={40}
//                     height={40}
//                     className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
//                 />
//                 <div className="flex flex-col">
//                     <h3 className="font-semibold">{item.name}</h3>
//                     <p className="text-xs text-gray-500">{item?.class}</p>
//                 </div>
//             </td>
//             <td className="hidden md:table-cell">{item.studentId}</td>
//             <td className="hidden md:table-cell">{item.grade}</td>
//             <td className="hidden md:table-cell">{item.phone}</td>
//             <td className="hidden md:table-cell">{item.adress}</td>
//             <td>
//                 <div className="flex items-center gap-2">
//                     <Link href={`/list/teachers/${item.id}`}>
//                         <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[var(--sky-color)]">
//                             <Image src="/view.png" alt="" width={16} height={16} />
//                         </button>
//                     </Link>
//                     {role === "admin" && (
//                         // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[var(--purplee-color)]">
//                         //     <Image src="/delete.png" alt="" width={16} height={16} />
//                         // </button>
//                         <FormModal table="student" type="delete" id={item.id} />
//                     )}
//                 </div>
//             </td>
//         </tr>
//     );

//     return (
//         <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//             {/* Top  */}
//             <div className="flex justify-between items-center">
//                 <h1 className="hidden md:block text-lg font-semibold">All Students</h1>
//                 <div className="flex flex-col md:flex-row gap-4  w-full md:w-auto">
//                     <TableSearch />
//                     <div className="flex items-center gap-4 self-end">
//                         <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
//                             <Image src="/filter.png" alt="" width={14} height={14} />
//                         </button>
//                         <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
//                             <Image src="/sort.png" alt="" width={14} height={14} />
//                         </button>
//                         {role === "admin" && <FormModal table="student" type="create" />}
//                     </div>
//                 </div>
//             </div>
//             {/* List  */}
//             <Table columns={columns} renderRow={renderRow} data={studentsData} />
//             {/* Pagination  */}
//             {/* <Pagination /> */}
//         </div>
//     );
// };

// export default StudentListPage;

import Image from "next/image";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { fetchStudents } from "@/action/server/student";
import FormModal from "@/components/FormModal";
import { getSession } from "@/lib/auth";
import { IUserStudent } from "@/types/user";

const columns = [
    { header: "Info", accessor: "info" },
    { header: "Grade", accessor: "gradeId", className: "hidden md:table-cell" },
    { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
    { header: "Sex", accessor: "sex", className: "hidden lg:table-cell" },
    { header: "Birthday", accessor: "birthday", className: "hidden lg:table-cell" },
    { header: "Address", accessor: "adress", className: "hidden lg:table-cell" },
    { header: "Actions", accessor: "actions" },
];

interface PageProps {
    searchParams?: Record<string, string | string[] | undefined>;
}

const StudentsPage = async ({ searchParams }: PageProps) => {
    const pageParam = searchParams?.page;
    const currentPage = Array.isArray(pageParam)
        ? parseInt(pageParam[0] || "1", 10)
        : parseInt(pageParam || "1", 10);

    const limit = 10;

    const [session, studentData] = await Promise.all([
        getSession(),
        fetchStudents(currentPage, limit),
    ]);

    const { data: students, totalPages } = studentData;

    const renderRow = (student: IUserStudent) => (
        <tr
            key={student.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[var(--purpleeLight-color)]"
        >
            <td className="flex items-center gap-4 p-4">
                <Image
                    src={
                        typeof student.img === "string" && student.img.startsWith("/")
                            ? student.img
                            : "/default-avatar.jpg"
                    }
                    alt="Student"
                    width={40}
                    height={40}
                    className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                    <h3 className="font-semibold">{`${student.name} ${student.surname}`}</h3>
                    <p className="text-xs text-gray-500">{student.email}</p>
                </div>
            </td>
            <td className="hidden md:table-cell">{student.grade}</td>
            <td className="hidden lg:table-cell">{student.phone}</td>
            <td className="hidden lg:table-cell capitalize">{student.sex}</td>
            <td className="hidden lg:table-cell">
                {new Date(student.birthday).toLocaleDateString()}
            </td>
            <td className="hidden lg:table-cell">{student.address}</td>
            <td>
                <div className="flex items-center gap-2">
                    <a href={`/list/students/${student.id}`}>
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[var(--sky-color)]">
                            <Image src="/view.png" alt="View" width={16} height={16} />
                        </button>
                    </a>
                    {session?.role === "admin" && (
                        <FormModal table="student" type="delete" id={student.id} />
                    )}
                </div>
            </td>
        </tr>
    );

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-semibold">All Students</h1>
                <div className="flex items-center gap-4">
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
                        <Image src="/filter.png" alt="Filter" width={14} height={14} />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
                        <Image src="/sort.png" alt="Sort" width={14} height={14} />
                    </button>
                    {session?.role === "admin" && <FormModal table="student" type="create" />}
                </div>
            </div>

            {Array.isArray(students) && (
                <Table<IUserStudent> columns={columns} renderRow={renderRow} data={students} />
            )}

            <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
    );
};

export default StudentsPage;
