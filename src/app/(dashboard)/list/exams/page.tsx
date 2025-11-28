// // src/app/list/exams/page.tsx

// export const dynamic = "force-dynamic";

// import Image from "next/image";
// import Link from "next/link";
// import { redirect } from "next/navigation";

// import { fetchClasses, fetchClassById, IClass } from "@/action/server/class";
// import Table from "@/components/Table";
// import Pagination from "@/components/Pagination";
// import ExamModal from "@/components/ExamModal";
// import { getSession } from "@/lib/auth";
// import { gradeLessonMap } from "@/lib/gradeLessons";

// // ─────────────────────────────────────────────
// // Types
// // ─────────────────────────────────────────────

// interface PageSearchParams {
//     page?: string;
// }

// interface PageProps {
//     searchParams: Promise<PageSearchParams>;
// }

// interface IClassWithRelations extends IClass {
//     teacherIds?: { id: string; name?: string; surname?: string }[];
//     supervisor?: { id: string; name: string; surname: string };
// }

// const columns = [
//     { header: "Class", accessor: "name" },
//     { header: "Grade", accessor: "grade", className: "hidden md:table-cell" },
//     {
//         header: "Supervisor",
//         accessor: "supervisor",
//         className: "hidden lg:table-cell",
//     },
//     { header: "Exams", accessor: "exams" },
// ];

// // ─────────────────────────────────────────────
// // Page
// // ─────────────────────────────────────────────

// export default async function ExamListPage({ searchParams }: PageProps) {
//     const { page: pageParam } = await searchParams;
//     const currentPage = Number.parseInt(pageParam ?? "1", 10);

//     const session = await getSession();
//     if (!session) redirect("/login");

//     const role = session.role;
//     const userId = session.id;
//     const userClassId = session.classId;

//     let classes: IClassWithRelations[] = [];
//     let totalPages = 1;

//     // ─────────────────────────────────────
//     // ADMIN → all classes (paginated)
//     // ─────────────────────────────────────
//     if (role === "admin") {
//         const { data, totalPages: tp } = await fetchClasses(currentPage);
//         classes = data as IClassWithRelations[];
//         totalPages = tp;
//     }

//     // ─────────────────────────────────────
//     // STUDENT/PARENT → only their class
//     // ─────────────────────────────────────
//     else if (role === "student" || role === "parent") {
//         if (userClassId) {
//             const cls = await fetchClassById(userClassId);
//             if (cls) {
//                 classes = [
//                     {
//                         id: cls.id,
//                         name: cls.name,
//                         grade: cls.grade,
//                         supervisor: cls.supervisor
//                             ? {
//                                   id: cls.supervisor.id,
//                                   name: cls.supervisor.name,
//                                   surname: cls.supervisor.surname,
//                               }
//                             : undefined,
//                         teacherIds: cls.teacherIds.map((t) => ({ id: t.id })),
//                     },
//                 ];
//             }
//         }
//         totalPages = 1;
//     }

//     // ─────────────────────────────────────
//     // TEACHER → classes they teach
//     // ─────────────────────────────────────
//     else if (role === "teacher") {
//         const { data } = await fetchClasses(1, 100);
//         const allClasses = data as IClassWithRelations[];

//         classes = allClasses.filter((c) =>
//             Array.isArray(c.teacherIds) ? c.teacherIds.some((t) => t.id === userId) : false
//         );

//         totalPages = 1;
//     }

//     // ─────────────────────────────────────
//     // OTHERS → no access
//     // ─────────────────────────────────────
//     else {
//         return (
//             <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//                 <p className="text-sm text-red-500">You do not have access to exam schedules.</p>
//             </div>
//         );
//     }

//     const canCreateExams = role === "admin";

//     const renderRow = (cls: IClassWithRelations) => {
//         const gradeKey = String(cls.grade);
//         const subjectsForClass: string[] = (gradeLessonMap[gradeKey] ?? []).map((s: string) =>
//             String(s)
//         );

//         return (
//             <tr
//                 key={cls.id}
//                 className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[var(--purpleeLight-color)]"
//             >
//                 <td className="p-4">
//                     <div className="flex flex-col">
//                         <span className="font-medium">{cls.name}</span>
//                         <span className="text-xs text-gray-500">Grade {cls.grade}</span>
//                     </div>
//                 </td>

//                 <td className="hidden md:table-cell">{cls.grade}</td>

//                 <td className="hidden lg:table-cell">
//                     {cls.supervisor ? (
//                         <Link
//                             href={`/list/teachers/${cls.supervisor.id}`}
//                             className="text-indigo-600 hover:underline"
//                         >
//                             {cls.supervisor.name} {cls.supervisor.surname}
//                         </Link>
//                     ) : (
//                         "N/A"
//                     )}
//                 </td>

//                 <td>
//                     <div className="flex items-center gap-2">
//                         <ExamModal
//                             classId={cls.id}
//                             className={cls.name}
//                             grade={String(cls.grade)}
//                             subjects={subjectsForClass}
//                             canCreateExams={canCreateExams}
//                         />

//                         <Link
//                             href={`/list/classes/${cls.id}`}
//                             className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--sky-color)]"
//                         >
//                             <Image src="/view.png" alt="View class" width={14} height={14} />
//                         </Link>
//                     </div>
//                 </td>
//             </tr>
//         );
//     };

//     return (
//         <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//             {/* Header — CLEANED */}
//             <div className="flex justify-between items-center mb-4">
//                 <h1 className="text-lg font-semibold">Exam Schedules</h1>
//             </div>

//             <Table<IClassWithRelations> columns={columns} renderRow={renderRow} data={classes} />

//             <Pagination currentPage={currentPage} totalPages={totalPages} />
//         </div>
//     );
// }

// src/app/list/exams/page.tsx

export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { fetchClasses, fetchClassById } from "@/action/server/class";
import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import ExamModal from "@/components/ExamModal";
import { getSession } from "@/lib/auth";
import { gradeLessonMap } from "@/lib/gradeLessons";

import type { IClassWithRelations } from "@/types/class";
import type { Grade } from "@/types/user";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface PageSearchParams {
    page?: string;
}

interface PageProps {
    searchParams: Promise<PageSearchParams>;
}

const columns = [
    { header: "Class", accessor: "name" },
    { header: "Grade", accessor: "grade", className: "hidden md:table-cell" },
    {
        header: "Supervisor",
        accessor: "supervisor",
        className: "hidden lg:table-cell",
    },
    { header: "Exams", accessor: "exams" },
];

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

export default async function ExamListPage({ searchParams }: PageProps) {
    const { page: pageParam } = await searchParams;
    const currentPage = Number.parseInt(pageParam ?? "1", 10);

    const session = await getSession();
    if (!session) redirect("/login");

    const role = session.role;
    const userId = session.id;
    const userClassId = session.classId;

    let classes: IClassWithRelations[] = [];
    let totalPages = 1;

    // ─────────────────────────────────────
    // ADMIN → all classes (paginated)
    // ─────────────────────────────────────
    if (role === "admin") {
        const { data, totalPages: tp } = await fetchClasses(currentPage);
        // For now we trust the server action to already conform to IClassWithRelations
        classes = data as IClassWithRelations[];
        totalPages = tp;
    }

    // ─────────────────────────────────────
    // STUDENT/PARENT → only their class
    // ─────────────────────────────────────
    else if (role === "student" || role === "parent") {
        if (userClassId) {
            const cls = await fetchClassById(userClassId);
            if (cls) {
                // Map whatever fetchClassById returns into our canonical view type
                const mapped: IClassWithRelations = {
                    id: cls.id,
                    name: cls.name,
                    // cls.grade is currently string/number → cast into our Grade type
                    grade: cls.grade as Grade,

                    // server returns populated teachers (IUserTeacher[]) → map to IDs
                    teacherIds: Array.isArray(cls.teacherIds)
                        ? cls.teacherIds.map((t) => t.id)
                        : undefined,

                    // server returns populated students (IUserStudent[]) → map to IDs
                    studentIds: Array.isArray(cls.studentIds)
                        ? cls.studentIds.map((s) => s.id)
                        : undefined,

                    supervisorId: cls.supervisor ? cls.supervisor.id : undefined,
                    lessons: cls.lessons,
                    schedule: cls.schedule,

                    // populated supervisor object for this page
                    supervisor: cls.supervisor
                        ? {
                              id: cls.supervisor.id,
                              name: cls.supervisor.name,
                              surname: cls.supervisor.surname,
                          }
                        : undefined,

                    // optional populated teachers array for view usage elsewhere
                    teachers: Array.isArray(cls.teacherIds)
                        ? cls.teacherIds.map((t) => ({
                              id: t.id,
                              name: t.name,
                              surname: t.surname,
                          }))
                        : undefined,
                };

                classes = [mapped];
            }
        }
        totalPages = 1;
    }

    // ─────────────────────────────────────
    // TEACHER → classes they teach
    // ─────────────────────────────────────
    else if (role === "teacher") {
        const { data } = await fetchClasses(1, 100);
        const allClasses = data as IClassWithRelations[];

        // In the canonical shape, teacherIds is string[]
        classes = allClasses.filter((c) =>
            Array.isArray(c.teacherIds) ? c.teacherIds.includes(userId) : false
        );

        totalPages = 1;
    }

    // ─────────────────────────────────────
    // OTHERS → no access
    // ─────────────────────────────────────
    else {
        return (
            <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                <p className="text-sm text-red-500">You do not have access to exam schedules.</p>
            </div>
        );
    }

    const canCreateExams = role === "admin";

    const renderRow = (cls: IClassWithRelations) => {
        const gradeKey = String(cls.grade);
        const subjectsForClass: string[] = (gradeLessonMap[gradeKey] ?? []).map((s: string) =>
            String(s)
        );

        return (
            <tr
                key={cls.id}
                className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[var(--purpleeLight-color)]"
            >
                <td className="p-4">
                    <div className="flex flex-col">
                        <span className="font-medium">{cls.name}</span>
                        <span className="text-xs text-gray-500">Grade {cls.grade}</span>
                    </div>
                </td>

                <td className="hidden md:table-cell">{cls.grade}</td>

                <td className="hidden lg:table-cell">
                    {cls.supervisor ? (
                        <Link
                            href={`/list/teachers/${cls.supervisor.id}`}
                            className="text-indigo-600 hover:underline"
                        >
                            {cls.supervisor.name} {cls.supervisor.surname}
                        </Link>
                    ) : (
                        "N/A"
                    )}
                </td>

                <td>
                    <div className="flex items-center gap-2">
                        <ExamModal
                            classId={cls.id}
                            className={cls.name}
                            grade={String(cls.grade)}
                            subjects={subjectsForClass}
                            canCreateExams={canCreateExams}
                        />

                        <Link
                            href={`/list/classes/${cls.id}`}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--sky-color)]"
                        >
                            <Image src="/view.png" alt="View class" width={14} height={14} />
                        </Link>
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-semibold">Exam Schedules</h1>
            </div>

            <Table<IClassWithRelations> columns={columns} renderRow={renderRow} data={classes} />

            <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
    );
}
