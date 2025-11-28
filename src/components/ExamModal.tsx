// // src/components/ExamModal.tsx
// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { IExam, getExamsByClass } from "@/action/client/exam";
// import ExamForm from "./forms/ExamForm";

// interface ExamModalProps {
//     classId: string;
//     className: string;
//     grade: string;
//     subjects: string[];
//     canCreateExams: boolean;
// }

// export default function ExamModal({
//     classId,
//     className,
//     grade,
//     subjects,
//     canCreateExams,
// }: ExamModalProps) {
//     const [open, setOpen] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [exams, setExams] = useState<IExam[]>([]);
//     const [errorMsg, setErrorMsg] = useState<string | null>(null);

//     const load = async (): Promise<void> => {
//         try {
//             setLoading(true);
//             setErrorMsg(null);
//             const data = await getExamsByClass(classId);
//             setExams(data);
//         } catch (err) {
//             console.error("[ExamModal] load error:", err);
//             setErrorMsg("Failed to load exams.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (open) {
//             void load();
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [open]);

//     const handleCreated = (exam: IExam): void => {
//         setExams((prev) => [...prev, exam]);
//     };

//     return (
//         <>
//             {/* Trigger button – visible for all roles */}
//             <button
//                 type="button"
//                 onClick={() => setOpen(true)}
//                 className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]"
//             >
//                 <Image src="/view.png" alt="View exams" width={14} height={14} />
//             </button>

//             {open && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//                     <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[85vh] overflow-y-auto p-4">
//                         <div className="flex justify-between items-center mb-3">
//                             <div>
//                                 <h2 className="text-lg font-semibold">{className} – Exams</h2>
//                                 <p className="text-xs text-gray-500">Grade {grade}</p>
//                             </div>
//                             <button
//                                 type="button"
//                                 onClick={() => setOpen(false)}
//                                 className="text-gray-500 hover:text-gray-700 text-xl leading-none"
//                             >
//                                 &times;
//                             </button>
//                         </div>

//                         {/* Exams list – visible to everyone */}
//                         {loading ? (
//                             <p className="text-sm text-gray-500">Loading exams…</p>
//                         ) : exams.length === 0 ? (
//                             <p className="text-sm text-gray-500 mb-3">
//                                 No exams scheduled for this class yet.
//                             </p>
//                         ) : (
//                             <table className="w-full text-xs border mb-3">
//                                 <thead className="bg-slate-100 text-left">
//                                     <tr>
//                                         <th className="p-2 border-b">Subject</th>
//                                         <th className="p-2 border-b">Date</th>
//                                         <th className="p-2 border-b">Start</th>
//                                         <th className="p-2 border-b">End</th>
//                                         <th className="p-2 border-b">Room</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {exams.map((ex) => (
//                                         <tr key={ex.id} className="border-t">
//                                             <td className="p-2">{ex.subject}</td>
//                                             <td className="p-2">
//                                                 {new Date(ex.date).toLocaleDateString()}
//                                             </td>
//                                             <td className="p-2">{ex.startTime}</td>
//                                             <td className="p-2">{ex.endTime}</td>
//                                             <td className="p-2">{ex.room ?? "—"}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         )}

//                         {errorMsg && <p className="text-xs text-red-500 mb-2">{errorMsg}</p>}

//                         {/* Add exam – ONLY admins see this */}
//                         {canCreateExams && subjects.length > 0 && (
//                             <ExamForm
//                                 classId={classId}
//                                 subjects={subjects}
//                                 onCreated={handleCreated}
//                             />
//                         )}
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }

// src/components/ExamModal.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getExamsByClass } from "@/action/client/exam";
import ExamForm from "./forms/ExamForm";

import type { IExam } from "@/types/exam";

interface ExamModalProps {
    classId: string;
    className: string;
    grade: string;
    subjects: string[];
    canCreateExams: boolean;
}

export default function ExamModal({
    classId,
    className,
    grade,
    subjects,
    canCreateExams,
}: ExamModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [exams, setExams] = useState<IExam[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const load = async (): Promise<void> => {
        try {
            setLoading(true);
            setErrorMsg(null);
            const data = await getExamsByClass(classId);
            setExams(data);
        } catch (err) {
            console.error("[ExamModal] load error:", err);
            setErrorMsg("Failed to load exams.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            void load();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleCreated = (exam: IExam): void => {
        setExams((prev) => [...prev, exam]);
    };

    return (
        <>
            {/* Trigger button – visible for all roles */}
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]"
            >
                <Image src="/view.png" alt="View exams" width={14} height={14} />
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[85vh] overflow-y-auto p-4">
                        <div className="flex justify-between items-center mb-3">
                            <div>
                                <h2 className="text-lg font-semibold">{className} – Exams</h2>
                                <p className="text-xs text-gray-500">Grade {grade}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="text-gray-500 hover:text-gray-700 text-xl leading-none"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Exams list – visible to everyone */}
                        {loading ? (
                            <p className="text-sm text-gray-500">Loading exams…</p>
                        ) : exams.length === 0 ? (
                            <p className="text-sm text-gray-500 mb-3">
                                No exams scheduled for this class yet.
                            </p>
                        ) : (
                            <table className="w-full text-xs border mb-3">
                                <thead className="bg-slate-100 text-left">
                                    <tr>
                                        <th className="p-2 border-b">Subject</th>
                                        <th className="p-2 border-b">Date</th>
                                        <th className="p-2 border-b">Start</th>
                                        <th className="p-2 border-b">End</th>
                                        <th className="p-2 border-b">Room</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exams.map((ex) => (
                                        <tr key={ex.id} className="border-t">
                                            <td className="p-2">{ex.subject}</td>
                                            <td className="p-2">
                                                {new Date(ex.date).toLocaleDateString()}
                                            </td>
                                            <td className="p-2">{ex.startTime}</td>
                                            <td className="p-2">{ex.endTime}</td>
                                            <td className="p-2">{ex.room ?? "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {errorMsg && <p className="text-xs text-red-500 mb-2">{errorMsg}</p>}

                        {/* Add exam – ONLY admins see this */}
                        {canCreateExams && subjects.length > 0 && (
                            <ExamForm
                                classId={classId}
                                subjects={subjects}
                                onCreated={handleCreated}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
