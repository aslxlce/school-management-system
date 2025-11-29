// src/app/dashboard/list/students/[id]/page.tsx
export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { fetchStudentById } from "@/action/server/student";
import { fetchClassById } from "@/action/server/class";
import BigCalendar from "@/components/BigCalendar";
import Announcements from "@/components/Announcements";
import FormModal from "@/components/FormModal";

interface PageProps {
    // Next 15 passes params as a Promise
    params: Promise<{ id: string }>;
}

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

export default async function SingleStudentPage(props: PageProps) {
    const { id } = await props.params;

    const student = await fetchStudentById(id);
    if (!student) notFound();

    const cls = student.classId ? await fetchClassById(student.classId) : null;

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

    // Safe avatar src
    const isValidImgSrc =
        typeof student.img === "string" &&
        (student.img.startsWith("/") ||
            student.img.startsWith("http://") ||
            student.img.startsWith("https://") ||
            student.img.startsWith("data:"));

    const avatarSrc: string =
        isValidImgSrc && typeof student.img === "string" ? student.img : "/default-avatar.jpg";

    return (
        <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
            {/* Left */}
            <div className="w-full xl:w-2/3">
                {/* Header: Profile + Basic Info */}
                <div className="flex flex-col gap-4 lg:flex-row">
                    <div className="bg-[var(--sky-color)] py-6 px-4 rounded-md flex-1 flex gap-4">
                        <div className="w-1/3">
                            <Image
                                src={avatarSrc}
                                alt={`${student.name} ${student.surname}`}
                                width={144}
                                height={144}
                                className="w-36 h-36 rounded-full object-cover"
                            />
                        </div>

                        <div className="w-2/3 flex flex-col justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <h1 className="text-2xl font-semibold">
                                    {student.name} {student.surname}
                                </h1>
                                <FormModal table="student" type="update" data={{ ...student }} />
                            </div>

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
                            <Image
                                src="/singleBranch.png"
                                alt="Grade"
                                width={40}
                                height={40}
                                className="w-10 h-10 object-contain"
                            />
                            <div>
                                <h1 className="text-xl font-semibold">{student.grade}</h1>
                                <span className="text-sm text-gray-400">Grade</span>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%]">
                            <Image
                                src="/singleClass.png"
                                alt="Class"
                                width={40}
                                height={40}
                                className="w-10 h-10 object-contain"
                            />
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
                            href={`/list/students/${id}/results`}
                            className="p-3 rounded-md bg-[var(--lightSkye-color)]"
                        >
                            Results
                        </Link>
                        <Link
                            href={`/list/students/${id}/assignments`}
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
