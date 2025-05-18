"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";

const schema = z.object({
    className: z
        .string()
        .min(3, { message: "Must be at least 8 characters long!" })
        .max(20, { message: "Must be at most 20 characters long!" }),
    capacity: z.number().min(1, { message: "Required !" }),
    grade: z.number().min(1, { message: "Required !" }),
    superVisor: z.string().min(3, { message: "Required !" }),
});

type Inputs = z.infer<typeof schema>;

const ClassForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
    });

    const onSubmit = handleSubmit((data) => {
        console.log(data);
    });
    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">Create a new Class</h1>
            <span className="text-xs text-gray-400 font-medium">Authentication Information</span>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Class Name"
                    name="className"
                    defaultValue={data?.className}
                    register={register}
                    error={errors?.className}
                />
                <InputField
                    label="Class Capacity"
                    name="capacity"
                    defaultValue={data?.capacity}
                    register={register}
                    error={errors?.capacity}
                />
                <InputField
                    label="Grade"
                    name="grade"
                    defaultValue={data?.grade}
                    register={register}
                    error={errors?.grade}
                />
                <InputField
                    label="Supervisor"
                    name="superVisor"
                    defaultValue={data?.superVisor}
                    register={register}
                    error={errors?.superVisor}
                />
            </div>

            <button className="bg-blue-400 text-white p-2 rounded-md">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default ClassForm;
