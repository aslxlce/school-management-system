// "use client";

// import { useState, useRef, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import InputField from "../InputField";
// import { createParent, updateParent, ParentPayload } from "@/action/client/parent";
// import { fetchStudentsByName, IStudentLite } from "@/action/client/student";

// const schema = z.object({
//     username: z
//         .string()
//         .min(8, { message: "Must be at least 8 characters long!" })
//         .max(20, { message: "Must be at most 20 characters long!" }),
//     email: z.string().email({ message: "Invalid email address!" }),
//     password: z.string().min(8, { message: "Must be at least 8 characters long!" }),
//     name: z.string().min(1, { message: "First name is required!" }),
//     surname: z.string().min(1, { message: "Last name is required!" }),
//     phone: z.string().min(1, { message: "Phone is required!" }),
//     address: z.string().min(1, { message: "Address is required!" }),

//     childrenIds: z
//         .preprocess((val) => {
//             if (val === "" || val === undefined || val === null) {
//                 return [];
//             }
//             return val;
//         }, z.array(z.string()))
//         .optional(),
// });

// type Inputs = z.infer<typeof schema>;

// type ParentFormProps = {
//     type: "create" | "update";
//     data?: Partial<Inputs> & {
//         id?: string;
//         childrenIds?: string[];
//         childrenLabels?: string[];
//     };
// };

// type StudentOption = {
//     id: string;
//     label: string;
// };

// export default function ParentForm({ type, data }: ParentFormProps) {
//     const {
//         register,
//         handleSubmit,
//         setValue,
//         watch,
//         formState: { errors },
//     } = useForm<Inputs>({
//         resolver: zodResolver(schema),
//         defaultValues: {
//             username: data?.username ?? "",
//             email: data?.email ?? "",
//             password: data?.password ?? "",
//             name: data?.name ?? "",
//             surname: data?.surname ?? "",
//             phone: data?.phone ?? "",
//             address: data?.address ?? "",
//             childrenIds: data?.childrenIds ?? [],
//         },
//     });

//     useEffect(() => {
//         register("childrenIds");
//     }, [register]);

//     console.log("🔍 [RHF errors]:", errors);

//     const [submitting, setSubmitting] = useState(false);
//     const [studentQuery, setStudentQuery] = useState("");
//     const [studentOpts, setStudentOpts] = useState<StudentOption[]>([]);
//     const [noStudents, setNoStudents] = useState(false);
//     const [selectedStudents, setSelectedStudents] = useState<StudentOption[]>([]);
//     const debounceTimer = useRef<NodeJS.Timeout | null>(null);
//     const initializedFromData = useRef(false);

//     const childrenIds = watch("childrenIds") || [];
//     console.log("🔍 [childrenIds]:", childrenIds);

//     useEffect(() => {
//         if (type !== "update") return;
//         if (initializedFromData.current) return;

//         const ids = data?.childrenIds;
//         if (!ids || !Array.isArray(ids) || ids.length === 0) return;

//         const labels = data?.childrenLabels ?? [];

//         const initialSelected: StudentOption[] = ids.map((id, index) => ({
//             id,
//             label: labels[index] ?? `Student ${index + 1}`,
//         }));

//         setSelectedStudents(initialSelected);
//         setValue("childrenIds", ids, { shouldValidate: false });

//         initializedFromData.current = true;
//     }, [type, data, setValue]);

//     const handleStudentSearch = (q: string) => {
//         setStudentQuery(q);

//         if (debounceTimer.current) {
//             clearTimeout(debounceTimer.current);
//         }

//         debounceTimer.current = setTimeout(async () => {
//             const trimmed = q.trim();
//             if (!trimmed) {
//                 setStudentOpts([]);
//                 setNoStudents(false);
//                 return;
//             }

//             try {
//                 const list: IStudentLite[] = await fetchStudentsByName(trimmed);
//                 console.log("👀 [handleStudentSearch] received:", list);

//                 if (!Array.isArray(list)) {
//                     console.error("[handleStudentSearch] Expected array, got:", list);
//                     setStudentOpts([]);
//                     setNoStudents(true);
//                     return;
//                 }

//                 const mapped: StudentOption[] = list
//                     .map((s) => {
//                         const id = s._id ?? s.id;
//                         if (!id) return null;
//                         const label = s.username
//                             ? `${s.name} ${s.surname} (${s.username})`
//                             : `${s.name} ${s.surname}`;
//                         return { id, label };
//                     })
//                     .filter((opt): opt is StudentOption => opt !== null);

//                 const filtered = mapped.filter(
//                     (stu) => !selectedStudents.some((sel) => sel.id === stu.id)
//                 );

//                 setStudentOpts(filtered);
//                 setNoStudents(filtered.length === 0);
//             } catch (error) {
//                 console.error("❌ [handleStudentSearch] error:", error);
//                 setStudentOpts([]);
//                 setNoStudents(true);
//             }
//         }, 300);
//     };

//     const addChild = (id: string, label: string) => {
//         console.log("➕ addChild", { id, label });
//         if (!selectedStudents.some((s) => s.id === id)) {
//             const updated = [...selectedStudents, { id, label }];
//             setSelectedStudents(updated);
//             setValue(
//                 "childrenIds",
//                 updated.map((x) => x.id),
//                 { shouldValidate: true }
//             );
//         }
//         setStudentOpts([]);
//         setStudentQuery("");
//     };

//     const removeChild = (id: string) => {
//         const updated = selectedStudents.filter((s) => s.id !== id);
//         setSelectedStudents(updated);
//         setValue(
//             "childrenIds",
//             updated.map((x) => x.id),
//             { shouldValidate: true }
//         );
//     };

//     const onSubmit = handleSubmit(async (form) => {
//         console.log("▶️ [onSubmit] form values:", form);

//         const payload: ParentPayload = {
//             username: form.username.trim(),
//             password: form.password.trim(),
//             email: form.email.trim(),
//             name: form.name.trim(),
//             surname: form.surname.trim(),
//             phone: form.phone.trim(),
//             address: form.address.trim(),
//             childrenIds: form.childrenIds ?? [],
//         };

//         try {
//             setSubmitting(true);
//             if (type === "create") {
//                 console.log("▶️ [onSubmit] calling createParent…");
//                 const result = await createParent(payload);
//                 console.log("✅ [onSubmit] createParent returned:", result);
//             } else if (type === "update" && data?.id) {
//                 console.log("▶️ [onSubmit] calling updateParent…", data.id);
//                 const result = await updateParent(data.id, payload);
//                 console.log("✅ [onSubmit] updateParent returned:", result);
//             } else {
//                 console.warn("[onSubmit] update called without id, ignoring");
//             }

//             window.location.reload();
//         } catch (error) {
//             console.error("❌ [onSubmit] parent save failed:", error);
//         } finally {
//             setSubmitting(false);
//         }
//     });

//     return (
//         <form className="flex flex-col gap-8" onSubmit={onSubmit}>
//             <h1 className="text-xl font-semibold">
//                 {type === "create" ? "Create a new Parent" : "Update Parent"}
//             </h1>

//             {/* AUTH FIELDS */}
//             <span className="text-xs text-gray-400 font-medium">Authentication Information</span>
//             <div className="flex flex-wrap gap-4">
//                 <InputField
//                     label="Username"
//                     name="username"
//                     defaultValue={data?.username}
//                     register={register}
//                     error={errors.username}
//                 />
//                 <InputField
//                     label="Email"
//                     name="email"
//                     type="email"
//                     defaultValue={data?.email}
//                     register={register}
//                     error={errors.email}
//                 />
//                 <InputField
//                     label="Password"
//                     name="password"
//                     type="password"
//                     defaultValue={data?.password}
//                     register={register}
//                     error={errors.password}
//                 />
//             </div>

//             {/* PERSONAL FIELDS */}
//             <span className="text-xs text-gray-400 font-medium">Personal Information</span>
//             <div className="flex flex-wrap gap-4">
//                 <InputField
//                     label="First Name"
//                     name="name"
//                     defaultValue={data?.name}
//                     register={register}
//                     error={errors.name}
//                 />
//                 <InputField
//                     label="Last Name"
//                     name="surname"
//                     defaultValue={data?.surname}
//                     register={register}
//                     error={errors.surname}
//                 />
//                 <InputField
//                     label="Phone"
//                     name="phone"
//                     defaultValue={data?.phone}
//                     register={register}
//                     error={errors.phone}
//                 />
//                 <InputField
//                     label="Address"
//                     name="address"
//                     defaultValue={data?.address}
//                     register={register}
//                     error={errors.address}
//                 />
//             </div>

//             {/* CHILDREN SEARCH */}
//             <span className="text-xs text-gray-400 font-medium">Children (Optional)</span>
//             <div className="flex flex-col gap-2 w-full sm:w-1/2 relative">
//                 <label className="text-xs text-gray-500">Search Students</label>
//                 <input
//                     type="text"
//                     placeholder="Type student name…"
//                     value={studentQuery}
//                     onChange={(e) => handleStudentSearch(e.target.value)}
//                     className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
//                 />

//                 {studentOpts.length > 0 && (
//                     <ul className="absolute top-full left-0 right-0 bg-white ring-1 ring-gray-200 shadow-md z-10 max-h-40 overflow-auto">
//                         {studentOpts.map((s, idx) => (
//                             <li
//                                 key={`${s.id}-${idx}`}
//                                 onClick={() => addChild(s.id, s.label)}
//                                 className="px-3 py-1 hover:bg-gray-100 cursor-pointer text-sm"
//                             >
//                                 {s.label}
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//                 {noStudents && <p className="text-sm text-red-400 py-1">No students found</p>}
//             </div>

//             {selectedStudents.length > 0 && (
//                 <div className="flex flex-wrap gap-2">
//                     {selectedStudents.map((s, idx) => (
//                         <div
//                             key={`${s.id}-${idx}`}
//                             className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
//                         >
//                             <span>{s.label}</span>
//                             <button
//                                 type="button"
//                                 onClick={() => removeChild(s.id)}
//                                 className="ml-1 text-red-600 hover:text-red-800"
//                             >
//                                 &times;
//                             </button>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             <button
//                 type="submit"
//                 disabled={submitting}
//                 className="bg-blue-600 text-white px-6 py-2 rounded-md w-max disabled:opacity-50"
//             >
//                 {submitting ? "Submitting…" : type === "create" ? "Create" : "Update"}
//             </button>
//         </form>
//     );
// }

"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import InputField from "../InputField";
import { createParent, updateParent, ParentPayload } from "@/action/client/parent";
import { fetchStudentsByName, IStudentLite } from "@/action/client/student";

const schema = z.object({
    username: z
        .string()
        .min(8, { message: "Must be at least 8 characters long!" })
        .max(20, { message: "Must be at most 20 characters long!" }),
    email: z.string().email({ message: "Invalid email address!" }),
    password: z.string().min(8, { message: "Must be at least 8 characters long!" }),
    name: z.string().min(1, { message: "First name is required!" }),
    surname: z.string().min(1, { message: "Last name is required!" }),
    phone: z.string().min(1, { message: "Phone is required!" }),
    address: z.string().min(1, { message: "Address is required!" }),

    childrenIds: z.array(z.string()).optional(),
});

type Inputs = z.infer<typeof schema>;

type ParentFormProps = {
    type: "create" | "update";
    data?: Partial<Inputs> & {
        id?: string;
        childrenIds?: string[];
        childrenLabels?: string[];
    };
};

type StudentOption = {
    id: string;
    label: string;
};

export default function ParentForm({ type, data }: ParentFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
        defaultValues: {
            username: data?.username ?? "",
            email: data?.email ?? "",
            password: data?.password ?? "",
            name: data?.name ?? "",
            surname: data?.surname ?? "",
            phone: data?.phone ?? "",
            address: data?.address ?? "",
            childrenIds: data?.childrenIds ?? [],
        },
    });

    useEffect(() => {
        register("childrenIds");
    }, [register]);

    console.log("🔍 [RHF errors]:", errors);

    const [submitting, setSubmitting] = useState(false);
    const [studentQuery, setStudentQuery] = useState("");
    const [studentOpts, setStudentOpts] = useState<StudentOption[]>([]);
    const [noStudents, setNoStudents] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState<StudentOption[]>([]);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const initializedFromData = useRef(false);

    const childrenIds = watch("childrenIds") || [];
    console.log("🔍 [childrenIds]:", childrenIds);

    useEffect(() => {
        if (type !== "update") return;
        if (initializedFromData.current) return;

        const ids = data?.childrenIds;
        if (!ids || !Array.isArray(ids) || ids.length === 0) return;

        const labels = data?.childrenLabels ?? [];

        const initialSelected: StudentOption[] = ids.map((id, index) => ({
            id,
            label: labels[index] ?? `Student ${index + 1}`,
        }));

        setSelectedStudents(initialSelected);
        setValue("childrenIds", ids, { shouldValidate: false });

        initializedFromData.current = true;
    }, [type, data, setValue]);

    const handleStudentSearch = (q: string) => {
        setStudentQuery(q);

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(async () => {
            const trimmed = q.trim();
            if (!trimmed) {
                setStudentOpts([]);
                setNoStudents(false);
                return;
            }

            try {
                const list: IStudentLite[] = await fetchStudentsByName(trimmed);
                console.log("👀 [handleStudentSearch] received:", list);

                if (!Array.isArray(list)) {
                    console.error("[handleStudentSearch] Expected array, got:", list);
                    setStudentOpts([]);
                    setNoStudents(true);
                    return;
                }

                const mapped: StudentOption[] = list
                    .map((s) => {
                        const id = s._id ?? s.id;
                        if (!id) return null;
                        const label = s.username
                            ? `${s.name} ${s.surname} (${s.username})`
                            : `${s.name} ${s.surname}`;
                        return { id, label };
                    })
                    .filter((opt): opt is StudentOption => opt !== null);

                const filtered = mapped.filter(
                    (stu) => !selectedStudents.some((sel) => sel.id === stu.id)
                );

                setStudentOpts(filtered);
                setNoStudents(filtered.length === 0);
            } catch (error) {
                console.error("❌ [handleStudentSearch] error:", error);
                setStudentOpts([]);
                setNoStudents(true);
            }
        }, 300);
    };

    const addChild = (id: string, label: string) => {
        console.log("➕ addChild", { id, label });
        if (!selectedStudents.some((s) => s.id === id)) {
            const updated = [...selectedStudents, { id, label }];
            setSelectedStudents(updated);
            setValue(
                "childrenIds",
                updated.map((x) => x.id),
                { shouldValidate: true }
            );
        }
        setStudentOpts([]);
        setStudentQuery("");
    };

    const removeChild = (id: string) => {
        const updated = selectedStudents.filter((s) => s.id !== id);
        setSelectedStudents(updated);
        setValue(
            "childrenIds",
            updated.map((x) => x.id),
            { shouldValidate: true }
        );
    };

    const onSubmit = handleSubmit(async (form) => {
        console.log("▶️ [onSubmit] form values:", form);

        const payload: ParentPayload = {
            username: form.username.trim(),
            password: form.password.trim(),
            email: form.email.trim(),
            name: form.name.trim(),
            surname: form.surname.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
            childrenIds: form.childrenIds ?? [],
        };

        try {
            setSubmitting(true);
            if (type === "create") {
                console.log("▶️ [onSubmit] calling createParent…");
                const result = await createParent(payload);
                console.log("✅ [onSubmit] createParent returned:", result);
            } else if (type === "update" && data?.id) {
                console.log("▶️ [onSubmit] calling updateParent…", data.id);
                const result = await updateParent(data.id, payload);
                console.log("✅ [onSubmit] updateParent returned:", result);
            } else {
                console.warn("[onSubmit] update called without id, ignoring");
            }

            window.location.reload();
        } catch (error) {
            console.error("❌ [onSubmit] parent save failed:", error);
        } finally {
            setSubmitting(false);
        }
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new Parent" : "Update Parent"}
            </h1>

            {/* AUTH FIELDS */}
            <span className="text-xs text-gray-400 font-medium">Authentication Information</span>
            <div className="flex flex-wrap gap-4">
                <InputField
                    label="Username"
                    name="username"
                    defaultValue={data?.username}
                    register={register}
                    error={errors.username}
                />
                <InputField
                    label="Email"
                    name="email"
                    type="email"
                    defaultValue={data?.email}
                    register={register}
                    error={errors.email}
                />
                <InputField
                    label="Password"
                    name="password"
                    type="password"
                    defaultValue={data?.password}
                    register={register}
                    error={errors.password}
                />
            </div>

            {/* PERSONAL FIELDS */}
            <span className="text-xs text-gray-400 font-medium">Personal Information</span>
            <div className="flex flex-wrap gap-4">
                <InputField
                    label="First Name"
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors.name}
                />
                <InputField
                    label="Last Name"
                    name="surname"
                    defaultValue={data?.surname}
                    register={register}
                    error={errors.surname}
                />
                <InputField
                    label="Phone"
                    name="phone"
                    defaultValue={data?.phone}
                    register={register}
                    error={errors.phone}
                />
                <InputField
                    label="Address"
                    name="address"
                    defaultValue={data?.address}
                    register={register}
                    error={errors.address}
                />
            </div>

            {/* CHILDREN SEARCH */}
            <span className="text-xs text-gray-400 font-medium">Children (Optional)</span>
            <div className="flex flex-col gap-2 w-full sm:w-1/2 relative">
                <label className="text-xs text-gray-500">Search Students</label>
                <input
                    type="text"
                    placeholder="Type student name…"
                    value={studentQuery}
                    onChange={(e) => handleStudentSearch(e.target.value)}
                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                />

                {studentOpts.length > 0 && (
                    <ul className="absolute top-full left-0 right-0 bg-white ring-1 ring-gray-200 shadow-md z-10 max-h-40 overflow-auto">
                        {studentOpts.map((s, idx) => (
                            <li
                                key={`${s.id}-${idx}`}
                                onClick={() => addChild(s.id, s.label)}
                                className="px-3 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                            >
                                {s.label}
                            </li>
                        ))}
                    </ul>
                )}
                {noStudents && <p className="text-sm text-red-400 py-1">No students found</p>}
            </div>

            {selectedStudents.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedStudents.map((s, idx) => (
                        <div
                            key={`${s.id}-${idx}`}
                            className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                        >
                            <span>{s.label}</span>
                            <button
                                type="button"
                                onClick={() => removeChild(s.id)}
                                className="ml-1 text-red-600 hover:text-red-800"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-md w-max disabled:opacity-50"
            >
                {submitting ? "Submitting…" : type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
}
