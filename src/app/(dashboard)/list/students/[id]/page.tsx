// import Announcements from "@/components/Announcements";
// import BigCalendar from "@/components/BigCalendar";
// import Performance from "@/components/Performance";
// import Image from "next/image";
// import Link from "next/link";

// const SingleStudentPage = () => {
//     return (
//         <div className="flex-1 p-4  flex flex-col gap-4 xl:flex-row">
//             {/* Left  */}
//             <div className="w-full xl:w-2/3">
//                 {/* Top  */}
//                 <div className=" flex flex-col gap-4 lg:flex-row">
//                     {/* User Info card  */}
//                     <div className="bg-[var(--sky-color)] py-6 px-4 rounded-md flex-1 flex gap-4">
//                         <div className="w-1/3">
//                             <Image
//                                 src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1200"
//                                 alt=""
//                                 width={144}
//                                 height={144}
//                                 className="w-36 h-36 rounded-full object-cover"
//                             />
//                         </div>
//                         <div className="w-2/3 flex flex-col justify-between gap-4">
//                             <h1 className="text-xl font-semibold">Huha</h1>
//                             <p className="text-sm text-gray-500">
//                                 Lorem ipsum dolor sit amet consectetur adipisicing elit.
//                             </p>
//                             <div className="flex items-center justify-between gap-2 flex-wrap text-sm font-medium">
//                                 <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
//                                     <Image src="/blood.png" alt="" width={14} height={14} />
//                                     <span>A+</span>
//                                 </div>
//                                 <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
//                                     <Image src="/date.png" alt="" width={14} height={14} />
//                                     <span>Jan 2025</span>
//                                 </div>
//                                 <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
//                                     <Image src="/mail.png" alt="" width={14} height={14} />
//                                     <span>hahahuhu@gmail.com</span>
//                                 </div>
//                                 <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
//                                     <Image src="/phone.png" alt="" width={14} height={14} />
//                                     <span>+9012345678</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     {/* Small Info card  */}
//                     <div className="flex-1 flex gap-4 justify-between flex-wrap">
//                         {/* Card  */}
//                         <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
//                             <Image
//                                 src="/singleAttendance.png"
//                                 alt=""
//                                 width={24}
//                                 height={24}
//                                 className="w-6 h-6"
//                             />
//                             <div className="">
//                                 <h1 className="text-xl font-semibold">90%</h1>
//                                 <span className="text-sm text-gray-400">Attendance</span>
//                             </div>
//                         </div>
//                         {/* Card  */}
//                         <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
//                             <Image
//                                 src="/singleBranch.png"
//                                 alt=""
//                                 width={24}
//                                 height={24}
//                                 className="w-6 h-6"
//                             />
//                             <div className="">
//                                 <h1 className="text-xl font-semibold">6th</h1>
//                                 <span className="text-sm text-gray-400">Grade</span>
//                             </div>
//                         </div>
//                         {/* Card  */}
//                         <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
//                             <Image
//                                 src="/singleLesson.png"
//                                 alt=""
//                                 width={24}
//                                 height={24}
//                                 className="w-6 h-6"
//                             />
//                             <div className="">
//                                 <h1 className="text-xl font-semibold">18</h1>
//                                 <span className="text-sm text-gray-400">Lessons</span>
//                             </div>
//                         </div>
//                         {/* Card  */}
//                         <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
//                             <Image
//                                 src="/singleClass.png"
//                                 alt=""
//                                 width={24}
//                                 height={24}
//                                 className="w-6 h-6"
//                             />
//                             <div className="">
//                                 <h1 className="text-xl font-semibold">6A</h1>
//                                 <span className="text-sm text-gray-400">Class</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {/* Bottom  */}
//                 <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
//                     <h1 className="">Student&apos;s Schecule</h1>
//                     <BigCalendar />
//                 </div>
//             </div>
//             {/* Right  */}
//             <div className="w-full xl:w-1/3 flex flex-col gap-4">
//                 <div className="bg-white p-4 rounded-md">
//                     <h1 className="text-xl font-semibold">Shortcuts</h1>
//                     <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
//                         <Link className="p-3 rounded-md bg-[var(--lightSkye-color)]" href="/">
//                             Student&apos;s Lessons
//                         </Link>
//                         <Link className="p-3 rounded-md bg-[var(--purpleeLight-color)]" href="/">
//                             Student&apos;s Teachers
//                         </Link>
//                         <Link className="p-3 rounded-md bg-[var(--yellowwLight-color)]" href="/">
//                             Student&apos;s Exams
//                         </Link>
//                         <Link className="p-3 rounded-md bg-pink-50" href="/">
//                             Student&apos;s Assignments
//                         </Link>
//                         <Link className="p-3 rounded-md bg-[var(--lightSkye-color)]" href="/">
//                             Student&apos;s Results
//                         </Link>
//                     </div>
//                 </div>
//                 <Performance />
//                 <Announcements />
//             </div>
//         </div>
//     );
// };

// export default SingleStudentPage;
// src/app/dashboard/list/students/[id]/page.tsx
export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchStudentById } from "@/action/server/student";
import { fetchClassById } from "@/action/server/class";
import BigCalendar from "@/components/BigCalendar";
import Announcements from "@/components/Announcements";

interface PageProps {
    params: { id: string };
}

// Helper to parse "08 AM" or "14:00"
function parseTime(t: string): { h: number; m: number } {
    if (t.includes("AM") || t.includes("PM")) {
        const [hourPart, period] = t.split(" ");
        let h = parseInt(hourPart, 10);
        if (period === "PM" && h < 12) h += 12;
        if (period === "AM" && h === 12) h = 0;
        return { h, m: 0 };
    }
    const [h, m] = t.split(":").map(Number);
    return { h, m };
}

export default async function SingleStudentPage({ params }: PageProps) {
    // 1) Fetch student
    const student = await fetchStudentById(params.id);
    if (!student) notFound();

    // 2) Fetch their class for schedule and name
    const cls = student.classId ? await fetchClassById(student.classId) : null;

    // 3) Build calendar events
    const events = (cls?.schedule ?? []).map((e) => {
        const now = new Date();
        const dow = now.getDay();
        const monOffset = (dow + 6) % 7;
        const monday = new Date(now);
        monday.setDate(now.getDate() - monOffset);
        monday.setHours(0, 0, 0, 0);

        const dayIndex = ["monday", "tuesday", "wednesday", "thursday", "friday"].indexOf(e.day);
        const base = new Date(monday);
        base.setDate(monday.getDate() + dayIndex);

        const { h: sh, m: sm } = parseTime(e.startTime);
        const { h: eh, m: em } = parseTime(e.endTime);

        const start = new Date(base);
        start.setHours(sh, sm, 0, 0);
        const end = new Date(base);
        end.setHours(eh, em, 0, 0);

        const className = cls?.name ?? "Class";
        return { title: `${e.subject} (${className})`, start, end };
    });

    return (
        <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
            {/* Left */}
            <div className="w-full xl:w-2/3">
                {/* Header: Profile + Basic Info */}
                <div className="flex flex-col gap-4 lg:flex-row">
                    <div className="bg-[var(--sky-color)] py-6 px-4 rounded-md flex-1 flex gap-4">
                        <div className="w-1/3">
                            <Image
                                src={
                                    typeof student.img === "string" && student.img.startsWith("/")
                                        ? student.img
                                        : "/default-avatar.jpg"
                                }
                                alt={`${student.name} ${student.surname}`}
                                width={144}
                                height={144}
                                className="w-36 h-36 rounded-full object-cover"
                            />
                        </div>
                        <div className="w-2/3 flex flex-col justify-between gap-4">
                            <h1 className="text-2xl font-semibold">
                                {student.name} {student.surname}
                            </h1>
                            <div className="text-sm text-gray-500">
                                Grade: <span className="font-medium">{student.grade}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                                Class: <span className="font-medium">{cls?.name ?? "—"}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 text-sm font-medium">
                                {student.email && (
                                    <div className="flex items-center gap-2">
                                        <Image src="/mail.png" alt="Email" width={14} height={14} />
                                        <span>{student.email}</span>
                                    </div>
                                )}
                                {student.phone && (
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src="/phone.png"
                                            alt="Phone"
                                            width={14}
                                            height={14}
                                        />
                                        <span>{student.phone}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex-1 flex gap-4 justify-between flex-wrap">
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%]">
                            <Image src="/singleBranch.png" alt="Grade" width={24} height={24} />
                            <div>
                                <h1 className="text-xl font-semibold">{student.grade}</h1>
                                <span className="text-sm text-gray-400">Grade</span>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%]">
                            <Image src="/singleClass.png" alt="Class" width={24} height={24} />
                            <div>
                                <h1 className="text-xl font-semibold">{cls?.name ?? "—"}</h1>
                                <span className="text-sm text-gray-400">Class</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Schedule */}
                <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
                    <h2 className="text-lg font-semibold mb-2">Class Schedule</h2>
                    <BigCalendar events={events} />
                </div>
            </div>

            {/* Right */}
            <div className="w-full xl:w-1/3 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-md">
                    <h2 className="text-xl font-semibold">Shortcuts</h2>
                    <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
                        <Link
                            href={`/dashboard/list/students/${params.id}/results`}
                            className="p-3 rounded-md bg-[var(--lightSkye-color)]"
                        >
                            Results
                        </Link>
                        <Link
                            href={`/dashboard/list/students/${params.id}/attendance`}
                            className="p-3 rounded-md bg-[var(--purpleeLight-color)]"
                        >
                            Attendance
                        </Link>
                        <Link
                            href={`/dashboard/list/students/${params.id}/assignments`}
                            className="p-3 rounded-md bg-[var(--yellowwLight-color)]"
                        >
                            Assignments
                        </Link>
                    </div>
                </div>

                <Announcements />
            </div>
        </div>
    );
}
