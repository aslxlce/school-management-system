// src/components/forms/TeacherForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import { useState } from "react";
import { createTeacher, updateTeacher, type TeacherPayload } from "@/action/client/teacher";
import { subjects } from "@/lib/gradeLessons";
import type { Sex } from "@/types/user";

const gradeLevels = ["primary", "middle", "high"] as const;
const sexOptions = ["male", "female"] as const;

// Common/base schema (password optional here, required only in createSchema)
const baseSchema = z.object({
    username: z.string().min(8).max(20),
    email: z.string().email(),
    password: z.string().min(8).optional(),
    name: z.string().min(1),
    surname: z.string().min(1),
    subject: z.enum(subjects),
    phone: z.string().min(1),
    address: z.string().min(1),
    birthday: z.string().min(1), // we'll send ISO to backend
    sex: z.enum(sexOptions),
    img: z.unknown().optional(), // file input
    gradeLevel: z.enum(gradeLevels),
});

// Create: password required
const createSchema = baseSchema.extend({
    password: z.string().min(8),
});

// Update: password optional
const updateSchema = baseSchema;

type Inputs = z.infer<typeof baseSchema>;

interface TeacherFormProps {
    type: "create" | "update";
    // When updating we expect an id on data
    data?: Partial<Inputs> & { id?: string; img?: string };
    onSuccess?: () => void;
    onCancel?: () => void;
}

const TeacherForm = ({ type, data, onSuccess, onCancel }: TeacherFormProps) => {
    const schema = type === "create" ? createSchema : updateSchema;

    // Default values: normalize birthday and clear password in update mode
    const defaultValues: Partial<Inputs> | undefined =
        type === "update" && data
            ? {
                  ...data,
                  birthday: data.birthday ? data.birthday.slice(0, 10) : "",
                  password: "",
              }
            : undefined;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
        defaultValues,
    });

    const [submitting, setSubmitting] = useState(false);

    // Local preview for the photo (existing img or newly selected file)
    const [previewSrc, setPreviewSrc] = useState<string | undefined>(data?.img);
    // Actual img value we will send to backend (base64 or existing string)
    const [imgValue, setImgValue] = useState<string | undefined>(data?.img);

    const onSubmit = handleSubmit(async (formValues) => {
        try {
            setSubmitting(true);

            const payload: TeacherPayload = {
                username: formValues.username,
                email: formValues.email,
                name: formValues.name,
                surname: formValues.surname,
                phone: formValues.phone,
                address: formValues.address,
                subject: formValues.subject,
                gradeLevel: formValues.gradeLevel,
                sex: formValues.sex as Sex,
                birthday: new Date(formValues.birthday).toISOString(),
                img: imgValue ?? data?.img, // use new img if chosen, otherwise keep old
            };

            if (formValues.password && formValues.password.trim().length > 0) {
                payload.password = formValues.password;
            }

            if (type === "update") {
                if (!data?.id) {
                    console.error("Missing teacher id for update");
                    return;
                }
                const response = await updateTeacher(data.id, payload);
                console.log("Teacher updated:", response);
            } else {
                const response = await createTeacher(payload);
                console.log("Teacher created:", response);
            }

            onSuccess?.();
        } catch (err) {
            console.error(
                type === "create" ? "Error creating teacher:" : "Error updating teacher:",
                err
            );
        } finally {
            setSubmitting(false);
        }
    });

    // Register the img field so RHF/zod know about it
    const imgRegister = register("img");

    const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        imgRegister.onChange(e); // keep RHF in sync

        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result;
            if (typeof result === "string") {
                setPreviewSrc(result);
                setImgValue(result); // base64 string for backend
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <form className="flex flex-col gap-8 w-full max-w-4xl mx-auto" onSubmit={onSubmit}>
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

                {/* Subject Dropdown – same width as before */}
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Subject</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("subject")}
                        defaultValue={defaultValues?.subject ?? ""}
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

                {/* Grade Level Dropdown – same width as before */}
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Grade Level</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("gradeLevel")}
                        defaultValue={defaultValues?.gradeLevel ?? ""}
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

                {/* Sex Dropdown – same width as before */}
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Sex</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("sex")}
                        defaultValue={defaultValues?.sex ?? ""}
                    >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    {errors.sex?.message && (
                        <p className="text-xs text-red-400">{errors.sex.message}</p>
                    )}
                </div>

                {/* Image upload + preview – same width as before */}
                <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
                    <label
                        htmlFor="img"
                        className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                    >
                        <Image
                            src={previewSrc || "/avatar.png"}
                            alt="Teacher photo"
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                        />
                        <span>{previewSrc ? "Change photo" : "Upload a photo"}</span>
                    </label>

                    <input
                        id="img"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        {...imgRegister}
                        onChange={handleImgChange}
                    />
                </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-2 rounded-md w-full sm:w-auto"
                    disabled={submitting}
                >
                    {submitting ? "Submitting..." : type === "create" ? "Create" : "Update"}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="border px-6 py-2 rounded-md w-full sm:w-auto"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default TeacherForm;
