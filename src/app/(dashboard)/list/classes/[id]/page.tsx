import { fetchClassById } from "@/action/server/class";
import Image from "next/image";
import { notFound } from "next/navigation";

interface ClassDetailPageProps {
    params: { id: string };
}

export default async function ClassDetailPage({ params }: ClassDetailPageProps) {
    const cls = await fetchClassById(params.id);

    if (!cls) return notFound();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Class: {cls.name}</h1>
            <p>
                <strong>Grade:</strong> {cls.grade}
            </p>
            <p>
                <strong>Schedule:</strong> {cls.schedule || "N/A"}
            </p>
            <p>
                <strong>Lessons:</strong> {cls.lessons?.join(", ") || "N/A"}
            </p>

            <h2 className="text-xl mt-6 mb-2 font-semibold">Supervisor</h2>
            {cls.supervisor ? (
                <div className="flex items-center gap-4 mb-6">
                    <Image
                        src={cls.supervisor.img}
                        alt="Supervisor"
                        width={50}
                        height={50}
                        className="rounded-full"
                    />
                    <div>
                        <p>
                            {cls.supervisor.name} {cls.supervisor.surname}
                        </p>
                        <p className="text-sm text-gray-500">{cls.supervisor.subject}</p>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500">No supervisor assigned.</p>
            )}

            <h2 className="text-xl mt-6 mb-2 font-semibold">Teachers</h2>
            <div className="grid grid-cols-2 gap-4">
                {cls.teacherIds?.map((teacher) => (
                    <div key={teacher.id} className="p-4 border rounded-md flex gap-3 items-center">
                        <Image
                            src={teacher.img}
                            alt="Teacher"
                            width={50}
                            height={50}
                            className="rounded-full"
                        />
                        <div>
                            <p>
                                {teacher.name} {teacher.surname}
                            </p>
                            <p className="text-sm text-gray-500">{teacher.subject}</p>
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="text-xl mt-6 mb-2 font-semibold">Students</h2>
            <div className="grid grid-cols-2 gap-4">
                {cls.studentIds?.map((student) => (
                    <div key={student.id} className="p-4 border rounded-md flex gap-3 items-center">
                        <Image
                            src={student.img}
                            alt="Student"
                            width={50}
                            height={50}
                            className="rounded-full"
                        />
                        <div>
                            <p>
                                {student.name} {student.surname}
                            </p>
                            <p className="text-sm text-gray-500">Grade: {student.gradeId}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
