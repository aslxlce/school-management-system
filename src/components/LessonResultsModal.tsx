// src/components/LessonResultsModal.tsx
"use client";

import { useState } from "react";
import type { IResult } from "@/action/server/result";

interface LessonResultsModalProps {
    subject: string;
    results: IResult[];
}

export default function LessonResultsModal({ subject, results }: LessonResultsModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="px-3 py-1 text-xs rounded-full bg-[var(--sky-color)] text-white"
            >
                View
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-md p-6 max-w-xl w-full">
                        <h2 className="text-lg font-semibold mb-4">Results for {subject}</h2>

                        {results.length === 0 ? (
                            <p className="text-sm text-gray-500">No results yet for this lesson.</p>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-2">Type</th>
                                        <th className="text-left py-2">Grade</th>
                                        <th className="text-left py-2">Teacher</th>
                                        <th className="text-left py-2">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((r) => (
                                        <tr key={r.id} className="border-b border-gray-100">
                                            <td className="py-2 capitalize">{r.type}</td>
                                            <td className="py-2">{r.grade}</td>
                                            <td className="py-2">
                                                {r.teacher.name} {r.teacher.surname}
                                            </td>
                                            <td className="py-2">{r.date.slice(0, 10)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
