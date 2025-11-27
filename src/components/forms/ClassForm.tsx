"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { getEligibleTeachersByGradeAndLesson } from "@/action/client/teacher";
import { getEligibleStudentsByGrade } from "@/action/client/student";
import { gradeLessonMap, gradeOptions, getGradeLevelFromGrade } from "@/lib/gradeLessons";
import { createClass, updateClass, ClassPayload } from "@/action/client/class";
import { IUserStudent, IUserTeacher } from "@/types/user";

interface ClassFormValues {
    className: string;
    grade: string;
    supervisorId?: string;
    teachersBySubject: Record<string, string>;
    studentIds: string[];
}

interface ClassFormProps {
    type: "create" | "update";
    data?: Partial<ClassFormValues> & { id?: string };
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

    const selectedGrade = watch("grade", data?.grade ?? gradeOptions[0]);
    const subjects = gradeLessonMap[selectedGrade] || [];

    const classId = data?.id ?? "";

    const allTeachers: IUserTeacher[] = Array.from(
        new Map(
            Object.values(teachersBySubject)
                .flat()
                .map((t) => [t.id, t] as [string, IUserTeacher])
        ).values()
    );

    const loadDataForGrade = async (
        grade: string,
        initialStudentIds: string[] = [],
        initialTeachersBySubject?: Record<string, string>
    ): Promise<void> => {
        console.log("[ClassForm] loadDataForGrade:", grade);

        const newSubjects = gradeLessonMap[grade] || [];

        const blankMap: Record<string, string> = {};
        newSubjects.forEach((subj) => {
            const initialTeacherId =
                initialTeachersBySubject && initialTeachersBySubject[subj]
                    ? initialTeachersBySubject[subj]
                    : "";
            blankMap[subj] = initialTeacherId;
        });
        setValue("teachersBySubject", blankMap);

        const level = getGradeLevelFromGrade(grade);
        const teachersMap: Record<string, IUserTeacher[]> = {};

        await Promise.all(
            newSubjects.map(async (subj) => {
                try {
                    const list = await getEligibleTeachersByGradeAndLesson(level, subj);
                    console.log("[ClassForm] teachers for", subj, "→", list);
                    teachersMap[subj] = list;
                } catch (err) {
                    console.error("[ClassForm] error fetching teachers for", subj, err);
                    teachersMap[subj] = [];
                }
            })
        );

        setTeachersBySubject(teachersMap);

        try {
            const stuList = await getEligibleStudentsByGrade(grade, classId);
            console.log("👧👦 eligible students for grade", grade, "→", stuList);

            // split into already-selected & available
            const selected: IUserStudent[] = stuList.filter((s) =>
                initialStudentIds.includes(s.id)
            );
            const available: IUserStudent[] = stuList.filter(
                (s) => !initialStudentIds.includes(s.id)
            );

            setSelectedStudents(selected);
            setAvailableStudents(available);
            setValue(
                "studentIds",
                selected.map((s) => s.id),
                { shouldValidate: true }
            );
        } catch (err) {
            console.error("[ClassForm] error fetching students:", err);
            setSelectedStudents([]);
            setAvailableStudents([]);
            setValue("studentIds", [], { shouldValidate: true });
        }
    };

    useEffect(() => {
        const initialGrade = data?.grade ?? gradeOptions[0];
        const initialStudentIds = data?.studentIds ?? [];
        const initialTeachersBySubject = data?.teachersBySubject;

        setValue("grade", initialGrade, { shouldValidate: false });

        void loadDataForGrade(initialGrade, initialStudentIds, initialTeachersBySubject);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = handleSubmit(async (form) => {
        const teacherIds = Object.values(form.teachersBySubject).filter((tid) => tid !== "");
        const studentIds = selectedStudents.map((s) => s.id); // ALWAYS send, even if []

        const payload: ClassPayload = {
            name: form.className.trim(),
            grade: form.grade,
            supervisor: form.supervisorId || undefined,
            teacherIds: teacherIds.length ? teacherIds : [],
            studentIds,
        };

        try {
            if (type === "create") {
                await createClass(payload);
                setStatusMessage("Class created successfully!");
            } else if (type === "update" && classId) {
                await updateClass(classId, payload);
                setStatusMessage("Class updated successfully!");
            }
            onSuccess?.();
        } catch (err) {
            console.error("Error saving class:", err);
            setStatusMessage("Failed to save class. Please try again.");
        }
    });

    async function onGradeChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const newGrade = e.target.value;
        setValue("grade", newGrade, { shouldValidate: true });

        // when changing grade in edit mode, we reset selections
        await loadDataForGrade(newGrade, [], {});
    }

    function onAddStudent(e: React.ChangeEvent<HTMLSelectElement>) {
        const id = e.target.value;
        if (!id) return;

        const stu = availableStudents.find((s) => s.id === id);
        if (!stu) return;

        const nextSelected = [...selectedStudents, stu];
        const nextAvailable = availableStudents.filter((s) => s.id !== id);

        setSelectedStudents(nextSelected);
        setAvailableStudents(nextAvailable);
        setValue(
            "studentIds",
            nextSelected.map((s) => s.id),
            { shouldValidate: true }
        );

        e.target.selectedIndex = 0;
    }

    function onRemoveStudent(id: string) {
        const stu = selectedStudents.find((s) => s.id === id);
        if (!stu) return;

        const nextSelected = selectedStudents.filter((s) => s.id !== id);
        const nextAvailable = [...availableStudents, stu];

        setSelectedStudents(nextSelected);
        setAvailableStudents(nextAvailable);
        setValue(
            "studentIds",
            nextSelected.map((s) => s.id),
            { shouldValidate: true }
        );
    }

    // ─────────────────────────────────────────────
    // JSX
    // ─────────────────────────────────────────────
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
                        defaultValue={selectedGrade}
                    >
                        {gradeOptions.map((g) => (
                            <option key={g} value={g}>
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
                                {allTeachers.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name} {t.surname}
                                    </option>
                                ))}
                            </select>
                        )}
                    />
                </div>

                {/* Assign Teachers by Subject */}
                {subjects.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-600">
                            Assign Teachers by Subject (optional)
                        </h3>
                        {subjects.map((subj) => {
                            const opts = teachersBySubject[subj] || [];
                            return (
                                <div key={subj} className="flex flex-col">
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
                                                {opts.map((t) => (
                                                    <option key={t.id} value={t.id}>
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
                        {availableStudents.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name} {s.surname}
                            </option>
                        ))}
                    </select>

                    {/* Selected students (can remove) */}
                    <div className="flex flex-wrap gap-2">
                        {selectedStudents.map((s) => (
                            <div
                                key={s.id}
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
                    {type === "create" ? "Save Class" : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
