"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";

const schema = z.object({
    username: z
        .string()
        .min(8, { message: "Must be at least 8 characters long!" })
        .max(20, { message: "Must be at most 20 characters long!" }),
    email: z.string().email({ message: "Invalid email address!" }),
    password: z.string().min(8, { message: "Must be at least 8 characters long!" }),
    firstName: z.string().min(1, { message: "Required !" }),
    lastName: z.string().min(1, { message: "Required !" }),
    phone: z.string().min(1, { message: "Required !" }),
    adress: z.string().min(1, { message: "Required !" }),
});

type Inputs = z.infer<typeof schema>;

const ParentForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
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
            <h1 className="text-xl font-semibold">Create a new Parent</h1>
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
                    label="First Name"
                    name="firstName"
                    defaultValue={data?.firstName}
                    register={register}
                    error={errors?.firstName}
                />
                <InputField
                    label="Last Name"
                    name="lastName"
                    defaultValue={data?.lastName}
                    register={register}
                    error={errors?.lastName}
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
            </div>
            <button className="bg-blue-400 text-white p-2 rounded-md">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default ParentForm;
