// // src/app/list/assignments/page.tsx
// export const dynamic = "force-dynamic";

// import Image from "next/image";
// import Link from "next/link";
// import { redirect } from "next/navigation";

// import Pagination from "@/components/Pagination";
// import Table from "@/components/Table";
// import { getSession } from "@/lib/auth";

// import { fetchAssignmentsByClass } from "@/action/server/assignment";
// import { fetchClassById, fetchClasses } from "@/action/server/class";

// import AssignmentViewModal from "@/components/AssignmentViewModal";
// import AssignmentTeacherModal from "@/components/AssignmentTeacherModal";

// import dbConnect from "@/lib/dbConnection";
// import { StudentModel, ParentModel } from "@/models/User";
// import { Types } from "mongoose";

// // ─────────────────────────────────────────────
// // Types
// // ─────────────────────────────────────────────

// interface PageSearchParams {
//     page?: string;
// }
// interface PageProps {
//     // Next 15: searchParams is a Promise
//     searchParams: Promise<PageSearchParams>;
// }

// /**
//  * Local view type for classes on this page.
//  * We do NOT import IClass from server; instead we mirror the shape
//  * that `fetchClasses` actually returns for list views.
//  */
// interface ClassListItem {
//     id: string;
//     name: string;
//     grade: string;
//     supervisor?: {
//         id: string;
//         name: string;
//         surname: string;
//     };
//     teacherIds?: { id: string }[];
// }

// interface RawChildForAssignments {
//     _id: Types.ObjectId;
//     name: string;
//     surname: string;
//     classId?: Types.ObjectId;
// }

// interface RawParentForAssignments {
//     _id: Types.ObjectId;
//     name: string;
//     surname: string;
//     childrenIds?: Types.ObjectId[];
// }

// interface AssignmentRow {
//     id: string;
//     title: string;
//     className: string;
//     teacherName: string;
//     dueDate: string;
//     assignment: IAssignment;
// }

// // Columns used for student/parent table
// const columns = [
//     {
//         header: "Subject Name",
//         accessor: "title",
//     },
//     {
//         header: "Class",
//         accessor: "className",
//     },
//     {
//         header: "Teacher",
//         accessor: "teacherName",
//         className: "hidden md:table-cell",
//     },
//     {
//         header: "Due Date",
//         accessor: "dueDate",
//         className: "hidden md:table-cell",
//     },
//     {
//         header: "Actions",
//         accessor: "actions",
//     },
// ];

// // ─────────────────────────────────────────────
// // Student & Parent row renderer
// // ─────────────────────────────────────────────

// const renderStudentParentRow = (item: AssignmentRow) => (
//     <tr
//         key={item.id}
//         className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[var(--purpleeLight-color)]"
//     >
//         <td className="flex items-center gap-4 p-4">{item.title}</td>
//         <td>{item.className}</td>
//         <td className="hidden md:table-cell">{item.teacherName}</td>
//         <td className="hidden md:table-cell">{item.dueDate}</td>
//         <td>
//             <div className="flex items-center gap-2">
//                 <AssignmentViewModal assignment={item.assignment} />
//             </div>
//         </td>
//     </tr>
// );

// // ─────────────────────────────────────────────
// // Page
// // ─────────────────────────────────────────────

// const AssignmentListPage = async ({ searchParams }: PageProps) => {
//     const { page: pageParam } = await searchParams;
//     const currentPage = Number.parseInt(pageParam ?? "1", 10);

//     const session = await getSession();
//     if (!session) {
//         redirect("/login");
//     }

//     const role = session.role;
//     const userId = session.id;
//     const userClassId = session.classId;

//     // ─────────────────────────────────────
//     // STUDENT & PARENT: assignments for their class
//     // ─────────────────────────────────────
//     if (role === "student" || role === "parent") {
//         let classId: string | null = null;
//         let className = "";
//         let heading = "Assignments";

//         if (role === "student") {
//             classId = userClassId ?? null;
//         } else if (role === "parent") {
//             await dbConnect();

//             // 1) Load parent to get childrenIds
//             const parent = await ParentModel.findById(
//                 userId
//             ).lean<RawParentForAssignments | null>();

//             let child: RawChildForAssignments | null = null;
//             if (parent && Array.isArray(parent.childrenIds) && parent.childrenIds.length > 0) {
//                 const firstChildId = parent.childrenIds[0];
//                 child = await StudentModel.findById(
//                     firstChildId
//                 ).lean<RawChildForAssignments | null>();
//             }

//             if (child) {
//                 heading = `Assignments (${child.name} ${child.surname})`;
//                 if (child.classId) {
//                     classId = child.classId.toString();
//                 }
//             }

//             // Fallback: if still no classId, try session.classId
//             if (!classId) {
//                 classId = userClassId ?? null;
//             }
//         }

//         let assignments: IAssignment[] = [];

//         if (classId) {
//             const cls = await fetchClassById(classId);
//             if (cls) {
//                 className = cls.name;
//             }
//             assignments = await fetchAssignmentsByClass(classId);
//         }

//         const rows: AssignmentRow[] = assignments.map((a) => ({
//             id: a.id,
//             title: a.title,
//             className: className || "Class",
//             teacherName: `${a.teacher.name} ${a.teacher.surname}`,
//             dueDate: a.dueDate.slice(0, 10),
//             assignment: a,
//         }));

//         return (
//             <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//                 {/* Top  */}
//                 <div className="flex justify-between items-center mb-4">
//                     <h1 className="hidden md:block text-lg font-semibold">{heading}</h1>
//                 </div>

//                 {/* List  */}
//                 <Table<AssignmentRow>
//                     columns={columns}
//                     renderRow={renderStudentParentRow}
//                     data={rows}
//                 />

//                 {/* Pagination  */}
//                 <Pagination currentPage={currentPage} totalPages={1} />
//             </div>
//         );
//     }

//     // ─────────────────────────────────────
//     // TEACHER & ADMIN: classes + Add assignment
//     // ─────────────────────────────────────
//     if (role === "teacher" || role === "admin") {
//         const { data } = await fetchClasses(currentPage, 100);
//         const allClasses = data as ClassListItem[];

//         let visibleClasses: ClassListItem[];
//         if (role === "admin") {
//             visibleClasses = allClasses;
//         } else {
//             visibleClasses = allClasses.filter((c) =>
//                 Array.isArray(c.teacherIds) ? c.teacherIds.some((t) => t.id === userId) : false
//             );
//         }

//         return (
//             <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//                 {/* Top  */}
//                 <div className="flex justify-between items-center mb-4">
//                     <h1 className="hidden md:block text-lg font-semibold">Assignments</h1>
//                 </div>

//                 {/* List of classes the teacher/admin can assign to */}
//                 <table className="w-full text-sm mt-4">
//                     <thead>
//                         <tr className="border-b border-gray-200">
//                             <th className="text-left p-4">Class</th>
//                             <th className="text-left p-4">Grade</th>
//                             <th className="text-left p-4 hidden md:table-cell">Supervisor</th>
//                             <th className="text-left p-4">Assignments</th>
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
//                                     <div className="flex items-center gap-2">
//                                         <AssignmentTeacherModal
//                                             classId={cls.id}
//                                             className={cls.name}
//                                         />
//                                         <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--sky-color)]">
//                                             <Image
//                                                 src="/view.png"
//                                                 alt="View class"
//                                                 width={14}
//                                                 height={14}
//                                             />
//                                         </button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>

//                 <Pagination currentPage={currentPage} totalPages={1} />
//             </div>
//         );
//     }

//     // Other roles (if any)
//     return (
//         <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//             <p className="text-sm text-gray-500">
//                 This page is only available for students, parents, teachers, and admins.
//             </p>
//         </div>
//     );
// };

// export default AssignmentListPage;

// src/app/list/assignments/page.tsx
export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { getSession } from "@/lib/auth";

import { fetchAssignmentsByClass } from "@/action/server/assignment";
import { fetchClassById, fetchClasses } from "@/action/server/class";

import AssignmentViewModal from "@/components/AssignmentViewModal";
import AssignmentTeacherModal from "@/components/AssignmentTeacherModal";

import dbConnect from "@/lib/dbConnection";
import { StudentModel, ParentModel } from "@/models/User";
import { Types } from "mongoose";

interface PageSearchParams {
    page?: string;
}
interface PageProps {
    // Next 15: searchParams is a Promise
    searchParams: Promise<PageSearchParams>;
}

/**
 * Local view type for classes on this page.
 * We do NOT import IClass from server; instead we mirror the shape
 * that `fetchClasses` actually returns for list views.
 */
interface ClassListItem {
    id: string;
    name: string;
    grade: string;
    supervisor?: {
        id: string;
        name: string;
        surname: string;
    };
    teacherIds?: { id: string }[];
}

interface RawChildForAssignments {
    _id: Types.ObjectId;
    name: string;
    surname: string;
    classId?: Types.ObjectId;
}

interface RawParentForAssignments {
    _id: Types.ObjectId;
    name: string;
    surname: string;
    childrenIds?: Types.ObjectId[];
}

interface AssignmentRow {
    id: string;
    title: string;
    className: string;
    teacherName: string;
    dueDate: string;
    assignment: IAssignment;
}

// Columns used for student/parent table
const columns = [
    {
        header: "Subject Name",
        accessor: "title",
    },
    {
        header: "Class",
        accessor: "className",
    },
    {
        header: "Teacher",
        accessor: "teacherName",
        className: "hidden md:table-cell",
    },
    {
        header: "Due Date",
        accessor: "dueDate",
        className: "hidden md:table-cell",
    },
    {
        header: "Actions",
        accessor: "actions",
    },
];

// ─────────────────────────────────────────────
// Student & Parent row renderer
// ─────────────────────────────────────────────

const renderStudentParentRow = (item: AssignmentRow) => (
    <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[var(--purpleeLight-color)]"
    >
        <td className="flex items-center gap-4 p-4">{item.title}</td>
        <td>{item.className}</td>
        <td className="hidden md:table-cell">{item.teacherName}</td>
        <td className="hidden md:table-cell">{item.dueDate}</td>
        <td>
            <div className="flex items-center gap-2">
                <AssignmentViewModal assignment={item.assignment} />
            </div>
        </td>
    </tr>
);

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

const AssignmentListPage = async ({ searchParams }: PageProps) => {
    const { page: pageParam } = await searchParams;
    const currentPage = Number.parseInt(pageParam ?? "1", 10);

    const session = await getSession();
    if (!session) {
        redirect("/login");
    }

    const role = session.role;
    const userId = session.id;
    const userClassId = session.classId;

    // ─────────────────────────────────────
    // STUDENT & PARENT: assignments for their class
    // ─────────────────────────────────────
    if (role === "student" || role === "parent") {
        let classId: string | null = null;
        let className = "";
        let heading = "Assignments";

        if (role === "student") {
            classId = userClassId ?? null;
        } else if (role === "parent") {
            await dbConnect();

            // 1) Load parent to get childrenIds
            const parent = await ParentModel.findById(
                userId
            ).lean<RawParentForAssignments | null>();

            let child: RawChildForAssignments | null = null;
            if (parent && Array.isArray(parent.childrenIds) && parent.childrenIds.length > 0) {
                const firstChildId = parent.childrenIds[0];
                child = await StudentModel.findById(
                    firstChildId
                ).lean<RawChildForAssignments | null>();
            }

            if (child) {
                heading = `Assignments (${child.name} ${child.surname})`;
                if (child.classId) {
                    classId = child.classId.toString();
                }
            }

            // Fallback: if still no classId, try session.classId
            if (!classId) {
                classId = userClassId ?? null;
            }
        }

        let assignments: IAssignment[] = [];

        if (classId) {
            const cls = await fetchClassById(classId);
            if (cls) {
                className = cls.name;
            }
            assignments = await fetchAssignmentsByClass(classId);
        }

        const rows: AssignmentRow[] = assignments.map((a) => ({
            id: a.id,
            title: a.title,
            className: className || "Class",
            teacherName: `${a.teacher.name} ${a.teacher.surname}`,
            dueDate: a.dueDate.slice(0, 10),
            assignment: a,
        }));

        return (
            <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                {/* Top  */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="hidden md:block text-lg font-semibold">{heading}</h1>
                </div>

                {/* List  */}
                <Table<AssignmentRow>
                    columns={columns}
                    renderRow={renderStudentParentRow}
                    data={rows}
                />

                {/* Pagination  */}
                <Pagination currentPage={currentPage} totalPages={1} />
            </div>
        );
    }

    // ─────────────────────────────────────
    // TEACHER & ADMIN: classes + Add assignment
    // ─────────────────────────────────────
    if (role === "teacher" || role === "admin") {
        const { data } = await fetchClasses(currentPage, 100);
        const allClasses = data as ClassListItem[];

        let visibleClasses: ClassListItem[];
        if (role === "admin") {
            visibleClasses = allClasses;
        } else {
            visibleClasses = allClasses.filter((c) =>
                Array.isArray(c.teacherIds) ? c.teacherIds.some((t) => t.id === userId) : false
            );
        }

        return (
            <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                {/* Top  */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="hidden md:block text-lg font-semibold">Assignments</h1>
                </div>

                {/* List of classes the teacher/admin can assign to */}
                <table className="w-full text-sm mt-4">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left p-4">Class</th>
                            <th className="text-left p-4">Grade</th>
                            <th className="text-left p-4 hidden md:table-cell">Supervisor</th>
                            <th className="text-left p-4">Assignments</th>
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
                                    <div className="flex items-center gap-2">
                                        <AssignmentTeacherModal
                                            classId={cls.id}
                                            className={cls.name}
                                        />
                                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--sky-color)]">
                                            <Image
                                                src="/view.png"
                                                alt="View class"
                                                width={14}
                                                height={14}
                                            />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination currentPage={currentPage} totalPages={1} />
            </div>
        );
    }

    // Other roles (if any)
    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            <p className="text-sm text-gray-500">
                This page is only available for students, parents, teachers, and admins.
            </p>
        </div>
    );
};

export default AssignmentListPage;
