// app/dashboard/student/page.tsx

import { fetchClassById } from "@/action/server/class";
import ClassScheduleSection, {
    IScheduleEntry as ClassScheduleEntry,
} from "@/components/ClassScheduleSection";
import EventCalendar from "@/components/EventCalendar";
import Announcements from "@/components/Announcements";
import { getSession } from "@/lib/auth";

export default async function StudentPage() {
    const session = await getSession();
    const role = session?.role;
    const classId = session?.classId;

    const hasStudentRole = role === "student";

    let schedule: ClassScheduleEntry[] = [];

    if (hasStudentRole && classId) {
        const cls = await fetchClassById(classId);

        if (cls && Array.isArray(cls.schedule)) {
            // cls.schedule is structurally compatible with ClassScheduleEntry
            schedule = cls.schedule as ClassScheduleEntry[];
        }
    }

    return (
        <div className="p-4 flex gap-4 flex-col xl:flex-row">
            {/* Left: student schedule */}
            <div className="w-full xl:w-2/3 bg-white p-4 rounded-md">
                <h1 className="text-xl font-semibold">Schedule</h1>

                {!hasStudentRole ? (
                    <p className="mt-4 text-gray-500">
                        This dashboard is only available for student accounts.
                    </p>
                ) : !classId ? (
                    <p className="mt-4 text-gray-500">
                        No class is assigned to this student yet. Please contact the administration.
                    </p>
                ) : schedule.length === 0 ? (
                    <p className="mt-4 text-gray-500">
                        No schedule has been defined for this class yet.
                    </p>
                ) : (
                    <ClassScheduleSection classId={classId} initialSchedule={schedule} readOnly />
                )}
            </div>

            {/* Right: other widgets */}
            <div className="w-full xl:w-1/3 flex flex-col gap-8">
                <EventCalendar />
                <Announcements />
            </div>
        </div>
    );
}
