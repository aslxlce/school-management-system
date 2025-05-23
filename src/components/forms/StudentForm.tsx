"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import { createStudent } from "@/action/client/student";
import { useState } from "react";

const schema = z.object({
    username: z
        .string()
        .min(8, { message: "Must be at least 8 characters long!" })
        .max(20, { message: "Must be at most 20 characters long!" }),
    email: z.string().email({ message: "Invalid email address!" }),
    password: z.string().min(8, { message: "Must be at least 8 characters long!" }),
    name: z.string().min(1, { message: "Required !" }),
    surname: z.string().min(1, { message: "Required !" }),
    phone: z.string().min(1, { message: "Required !" }),
    adress: z.string().min(1, { message: "Required !" }),
    parentId: z.string().min(1, { message: "Required !" }),
    classId: z.number().min(1, { message: "Required !" }),
    gradeId: z.number().min(1, { message: "Required !" }),
    birthday: z.date({ message: "Required !" }),
    sex: z.enum(["male", "female"], { message: "Required !" }),
    img: z.instanceof(File, { message: "Required !" }),
});

type Inputs = z.infer<typeof schema>;

const StudentForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
    });

    // const onSubmit = handleSubmit((data) => {
    //     console.log(data);
    // });

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
            const response = await createStudent(formData);
            console.log("Teacher created:", response);
        } catch (err) {
            console.error("Error creating teacher:", err);
        }
        console.log(formData);
    });
    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">Create a new student</h1>
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
                    label="Adress"
                    name="adress"
                    defaultValue={data?.adress}
                    register={register}
                    error={errors?.adress}
                />
                <InputField
                    label="Parent ID"
                    name="parentId"
                    defaultValue={data?.parentId}
                    register={register}
                    error={errors?.parentId}
                />
                <InputField
                    label="Class ID"
                    name="classId"
                    defaultValue={data?.classId}
                    register={register}
                    error={errors?.classId}
                />
                <InputField
                    label="Grade ID"
                    name="gradeId"
                    defaultValue={data?.gradeId}
                    register={register}
                    error={errors?.gradeId}
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
                        <p className="text-xs text-red-400">{errors.sex.message.toString()}</p>
                    )}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
                    <label
                        className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                        htmlFor="img"
                    >
                        <Image src="/upload.png" alt="" width={28} height={28} />
                        <span className="">Upload a photo</span>
                    </label>
                    <input type="file" id="img" {...register("img")} className="hidden" />
                    {errors.img?.message && (
                        <p className="text-xs text-red-400">{errors.img.message.toString()}</p>
                    )}
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

export default StudentForm;
