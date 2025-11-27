"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import InputField from "../InputField";
import { gradeOptions } from "@/lib/gradeLessons";
import Image from "next/image";
import { createStudent, updateStudent } from "@/action/client/student";
import { fetchParentsByName } from "@/action/client/parent";
import { fetchClassesByGrade } from "@/action/client/class";

const schema = z.object({
    username: z.string().min(8).max(20),
    password: z.string().min(8),
    name: z.string(),
    surname: z.string(),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().min(8).optional().or(z.literal("")),
    address: z.string(),
    sex: z.enum(["male", "female"]),
    birthday: z.string(),
    grade: z.string().nonempty(),
    parentId: z.string().optional(),
    classId: z.string().optional(),
    img: z
        .instanceof(FileList)
        .optional()
        .refine((v) => !v || v.length <= 1, { message: "Upload at most one file" }),
});

type Inputs = z.infer<typeof schema>;

export default function StudentForm({
    type,
    data,
}: {
    type: "create" | "update";
    data?: Partial<Inputs> & { id?: string };
}) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
        defaultValues: {
            classId: data?.classId ?? "",
            parentId: data?.parentId ?? "",
            ...data,
        },
    });

    const [parentOpts, setParentOpts] = useState<{ id: string; label: string }[]>([]);
    const [classOpts, setClassOpts] = useState<{ id: string; name: string }[]>([]);
    const [noParents, setNoParents] = useState(false);
    const [noClasses, setNoClasses] = useState(false);
    const [parentInput, setParentInput] = useState("");

    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const handleParentSearch = (q: string) => {
        setParentInput(q);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            if (!q.trim()) {
                setParentOpts([]);
                setNoParents(false);
                return;
            }
            try {
                const list = await fetchParentsByName(q);
                setParentOpts(list.map((p) => ({ id: p._id, label: `${p.name} ${p.surname}` })));
                setNoParents(list.length === 0);
            } catch {
                setParentOpts([]);
                setNoParents(true);
            }
        }, 300);
    };

    const handleGradeChange = async (g: string) => {
        setValue("grade", g);
        setClassOpts([]);
        setNoClasses(false);
        if (!g) return;
        try {
            const list = await fetchClassesByGrade(g);
            setClassOpts(list.map((c) => ({ id: c._id, name: c.name })));
            setNoClasses(list.length === 0);
        } catch {
            setClassOpts([]);
            setNoClasses(true);
        }
    };

    const onValid = async (form: Inputs) => {
        const fd = new FormData();
        (Object.entries(form) as Array<[keyof Inputs, unknown]>).forEach(([k, v]) => {
            if (k === "img" && v instanceof FileList && v.length > 0) {
                fd.append("img", v[0]);
            } else if (v !== undefined) {
                fd.append(k, String(v));
            }
        });

        if (type === "create") {
            await createStudent(fd);
        } else if (data?.id) {
            await updateStudent(data.id, fd);
        }
        window.location.reload();
    };

    const onInvalid = (errs: typeof errors) => {
        console.log("Validation errors:", errs);
    };

    const doSubmit = handleSubmit(onValid, onInvalid);

    return (
        <form className="flex flex-col gap-8" noValidate>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new student" : "Update student"}
            </h1>

            {/* AUTH */}
            <span className="text-xs text-gray-500 font-medium">Authentication</span>
            <div className="flex flex-wrap gap-4">
                <InputField
                    label="Username"
                    name="username"
                    register={register}
                    error={errors.username}
                />
                <InputField
                    label="Password"
                    name="password"
                    type="password"
                    register={register}
                    error={errors.password}
                />
                <InputField
                    label="Email (optional)"
                    name="email"
                    type="email"
                    register={register}
                    error={errors.email}
                />
            </div>

            {/* PERSONAL */}
            <span className="text-xs text-gray-500 font-medium">Personal Info</span>
            <div className="flex flex-wrap gap-4">
                <InputField label="Name" name="name" register={register} error={errors.name} />
                <InputField
                    label="Surname"
                    name="surname"
                    register={register}
                    error={errors.surname}
                />
                <InputField
                    label="Phone (optional)"
                    name="phone"
                    register={register}
                    error={errors.phone}
                />
                <InputField
                    label="Address"
                    name="address"
                    register={register}
                    error={errors.address}
                />
                <div className="flex flex-col gap-1 w-full sm:w-1/4">
                    <label className="text-xs text-gray-500">Sex</label>
                    <select
                        {...register("sex")}
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    {errors.sex && <p className="text-xs text-red-400">{errors.sex.message}</p>}
                </div>
                <InputField
                    label="Birthday"
                    name="birthday"
                    type="date"
                    register={register}
                    error={errors.birthday}
                />
            </div>

            {/* ENROLLMENT */}
            <span className="text-xs text-gray-500 font-medium">Enrollment</span>
            <div className="flex flex-wrap gap-4">
                {/* Grade */}
                <div className="flex flex-col gap-1 w-full sm:w-1/4">
                    <label className="text-xs text-gray-500">Grade</label>
                    <select
                        {...register("grade", {
                            onChange: (e) => handleGradeChange(e.target.value),
                        })}
                        defaultValue={data?.grade ?? ""}
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
                    >
                        <option value="">Select grade</option>
                        {gradeOptions.map((g) => (
                            <option key={g} value={g}>
                                {g}
                            </option>
                        ))}
                    </select>
                    {errors.grade && <p className="text-xs text-red-400">{errors.grade.message}</p>}
                </div>

                {/* Class */}
                {watch("grade") && (
                    <div className="flex flex-col gap-1 w-full sm:w-1/3">
                        <label className="text-xs text-gray-500">
                            Class <span className="italic text-gray-400">(optional)</span>
                        </label>
                        {noClasses ? (
                            <p className="text-sm text-red-400 py-2">No classes found</p>
                        ) : (
                            <select
                                {...register("classId")}
                                defaultValue={data?.classId ?? ""}
                                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
                            >
                                <option value="">— none —</option>
                                {classOpts.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                )}

                {/* Parent */}
                <div className="flex flex-col gap-1 w-full sm:w-1/3 relative">
                    <label className="text-xs text-gray-500">
                        Parent <span className="italic text-gray-400">(optional)</span>
                    </label>
                    <input
                        type="text"
                        value={parentInput}
                        placeholder="Start typing parent name…"
                        onChange={(e) => handleParentSearch(e.target.value)}
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
                    />
                    {parentOpts.length > 0 && (
                        <ul className="absolute top-full left-0 right-0 bg-white ring-1 ring-gray-200 shadow-md z-10 max-h-48 overflow-auto">
                            {parentOpts.map((p) => (
                                <li
                                    key={p.id}
                                    onClick={() => {
                                        setValue("parentId", p.id);
                                        setParentInput(p.label);
                                        setParentOpts([]);
                                    }}
                                    className="px-3 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                                >
                                    {p.label}
                                </li>
                            ))}
                        </ul>
                    )}
                    {noParents && <p className="text-sm text-red-400 py-2">No parents found</p>}
                    <input type="hidden" {...register("parentId")} />
                </div>
            </div>

            {/* PHOTO */}
            <span className="text-xs text-gray-500 font-medium">Profile Photo</span>
            <label
                htmlFor="img"
                className="flex items-center gap-2 cursor-pointer w-max text-sm text-blue-600"
            >
                <Image src="/upload.png" alt="upload" width={24} height={24} />
                Upload
            </label>
            <input id="img" type="file" {...register("img")} className="hidden" />
            {errors.img && <p className="text-xs text-red-400">{errors.img.message}</p>}

            {/* SUBMIT */}
            <button
                type="button"
                onClick={doSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded-md w-max"
            >
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
}
