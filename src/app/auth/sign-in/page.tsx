"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import FormField from "./FormField";
import { doCredentialLogin } from "@/action/client/auth";
import { LoginSchemaType } from "@/schemas/authSchema";
import { UserType } from "@/types/user";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const { mutate, isPending, isError, error } = useMutation({
        mutationFn: (values: LoginSchemaType) =>
            doCredentialLogin({
                email: values.email,
                password: values.password,
            }),
        onSuccess: (user: UserType) => {
            if (user) {
                router.push("/");
            }
        },
        onError: (error: Error) => {
            console.error("Login Error:", error.message);
        },
    });

    return (
        <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
            <FormField label="Email" name="email">
                <input
                    type="email"
                    {...register("email")}
                    className="input input-bordered w-full"
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </FormField>

            <FormField label="Password" name="password">
                <input
                    type="password"
                    {...register("password")}
                    className="input input-bordered w-full"
                />
                {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
            </FormField>

            {isError && (
                <div className="text-sm text-red-500">
                    {error instanceof Error ? error.message : "An error occurred during login"}
                </div>
            )}

            <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
                {isPending ? "Signing In..." : "Sign In"}
            </button>
        </form>
    );
}
