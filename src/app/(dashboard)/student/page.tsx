// import Announcements from "@/components/Announcements";
// import BigCalendar from "@/components/BigCalendar";
// import EventCalendar from "@/components/EventCalendar";

// const StudentPage = () => {
//     return (
//         <div className="p-4 flex gap-4 flex-col xl:flex-row">
//             {/* Left  */}
//             <div className="w-full xl:w-2/3">
//                 <div className="h-full bg-white p-4 rounded-md">
//                     <h1 className="text-xl font-semibold">Schecule (4A)</h1>
//                     {/* <BigCalendar /> */}
//                 </div>
//             </div>
//             {/* Right  */}
//             <div className="w-full xl:w-1/3 flex flex-col gap-8">
//                 <EventCalendar />
//                 <Announcements />
//             </div>
//         </div>
//     );
// };

// export default StudentPage;

// app/dashboard/student/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import Announcements from "@/components/Announcements";
import BigCalendar, { type CalendarEvent } from "@/components/BigCalendar";
import EventCalendar from "@/components/EventCalendar";
import {
    fetchMyStudentProfile,
    type IUserStudentWithSchedule,
    type IScheduleEntry,
} from "@/action/client/student";

const StudentPage = () => {
    const { data: session, status } = useSession();
    const [student, setStudent] = useState<IUserStudentWithSchedule | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status !== "authenticated" || !session?.user?.id) return;
        setLoading(true);
        fetchMyStudentProfile(session.user.id)
            .then(setStudent)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [status, session]);

    if (status === "loading" || loading) {
        return <p>Loading your schedule…</p>;
    }
    if (!student) {
        return <p>Couldn’t load your profile.</p>;
    }
    if (!Array.isArray(student.schedule) || student.schedule.length === 0) {
        return <p>No schedule assigned yet.</p>;
    }

    // Compute Monday of current ISO week
    const now = new Date();
    const monday = new Date(now);
    // ((day+6)%7) shifts Monday→0 … Friday→4
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));

    const dayMap: Record<IScheduleEntry["day"], number> = {
        monday: 0,
        tuesday: 1,
        wednesday: 2,
        thursday: 3,
        friday: 4,
    };

    const events: CalendarEvent[] = student.schedule.map((e) => {
        const base = new Date(monday);
        base.setDate(monday.getDate() + dayMap[e.day]);

        // parse both "08 AM" and "08:00"
        const [sh, sm] = e.startTime.split(/[: ]/).map(Number);
        const [eh, em] = e.endTime.split(/[: ]/).map(Number);

        const start = new Date(base);
        start.setHours(sh, sm, 0, 0);
        const end = new Date(base);
        end.setHours(eh, em, 0, 0);

        return { title: e.subject, start, end };
    });

    return (
        <div className="p-4 flex gap-4 flex-col xl:flex-row">
            {/* Left column: calendar */}
            <div className="w-full xl:w-2/3">
                <div className="h-full bg-white p-4 rounded-md">
                    <h1 className="text-xl font-semibold">Schedule (Grade {student.grade})</h1>
                    <BigCalendar events={events} />
                </div>
            </div>

            {/* Right column: events & announcements */}
            <div className="w-full xl:w-1/3 flex flex-col gap-8">
                <EventCalendar />
                <Announcements />
            </div>
        </div>
    );
};

export default StudentPage;
