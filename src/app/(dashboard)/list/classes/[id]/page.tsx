// export const dynamic = "force-dynamic";

// import React from "react";
// import { fetchClassById } from "@/action/server/class";
// import { notFound } from "next/navigation";
// import Image from "next/image";
// import ClassScheduleSection from "@/components/ClassScheduleSection";
// import { gradeLessonMap } from "@/lib/gradeLessons";

// interface PageProps {
//     params: { id: string };
// }

// export default async function ClassDetailPage({ params }: PageProps) {
//     const cls = await fetchClassById(params.id);
//     if (!cls) notFound();

//     // derive this class’s list of subjects from its grade
//     const subjects = gradeLessonMap[cls.grade] || [];

//     return (
//         <div className="p-6 bg-white rounded-md m-4 space-y-8">
//             <header>
//                 <h1 className="text-2xl font-bold">{cls.name}</h1>
//                 <p className="text-gray-600">Grade: {cls.grade}</p>
//                 <p className="text-gray-600">
//                     Supervisor:{" "}
//                     {cls.supervisor ? `${cls.supervisor.name} ${cls.supervisor.surname}` : "None"}
//                 </p>
//             </header>

//             <section>
//                 <h2 className="text-xl font-semibold mb-2">Assigned Teachers</h2>
//                 {cls.teacherIds.length ? (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {cls.teacherIds.map((t) => (
//                             <div key={t.id} className="flex items-center gap-4 p-4 border rounded">
//                                 <Image
//                                     src={t.img || "/default-avatar.jpg"}
//                                     alt={`${t.name} ${t.surname}`}
//                                     width={48}
//                                     height={48}
//                                     className="rounded-full"
//                                 />
//                                 <div>
//                                     <p className="font-medium">
//                                         {t.name} {t.surname}
//                                     </p>
//                                     <p className="text-sm text-gray-500">{t.subject}</p>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <p className="text-gray-500">No teachers assigned.</p>
//                 )}
//             </section>

//             <section>
//                 <h2 className="text-xl font-semibold mb-2">Students</h2>
//                 {cls.studentIds.length ? (
//                     <ul className="list-disc list-inside space-y-1">
//                         {cls.studentIds.map((s) => (
//                             <li key={s.id}>
//                                 {s.name} {s.surname}
//                             </li>
//                         ))}
//                     </ul>
//                 ) : (
//                     <p className="text-gray-500">No students enrolled.</p>
//                 )}
//             </section>

//             <ClassScheduleSection
//                 classId={cls.id}
//                 initialSchedule={cls.schedule}
//                 subjects={subjects}
//             />
//         </div>
//     );
// }

// app/list/classes/[id]/page.tsx

import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchClassById } from "@/action/server/class";
import ClassScheduleSection from "@/components/ClassScheduleSection";
import { gradeLessonMap } from "@/lib/gradeLessons";

interface PageProps {
    params: { id: string };
}

export default async function ClassDetailPage({ params }: PageProps) {
    // 1) Fetch the class, or 404 if missing
    const cls = await fetchClassById(params.id);
    if (!cls) notFound();

    // 2) Build subject list from grade
    const subjects = gradeLessonMap[cls.grade] || [];

    // 3) Ensure schedule is always an array
    const schedule = cls.schedule ?? [];

    return (
        <div className="p-6 bg-white rounded-md m-4 space-y-8">
            <header>
                <h1 className="text-2xl font-bold">{cls.name}</h1>
                <p className="text-gray-600">Grade: {cls.grade}</p>
                <p className="text-gray-600">
                    Supervisor:{" "}
                    {cls.supervisor ? `${cls.supervisor.name} ${cls.supervisor.surname}` : "None"}
                </p>
            </header>

            <section>
                <h2 className="text-xl font-semibold mb-2">Assigned Teachers</h2>
                {cls.teacherIds.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cls.teacherIds.map((t) => (
                            <div key={t.id} className="flex items-center gap-4 p-4 border rounded">
                                <Image
                                    src={t.img || "/default-avatar.jpg"}
                                    alt={`${t.name} ${t.surname}`}
                                    width={48}
                                    height={48}
                                    className="rounded-full"
                                />
                                <div>
                                    <p className="font-medium">
                                        {t.name} {t.surname}
                                    </p>
                                    <p className="text-sm text-gray-500">{t.subject}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No teachers assigned.</p>
                )}
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">Students</h2>
                {cls.studentIds.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                        {cls.studentIds.map((s) => (
                            <li key={s.id}>
                                {s.name} {s.surname}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No students enrolled.</p>
                )}
            </section>

            <ClassScheduleSection classId={cls.id} initialSchedule={schedule} subjects={subjects} />
        </div>
    );
}
