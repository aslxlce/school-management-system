// "use client";

// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import FormField from "./FormField";
// import { doCredentialLogin } from "@/action/client/auth";
// import { LoginSchemaType } from "@/schemas/authSchema";
// import { UserType } from "@/types/user";

// const loginSchema = z.object({
//     email: z.string().email("Invalid email address"),
//     password: z.string().min(1, "Password is required"),
// });

// type LoginFormData = z.infer<typeof loginSchema>;

// export default function LoginForm() {
//     const router = useRouter();

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm<LoginFormData>({
//         resolver: zodResolver(loginSchema),
//     });

//     const { mutate, isPending, isError, error } = useMutation({
//         mutationFn: (values: LoginSchemaType) =>
//             doCredentialLogin({
//                 email: values.email,
//                 password: values.password,
//             }),
//         onSuccess: (user: UserType) => {
//             if (user) {
//                 router.push("/");
//             }
//         },
//         onError: (error: Error) => {
//             console.error("Login Error:", error.message);
//         },
//     });

//     return (
//         <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
//             <FormField label="Email" name="email">
//                 <input
//                     type="email"
//                     {...register("email")}
//                     className="input input-bordered w-full"
//                 />
//                 {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
//             </FormField>

//             <FormField label="Password" name="password">
//                 <input
//                     type="password"
//                     {...register("password")}
//                     className="input input-bordered w-full"
//                 />
//                 {errors.password && (
//                     <p className="text-sm text-red-500">{errors.password.message}</p>
//                 )}
//             </FormField>

//             {isError && (
//                 <div className="text-sm text-red-500">
//                     {error instanceof Error ? error.message : "An error occurred during login"}
//                 </div>
//             )}

//             <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
//                 {isPending ? "Signing In..." : "Sign In"}
//             </button>
//         </form>
//     );
// }

"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function SignInPage() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const result = await signIn("credentials", {
                username: data.username,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                setError("root", { message: result.error });
                return;
            }

            router.push("/");
            router.refresh();
        } catch (error) {
            setError("root", { message: "An error occurred during sign in" });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">Sign in</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Username
                            </label>
                            <input
                                {...register("username")}
                                type="text"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <input
                                {...register("password")}
                                type="password"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {errors.root && (
                        <p className="text-sm text-red-600 text-center">{errors.root.message}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isSubmitting ? "Signing in..." : "Sign in"}
                    </button>
                </form>
            </div>
        </div>
    );
}
