"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import { useState } from "react";
import { createTeacher } from "@/action/client/teacher";

const schema = z.object({
    username: z.string().min(8, { message: "Must be at least 8 characters long!" }).max(20),
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1),
    surname: z.string().min(1),
    subject: z.string(),
    phone: z.string().min(1),
    address: z.string().min(1),
    birthday: z.string(),
    sex: z.enum(["male", "female"]),
    img: z.any(),
});

type Inputs = z.infer<typeof schema>;

const TeacherForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
    });

    const [submitting, setSubmitting] = useState(false);

    const onSubmit = handleSubmit(async (data) => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (key === "img" && value instanceof File) {
                formData.append(key, value);
            } else {
                formData.append(key, value as string);
            }
        });

        try {
            const response = await createTeacher(formData);
            // const response = await addUser(formData);
            console.log("Teacher created:", response);
        } catch (err) {
            console.error("Error creating teacher:", err);
        }
        console.log(formData);
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">Create a new teacher</h1>
            <span className="text-xs text-gray-400 font-medium">Authentication Information</span>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Username"
                    name="username"
                    defaultValue={data?.username}
                    register={register}
                    error={errors?.username}
                />
                <InputField
                    label="Email"
                    name="email"
                    type="email"
                    defaultValue={data?.email}
                    register={register}
                    error={errors?.email}
                />
                <InputField
                    label="Password"
                    name="password"
                    type="password"
                    defaultValue={data?.password}
                    register={register}
                    error={errors?.password}
                />
            </div>

            <span className="text-xs text-gray-400 font-medium">Personal Information</span>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Name"
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors?.name}
                />
                <InputField
                    label="Surname"
                    name="surname"
                    defaultValue={data?.surname}
                    register={register}
                    error={errors?.surname}
                />
                <InputField
                    label="Phone"
                    name="phone"
                    defaultValue={data?.phone}
                    register={register}
                    error={errors?.phone}
                />
                <InputField
                    label="Address"
                    name="address"
                    defaultValue={data?.address}
                    register={register}
                    error={errors?.address}
                />
                <InputField
                    label="Subject"
                    name="subject"
                    defaultValue={data?.subject}
                    register={register}
                    error={errors?.subject}
                />
                <InputField
                    label="Birthday"
                    name="birthday"
                    defaultValue={data?.birthday}
                    register={register}
                    error={errors?.birthday}
                    type="date"
                />

                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Sex</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("sex")}
                        defaultValue={data?.sex}
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    {errors.sex?.message && (
                        <p className="text-xs text-red-400">{errors.sex.message}</p>
                    )}
                </div>

                <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
                    <label
                        className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                        htmlFor="img"
                    >
                        <Image src="/upload.png" alt="" width={28} height={28} />
                        <span>Upload a photo</span>
                    </label>
                    <input type="file" id="img" {...register("img")} className="hidden" />
                    {/* {errors.img?.message && (
                        <p className="text-xs text-red-400">{errors.img.message}</p>
                    )} */}
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
