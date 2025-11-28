// src/app/list/results/[classId]/page.tsx
export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { fetchClassById } from "@/action/server/class";
import { gradeLessonMap } from "@/lib/gradeLessons";
import AddResultModal from "@/components/AddResultModal";

export default async function ClassResultsPage(props: { params: Promise<{ classId: string }> }) {
    // Next 15 expects params as a Promise here, so we await it
    const { classId } = await props.params;

    const session = await getSession();
    if (!session) redirect("/login");

    const role = session.role;
    const userId = session.id;

    // Only teachers & admins can access this page
    if (role !== "teacher" && role !== "admin") {
        redirect("/list/results");
    }

    const cls = await fetchClassById(classId);
    if (!cls) {
        return (
            <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                <p className="text-sm text-gray-500">Class not found.</p>
            </div>
        );
    }

    // If teacher, ensure they actually teach this class
    const teachesHere =
        role === "teacher" ? (cls.teacherIds ?? []).some((t) => t.id === userId) : true;

    if (!teachesHere) {
        redirect("/list/results");
    }

    const gradeKey = String(cls.grade);
    const subjects: string[] = gradeLessonMap[gradeKey] ?? [];
    const students = cls.studentIds ?? [];

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            <h1 className="text-lg font-semibold mb-4">
                Results – {cls.name} (Grade {cls.grade})
            </h1>

            {students.length === 0 ? (
                <p className="text-sm text-gray-500">
                    There are no students assigned to this class yet.
                </p>
            ) : (
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left p-4">Student</th>
                            <th className="text-left p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((s) => (
                            <tr
                                key={s.id}
                                className="border-b border-gray-200 even:bg-slate-50 text-sm"
                            >
                                <td className="p-4">
                                    {s.name} {s.surname}
                                </td>
                                <td className="p-4">
                                    <AddResultModal
                                        studentId={s.id}
                                        classId={cls.id}
                                        studentName={`${s.name} ${s.surname}`}
                                        subjects={subjects}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
