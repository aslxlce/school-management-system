// app/list/classes/[id]/page.tsx

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { fetchClassById } from "@/action/server/class";
import ClassScheduleSection from "@/components/ClassScheduleSection";
import { gradeLessonMap } from "@/lib/gradeLessons";
import { getSession } from "@/lib/auth";
import FormModal from "@/components/FormModal";
import type { IUserTeacher, IUserStudent } from "@/types/user";

interface PageParams {
    id: string;
}

interface PageProps {
    params: Promise<PageParams>;
}

export default async function ClassDetailPage({ params }: PageProps) {
    // Next.js: params is a Promise in latest app router
    const { id } = await params;

    const [session, cls] = await Promise.all([getSession(), fetchClassById(id)]);
    if (!cls) notFound();

    const role = session?.role;
    const subjectsForGrade = gradeLessonMap[cls.grade] || [];
    const schedule = cls.schedule ?? [];

    // Build subject -> teacherId map from existing teachers
    // For each subject, pick the first teacher whose `subject` matches
    const initialTeachersBySubject: Record<string, string> = {};
    subjectsForGrade.forEach((subj) => {
        const teacherForSubject = cls.teacherIds.find((t: IUserTeacher) => t.subject === subj);
        if (teacherForSubject) {
            initialTeachersBySubject[subj] = teacherForSubject.id;
        }
    });

    // Pre-fill data for ClassForm (update)
    const updateData: {
        id: string;
        className: string;
        grade: string;
        supervisorId: string;
        teachersBySubject: Record<string, string>;
        studentIds: string[];
    } = {
        id: cls.id,
        className: cls.name,
        grade: String(cls.grade),
        supervisorId: cls.supervisor ? cls.supervisor.id : "",
        teachersBySubject: initialTeachersBySubject,
        studentIds: cls.studentIds.map((s: IUserStudent) => s.id),
    };

    return (
        <div className="p-6 bg-white rounded-md m-4 space-y-8">
            {/* Header */}
            <header className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">{cls.name}</h1>
                    <p className="text-gray-600">Grade: {cls.grade}</p>
                    <p className="text-gray-600">
                        Supervisor:{" "}
                        {cls.supervisor ? (
                            <Link
                                href={`/list/teachers/${cls.supervisor.id}`}
                                className="text-indigo-600 hover:underline"
                            >
                                {cls.supervisor.name} {cls.supervisor.surname}
                            </Link>
                        ) : (
                            "None"
                        )}
                    </p>
                </div>

                {role === "admin" && (
                    <FormModal
                        table="class"
                        type="update"
                        data={updateData as Record<string, unknown>}
                    />
                )}
            </header>

            {/* Teachers */}
            <section>
                <h2 className="text-xl font-semibold mb-2">Assigned Teachers</h2>
                {cls.teacherIds.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cls.teacherIds.map((t: IUserTeacher) => (
                            <Link
                                key={t.id}
                                href={`/list/teachers/${t.id}`}
                                className="flex items-center gap-4 p-4 border rounded hover:bg-slate-50 transition"
                            >
                                <Image
                                    src={t.img || "/default-avatar.jpg"}
                                    alt={`${t.name} ${t.surname}`}
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-medium">
                                        {t.name} {t.surname}
                                    </p>
                                    <p className="text-sm text-gray-500">{t.subject}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No teachers assigned.</p>
                )}
            </section>

            {/* Students */}
            <section>
                <h2 className="text-xl font-semibold mb-2">Students</h2>
                {cls.studentIds.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                        {cls.studentIds.map((s: IUserStudent) => (
                            <li key={s.id}>
                                <Link
                                    href={`/list/students/${s.id}`}
                                    className="text-indigo-600 hover:underline"
                                >
                                    {s.name} {s.surname}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No students enrolled.</p>
                )}
            </section>

            {/* Schedule */}
            <ClassScheduleSection
                classId={cls.id}
                initialSchedule={schedule}
                subjects={subjectsForGrade}
                teachers={cls.teacherIds}
            />
        </div>
    );
}
