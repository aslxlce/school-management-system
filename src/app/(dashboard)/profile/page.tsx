// src/app/(dashboard)/profile/page.tsx
import { getSession } from "@/lib/auth";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
    const user = await getSession();

    if (!user) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-xl font-semibold">Not authenticated</h1>
            </div>
        );
    }

    const fullName = user.name && user.surname ? `${user.name} ${user.surname}` : user.username;

    const avatar =
        typeof user.img === "string" && user.img.trim().length > 0 ? user.img : "/avatar.png";

    return (
        <div className="p-8 max-w-xl mx-auto bg-white rounded-md shadow">
            <div className="flex items-center gap-4">
                <Image
                    src={avatar}
                    width={90}
                    height={90}
                    className="rounded-full object-cover"
                    alt="Profile image"
                />

                <div>
                    <h1 className="text-2xl font-semibold">{fullName}</h1>
                    <p className="text-gray-500 capitalize">{user.role}</p>
                </div>
            </div>

            <div className="mt-6 space-y-3 text-sm">
                <p>
                    <strong>Username:</strong> {user.username}
                </p>

                {user.name && (
                    <p>
                        <strong>Name:</strong> {user.name}
                    </p>
                )}
                {user.surname && (
                    <p>
                        <strong>Surname:</strong> {user.surname}
                    </p>
                )}

                {user.role === "student" && user.classId && (
                    <p>
                        <strong>Class ID:</strong> {user.classId}
                    </p>
                )}

                {user.role === "parent" && user.classId && (
                    <p>
                        <strong>Child’s Class ID:</strong> {user.classId}
                    </p>
                )}
            </div>
        </div>
    );
}

// // src/app/(dashboard)/profile/page.tsx
// export const dynamic = "force-dynamic";

// import Image from "next/image";
// import Link from "next/link";

// import Announcements from "@/components/Announcements";
// import BigCalendar, { type CalendarEvent } from "@/components/BigCalendar";
// import FormModal from "@/components/FormModal";

// import { getSession } from "@/lib/auth";
// import { fetchTeacherById } from "@/action/server/teacher";
// import { fetchClassById } from "@/action/server/class";

// import dbConnect from "@/lib/dbConnection";
// import { StudentModel, ParentModel } from "@/models/User";

// export default async function ProfilePage() {
//     const user = await getSession();

//     if (!user) {
//         return (
//             <div className="p-8 text-center">
//                 <h1 className="text-xl font-semibold">Not authenticated</h1>
//             </div>
//         );
//     }

//     const isAdmin = user.role === "admin";
//     const isTeacher = user.role === "teacher";
//     const isStudent = user.role === "student";
//     const isParent = user.role === "parent";

//     const fullName = user.name && user.surname ? `${user.name} ${user.surname}` : user.username;

//     const avatar =
//         typeof user.img === "string" && user.img.trim().length > 0
//             ? user.img
//             : "/default-avatar.jpg";

//     // ─────────────────────────────────────────────
//     // Extra data depending on role
//     // ─────────────────────────────────────────────

//     // teacher-related
//     let teacherSubject: string | undefined;
//     let teacherBirthday: Date | undefined;
//     let lessonsCount: number | undefined;
//     let classesCount: number | undefined;

//     // parent-related
//     let childName: string | null = null;

//     // schedule for teacher / student / parent
//     let scheduleEvents: CalendarEvent[] = [];
//     let scheduleTitle = "";
//     let showSchedule = false;

//     // TEACHER: load teacher document with schedule, stats, etc.
//     if (isTeacher) {
//         const teacher = await fetchTeacherById(user.id);

//         if (teacher) {
//             teacherSubject = teacher.subject;
//             teacherBirthday =
//                 typeof teacher.birthday === "string"
//                     ? new Date(teacher.birthday)
//                     : teacher.birthday;

//             lessonsCount = typeof teacher.lessonsCount === "number" ? teacher.lessonsCount : 0;
//             classesCount = typeof teacher.classesCount === "number" ? teacher.classesCount : 0;

//             // scheduleEvents already matches BigCalendar requirement
//             scheduleEvents = (teacher.scheduleEvents ?? []) as CalendarEvent[];
//             scheduleTitle = "Teacher’s Schedule";
//             showSchedule = true;
//         }
//     }

//     // STUDENT: use their class schedule
//     if (isStudent && user.classId && !isTeacher) {
//         const cls = await fetchClassById(user.classId);
//         if (cls?.schedule) {
//             const raw = cls.schedule;
//             if (typeof raw === "string") {
//                 try {
//                     const parsed = JSON.parse(raw) as CalendarEvent[];
//                     scheduleEvents = parsed;
//                 } catch {
//                     // ignore JSON parse error
//                 }
//             } else if (Array.isArray(raw)) {
//                 // e.g. IScheduleEntry[]
//                 scheduleEvents = raw as unknown as CalendarEvent[];
//             }
//         }
//         scheduleTitle = "Student’s Schedule";
//         showSchedule = true;
//     }

//     // PARENT: find first child + use the child class schedule
//     if (isParent && !isTeacher && !isStudent) {
//         await dbConnect();

//         const parentDoc = await ParentModel.findById(user.id)
//             .select("childrenIds")
//             .lean<{ childrenIds?: string[] }>();

//         let childClassId: string | null = null;

//         if (parentDoc?.childrenIds && parentDoc.childrenIds.length > 0) {
//             const firstChildId = parentDoc.childrenIds[0];
//             const child = await StudentModel.findById(firstChildId)
//                 .select("name surname classId")
//                 .lean<{ name?: string; surname?: string; classId?: unknown }>();

//             if (child) {
//                 const n = child.name ?? "";
//                 const s = child.surname ?? "";
//                 const combined = `${n} ${s}`.trim();
//                 childName = combined.length > 0 ? combined : null;

//                 if (child.classId) {
//                     childClassId = String(child.classId);
//                 }
//             }
//         }

//         const effectiveClassId = childClassId ?? user.classId ?? null;

//         if (effectiveClassId) {
//             const cls = await fetchClassById(effectiveClassId);
//             if (cls?.schedule) {
//                 const raw = cls.schedule;
//                 if (typeof raw === "string") {
//                     try {
//                         const parsed = JSON.parse(raw) as CalendarEvent[];
//                         scheduleEvents = parsed;
//                     } catch {
//                         // ignore JSON parse error
//                     }
//                 } else if (Array.isArray(raw)) {
//                     scheduleEvents = raw as unknown as CalendarEvent[];
//                 }
//             }
//         }

//         scheduleTitle = childName ? `${childName}'s Class Schedule` : "Child's Class Schedule";
//         showSchedule = true;
//     }

//     // ─────────────────────────────────────────────
//     // Render
//     // ─────────────────────────────────────────────

//     return (
//         <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
//             {/* Left side */}
//             <div className="w-full xl:w-2/3">
//                 {/* Header: profile card + stats cards */}
//                 <div className="flex flex-col gap-4 lg:flex-row">
//                     {/* Profile Card */}
//                     <div className="bg-[var(--sky-color)] py-6 px-4 rounded-md flex-1 flex gap-4">
//                         <div className="w-1/3">
//                             <Image
//                                 src={avatar}
//                                 alt={fullName}
//                                 width={144}
//                                 height={144}
//                                 className="w-36 h-36 rounded-full object-cover"
//                             />
//                         </div>

//                         <div className="w-2/3 flex flex-col justify-between gap-4">
//                             <div className="flex items-center gap-4">
//                                 <h1 className="text-xl font-semibold">{fullName}</h1>
//                                 {(isTeacher || isStudent) && (
//                                     <FormModal
//                                         table={isTeacher ? "teacher" : "student"}
//                                         type="update"
//                                         data={{ id: user.id }}
//                                     />
//                                 )}
//                             </div>

//                             {/* Role / extra description */}
//                             <p className="text-sm text-gray-500 capitalize">
//                                 {isTeacher && teacherSubject
//                                     ? `Teaches ${teacherSubject}`
//                                     : isStudent
//                                     ? "Student"
//                                     : isParent && childName
//                                     ? `Parent of ${childName}`
//                                     : isParent
//                                     ? "Parent"
//                                     : "Admin"}
//                             </p>

//                             {/* Contact Info */}
//                             <div className="flex flex-wrap gap-2 text-sm font-medium">
//                                 {teacherBirthday && (
//                                     <div className="flex items-center gap-2">
//                                         <Image
//                                             src="/date.png"
//                                             alt="Birthday"
//                                             width={14}
//                                             height={14}
//                                         />
//                                         <span>{teacherBirthday.toLocaleDateString()}</span>
//                                     </div>
//                                 )}

//                                 {user.email && (
//                                     <div className="flex items-center gap-2">
//                                         <Image src="/mail.png" alt="Email" width={14} height={14} />
//                                         <span>{user.email}</span>
//                                     </div>
//                                 )}

//                                 {user.phone && (
//                                     <div className="flex items-center gap-2">
//                                         <Image
//                                             src="/phone.png"
//                                             alt="Phone"
//                                             width={14}
//                                             height={14}
//                                         />
//                                         <span>{user.phone}</span>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Stats Cards – same layout as teacher page */}
//                     <div className="flex-1 flex gap-4 justify-between flex-wrap">
//                         <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%]">
//                             <Image src="/singleLesson.png" alt="Lessons" width={24} height={24} />
//                             <div>
//                                 <h1 className="text-xl font-semibold">
//                                     {isTeacher ? lessonsCount ?? 0 : "--"}
//                                 </h1>
//                                 <span className="text-sm text-gray-400">Lessons</span>
//                             </div>
//                         </div>
//                         <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%]">
//                             <Image src="/singleClass.png" alt="Classes" width={24} height={24} />
//                             <div>
//                                 <h1 className="text-xl font-semibold">
//                                     {isTeacher ? classesCount ?? 0 : "--"}
//                                 </h1>
//                                 <span className="text-sm text-gray-400">Classes</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Calendar / Schedule */}
//                 {showSchedule ? (
//                     <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
//                         <h2 className="text-lg font-semibold mb-2">{scheduleTitle}</h2>
//                         <BigCalendar events={scheduleEvents} />
//                     </div>
//                 ) : isAdmin ? (
//                     <div className="mt-4 bg-white rounded-md p-4">
//                         <h2 className="text-lg font-semibold mb-2">Schedule</h2>
//                         <p className="text-sm text-gray-500">
//                             Admin users don&apos;t have a personal schedule.
//                         </p>
//                     </div>
//                 ) : null}
//             </div>

//             {/* Right Sidebar */}
//             <div className="w-full xl:w-1/3 flex flex-col gap-4">
//                 <div className="bg-white p-4 rounded-md">
//                     <h2 className="text-xl font-semibold">Shortcuts</h2>
//                     <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
//                         {isTeacher && (
//                             <>
//                                 <Link
//                                     href={`/dashboard/list/teachers/${user.id}/classes`}
//                                     className="p-3 rounded-md bg-[var(--lightSkye-color)]"
//                                 >
//                                     Classes
//                                 </Link>
//                                 <Link
//                                     href={`/dashboard/list/teachers/${user.id}/students`}
//                                     className="p-3 rounded-md bg-[var(--purpleeLight-color)]"
//                                 >
//                                     Students
//                                 </Link>
//                                 <Link
//                                     href={`/dashboard/list/teachers/${user.id}/lessons`}
//                                     className="p-3 rounded-md bg-[var(--yellowwLight-color)]"
//                                 >
//                                     Lessons
//                                 </Link>
//                             </>
//                         )}

//                         {isStudent && user.classId && (
//                             <Link
//                                 href={`/dashboard/list/classes/${user.classId}`}
//                                 className="p-3 rounded-md bg-[var(--lightSkye-color)]"
//                             >
//                                 My Class
//                             </Link>
//                         )}

//                         {isParent && user.classId && (
//                             <Link
//                                 href={`/dashboard/list/classes/${user.classId}`}
//                                 className="p-3 rounded-md bg-[var(--purpleeLight-color)]"
//                             >
//                                 Child&apos;s Class
//                             </Link>
//                         )}
//                     </div>
//                 </div>

//                 <Announcements />
//             </div>
//         </div>
//     );
// }
