// "use client";

// import { useState, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import moment from "moment";
// import { Calendar, momentLocalizer, Views, View, Event as CalEvent } from "react-big-calendar";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import dynamic from "next/dynamic";

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

// // New prop interface, including `teachers`
// export interface ClassScheduleSectionProps {
//     classId: string;
//     initialSchedule: IScheduleEntry[];
//     subjects: string[];
//     teachers: { id: string; subject: string }[];
// }

// const localizer = momentLocalizer(moment);
// const ScheduleForm = dynamic(() => import("./forms/ScheduleForm"), {
//     ssr: false,
//     loading: () => <p>Loading…</p>,
// });

// // Map Monday→0 … Friday→4
// const dayToIndex: Record<DayOfWeek, number> = {
//     monday: 0,
//     tuesday: 1,
//     wednesday: 2,
//     thursday: 3,
//     friday: 4,
// };

// export default function ClassScheduleSection({
//     classId,
//     initialSchedule,
//     subjects,
//     teachers, // <-- now declared
// }: ClassScheduleSectionProps) {
//     const [schedule, setSchedule] = useState<IScheduleEntry[]>(initialSchedule);
//     const [view, setView] = useState<View>(Views.WORK_WEEK);
//     const [showForm, setShowForm] = useState(false);
//     const router = useRouter();

//     const events: CalEvent[] = useMemo(() => {
//         const now = new Date();
//         const dow = now.getDay();
//         const offset = (dow + 6) % 7; // Monday=0
//         const monday = new Date(now);
//         monday.setDate(now.getDate() - offset);
//         monday.setHours(0, 0, 0, 0);

//         return schedule.map((e) => {
//             const idx = dayToIndex[e.day];
//             const base = new Date(monday);
//             base.setDate(monday.getDate() + idx);

//             const [sh, sm] = e.startTime.split(":").map(Number);
//             const [eh, em] = e.endTime.split(":").map(Number);
//             const start = new Date(base);
//             start.setHours(sh, sm, 0, 0);
//             const end = new Date(base);
//             end.setHours(eh, em, 0, 0);

//             return { title: e.subject, start, end };
//         });
//     }, [schedule]);

//     async function handleSave(newSchedule: IScheduleEntry[]) {
//         const res = await fetch(`/api/classes/${classId}/schedule`, {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ schedule: newSchedule }),
//         });
//         if (!res.ok) throw new Error("Failed to save");
//         const body = await res.json();
//         setSchedule(body.schedule);
//         setShowForm(false);
//         router.refresh();
//     }

//     return (
//         <section className="mb-8">
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-semibold">Weekly Schedule</h2>
//                 <button
//                     onClick={() => setShowForm(true)}
//                     className="bg-indigo-600 text-white px-4 py-2 rounded"
//                 >
//                     Edit Schedule
//                 </button>
//             </div>

//             <Calendar
//                 localizer={localizer}
//                 events={events}
//                 startAccessor="start"
//                 endAccessor="end"
//                 view={view}
//                 onView={(v) => setView(v)}
//                 views={["work_week", "day"]}
//                 style={{ height: 500 }}
//                 min={new Date(0, 0, 0, 8)}
//                 max={new Date(0, 0, 0, 18)}
//             />

//             {showForm && (
//                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//                     <div className="bg-white p-6 rounded-lg max-w-lg w-full">
//                         <ScheduleForm
//                             classId={classId}
//                             subjects={subjects}
//                             teachers={teachers}
//                             initialSchedule={schedule}
//                             onClose={() => setShowForm(false)}
//                             onSave={handleSave}
//                         />
//                     </div>
//                 </div>
//             )}
//         </section>
//     );
// }

// components/ClassScheduleSection.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import { Calendar, momentLocalizer, Views, View, Event as CalEvent } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dynamic from "next/dynamic";

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

export interface ClassScheduleSectionProps {
    classId: string;
    initialSchedule: IScheduleEntry[];
    subjects: string[];
    teachers: { id: string; subject: string }[];
}

const localizer = momentLocalizer(moment);
const ScheduleForm = dynamic(() => import("./forms/ScheduleForm"), {
    ssr: false,
    loading: () => <p>Loading…</p>,
});

const dayToIndex: Record<DayOfWeek, number> = {
    monday: 0,
    tuesday: 1,
    wednesday: 2,
    thursday: 3,
    friday: 4,
};

export default function ClassScheduleSection({
    classId,
    initialSchedule,
    subjects,
    teachers,
}: ClassScheduleSectionProps) {
    const [schedule, setSchedule] = useState<IScheduleEntry[]>(initialSchedule);
    const [view, setView] = useState<View>(Views.WORK_WEEK);
    const [showForm, setShowForm] = useState(false);
    const router = useRouter();

    // Helper to parse "HH AM/PM" into {hour,minute}
    function parseHourAMPM(str: string) {
        const [hourStr, period] = str.split(" ");
        let h = parseInt(hourStr, 10);
        if (period === "PM" && h < 12) h += 12;
        if (period === "AM" && h === 12) h = 0;
        return { h, m: 0 };
    }

    const events: CalEvent[] = useMemo(() => {
        const now = new Date();
        const dow = now.getDay(); // Sunday=0
        const offset = (dow + 6) % 7; // Monday=0
        const monday = new Date(now);
        monday.setDate(now.getDate() - offset);
        monday.setHours(0, 0, 0, 0);

        return schedule.map((e) => {
            const idx = dayToIndex[e.day];
            const base = new Date(monday);
            base.setDate(monday.getDate() + idx);

            const { h: sh, m: sm } = parseHourAMPM(e.startTime);
            const { h: eh, m: em } = parseHourAMPM(e.endTime);

            const start = new Date(base);
            start.setHours(sh, sm, 0, 0);
            const end = new Date(base);
            end.setHours(eh, em, 0, 0);

            return { title: e.subject, start, end };
        });
    }, [schedule]);

    async function handleSave(newSchedule: IScheduleEntry[]) {
        const res = await fetch(`/api/classes/${classId}/schedule`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ schedule: newSchedule }),
        });
        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            console.error("Server rejected schedule:", errBody);
            throw new Error("Failed to save: " + JSON.stringify(errBody));
        }
        const body = await res.json();
        setSchedule(body.schedule);
        setShowForm(false);
        router.refresh();
    }

    return (
        <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Weekly Schedule</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded"
                >
                    Edit Schedule
                </button>
            </div>

            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                view={view}
                onView={(v) => setView(v)}
                views={["work_week", "day"]}
                style={{ height: 500 }}
                min={new Date(0, 0, 0, 8)}
                max={new Date(0, 0, 0, 18)}
            />

            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-lg w-full">
                        <ScheduleForm
                            classId={classId}
                            subjects={subjects}
                            teachers={teachers}
                            initialSchedule={schedule}
                            onClose={() => setShowForm(false)}
                            onSave={handleSave}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
