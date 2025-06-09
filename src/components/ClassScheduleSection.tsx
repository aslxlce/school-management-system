// "use client";

// import { useState, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import moment from "moment";
// import { Calendar, momentLocalizer, Views, View, Event as CalEvent } from "react-big-calendar";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import dynamic from "next/dynamic";
// import { IScheduleEntry } from "@/types/schedule";

// const localizer = momentLocalizer(moment);
// const ScheduleForm = dynamic(() => import("@/components/forms/ScheduleForm"), {
//     ssr: false,
//     loading: () => <p>Loading…</p>,
// });

// const dayToIndex: Record<"monday" | "tuesday" | "wednesday" | "thursday" | "friday", number> = {
//     monday: 0,
//     tuesday: 1,
//     wednesday: 2,
//     thursday: 3,
//     friday: 4,
// };

// interface Props {
//     classId: string;
//     initialSchedule: IScheduleEntry[];
//     subjects: string[];
// }

// export default function ClassScheduleSection({ classId, initialSchedule, subjects }: Props) {
//     const [schedule, setSchedule] = useState<IScheduleEntry[]>(initialSchedule ?? []);
//     const [view, setView] = useState<View>(Views.WORK_WEEK);
//     const [showForm, setShowForm] = useState(false);
//     const router = useRouter();

//     const events: CalEvent[] = useMemo(() => {
//         // Monday as week start:
//         const weekStart = moment().startOf("isoWeek");
//         return schedule.map((e) => {
//             const base = weekStart.clone().add(dayToIndex[e.day], "days");
//             const [sh, sm] = e.startTime.split(":").map(Number);
//             const [eh, em] = e.endTime.split(":").map(Number);
//             return {
//                 title: e.subject,
//                 start: base.clone().hour(sh).minute(sm).toDate(),
//                 end: base.clone().hour(eh).minute(em).toDate(),
//             };
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
//         setSchedule(body.schedule ?? []);
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

// Locally re-declare your schedule types:
type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";

interface IScheduleEntry {
    day: DayOfWeek;
    startTime: string;
    endTime: string;
    subject: string;
    classId: string;
    teacherId?: string;
}

const localizer = momentLocalizer(moment);
const ScheduleForm = dynamic(() => import("./forms/ScheduleForm"), {
    ssr: false,
    loading: () => <p>Loading…</p>,
});

// Map Monday→0 … Friday→4
const dayToIndex: Record<DayOfWeek, number> = {
    monday: 0,
    tuesday: 1,
    wednesday: 2,
    thursday: 3,
    friday: 4,
};

interface Props {
    classId: string;
    initialSchedule: IScheduleEntry[];
    subjects: string[];
}

export default function ClassScheduleSection({ classId, initialSchedule, subjects }: Props) {
    const [schedule, setSchedule] = useState<IScheduleEntry[]>(initialSchedule);
    const [view, setView] = useState<View>(Views.WORK_WEEK);
    const [showForm, setShowForm] = useState(false);
    const router = useRouter();

    const events: CalEvent[] = useMemo(() => {
        const weekStart = moment().startOf("isoWeek"); // Monday
        return schedule.map((e) => {
            const base = weekStart.clone().add(dayToIndex[e.day], "days");
            const [sh, sm] = e.startTime.split(":").map(Number);
            const [eh, em] = e.endTime.split(":").map(Number);
            return {
                title: e.subject,
                start: base.clone().hour(sh).minute(sm).toDate(),
                end: base.clone().hour(eh).minute(em).toDate(),
            };
        });
    }, [schedule]);

    async function handleSave(newSchedule: IScheduleEntry[]) {
        const res = await fetch(`/api/classes/${classId}/schedule`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ schedule: newSchedule }),
        });
        if (!res.ok) throw new Error("Failed to save");
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
