export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";

import { fetchStudentById } from "@/action/server/student";
import { fetchResultsByStudent } from "@/action/server/result";
import type { IResult } from "@/types/result";

export default async function StudentResultsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const student = await fetchStudentById(id);
    if (!student) notFound();

    // Server action is expected to return IResult[]
    const results = (await fetchResultsByStudent(id)) as IResult[];

    return (
        <div className="p-4 flex-1">
            <h1 className="text-2xl font-semibold mb-1">
                Results – {student.name} {student.surname}
            </h1>
            <p className="text-sm text-gray-500 mb-6">
                All exam and assignment grades for this student.
            </p>

            {results.length === 0 ? (
                <p className="text-sm text-gray-500">No results found for this student.</p>
            ) : (
                <div className="overflow-x-auto bg-white rounded-md shadow-sm">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="px-4 py-2">Subject</th>
                                <th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">Grade</th>
                                <th className="px-4 py-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((r) => (
                                <tr key={r.id} className="border-t">
                                    <td className="px-4 py-2">{r.subject}</td>
                                    <td className="px-4 py-2 capitalize">
                                        {r.type === "exam" ? "Exam" : "Assignment"}
                                    </td>
                                    <td className="px-4 py-2">
                                        {r.grade.toFixed ? r.grade.toFixed(1) : r.grade}%
                                        {/* 0–100 */}
                                    </td>
                                    <td className="px-4 py-2">
                                        {new Date(r.date).toLocaleDateString()}
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
