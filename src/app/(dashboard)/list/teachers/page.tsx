export const dynamic = "force-dynamic";

import Image from "next/image";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { fetchTeachers } from "@/action/server/teacher";
import FormModal from "@/components/FormModal";
import { getSession } from "@/lib/auth";
import type { IUserTeacher } from "@/types/user";

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

export default async function TeachersPage({
    searchParams,
}: {
    // Next.js provides this as a Promise
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    // 1. Verify session
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

    // 2. Resolve search params + parse page
    const resolvedSearchParams = await searchParams;
    const pageRaw = resolvedSearchParams.page;

    const currentPage = Array.isArray(pageRaw)
        ? parseInt(pageRaw[0] || "1", 10)
        : parseInt(pageRaw || "1", 10);

    const limit = 10;

    // 3. Fetch data
    const teacherData = await fetchTeachers(currentPage, limit);
    const { data: teachers, totalPages } = teacherData;

    // 4. Render each teacher row
    const renderRow = (teacher: IUserTeacher) => {
        const avatarSrc =
            typeof teacher.img === "string" && teacher.img.trim() !== ""
                ? teacher.img
                : "/default-avatar.jpg"; // Always a string → no TS error

        return (
            <tr
                key={teacher.id}
                className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[var(--purpleeLight-color)]"
            >
                <td className="flex items-center gap-4 p-4">
                    <Image
                        src={avatarSrc}
                        alt="Teacher"
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
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

                        <FormModal table="teacher" type="delete" id={teacher.id} />
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-semibold">All Teachers</h1>
                <FormModal table="teacher" type="create" />
            </div>

            {Array.isArray(teachers) && (
                <Table<IUserTeacher> columns={columns} renderRow={renderRow} data={teachers} />
            )}

            <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
    );
}

// // src/app/dashboard/list/teachers/[id]/page.tsx
// export const dynamic = "force-dynamic";

// import Image from "next/image";
// import Link from "next/link";
// import { notFound } from "next/navigation";
// import Announcements from "@/components/Announcements";
// import BigCalendar from "@/components/BigCalendar";
// import FormModal from "@/components/FormModal";
// import { fetchTeacherById } from "@/action/server/teacher";

// interface PageProps {
//     params: Promise<{ id: string }>;
// }

// export default async function SingleTeacherPage(props: PageProps) {
//     const { id } = await props.params;

//     const teacher = await fetchTeacherById(id);
//     if (!teacher) notFound();

//     return (
//         <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
//             {/* Left */}
//             <div className="w-full xl:w-2/3">
//                 {/* Header */}
//                 <div className="flex flex-col gap-4 lg:flex-row">
//                     {/* Profile Card */}
//                     <div className="bg-[var(--sky-color)] py-6 px-4 rounded-md flex-1 flex gap-4">
//                         <div className="w-1/3">
//                             <Image
//                                 src={teacher.img || "/default-avatar.jpg"}
//                                 alt={`${teacher.name} ${teacher.surname}`}
//                                 width={144}
//                                 height={144}
//                                 className="w-36 h-36 rounded-full object-cover"
//                             />
//                         </div>
//                         <div className="w-2/3 flex flex-col justify-between gap-4">
//                             <div className="flex items-center gap-4">
//                                 <h1 className="text-xl font-semibold">
//                                     {teacher.name} {teacher.surname}
//                                 </h1>
//                                 <FormModal table="teacher" type="update" data={{ ...teacher }} />
//                             </div>
//                             <p className="text-sm text-gray-500">Teaches {teacher.subject}</p>
//                             <div className="flex flex-wrap gap-2 text-sm font-medium">
//                                 <div className="flex items-center gap-2">
//                                     <Image src="/date.png" alt="Birthday" width={14} height={14} />
//                                     <span>{new Date(teacher.birthday).toLocaleDateString()}</span>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <Image src="/mail.png" alt="Email" width={14} height={14} />
//                                     <span>{teacher.email}</span>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <Image src="/phone.png" alt="Phone" width={14} height={14} />
//                                     <span>{teacher.phone}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Stats Cards */}
//                     <div className="flex-1 flex gap-4 justify-between flex-wrap">
//                         <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%]">
//                             <Image
//                                 src="/singleLesson.png"
//                                 alt="Lessons"
//                                 width={40}
//                                 height={40}
//                                 className="w-10 h-10 object-contain"
//                             />
//                             <div>
//                                 <h1 className="text-xl font-semibold">{teacher.lessonsCount}</h1>
//                                 <span className="text-sm text-gray-400">Lessons</span>
//                             </div>
//                         </div>
//                         <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%]">
//                             <Image
//                                 src="/singleClass.png"
//                                 alt="Classes"
//                                 width={40}
//                                 height={40}
//                                 className="w-10 h-10 object-contain"
//                             />
//                             <div>
//                                 <h1 className="text-xl font-semibold">{teacher.classesCount}</h1>
//                                 <span className="text-sm text-gray-400">Classes</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Calendar */}
//                 <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
//                     <h2 className="text-lg font-semibold mb-2">Teacher’s Schedule</h2>
//                     <BigCalendar events={teacher.scheduleEvents} />
//                 </div>
//             </div>

//             {/* Right Sidebar */}
//             <div className="w-full xl:w-1/3 flex flex-col gap-4">
//                 <div className="bg-white p-4 rounded-md">
//                     <h2 className="text-xl font-semibold">Shortcuts</h2>
//                     <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
//                         <Link
//                             href={`/dashboard/list/teachers/${id}/classes`}
//                             className="p-3 rounded-md bg-[var(--lightSkye-color)]"
//                         >
//                             Classes
//                         </Link>
//                         <Link
//                             href={`/dashboard/list/teachers/${id}/students`}
//                             className="p-3 rounded-md bg-[var(--purpleeLight-color)]"
//                         >
//                             Students
//                         </Link>
//                         <Link
//                             href={`/dashboard/list/teachers/${id}/lessons`}
//                             className="p-3 rounded-md bg-[var(--yellowwLight-color)]"
//                         >
//                             Lessons
//                         </Link>
//                     </div>
//                 </div>
//                 <Announcements />
//             </div>
//         </div>
//     );
// }
