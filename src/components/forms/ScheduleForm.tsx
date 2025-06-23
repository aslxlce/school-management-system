// "use client";

// import React, { useState } from "react";

// // Local types
// type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
// interface IScheduleEntry {
//     day: DayOfWeek;
//     startTime: string;
//     endTime: string;
//     subject: string;
//     classId: string;
//     teacherId?: string;
// }

// // The form props now include `teachers`
// interface ScheduleFormProps {
//     classId: string;
//     subjects: string[];
//     teachers: { id: string; subject: string }[];
//     initialSchedule: IScheduleEntry[];
//     onClose: () => void;
//     onSave: (newSchedule: IScheduleEntry[]) => void;
// }

// // Monday–Friday
// const days: DayOfWeek[] = ["monday", "tuesday", "wednesday", "thursday", "friday"];

// export default function ScheduleForm({
//     classId,
//     subjects,
//     teachers, // <-- now declared
//     initialSchedule,
//     onClose,
//     onSave,
// }: ScheduleFormProps) {
//     const [entries, setEntries] = useState<IScheduleEntry[]>([...initialSchedule]);
//     const [draft, setDraft] = useState<{
//         day: DayOfWeek;
//         startTime: string;
//         endTime: string;
//         subject: string;
//     }>({
//         day: days[0],
//         startTime: "08:00",
//         endTime: "09:00",
//         subject: subjects[0] || "",
//     });

//     function addEntry() {
//         if (!draft.subject) return;
//         const teacher = teachers.find((t) => t.subject === draft.subject);
//         const newEntry: IScheduleEntry = {
//             day: draft.day,
//             startTime: draft.startTime,
//             endTime: draft.endTime,
//             subject: draft.subject,
//             classId,
//             teacherId: teacher?.id, // auto‐assign teacher by subject
//         };
//         setEntries((prev) => [...prev, newEntry]);
//     }

//     function removeEntry(idx: number) {
//         setEntries((prev) => prev.filter((_, i) => i !== idx));
//     }

//     return (
//         <div className="space-y-4">
//             {/* Draft form */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
//                 <select
//                     className="border p-2 rounded"
//                     value={draft.day}
//                     onChange={(e) =>
//                         setDraft((prev) => ({
//                             ...prev,
//                             day: e.target.value as DayOfWeek,
//                         }))
//                     }
//                 >
//                     {days.map((d) => (
//                         <option key={d} value={d}>
//                             {d.charAt(0).toUpperCase() + d.slice(1)}
//                         </option>
//                     ))}
//                 </select>

//                 <input
//                     type="time"
//                     className="border p-2 rounded"
//                     value={draft.startTime}
//                     onChange={(e) =>
//                         setDraft((prev) => ({
//                             ...prev,
//                             startTime: e.target.value,
//                         }))
//                     }
//                 />

//                 <input
//                     type="time"
//                     className="border p-2 rounded"
//                     value={draft.endTime}
//                     onChange={(e) =>
//                         setDraft((prev) => ({
//                             ...prev,
//                             endTime: e.target.value,
//                         }))
//                     }
//                 />

//                 <select
//                     className="border p-2 rounded"
//                     value={draft.subject}
//                     onChange={(e) =>
//                         setDraft((prev) => ({
//                             ...prev,
//                             subject: e.target.value,
//                         }))
//                     }
//                 >
//                     {subjects.map((subj) => (
//                         <option key={subj} value={subj}>
//                             {subj}
//                         </option>
//                     ))}
//                 </select>
//             </div>

//             <button
//                 type="button"
//                 onClick={addEntry}
//                 className="bg-green-600 text-white px-4 py-2 rounded"
//             >
//                 + Add Entry
//             </button>

//             {/* List of entries */}
//             <ul className="space-y-1 max-h-40 overflow-auto">
//                 {entries.map((entry, idx) => (
//                     <li
//                         key={`${entry.day}-${entry.startTime}-${entry.subject}-${idx}`}
//                         className="flex justify-between bg-gray-100 p-2 rounded"
//                     >
//                         <span>
//                             <strong>
//                                 {entry.day.charAt(0).toUpperCase() + entry.day.slice(1)}
//                             </strong>{" "}
//                             {entry.startTime}–{entry.endTime} • {entry.subject}
//                         </span>
//                         <button
//                             type="button"
//                             onClick={() => removeEntry(idx)}
//                             className="text-red-600"
//                         >
//                             &times;
//                         </button>
//                     </li>
//                 ))}
//             </ul>

//             {/* Actions */}
//             <div className="flex justify-end gap-2">
//                 <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
//                     Cancel
//                 </button>
//                 <button
//                     type="button"
//                     onClick={() => onSave(entries)}
//                     className="px-4 py-2 bg-indigo-600 text-white rounded"
//                 >
//                     Save Schedule
//                 </button>
//             </div>
//         </div>
//     );
// }

// components/forms/ScheduleForm.tsx
"use client";

import React, { useState } from "react";

// Local types
type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";

interface IScheduleEntry {
    day: DayOfWeek;
    startTime: string; // e.g. "08 AM"
    endTime: string; // e.g. "09 PM"
    subject: string;
    classId: string;
    teacherId?: string;
}

interface ScheduleFormProps {
    classId: string;
    subjects: string[];
    teachers: { id: string; subject: string }[];
    initialSchedule: IScheduleEntry[];
    onClose: () => void;
    onSave: (newSchedule: IScheduleEntry[]) => void;
}

// Monday–Friday
const days: DayOfWeek[] = ["monday", "tuesday", "wednesday", "thursday", "friday"];

// Hours 1–12
const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const periods = ["AM", "PM"] as const;

export default function ScheduleForm({
    classId,
    subjects,
    teachers,
    initialSchedule,
    onClose,
    onSave,
}: ScheduleFormProps) {
    const [entries, setEntries] = useState<IScheduleEntry[]>([...initialSchedule]);
    const [draft, setDraft] = useState<{
        day: DayOfWeek;
        startHour: string;
        startPeriod: (typeof periods)[number];
        endHour: string;
        endPeriod: (typeof periods)[number];
        subject: string;
    }>({
        day: days[0],
        startHour: "08",
        startPeriod: "AM",
        endHour: "09",
        endPeriod: "AM",
        subject: subjects[0] || "",
    });

    const formatTime = (hour: string, period: string) => `${hour} ${period}`;

    function addEntry() {
        if (!draft.subject) return;
        const teacher = teachers.find((t) => t.subject === draft.subject);
        const newEntry: IScheduleEntry = {
            day: draft.day,
            startTime: formatTime(draft.startHour, draft.startPeriod),
            endTime: formatTime(draft.endHour, draft.endPeriod),
            subject: draft.subject,
            classId,
            teacherId: teacher?.id,
        };
        setEntries((prev) => [...prev, newEntry]);
    }

    function removeEntry(idx: number) {
        setEntries((prev) => prev.filter((_, i) => i !== idx));
    }

    return (
        <div className="space-y-4">
            {/* Draft form */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                <select
                    className="border p-2 rounded"
                    value={draft.day}
                    onChange={(e) =>
                        setDraft((prev) => ({
                            ...prev,
                            day: e.target.value as DayOfWeek,
                        }))
                    }
                >
                    {days.map((d) => (
                        <option key={d} value={d}>
                            {d[0].toUpperCase() + d.slice(1)}
                        </option>
                    ))}
                </select>

                <select
                    className="border p-2 rounded"
                    value={draft.startHour}
                    onChange={(e) => setDraft((prev) => ({ ...prev, startHour: e.target.value }))}
                >
                    {hours.map((h) => (
                        <option key={h} value={h}>
                            {h}
                        </option>
                    ))}
                </select>

                <select
                    className="border p-2 rounded"
                    value={draft.startPeriod}
                    onChange={(e) =>
                        setDraft((prev) => ({
                            ...prev,
                            startPeriod: e.target.value as (typeof periods)[number],
                        }))
                    }
                >
                    {periods.map((p) => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </select>

                <select
                    className="border p-2 rounded"
                    value={draft.endHour}
                    onChange={(e) => setDraft((prev) => ({ ...prev, endHour: e.target.value }))}
                >
                    {hours.map((h) => (
                        <option key={h} value={h}>
                            {h}
                        </option>
                    ))}
                </select>

                <select
                    className="border p-2 rounded"
                    value={draft.endPeriod}
                    onChange={(e) =>
                        setDraft((prev) => ({
                            ...prev,
                            endPeriod: e.target.value as (typeof periods)[number],
                        }))
                    }
                >
                    {periods.map((p) => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </select>

                <select
                    className="border p-2 rounded"
                    value={draft.subject}
                    onChange={(e) => setDraft((prev) => ({ ...prev, subject: e.target.value }))}
                >
                    {subjects.map((subj) => (
                        <option key={subj} value={subj}>
                            {subj}
                        </option>
                    ))}
                </select>
            </div>

            <button
                type="button"
                onClick={addEntry}
                className="bg-green-600 text-white px-4 py-2 rounded"
            >
                + Add Entry
            </button>

            {/* List of entries */}
            <ul className="space-y-1 max-h-40 overflow-auto">
                {entries.map((entry, idx) => (
                    <li
                        key={`${entry.day}-${entry.startTime}-${entry.subject}-${idx}`}
                        className="flex justify-between bg-gray-100 p-2 rounded"
                    >
                        <span>
                            <strong>
                                {entry.day.charAt(0).toUpperCase() + entry.day.slice(1)}
                            </strong>{" "}
                            {entry.startTime}–{entry.endTime} • {entry.subject}
                        </span>
                        <button
                            type="button"
                            onClick={() => removeEntry(idx)}
                            className="text-red-600"
                        >
                            &times;
                        </button>
                    </li>
                ))}
            </ul>

            {/* Actions */}
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={() => onSave(entries)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                    Save Schedule
                </button>
            </div>
        </div>
    );
}
