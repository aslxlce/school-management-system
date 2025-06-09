"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { getEligibleTeachersByGradeAndLesson, IUserTeacher } from "@/action/client/teacher";
import { getEligibleStudentsByGrade, IUserStudent } from "@/action/client/student";
import { gradeLessonMap, gradeOptions, getGradeLevelFromGrade } from "@/lib/gradeLessons";
import { createClass } from "@/action/client/class";

interface ClassFormValues {
    className: string;
    grade: string;
    supervisorId?: string;
    teachersBySubject: Record<string, string>;
    studentIds: string[];
}

interface ClassFormProps {
    type: "create" | "update";
    data?: Partial<ClassFormValues>;
    onSuccess?: () => void;
}

export default function ClassForm({ type, data, onSuccess }: ClassFormProps) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ClassFormValues>({
        defaultValues: {
            className: "",
            grade: gradeOptions[0],
            supervisorId: "",
            teachersBySubject: {},
            studentIds: [],
            ...data,
        },
    });

    const [teachersBySubject, setTeachersBySubject] = useState<Record<string, IUserTeacher[]>>({});
    const [availableStudents, setAvailableStudents] = useState<IUserStudent[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<IUserStudent[]>([]);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const selectedGrade = watch("grade", gradeOptions[0]);
    const subjects = gradeLessonMap[selectedGrade] || [];

    const allTeachers: IUserTeacher[] = Array.from(
        new Map(
            Object.values(teachersBySubject)
                .flat()
                .map((t) => [t.id, t] as [string, IUserTeacher])
        ).values()
    );

    const onSubmit = handleSubmit(async (form) => {
        const teacherIds = Object.values(form.teachersBySubject).filter((tid) => tid !== "");

        const payload: {
            name: string;
            grade: string;
            supervisor?: string;
            teacherIds?: string[];
            studentIds?: string[];
        } = {
            name: form.className.trim(),
            grade: form.grade,
        };

        if (form.supervisorId) payload.supervisor = form.supervisorId;
        if (teacherIds.length) payload.teacherIds = teacherIds;
        if (selectedStudents.length) payload.studentIds = selectedStudents.map((s) => s.id);

        try {
            await createClass(payload);
            setStatusMessage("Class created successfully!");
            onSuccess?.();
        } catch (err) {
            console.error("Error creating class:", err);
            setStatusMessage("Failed to create class. Please try again.");
        }
    });

    async function onGradeChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const newGrade = e.target.value;
        setValue("grade", newGrade, { shouldValidate: true });

        const newSubjects = gradeLessonMap[newGrade] || [];
        const blankMap: Record<string, string> = {};
        newSubjects.forEach((subj) => (blankMap[subj] = ""));
        setValue("teachersBySubject", blankMap);

        const level = getGradeLevelFromGrade(newGrade);
        const newMap: Record<string, IUserTeacher[]> = {};
        await Promise.all(
            newSubjects.map(async (subj) => {
                try {
                    const list = await getEligibleTeachersByGradeAndLesson(level, subj);
                    newMap[subj] = list;
                } catch {
                    newMap[subj] = [];
                }
            })
        );
        setTeachersBySubject(newMap);

        try {
            const stuList = await getEligibleStudentsByGrade(newGrade);
            setAvailableStudents(stuList);
            setSelectedStudents([]);
            setValue("studentIds", [], { shouldValidate: true });
        } catch {
            setAvailableStudents([]);
            setSelectedStudents([]);
            setValue("studentIds", [], { shouldValidate: true });
        }
    }

    function onAddStudent(e: React.ChangeEvent<HTMLSelectElement>) {
        const id = e.target.value;
        if (!id) return;
        const stu = availableStudents.find((s) => s.id === id);
        if (!stu) return;
        const next = [...selectedStudents, stu];
        setSelectedStudents(next);
        setAvailableStudents((prev) => prev.filter((s) => s.id !== id));
        setValue(
            "studentIds",
            next.map((s) => s.id),
            { shouldValidate: true }
        );
        e.target.selectedIndex = 0;
    }

    function onRemoveStudent(id: string) {
        const stu = selectedStudents.find((s) => s.id === id);
        if (!stu) return;
        const next = selectedStudents.filter((s) => s.id !== id);
        setSelectedStudents(next);
        setAvailableStudents((prev) => [...prev, stu]);
        setValue(
            "studentIds",
            next.map((s) => s.id),
            { shouldValidate: true }
        );
    }

    return (
        <div className="max-h-[80vh] overflow-y-auto p-4">
            <form
                onSubmit={onSubmit}
                className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg space-y-6"
            >
                <h2 className="text-2xl font-semibold text-gray-700">
                    {type === "create" ? "Create Class" : "Update Class"}
                </h2>

                {statusMessage && (
                    <div className="text-center text-sm text-green-600">{statusMessage}</div>
                )}

                {/* Class Name */}
                <div className="flex flex-col">
                    <label htmlFor="className" className="mb-2 text-gray-600 font-medium">
                        Class Name
                    </label>
                    <input
                        id="className"
                        {...register("className", { required: "Class name is required" })}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
                        placeholder="e.g. Class 7A"
                    />
                    {errors.className && (
                        <p className="text-red-500 text-sm mt-1">{errors.className.message}</p>
                    )}
                </div>

                {/* Grade */}
                <div className="flex flex-col">
                    <label htmlFor="grade" className="mb-2 text-gray-600 font-medium">
                        Grade
                    </label>
                    <select
                        id="grade"
                        {...register("grade", { required: true })}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
                        onChange={onGradeChange}
                    >
                        {gradeOptions.map((g, i) => (
                            <option key={i} value={g}>
                                Grade {g}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Supervisor */}
                <div className="flex flex-col">
                    <label htmlFor="supervisorId" className="mb-2 text-gray-600 font-medium">
                        Supervisor (optional)
                    </label>
                    <Controller
                        name="supervisorId"
                        control={control}
                        render={({ field }) => (
                            <select
                                {...field}
                                id="supervisorId"
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
                            >
                                <option value="">-- No Supervisor --</option>
                                {allTeachers.map((t, i) => (
                                    <option key={i} value={t.id}>
                                        {t.name} {t.surname}
                                    </option>
                                ))}
                            </select>
                        )}
                    />
                </div>

                {/* Assign Teachers */}
                {subjects.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-600">
                            Assign Teachers by Subject (optional)
                        </h3>
                        {subjects.map((subj, i) => {
                            const opts = teachersBySubject[subj] || [];
                            return (
                                <div key={i} className="flex flex-col">
                                    <label className="mb-2 text-gray-600 font-medium">{subj}</label>
                                    <Controller
                                        name={`teachersBySubject.${subj}`}
                                        control={control}
                                        render={({ field }) => (
                                            <select
                                                {...field}
                                                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
                                            >
                                                <option value="">-- No Teacher Assigned --</option>
                                                {opts.map((t, j) => (
                                                    <option key={j} value={t.id}>
                                                        {t.name} {t.surname}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Select Students */}
                <div className="flex flex-col">
                    <label htmlFor="studentSelect" className="mb-2 text-gray-600 font-medium">
                        Select Student (optional)
                    </label>
                    <select
                        id="studentSelect"
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 mb-2"
                        onChange={onAddStudent}
                    >
                        <option value="">-- Choose a Student --</option>
                        {availableStudents.map((s, i) => (
                            <option key={i} value={s.id}>
                                {s.name} {s.surname}
                            </option>
                        ))}
                    </select>
                    <div className="flex flex-wrap gap-2">
                        {selectedStudents.map((s, i) => (
                            <div
                                key={i}
                                className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                            >
                                {s.name} {s.surname}
                                <button
                                    type="button"
                                    onClick={() => onRemoveStudent(s.id)}
                                    className="ml-1 text-red-600 hover:text-red-800"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
                >
                    Save Class
                </button>
            </form>
        </div>
    );
}
