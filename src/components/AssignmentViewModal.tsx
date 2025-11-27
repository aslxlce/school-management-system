// src/components/AssignmentViewModal.tsx
"use client";

import { useState } from "react";
import type { IAssignment } from "@/action/server/assignment";

interface AssignmentViewModalProps {
    assignment: IAssignment;
}

export default function AssignmentViewModal({ assignment }: AssignmentViewModalProps) {
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
                    <div className="bg-white rounded-md p-6 max-w-lg w-full">
                        <h2 className="text-lg font-semibold mb-2">{assignment.title}</h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Teacher: {assignment.teacher.name} {assignment.teacher.surname}
                        </p>
                        <p className="text-sm whitespace-pre-line">{assignment.description}</p>
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
