export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";

import { fetchStudentById } from "@/action/server/student";
import { fetchAssignmentsByClass } from "@/action/server/assignment";
// IAssignment is declared globally in src/types/assignment.d.ts

export default async function StudentAssignmentsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const student = await fetchStudentById(id);
    if (!student) notFound();

    if (!student.classId) {
        return (
            <div className="p-4 flex-1">
                <h1 className="text-2xl font-semibold mb-1">
                    Assignments – {student.name} {student.surname}
                </h1>
                <p className="text-sm text-gray-500">
                    This student is not currently assigned to any class.
                </p>
            </div>
        );
    }

    // Expecting server action to return IAssignment[]
    const assignments = (await fetchAssignmentsByClass(student.classId)) as IAssignment[];

    return (
        <div className="p-4 flex-1">
            <h1 className="text-2xl font-semibold mb-1">
                Assignments – {student.name} {student.surname}
            </h1>
            <p className="text-sm text-gray-500 mb-6">
                All assignments given to the student&apos;s class.
            </p>

            {assignments.length === 0 ? (
                <p className="text-sm text-gray-500">No assignments found for this class.</p>
            ) : (
                <div className="overflow-x-auto bg-white rounded-md shadow-sm">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="px-4 py-2">Title</th>
                                <th className="px-4 py-2">Description</th>
                                <th className="px-4 py-2">Due date</th>
                                <th className="px-4 py-2">Teacher</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.map((a) => (
                                <tr key={a.id} className="border-t align-top">
                                    <td className="px-4 py-2 font-medium">{a.title}</td>
                                    <td className="px-4 py-2 max-w-md break-words">
                                        {a.description}
                                    </td>
                                    <td className="px-4 py-2">
                                        {new Date(a.dueDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2">
                                        {a.teacher.name} {a.teacher.surname}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
