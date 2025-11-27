"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import { useState } from "react";
import { createTeacher } from "@/action/client/teacher";
import { subjects } from "@/lib/gradeLessons";

const gradeLevels = ["primary", "middle", "high"] as const;

const schema = z.object({
    username: z.string().min(8).max(20),
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1),
    surname: z.string().min(1),
    subject: z.enum(subjects),
    phone: z.string().min(1),
    address: z.string().min(1),
    birthday: z.string(),
    sex: z.enum(["male", "female"]),
    img: z.any().optional(),
    gradeLevel: z.enum(gradeLevels),
});

type Inputs = z.infer<typeof schema>;

interface TeacherFormProps {
    type: "create" | "update";
    data?: Partial<Inputs>;
    onSuccess?: () => void;
}

const TeacherForm = ({ type, data, onSuccess }: TeacherFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
        defaultValues: data,
    });

    const [submitting, setSubmitting] = useState(false);

    const onSubmit = handleSubmit(async (formValues) => {
        try {
            setSubmitting(true);
            const formData = new FormData();

            for (const [key, value] of Object.entries(formValues)) {
                if (key === "img" && value instanceof FileList && value.length > 0) {
                    formData.append(key, value[0]);
                } else if (key === "birthday") {
                    formData.append(key, new Date(value).toISOString());
                } else {
                    formData.append(key, value as string);
                }
            }

            const response = await createTeacher(formData);
            console.log("Teacher created:", response);
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Error creating teacher:", err);
        } finally {
            setSubmitting(false);
        }
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new teacher" : "Update teacher"}
            </h1>

            <span className="text-xs text-gray-400 font-medium">Authentication Information</span>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Username"
                    name="username"
                    register={register}
                    error={errors.username}
                />
                <InputField
                    label="Email"
                    name="email"
                    type="email"
                    register={register}
                    error={errors.email}
                />
                <InputField
                    label="Password"
                    name="password"
                    type="password"
                    register={register}
                    error={errors.password}
                />
            </div>

            <span className="text-xs text-gray-400 font-medium">Personal Information</span>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField label="Name" name="name" register={register} error={errors.name} />
                <InputField
                    label="Surname"
                    name="surname"
                    register={register}
                    error={errors.surname}
                />
                <InputField label="Phone" name="phone" register={register} error={errors.phone} />
                <InputField
                    label="Address"
                    name="address"
                    register={register}
                    error={errors.address}
                />

                {/* Subject Dropdown */}
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Subject</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("subject")}
                        defaultValue={data?.subject ?? ""}
                    >
                        <option value="">Select subject</option>
                        {subjects.map((subject) => (
                            <option key={subject} value={subject}>
                                {subject}
                            </option>
                        ))}
                    </select>
                    {errors.subject?.message && (
                        <p className="text-xs text-red-400">{errors.subject.message}</p>
                    )}
                </div>

                {/* Grade Level Dropdown */}
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Grade Level</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("gradeLevel")}
                        defaultValue={data?.gradeLevel ?? ""}
                    >
                        <option value="">Select level</option>
                        {gradeLevels.map((level) => (
                            <option key={level} value={level}>
                                {level}
                            </option>
                        ))}
                    </select>
                    {errors.gradeLevel?.message && (
                        <p className="text-xs text-red-400">{errors.gradeLevel.message}</p>
                    )}
                </div>

                <InputField
                    label="Birthday"
                    name="birthday"
                    type="date"
                    register={register}
                    error={errors.birthday}
                />

                {/* Sex Dropdown */}
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Sex</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("sex")}
                        defaultValue={data?.sex ?? ""}
                    >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    {errors.sex?.message && (
                        <p className="text-xs text-red-400">{errors.sex.message}</p>
                    )}
                </div>

                {/* Image Upload */}
                <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
                    <label
                        className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                        htmlFor="img"
                    >
                        <Image src="/upload.png" alt="Upload" width={28} height={28} />
                        <span>Upload a photo</span>
                    </label>
                    <input type="file" id="img" {...register("img")} className="hidden" />
                </div>
            </div>

            <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-md"
                disabled={submitting}
            >
                {submitting ? "Submitting..." : type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default TeacherForm;
