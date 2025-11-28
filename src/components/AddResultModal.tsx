// // src/components/AddResultModal.tsx
// "use client";

// import { useState } from "react";
// import type { ResultType } from "@/models/Result";

// interface AddResultModalProps {
//     studentId: string;
//     classId: string;
//     studentName: string;
//     subjects: string[]; // lessons for this class
// }

// interface AddResultFormState {
//     type: ResultType;
//     subject: string;
//     grade: string;
//     date: string;
// }

// export default function AddResultModal({
//     studentId,
//     classId,
//     studentName,
//     subjects,
// }: AddResultModalProps) {
//     const [open, setOpen] = useState(false);
//     const [form, setForm] = useState<AddResultFormState>({
//         type: "exam",
//         subject: subjects[0] ?? "",
//         grade: "",
//         date: "",
//     });
//     const [submitting, setSubmitting] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     function update<K extends keyof AddResultFormState>(key: K, value: AddResultFormState[K]) {
//         setForm((prev) => ({ ...prev, [key]: value }));
//     }

//     async function handleSubmit(e: React.FormEvent) {
//         e.preventDefault();
//         setSubmitting(true);
//         setError(null);

//         const gradeNum = Number(form.grade);
//         if (Number.isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
//             setError("Grade must be a number between 0 and 100.");
//             setSubmitting(false);
//             return;
//         }

//         try {
//             const res = await fetch("/api/results", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     studentId,
//                     classId,
//                     subject: form.subject,
//                     type: form.type,
//                     grade: gradeNum,
//                     date: form.date || undefined,
//                 }),
//             });

//             if (!res.ok) {
//                 const body = await res.json().catch(() => ({ message: "Unknown error" }));
//                 throw new Error(body.message ?? "Failed to create result");
//             }

//             setForm({
//                 type: "exam",
//                 subject: subjects[0] ?? "",
//                 grade: "",
//                 date: "",
//             });
//             setOpen(false);
//         } catch (err) {
//             console.error(err);
//             setError((err as Error).message);
//         } finally {
//             setSubmitting(false);
//         }
//     }

//     return (
//         <>
//             <button
//                 onClick={() => setOpen(true)}
//                 className="px-3 py-1 text-xs rounded-full bg-[var(--yelloww-color)]"
//             >
//                 Add Result
//             </button>

//             {open && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//                     <div className="bg-white rounded-md p-6 max-w-lg w-full">
//                         <h2 className="text-lg font-semibold mb-4">Add Result for {studentName}</h2>

//                         {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

//                         <form onSubmit={handleSubmit} className="space-y-3">
//                             <div className="flex gap-3">
//                                 <div className="flex-1">
//                                     <label className="block text-sm font-medium mb-1">Type</label>
//                                     <select
//                                         value={form.type}
//                                         onChange={(e) =>
//                                             update("type", e.target.value as ResultType)
//                                         }
//                                         className="w-full border rounded px-2 py-1 text-sm"
//                                     >
//                                         <option value="exam">Exam</option>
//                                         <option value="assignment">Assignment</option>
//                                     </select>
//                                 </div>
//                                 <div className="flex-1">
//                                     <label className="block text-sm font-medium mb-1">Lesson</label>
//                                     <select
//                                         value={form.subject}
//                                         onChange={(e) => update("subject", e.target.value)}
//                                         className="w-full border rounded px-2 py-1 text-sm"
//                                     >
//                                         {subjects.map((s) => (
//                                             <option key={s} value={s}>
//                                                 {s}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                             </div>

//                             <div className="flex gap-3">
//                                 <div className="flex-1">
//                                     <label className="block text-sm font-medium mb-1">
//                                         Grade (0–100)
//                                     </label>
//                                     <input
//                                         type="number"
//                                         min={0}
//                                         max={100}
//                                         value={form.grade}
//                                         onChange={(e) => update("grade", e.target.value)}
//                                         className="w-full border rounded px-2 py-1 text-sm"
//                                         required
//                                     />
//                                 </div>
//                                 <div className="flex-1">
//                                     <label className="block text-sm font-medium mb-1">Date</label>
//                                     <input
//                                         type="date"
//                                         value={form.date}
//                                         onChange={(e) => update("date", e.target.value)}
//                                         className="w-full border rounded px-2 py-1 text-sm"
//                                     />
//                                 </div>
//                             </div>

//                             <div className="mt-4 flex justify-end gap-2">
//                                 <button
//                                     type="button"
//                                     onClick={() => setOpen(false)}
//                                     className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     disabled={submitting}
//                                     className="px-4 py-2 text-sm rounded bg-indigo-600 text-white disabled:opacity-50"
//                                 >
//                                     {submitting ? "Saving..." : "Save"}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }

// src/components/AddResultModal.tsx
"use client";

import { useState } from "react";
import type { ResultType } from "@/types/result";

interface AddResultModalProps {
    studentId: string;
    classId: string;
    studentName: string;
    subjects: string[]; // lessons for this class
}

interface AddResultFormState {
    type: ResultType;
    subject: string;
    grade: string;
    date: string;
}

export default function AddResultModal({
    studentId,
    classId,
    studentName,
    subjects,
}: AddResultModalProps) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<AddResultFormState>({
        type: "exam",
        subject: subjects[0] ?? "",
        grade: "",
        date: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function update<K extends keyof AddResultFormState>(key: K, value: AddResultFormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const gradeNum = Number(form.grade);
        if (Number.isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
            setError("Grade must be a number between 0 and 100.");
            setSubmitting(false);
            return;
        }

        try {
            const res = await fetch("/api/results", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentId,
                    classId,
                    subject: form.subject,
                    type: form.type,
                    grade: gradeNum,
                    date: form.date || undefined,
                }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({ message: "Unknown error" }));
                throw new Error(body.message ?? "Failed to create result");
            }

            setForm({
                type: "exam",
                subject: subjects[0] ?? "",
                grade: "",
                date: "",
            });
            setOpen(false);
        } catch (err) {
            console.error(err);
            setError((err as Error).message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="px-3 py-1 text-xs rounded-full bg-[var(--yelloww-color)]"
            >
                Add Result
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-md p-6 max-w-lg w-full">
                        <h2 className="text-lg font-semibold mb-4">Add Result for {studentName}</h2>

                        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1">Type</label>
                                    <select
                                        value={form.type}
                                        onChange={(e) =>
                                            update("type", e.target.value as ResultType)
                                        }
                                        className="w-full border rounded px-2 py-1 text-sm"
                                    >
                                        <option value="exam">Exam</option>
                                        <option value="assignment">Assignment</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1">Lesson</label>
                                    <select
                                        value={form.subject}
                                        onChange={(e) => update("subject", e.target.value)}
                                        className="w-full border rounded px-2 py-1 text-sm"
                                    >
                                        {subjects.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1">
                                        Grade (0–100)
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={form.grade}
                                        onChange={(e) => update("grade", e.target.value)}
                                        className="w-full border rounded px-2 py-1 text-sm"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1">Date</label>
                                    <input
                                        type="date"
                                        value={form.date}
                                        onChange={(e) => update("date", e.target.value)}
                                        className="w-full border rounded px-2 py-1 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 text-sm rounded bg-indigo-600 text-white disabled:opacity-50"
                                >
                                    {submitting ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
