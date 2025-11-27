// app/list/subjects/[subject]/page.tsx
export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";

import { fetchTeachersBySubject } from "@/action/server/subject";
import type { IUserTeacher } from "@/types/user";

interface PageParams {
    subject: string;
}

interface PageProps {
    params: Promise<PageParams>;
}

export default async function SubjectDetailPage({ params }: PageProps) {
    const { subject } = await params;
    const decodedSubject = decodeURIComponent(subject);

    const teachers = await fetchTeachersBySubject(decodedSubject);

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 space-y-4">
            <header className="flex items-center justify-between">
                <h1 className="text-lg font-semibold">
                    Teachers for subject: <span className="text-indigo-600">{decodedSubject}</span>
                </h1>
                <Link href="/list/subjects" className="text-sm text-indigo-600 hover:underline">
                    ← Back to subjects
                </Link>
            </header>

            {teachers.length === 0 ? (
                <p className="text-gray-500">No teachers found for this subject.</p>
            ) : (
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 text-left">
                            <th className="p-2">Teacher</th>
                            <th className="p-2 hidden md:table-cell">Email</th>
                            <th className="p-2 hidden md:table-cell">Phone</th>
                            <th className="p-2 hidden lg:table-cell">Grade level</th>
                            <th className="p-2 hidden lg:table-cell">Address</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map((t: IUserTeacher) => (
                            <tr
                                key={t.id}
                                className="border-b border-gray-200 even:bg-slate-50 hover:bg-[var(--purpleeLight-color)]"
                            >
                                <td className="flex items-center gap-3 p-2">
                                    <Image
                                        src={t.img || "/default-avatar.jpg"}
                                        alt={`${t.name} ${t.surname}`}
                                        width={36}
                                        height={36}
                                        className="rounded-full object-cover"
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-medium">
                                            {t.name} {t.surname}
                                        </span>
                                        <span className="text-xs text-gray-500">{t.username}</span>
                                    </div>
                                </td>
                                <td className="p-2 hidden md:table-cell">{t.email}</td>
                                <td className="p-2 hidden md:table-cell">{t.phone}</td>
                                <td className="p-2 hidden lg:table-cell capitalize">
                                    {t.gradeLevel}
                                </td>
                                <td className="p-2 hidden lg:table-cell">{t.address}</td>
                                <td className="p-2">
                                    <Link
                                        href={`/list/teachers/${t.id}`}
                                        className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-[var(--yelloww-color)]"
                                    >
                                        <Image src="/view.png" alt="View" width={14} height={14} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
