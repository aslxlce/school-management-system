// "use client";

// import { Field, Form, Formik } from "formik";
// import FormField from "./FormField";
// import * as Yup from "yup";
// import { useMutation } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { doCredentialLogin } from "@/action/client/auth";

// const loginSchema = Yup.object().shape({
//     email: Yup.string().email("Invalid email address").required("Email is required"),
//     password: Yup.string().required("Password is required"),
// });

// export default function LoginForm() {
//     const router = useRouter();

//     const { mutate, isPending, isError, error } = useMutation({
//         mutationFn: (values: { email: string; password: string }) =>
//             doCredentialLogin({
//                 email: values.email,
//                 password: values.password,
//             }),
//         onSuccess: (user) => {
//             if (user) {
//                 router.push("/");
//             }
//         },
//         onError: (error) => {
//             console.error("Login Error:", error);
//         },
//     });

//     return (
//         <Formik
//             initialValues={{
//                 email: "",
//                 password: "",
//             }}
//             validationSchema={loginSchema}
//             onSubmit={(values) => mutate(values)}
//         >
//             <Form className="space-y-4">
//                 <FormField label="Email" name="email">
//                     <Field type="email" name="email" className="input input-bordered w-full" />
//                 </FormField>

//                 <FormField label="Password" name="password">
//                     <Field
//                         type="password"
//                         name="password"
//                         className="input input-bordered w-full"
//                     />
//                 </FormField>

//                 {isError && (
//                     <div className="text-sm text-red-500">
//                         {error instanceof Error ? error.message : "An error occurred during login"}
//                     </div>
//                 )}

//                 <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
//                     {isPending ? "Signing In..." : "Sign In"}
//                 </button>
//             </Form>
//         </Formik>
//     );
// }
