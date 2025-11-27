// app/dashboard/teacher/page.tsx

import { getSession } from "@/lib/auth";
import { fetchClasses, fetchClassById, IClass } from "@/action/server/class";
import ClassScheduleSection, {
    IScheduleEntry as ClassScheduleEntry,
} from "@/components/ClassScheduleSection";
import EventCalendar from "@/components/EventCalendar";
import Announcements from "@/components/Announcements";

interface IClassWithTeacherIds extends IClass {
    teacherIds?: { id: string }[];
}

export default async function TeacherPage() {
    const session = await getSession();
    const role = session?.role;
    const teacherId = session?.id;

    const isTeacher = role === "teacher";

    let schedule: ClassScheduleEntry[] = [];

    if (isTeacher && teacherId) {
        // 1) Fetch "all" classes with teacherIds populated
        const { data } = await fetchClasses(1, 100); // 2nd arg is limit
        const allClasses = data as IClassWithTeacherIds[];

        // 2) Keep only classes where this teacher is assigned
        const teacherClasses = allClasses.filter((cls) =>
            Array.isArray(cls.teacherIds) ? cls.teacherIds.some((t) => t.id === teacherId) : false
        );

        // 3) For each of those classes, load full detail (including schedule)
        const details = await Promise.all(teacherClasses.map((cls) => fetchClassById(cls.id)));

        // 4) Aggregate schedule entries where teacherId matches this teacher
        const aggregated: ClassScheduleEntry[] = [];
        for (const cls of details) {
            if (!cls || !Array.isArray(cls.schedule)) continue;

            const filtered = cls.schedule.filter(
                (entry) => entry.teacherId === teacherId
            ) as ClassScheduleEntry[];

            aggregated.push(...filtered);
        }

        schedule = aggregated;
    }

    return (
        <div className="p-4 flex gap-4 flex-col xl:flex-row">
            {/* Left: teacher schedule */}
            <div className="w-full xl:w-2/3 bg-white p-4 rounded-md">
                <h1 className="text-xl font-semibold">Schedule</h1>

                {!isTeacher ? (
                    <p className="mt-4 text-gray-500">
                        This dashboard is only available for teacher accounts.
                    </p>
                ) : !teacherId ? (
                    <p className="mt-4 text-gray-500">No teacher information found in session.</p>
                ) : schedule.length === 0 ? (
                    <p className="mt-4 text-gray-500">
                        No schedule has been defined for this teacher yet.
                    </p>
                ) : (
                    // We reuse ClassScheduleSection in read-only mode.
                    // classId is not used when readOnly is true, so we can pass any string.
                    <ClassScheduleSection
                        classId="teacher-schedule"
                        initialSchedule={schedule}
                        readOnly
                    />
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
