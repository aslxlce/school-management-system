// ("use client");

// import { IScheduleEntry } from "@/types/schedule";
// import React, { useState } from "react";

// interface ScheduleFormProps {
//     classId: string;
//     subjects: string[];
//     initialSchedule: IScheduleEntry[];
//     onClose: () => void;
//     onSave: (newSchedule: IScheduleEntry[]) => void;
// }

// // only Monday→Friday
// const days: IScheduleEntry["day"][] = [
//     "monday",
//     "tuesday",
//     "wednesday",
//     "thursday",
//     "friday", // added back
// ];

// // build hour options from 8AM to 5PM
// const hourOptions = Array.from({ length: 10 }, (_, i) => {
//     const h24 = 8 + i; // 8..17
//     const suffix = h24 >= 12 ? "PM" : "AM";
//     const h12 = ((h24 + 11) % 12) + 1; // converts 0→12
//     const label = `${h12} ${suffix}`;
//     const value = h24.toString().padStart(2, "0") + ":00";
//     return { label, value };
// });

// export default function ScheduleForm({
//     classId,
//     subjects,
//     initialSchedule,
//     onClose,
//     onSave,
// }: ScheduleFormProps) {
//     const [entries, setEntries] = useState<IScheduleEntry[]>([...initialSchedule]);
//     const [draft, setDraft] = useState<{
//         day: IScheduleEntry["day"];
//         startTime: string;
//         endTime: string;
//         subject: string;
//     }>({
//         day: days[0],
//         startTime: hourOptions[0].value,
//         endTime: hourOptions[1].value,
//         subject: subjects[0] || "",
//     });

//     function addEntry() {
//         if (!draft.subject) return;
//         setEntries((prev) => [
//             ...prev,
//             {
//                 day: draft.day,
//                 startTime: draft.startTime,
//                 endTime: draft.endTime,
//                 subject: draft.subject,
//                 classId,
//                 teacherId: "",
//             },
//         ]);
//     }

//     function removeEntry(idx: number) {
//         setEntries((prev) => prev.filter((_, i) => i !== idx));
//     }

//     return (
//         <div className="space-y-4">
//             {/* Draft row */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
//                 {/* Day */}
//                 <select
//                     className="border p-2 rounded"
//                     value={draft.day}
//                     onChange={(e) =>
//                         setDraft((d) => ({
//                             ...d,
//                             day: e.target.value as IScheduleEntry["day"],
//                         }))
//                     }
//                 >
//                     {days.map((d) => (
//                         <option key={d} value={d}>
//                             {d[0].toUpperCase() + d.slice(1)}
//                         </option>
//                     ))}
//                 </select>

//                 {/* Start hour */}
//                 <select
//                     className="border p-2 rounded"
//                     value={draft.startTime}
//                     onChange={(e) => setDraft((d) => ({ ...d, startTime: e.target.value }))}
//                 >
//                     {hourOptions.map((h) => (
//                         <option key={h.value} value={h.value}>
//                             {h.label}
//                         </option>
//                     ))}
//                 </select>

//                 {/* End hour */}
//                 <select
//                     className="border p-2 rounded"
//                     value={draft.endTime}
//                     onChange={(e) => setDraft((d) => ({ ...d, endTime: e.target.value }))}
//                 >
//                     {hourOptions.map((h) => (
//                         <option key={h.value} value={h.value}>
//                             {h.label}
//                         </option>
//                     ))}
//                 </select>

//                 {/* Subject */}
//                 <select
//                     className="border p-2 rounded"
//                     value={draft.subject}
//                     onChange={(e) => setDraft((d) => ({ ...d, subject: e.target.value }))}
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

//             {/* Existing entries */}
//             <ul className="space-y-1 max-h-40 overflow-auto">
//                 {entries.map((e, i) => (
//                     <li
//                         key={`${e.day}-${e.startTime}-${e.subject}-${i}`}
//                         className="flex justify-between bg-gray-100 p-2 rounded"
//                     >
//                         <span>
//                             <strong>{e.day[0].toUpperCase() + e.day.slice(1)}</strong>{" "}
//                             {hourOptions.find((h) => h.value === e.startTime)?.label}–{" "}
//                             {hourOptions.find((h) => h.value === e.endTime)?.label} • {e.subject}
//                         </span>
//                         <button
//                             type="button"
//                             onClick={() => removeEntry(i)}
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

// Locally redeclare your schedule types so no import is needed:
type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";

interface IScheduleEntry {
    day: DayOfWeek;
    startTime: string;
    endTime: string;
    subject: string;
    classId: string;
    teacherId?: string;
}

interface ScheduleFormProps {
    classId: string;
    subjects: string[];
    initialSchedule: IScheduleEntry[];
    onClose: () => void;
    onSave: (newSchedule: IScheduleEntry[]) => void;
}

// Only Monday–Friday
const days: DayOfWeek[] = ["monday", "tuesday", "wednesday", "thursday", "friday"];

export default function ScheduleForm({
    classId,
    subjects,
    initialSchedule,
    onClose,
    onSave,
}: ScheduleFormProps) {
    const [entries, setEntries] = useState<IScheduleEntry[]>([...initialSchedule]);
    const [draft, setDraft] = useState<{
        day: DayOfWeek;
        startTime: string;
        endTime: string;
        subject: string;
    }>({
        day: days[0],
        startTime: "08:00",
        endTime: "09:00",
        subject: subjects[0] || "",
    });

    function addEntry() {
        if (!draft.subject) return;
        const newEntry: IScheduleEntry = {
            day: draft.day,
            startTime: draft.startTime,
            endTime: draft.endTime,
            subject: draft.subject,
            classId,
            teacherId: "",
        };
        setEntries((prev) => [...prev, newEntry]);
    }

    function removeEntry(idx: number) {
        setEntries((prev) => prev.filter((_, i) => i !== idx));
    }

    return (
        <div className="space-y-4">
            {/* Draft form */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
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
                            {d.charAt(0).toUpperCase() + d.slice(1)}
                        </option>
                    ))}
                </select>

                <input
                    type="time"
                    className="border p-2 rounded"
                    value={draft.startTime}
                    onChange={(e) => setDraft((prev) => ({ ...prev, startTime: e.target.value }))}
                />

                <input
                    type="time"
                    className="border p-2 rounded"
                    value={draft.endTime}
                    onChange={(e) => setDraft((prev) => ({ ...prev, endTime: e.target.value }))}
                />

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
