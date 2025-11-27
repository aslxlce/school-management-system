// // // src/app/list/results/page.tsx
// // export const dynamic = "force-dynamic";

// // import Link from "next/link";
// // import Image from "next/image";
// // import { redirect } from "next/navigation";

// // import { getSession } from "@/lib/auth";
// // import { fetchClasses, fetchClassById, IClass } from "@/action/server/class";
// // import { fetchResultsByStudent, IResult } from "@/action/server/result";
// // import { gradeLessonMap } from "@/lib/gradeLessons";

// // import dbConnect from "@/lib/dbConnection";
// // import { StudentModel, ParentModel } from "@/models/User";
// // import { Types } from "mongoose";

// // import TableSearch from "@/components/TableSearch";
// // import Pagination from "@/components/Pagination";
// // import LessonResultsModal from "@/components/LessonResultsModal";

// // interface PageSearchParams {
// //     page?: string;
// // }
// // interface PageProps {
// //     searchParams: Promise<PageSearchParams>;
// // }

// // interface IClassWithTeacherIds extends IClass {
// //     teacherIds?: { id: string }[];
// // }

// // interface RawChild {
// //     _id: Types.ObjectId;
// //     name: string;
// //     surname: string;
// //     classId?: Types.ObjectId;
// // }

// // interface RawParent {
// //     _id: Types.ObjectId;
// //     childrenIds?: Types.ObjectId[];
// // }

// // interface SubjectRow {
// //     subject: string;
// //     results: IResult[];
// // }

// // const subjectColumns = [
// //     { header: "Lesson", accessor: "subject" },
// //     { header: "Actions", accessor: "actions" },
// // ];

// // const ResultsPage = async ({ searchParams }: PageProps) => {
// //     const { page: pageParam } = await searchParams;
// //     const currentPage = Number.parseInt(pageParam ?? "1", 10);

// //     const session = await getSession();
// //     if (!session) redirect("/login");

// //     const role = session.role;
// //     const userId = session.id;
// //     const userClassId = session.classId;

// //     // ─────────── Student / Parent ───────────
// //     if (role === "student" || role === "parent") {
// //         await dbConnect();

// //         let studentId: string | null = null;
// //         let classId: string | null = null;
// //         let heading = "Results";

// //         if (role === "student") {
// //             studentId = userId;
// //             classId = userClassId ?? null;
// //         } else {
// //             // Parent → find first child from childrenIds
// //             const parent = await ParentModel.findById(userId).lean<RawParent | null>();
// //             let child: RawChild | null = null;
// //             if (parent && Array.isArray(parent.childrenIds) && parent.childrenIds.length > 0) {
// //                 const firstChildId = parent.childrenIds[0];
// //                 child = await StudentModel.findById(firstChildId).lean<RawChild | null>();
// //             }

// //             if (child) {
// //                 studentId = child._id.toString();
// //                 if (child.classId) classId = child.classId.toString();
// //                 heading = `Results (${child.name} ${child.surname})`;
// //             } else {
// //                 classId = userClassId ?? null;
// //             }
// //         }

// //         if (!studentId) {
// //             return (
// //                 <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
// //                     <h1 className="text-lg font-semibold mb-4">{heading}</h1>
// //                     <p className="text-sm text-gray-500">
// //                         No student is associated with this account yet.
// //                     </p>
// //                 </div>
// //             );
// //         }

// //         // lessons for this class
// //         let subjects: string[] = [];
// //         if (classId) {
// //             const cls = await fetchClassById(classId);
// //             if (cls) {
// //                 const gradeKey = String(cls.grade);
// //                 subjects = gradeLessonMap[gradeKey] ?? [];
// //             }
// //         }

// //         const results = await fetchResultsByStudent(studentId);

// //         const resultsBySubject = new Map<string, IResult[]>();
// //         for (const s of subjects) {
// //             resultsBySubject.set(s, []);
// //         }
// //         for (const r of results) {
// //             if (!resultsBySubject.has(r.subject)) {
// //                 resultsBySubject.set(r.subject, []);
// //             }
// //             resultsBySubject.get(r.subject)?.push(r);
// //         }

// //         const rows: SubjectRow[] = Array.from(resultsBySubject.entries()).map(
// //             ([subject, subjectResults]) => ({
// //                 subject,
// //                 results: subjectResults,
// //             })
// //         );

// //         return (
// //             <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
// //                 <div className="flex justify-between items-center mb-4">
// //                     <h1 className="hidden md:block text-lg font-semibold">{heading}</h1>
// //                     <TableSearch />
// //                 </div>

// //                 <table className="w-full text-sm">
// //                     <thead>
// //                         <tr className="border-b border-gray-200">
// //                             <th className="text-left p-4">Lesson</th>
// //                             <th className="text-left p-4">Actions</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody>
// //                         {rows.map((row) => (
// //                             <tr
// //                                 key={row.subject}
// //                                 className="border-b border-gray-200 even:bg-slate-50 text-sm"
// //                             >
// //                                 <td className="p-4">{row.subject}</td>
// //                                 <td className="p-4">
// //                                     <LessonResultsModal
// //                                         subject={row.subject}
// //                                         results={row.results}
// //                                     />
// //                                 </td>
// //                             </tr>
// //                         ))}
// //                     </tbody>
// //                 </table>

// //                 <Pagination currentPage={currentPage} totalPages={1} />
// //             </div>
// //         );
// //     }

// //     // ─────────── Teacher / Admin ───────────
// //     if (role === "teacher" || role === "admin") {
// //         const { data } = await fetchClasses(currentPage, 100);
// //         const allClasses = data as IClassWithTeacherIds[];

// //         const visibleClasses: IClassWithTeacherIds =
// //             role === "admin"
// //                 ? allClasses
// //                 : allClasses.filter((c) =>
// //                       Array.isArray(c.teacherIds)
// //                           ? c.teacherIds.some((t) => t.id === userId)
// //                           : false
// //                   );

// //         return (
// //             <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
// //                 <div className="flex justify-between items-center mb-4">
// //                     <h1 className="hidden md:block text-lg font-semibold">Class Results</h1>
// //                     <TableSearch />
// //                 </div>

// //                 <table className="w-full text-sm mt-4">
// //                     <thead>
// //                         <tr className="border-b border-gray-200">
// //                             <th className="text-left p-4">Class</th>
// //                             <th className="text-left p-4">Grade</th>
// //                             <th className="text-left p-4 hidden md:table-cell">Supervisor</th>
// //                             <th className="text-left p-4">Results</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody>
// //                         {visibleClasses.map((cls) => (
// //                             <tr
// //                                 key={cls.id}
// //                                 className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[var(--purpleeLight-color)]"
// //                             >
// //                                 <td className="p-4">
// //                                     <div className="flex flex-col">
// //                                         <span className="font-medium">{cls.name}</span>
// //                                         <span className="text-xs text-gray-500">
// //                                             Grade {cls.grade}
// //                                         </span>
// //                                     </div>
// //                                 </td>
// //                                 <td className="p-4">{cls.grade}</td>
// //                                 <td className="p-4 hidden md:table-cell">
// //                                     {cls.supervisor ? (
// //                                         <Link
// //                                             href={`/list/teachers/${cls.supervisor.id}`}
// //                                             className="text-indigo-600 hover:underline"
// //                                         >
// //                                             {cls.supervisor.name} {cls.supervisor.surname}
// //                                         </Link>
// //                                     ) : (
// //                                         "N/A"
// //                                     )}
// //                                 </td>
// //                                 <td className="p-4">
// //                                     <Link
// //                                         href={`/list/results/${cls.id}`}
// //                                         className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--sky-color)]"
// //                                     >
// //                                         <Image
// //                                             src="/view.png"
// //                                             alt="View results"
// //                                             width={14}
// //                                             height={14}
// //                                         />
// //                                     </Link>
// //                                 </td>
// //                             </tr>
// //                         ))}
// //                     </tbody>
// //                 </table>

// //                 <Pagination currentPage={currentPage} totalPages={1} />
// //             </div>
// //         );
// //     }

// //     return (
// //         <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
// //             <p className="text-sm text-gray-500">
// //                 This page is only available for students, parents, teachers, and admins.
// //             </p>
// //         </div>
// //     );
// // };

// // export default ResultsPage;

// // src/app/list/results/page.tsx
// export const dynamic = "force-dynamic";

// import Link from "next/link";
// import Image from "next/image";
// import { redirect } from "next/navigation";

// import { getSession } from "@/lib/auth";
// import { fetchClasses, fetchClassById, IClass } from "@/action/server/class";
// import { fetchResultsByStudent, IResult } from "@/action/server/result";
// import { gradeLessonMap } from "@/lib/gradeLessons";

// import dbConnect from "@/lib/dbConnection";
// import { StudentModel, ParentModel } from "@/models/User";
// import { Types } from "mongoose";

// import TableSearch from "@/components/TableSearch";
// import Pagination from "@/components/Pagination";
// import LessonResultsModal from "@/components/LessonResultsModal";

// // ─────────────────────────────────────────────
// // Types
// // ─────────────────────────────────────────────

// interface PageSearchParams {
//     page?: string;
// }
// interface PageProps {
//     searchParams: Promise<PageSearchParams>;
// }

// interface IClassWithTeacherIds extends IClass {
//     teacherIds?: { id: string }[];
// }

// interface RawChild {
//     _id: Types.ObjectId;
//     name: string;
//     surname: string;
//     classId?: Types.ObjectId;
// }

// interface RawParent {
//     _id: Types.ObjectId;
//     childrenIds?: Types.ObjectId[];
// }

// interface SubjectRow {
//     subject: string;
//     results: IResult[];
// }

// // ─────────────────────────────────────────────
// // Page
// // ─────────────────────────────────────────────

// const ResultsPage = async ({ searchParams }: PageProps) => {
//     const { page: pageParam } = await searchParams;
//     const currentPage = Number.parseInt(pageParam ?? "1", 10);

//     const session = await getSession();
//     if (!session) redirect("/login");

//     const role = session.role;
//     const userId = session.id;
//     const userClassId = session.classId;

//     // ─────────── Student / Parent ───────────
//     if (role === "student" || role === "parent") {
//         await dbConnect();

//         let studentId: string | null = null;
//         let classId: string | null = null;
//         let heading = "Results";

//         if (role === "student") {
//             studentId = userId;
//             classId = userClassId ?? null;
//         } else {
//             // Parent → find first child from childrenIds
//             const parent = await ParentModel.findById(userId).lean<RawParent | null>();
//             let child: RawChild | null = null;

//             if (parent && Array.isArray(parent.childrenIds) && parent.childrenIds.length > 0) {
//                 const firstChildId = parent.childrenIds[0];
//                 child = await StudentModel.findById(firstChildId).lean<RawChild | null>();
//             }

//             if (child) {
//                 studentId = child._id.toString();
//                 if (child.classId) classId = child.classId.toString();
//                 heading = `Results (${child.name} ${child.surname})`;
//             } else {
//                 classId = userClassId ?? null;
//             }
//         }

//         if (!studentId) {
//             return (
//                 <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//                     <h1 className="text-lg font-semibold mb-4">{heading}</h1>
//                     <p className="text-sm text-gray-500">
//                         No student is associated with this account yet.
//                     </p>
//                 </div>
//             );
//         }

//         // lessons for this class
//         let subjects: string[] = [];
//         if (classId) {
//             const cls = await fetchClassById(classId);
//             if (cls) {
//                 const gradeKey = String(cls.grade);
//                 subjects = gradeLessonMap[gradeKey] ?? [];
//             }
//         }

//         const results = await fetchResultsByStudent(studentId);

//         const resultsBySubject = new Map<string, IResult[]>();
//         for (const s of subjects) {
//             resultsBySubject.set(s, []);
//         }
//         for (const r of results) {
//             if (!resultsBySubject.has(r.subject)) {
//                 resultsBySubject.set(r.subject, []);
//             }
//             resultsBySubject.get(r.subject)?.push(r);
//         }

//         const rows: SubjectRow[] = Array.from(resultsBySubject.entries()).map(
//             ([subject, subjectResults]) => ({
//                 subject,
//                 results: subjectResults,
//             })
//         );

//         return (
//             <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//                 <div className="flex justify-between items-center mb-4">
//                     <h1 className="hidden md:block text-lg font-semibold">{heading}</h1>
//                     <TableSearch />
//                 </div>

//                 <table className="w-full text-sm">
//                     <thead>
//                         <tr className="border-b border-gray-200">
//                             <th className="text-left p-4">Lesson</th>
//                             <th className="text-left p-4">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {rows.map((row) => (
//                             <tr
//                                 key={row.subject}
//                                 className="border-b border-gray-200 even:bg-slate-50 text-sm"
//                             >
//                                 <td className="p-4">{row.subject}</td>
//                                 <td className="p-4">
//                                     <LessonResultsModal
//                                         subject={row.subject}
//                                         results={row.results}
//                                     />
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>

//                 <Pagination currentPage={currentPage} totalPages={1} />
//             </div>
//         );
//     }

//     // ─────────── Teacher / Admin ───────────
//     if (role === "teacher" || role === "admin") {
//         const { data } = await fetchClasses(currentPage, 100);
//         const allClasses = data as IClassWithTeacherIds[];

//         const visibleClasses: IClassWithTeacherIds[] =
//             role === "admin"
//                 ? allClasses
//                 : allClasses.filter((c) =>
//                       Array.isArray(c.teacherIds)
//                           ? c.teacherIds.some((t) => t.id === userId)
//                           : false
//                   );

//         return (
//             <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//                 <div className="flex justify-between items-center mb-4">
//                     <h1 className="hidden md:block text-lg font-semibold">Class Results</h1>
//                     <TableSearch />
//                 </div>

//                 <table className="w-full text-sm mt-4">
//                     <thead>
//                         <tr className="border-b border-gray-200">
//                             <th className="text-left p-4">Class</th>
//                             <th className="text-left p-4">Grade</th>
//                             <th className="text-left p-4 hidden md:table-cell">Supervisor</th>
//                             <th className="text-left p-4">Results</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {visibleClasses.map((cls) => (
//                             <tr
//                                 key={cls.id}
//                                 className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[var(--purpleeLight-color)]"
//                             >
//                                 <td className="p-4">
//                                     <div className="flex flex-col">
//                                         <span className="font-medium">{cls.name}</span>
//                                         <span className="text-xs text-gray-500">
//                                             Grade {cls.grade}
//                                         </span>
//                                     </div>
//                                 </td>
//                                 <td className="p-4">{cls.grade}</td>
//                                 <td className="p-4 hidden md:table-cell">
//                                     {cls.supervisor ? (
//                                         <Link
//                                             href={`/list/teachers/${cls.supervisor.id}`}
//                                             className="text-indigo-600 hover:underline"
//                                         >
//                                             {cls.supervisor.name} {cls.supervisor.surname}
//                                         </Link>
//                                     ) : (
//                                         "N/A"
//                                     )}
//                                 </td>
//                                 <td className="p-4">
//                                     <Link
//                                         href={`/list/results/${cls.id}`}
//                                         className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--sky-color)]"
//                                     >
//                                         <Image
//                                             src="/view.png"
//                                             alt="View results"
//                                             width={14}
//                                             height={14}
//                                         />
//                                     </Link>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>

//                 <Pagination currentPage={currentPage} totalPages={1} />
//             </div>
//         );
//     }

//     // Fallback for other roles
//     return (
//         <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//             <p className="text-sm text-gray-500">
//                 This page is only available for students, parents, teachers, and admins.
//             </p>
//         </div>
//     );
// };

// export default ResultsPage;

// src/app/list/results/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import { fetchClasses, fetchClassById, IClass } from "@/action/server/class";
import { fetchResultsByStudent, IResult } from "@/action/server/result";
import { gradeLessonMap } from "@/lib/gradeLessons";

import dbConnect from "@/lib/dbConnection";
import { StudentModel, ParentModel } from "@/models/User";
import { Types } from "mongoose";

import Pagination from "@/components/Pagination";
import LessonResultsModal from "@/components/LessonResultsModal";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface PageSearchParams {
    page?: string;
}
interface PageProps {
    searchParams: Promise<PageSearchParams>;
}

interface IClassWithTeacherIds extends IClass {
    teacherIds?: { id: string }[];
}

interface RawChild {
    _id: Types.ObjectId;
    name: string;
    surname: string;
    classId?: Types.ObjectId;
}

interface RawParent {
    _id: Types.ObjectId;
    childrenIds?: Types.ObjectId[];
}

interface SubjectRow {
    subject: string;
    results: IResult[];
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

const ResultsPage = async ({ searchParams }: PageProps) => {
    const { page: pageParam } = await searchParams;
    const currentPage = Number.parseInt(pageParam ?? "1", 10);

    const session = await getSession();
    if (!session) redirect("/login");

    const role = session.role;
    const userId = session.id;
    const userClassId = session.classId;

    // ─────────── Student / Parent ───────────
    if (role === "student" || role === "parent") {
        await dbConnect();

        let studentId: string | null = null;
        let classId: string | null = null;
        let heading = "Results";

        if (role === "student") {
            studentId = userId;
            classId = userClassId ?? null;
        } else {
            // Parent → find first child from childrenIds
            const parent = await ParentModel.findById(userId).lean<RawParent | null>();
            let child: RawChild | null = null;

            if (parent && Array.isArray(parent.childrenIds) && parent.childrenIds.length > 0) {
                const firstChildId = parent.childrenIds[0];
                child = await StudentModel.findById(firstChildId).lean<RawChild | null>();
            }

            if (child) {
                studentId = child._id.toString();
                if (child.classId) classId = child.classId.toString();
                heading = `Results (${child.name} ${child.surname})`;
            } else {
                classId = userClassId ?? null;
            }
        }

        if (!studentId) {
            return (
                <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                    <h1 className="text-lg font-semibold mb-4">{heading}</h1>
                    <p className="text-sm text-gray-500">
                        No student is associated with this account yet.
                    </p>
                </div>
            );
        }

        // lessons for this class
        let subjects: string[] = [];
        if (classId) {
            const cls = await fetchClassById(classId);
            if (cls) {
                const gradeKey = String(cls.grade);
                subjects = gradeLessonMap[gradeKey] ?? [];
            }
        }

        const results = await fetchResultsByStudent(studentId);

        const resultsBySubject = new Map<string, IResult[]>();
        for (const s of subjects) {
            resultsBySubject.set(s, []);
        }
        for (const r of results) {
            if (!resultsBySubject.has(r.subject)) {
                resultsBySubject.set(r.subject, []);
            }
            resultsBySubject.get(r.subject)?.push(r);
        }

        const rows: SubjectRow[] = Array.from(resultsBySubject.entries()).map(
            ([subject, subjectResults]) => ({
                subject,
                results: subjectResults,
            })
        );

        return (
            <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="hidden md:block text-lg font-semibold">{heading}</h1>
                </div>

                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left p-4">Lesson</th>
                            <th className="text-left p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr
                                key={row.subject}
                                className="border-b border-gray-200 even:bg-slate-50 text-sm"
                            >
                                <td className="p-4">{row.subject}</td>
                                <td className="p-4">
                                    <LessonResultsModal
                                        subject={row.subject}
                                        results={row.results}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination currentPage={currentPage} totalPages={1} />
            </div>
        );
    }

    // ─────────── Teacher / Admin ───────────
    if (role === "teacher" || role === "admin") {
        const { data } = await fetchClasses(currentPage, 100);
        const allClasses = data as IClassWithTeacherIds[];

        const visibleClasses: IClassWithTeacherIds[] =
            role === "admin"
                ? allClasses
                : allClasses.filter((c) =>
                      Array.isArray(c.teacherIds)
                          ? c.teacherIds.some((t) => t.id === userId)
                          : false
                  );

        return (
            <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="hidden md:block text-lg font-semibold">Class Results</h1>
                </div>

                <table className="w-full text-sm mt-4">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left p-4">Class</th>
                            <th className="text-left p-4">Grade</th>
                            <th className="text-left p-4 hidden md:table-cell">Supervisor</th>
                            <th className="text-left p-4">Results</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleClasses.map((cls) => (
                            <tr
                                key={cls.id}
                                className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[var(--purpleeLight-color)]"
                            >
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium">{cls.name}</span>
                                        <span className="text-xs text-gray-500">
                                            Grade {cls.grade}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4">{cls.grade}</td>
                                <td className="p-4 hidden md:table-cell">
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
                                <td className="p-4">
                                    <Link
                                        href={`/list/results/${cls.id}`}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--sky-color)]"
                                    >
                                        <Image
                                            src="/view.png"
                                            alt="View results"
                                            width={14}
                                            height={14}
                                        />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination currentPage={currentPage} totalPages={1} />
            </div>
        );
    }

    // Fallback for other roles
    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            <p className="text-sm text-gray-500">
                This page is only available for students, parents, teachers, and admins.
            </p>
        </div>
    );
};

export default ResultsPage;
