// // src/components/forms/ExamForm.tsx
// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { createExam, CreateExamPayload, IExam } from "@/action/client/exam";

// const examSchema = z.object({
//     subject: z.string().min(1, "Subject is required"),
//     date: z.string().min(1, "Date is required"),
//     startTime: z.string().min(1, "Start time is required"),
//     endTime: z.string().min(1, "End time is required"),
//     room: z.string().optional(),
// });

// type ExamFormInputs = z.infer<typeof examSchema>;

// interface ExamFormProps {
//     classId: string;
//     /** subjects allowed for this class (from cls.lessons or gradeLessonMap) */
//     subjects: string[];
//     onCreated: (exam: IExam) => void;
// }

// export default function ExamForm({ classId, subjects, onCreated }: ExamFormProps) {
//     const {
//         register,
//         handleSubmit,
//         reset,
//         formState: { errors },
//     } = useForm<ExamFormInputs>({
//         resolver: zodResolver(examSchema),
//         defaultValues: {
//             subject: subjects[0] ?? "",
//             date: "",
//             startTime: "",
//             endTime: "",
//             room: "",
//         },
//     });

//     const [submitting, setSubmitting] = useState(false);
//     const [errorMsg, setErrorMsg] = useState<string | null>(null);

//     const onSubmit = handleSubmit(async (values) => {
//         try {
//             setSubmitting(true);
//             setErrorMsg(null);

//             const payload: CreateExamPayload = {
//                 classId,
//                 subject: values.subject.trim(),
//                 date: values.date,
//                 startTime: values.startTime,
//                 endTime: values.endTime,
//                 room: values.room?.trim() || undefined,
//             };

//             const created = await createExam(payload);
//             onCreated(created);
//             reset({
//                 subject: values.subject, // keep same subject selected
//                 date: "",
//                 startTime: "",
//                 endTime: "",
//                 room: "",
//             });
//         } catch (err) {
//             console.error("[ExamForm] create error:", err);
//             setErrorMsg("Failed to create exam. Please try again.");
//         } finally {
//             setSubmitting(false);
//         }
//     });

//     return (
//         <form onSubmit={onSubmit} className="space-y-3 mt-4">
//             <h3 className="font-semibold text-gray-700 text-sm">Add exam</h3>

//             {/* Subject (from class subjects) */}
//             <div className="flex flex-col gap-1">
//                 <label className="text-xs text-gray-500">Subject</label>
//                 <select
//                     {...register("subject")}
//                     className="ring-[1.5px] ring-gray-300 rounded-md px-2 py-1 text-sm"
//                 >
//                     {subjects.map((subj) => (
//                         <option key={subj} value={subj}>
//                             {subj}
//                         </option>
//                     ))}
//                 </select>
//                 {errors.subject && <p className="text-xs text-red-500">{errors.subject.message}</p>}
//             </div>

//             {/* Date + time */}
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
//                 <div className="flex flex-col gap-1">
//                     <label className="text-xs text-gray-500">Date</label>
//                     <input
//                         type="date"
//                         {...register("date")}
//                         className="ring-[1.5px] ring-gray-300 rounded-md px-2 py-1 text-sm"
//                     />
//                     {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
//                 </div>

//                 <div className="flex flex-col gap-1">
//                     <label className="text-xs text-gray-500">Start</label>
//                     <input
//                         type="time"
//                         {...register("startTime")}
//                         className="ring-[1.5px] ring-gray-300 rounded-md px-2 py-1 text-sm"
//                     />
//                     {errors.startTime && (
//                         <p className="text-xs text-red-500">{errors.startTime.message}</p>
//                     )}
//                 </div>

//                 <div className="flex flex-col gap-1">
//                     <label className="text-xs text-gray-500">End</label>
//                     <input
//                         type="time"
//                         {...register("endTime")}
//                         className="ring-[1.5px] ring-gray-300 rounded-md px-2 py-1 text-sm"
//                     />
//                     {errors.endTime && (
//                         <p className="text-xs text-red-500">{errors.endTime.message}</p>
//                     )}
//                 </div>
//             </div>

//             {/* Room */}
//             <div className="flex flex-col gap-1">
//                 <label className="text-xs text-gray-500">
//                     Room <span className="text-gray-400 italic">(optional)</span>
//                 </label>
//                 <input
//                     {...register("room")}
//                     className="ring-[1.5px] ring-gray-300 rounded-md px-2 py-1 text-sm"
//                     placeholder="Room 3B"
//                 />
//             </div>

//             {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}

//             <button
//                 type="submit"
//                 disabled={submitting}
//                 className="mt-1 bg-indigo-600 text-white text-xs px-4 py-1.5 rounded-md disabled:opacity-50"
//             >
//                 {submitting ? "Saving…" : "Add exam"}
//             </button>
//         </form>
//     );
// }

// src/components/forms/ExamForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { createExam } from "@/action/client/exam";
import type { CreateExamPayload, IExam } from "@/types/exam";

const examSchema = z.object({
    subject: z.string().min(1, "Subject is required"),
    date: z.string().min(1, "Date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    room: z.string().optional(),
});

type ExamFormInputs = z.infer<typeof examSchema>;

interface ExamFormProps {
    classId: string;
    /** subjects allowed for this class (from cls.lessons or gradeLessonMap) */
    subjects: string[];
    onCreated: (exam: IExam) => void;
}

export default function ExamForm({ classId, subjects, onCreated }: ExamFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ExamFormInputs>({
        resolver: zodResolver(examSchema),
        defaultValues: {
            subject: subjects[0] ?? "",
            date: "",
            startTime: "",
            endTime: "",
            room: "",
        },
    });

    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const onSubmit = handleSubmit(async (values) => {
        try {
            setSubmitting(true);
            setErrorMsg(null);

            const payload: CreateExamPayload = {
                classId,
                subject: values.subject.trim(),
                date: values.date,
                startTime: values.startTime,
                endTime: values.endTime,
                room: values.room?.trim() || undefined,
            };

            const created = await createExam(payload);
            onCreated(created);
            reset({
                subject: values.subject, // keep same subject selected
                date: "",
                startTime: "",
                endTime: "",
                room: "",
            });
        } catch (err) {
            console.error("[ExamForm] create error:", err);
            setErrorMsg("Failed to create exam. Please try again.");
        } finally {
            setSubmitting(false);
        }
    });

    return (
        <form onSubmit={onSubmit} className="space-y-3 mt-4">
            <h3 className="font-semibold text-gray-700 text-sm">Add exam</h3>

            {/* Subject (from class subjects) */}
            <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Subject</label>
                <select
                    {...register("subject")}
                    className="ring-[1.5px] ring-gray-300 rounded-md px-2 py-1 text-sm"
                >
                    {subjects.map((subj) => (
                        <option key={subj} value={subj}>
                            {subj}
                        </option>
                    ))}
                </select>
                {errors.subject && <p className="text-xs text-red-500">{errors.subject.message}</p>}
            </div>

            {/* Date + time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Date</label>
                    <input
                        type="date"
                        {...register("date")}
                        className="ring-[1.5px] ring-gray-300 rounded-md px-2 py-1 text-sm"
                    />
                    {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Start</label>
                    <input
                        type="time"
                        {...register("startTime")}
                        className="ring-[1.5px] ring-gray-300 rounded-md px-2 py-1 text-sm"
                    />
                    {errors.startTime && (
                        <p className="text-xs text-red-500">{errors.startTime.message}</p>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">End</label>
                    <input
                        type="time"
                        {...register("endTime")}
                        className="ring-[1.5px] ring-gray-300 rounded-md px-2 py-1 text-sm"
                    />
                    {errors.endTime && (
                        <p className="text-xs text-red-500">{errors.endTime.message}</p>
                    )}
                </div>
            </div>

            {/* Room */}
            <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">
                    Room <span className="text-gray-400 italic">(optional)</span>
                </label>
                <input
                    {...register("room")}
                    className="ring-[1.5px] ring-gray-300 rounded-md px-2 py-1 text-sm"
                    placeholder="Room 3B"
                />
            </div>

            {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}

            <button
                type="submit"
                disabled={submitting}
                className="mt-1 bg-indigo-600 text-white text-xs px-4 py-1.5 rounded-md disabled:opacity-50"
            >
                {submitting ? "Saving…" : "Add exam"}
            </button>
        </form>
    );
}
