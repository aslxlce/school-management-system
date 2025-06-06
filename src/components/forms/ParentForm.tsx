"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import InputField from "../InputField";
import { createParent, ParentPayload } from "@/action/client/parent";
import { fetchStudentsByName } from "@/action/client/student";

//
// ────────────────────────────────────────────────────────────────────────────
//   Zod Schema (with preprocess for childrenIds)
// ────────────────────────────────────────────────────────────────────────────
//
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

    // Preprocess childrenIds: if it’s "" or undefined/null, turn into []
    childrenIds: z
        .preprocess((val) => {
            if (val === "" || val === undefined || val === null) {
                return [];
            }
            return val;
        }, z.array(z.string()))
        .optional(),
});

type Inputs = z.infer<typeof schema>;

export default function ParentForm({
    type,
    data,
}: {
    type: "create" | "update";
    data?: Partial<Inputs>;
}) {
    //
    // ────────────────────────────────────────────────────────────────────────────
    //   RHF Setup
    // ────────────────────────────────────────────────────────────────────────────
    //
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
            childrenIds: data?.childrenIds ?? [], // must start as an array
        },
    });

    // Register childrenIds so RHF knows it’s tracking that field
    useEffect(() => {
        register("childrenIds");
    }, [register]);

    // Log any validation errors each render (for debugging)
    console.log("🔍 [RHF errors]:", errors);

    //
    // ────────────────────────────────────────────────────────────────────────────
    //   Local State for Student Search
    // ────────────────────────────────────────────────────────────────────────────
    //
    const [submitting, setSubmitting] = useState(false);
    const [studentQuery, setStudentQuery] = useState("");
    const [studentOpts, setStudentOpts] = useState<Array<{ id: string; label: string }>>([]);
    const [noStudents, setNoStudents] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState<Array<{ id: string; label: string }>>(
        []
    );
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    // Watch the childrenIds field (for debugging/preview)
    const childrenIds = watch("childrenIds") || [];
    console.log("🔍 [childrenIds]:", childrenIds);

    //
    // ────────────────────────────────────────────────────────────────────────────
    //   Student‐Search Handler (with corrected mapping)
    // ────────────────────────────────────────────────────────────────────────────
    //
    const handleStudentSearch = (q: string) => {
        setStudentQuery(q);

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(async () => {
            if (!q.trim()) {
                setStudentOpts([]);
                setNoStudents(false);
                return;
            }

            try {
                const list = await fetchStudentsByName(q.trim());
                console.log("👀 [handleStudentSearch] received:", list);

                // ■■■■■ CORRECTED MAPPING STEP ■■■■■
                // Use `s.id` if that’s how your fetch actually returns it,
                // otherwise fallback to `_id` if your backend uses Mongo-style _id.
                const mapped = list.map((s: any) => ({
                    id: s._id ?? s.id, // ← the essential fix: pick whichever exists
                    label: `${s.name} ${s.surname} (${s.username})`,
                }));

                // Filter out already-chosen students
                const filtered = mapped.filter(
                    (stu) => !selectedStudents.some((sel) => sel.id === stu.id)
                );

                setStudentOpts(filtered);
                setNoStudents(filtered.length === 0);
            } catch (err) {
                console.error("❌ [handleStudentSearch] error:", err);
                setStudentOpts([]);
                setNoStudents(true);
            }
        }, 300);
    };

    //
    // ────────────────────────────────────────────────────────────────────────────
    //   Add/Remove Child
    // ────────────────────────────────────────────────────────────────────────────
    //
    const addChild = (id: string, label: string) => {
        // Prevent duplicates
        if (!selectedStudents.some((s) => s.id === id)) {
            const updated = [...selectedStudents, { id, label }];
            setSelectedStudents(updated);

            // Now childrenIds becomes [ "the-real-id-string", … ]
            setValue(
                "childrenIds",
                updated.map((x) => x.id),
                { shouldValidate: true }
            );
        }

        // Clear the dropdown after picking
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

    //
    // ────────────────────────────────────────────────────────────────────────────
    //   On Form Submit
    // ────────────────────────────────────────────────────────────────────────────
    //
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
            // childrenIds is guaranteed to be a real string[] by our preprocess
            childrenIds: form.childrenIds ?? [],
        };

        try {
            setSubmitting(true);
            console.log("▶️ [onSubmit] calling createParent…");
            const result = await createParent(payload);
            console.log("✅ [onSubmit] createParent returned:", result);
            window.location.reload();
        } catch (err) {
            console.error("❌ [onSubmit] createParent failed:", err);
        } finally {
            setSubmitting(false);
        }
    });

    //
    // ────────────────────────────────────────────────────────────────────────────
    //   JSX
    // ────────────────────────────────────────────────────────────────────────────
    //
    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new Parent" : "Update Parent"}
            </h1>

            {/* ===== AUTHENTICATION FIELDS ===== */}
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

            {/* ===== PERSONAL FIELDS ===== */}
            <span className="text-xs text-gray-400 font-medium">Personal Information</span>
            <div className="flex flex-wrap gap-4">
                <InputField
                    label="First Name"
                    name="name" // ← matches zod key “name”
                    defaultValue={data?.name}
                    register={register}
                    error={errors.name}
                />
                <InputField
                    label="Last Name"
                    name="surname" // ← matches zod key “surname”
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

            {/* ===== CHILDREN (STUDENT SEARCH) ===== */}
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

                {/* Autocomplete Dropdown */}
                {studentOpts.length > 0 && (
                    <ul className="absolute top-full left-0 right-0 bg-white ring-1 ring-gray-200 shadow-md z-10 max-h-40 overflow-auto">
                        {studentOpts.map((s) => (
                            <li
                                key={s.id}
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

            {/* Display the “pill”—selected children */}
            {selectedStudents.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedStudents.map((s) => (
                        <div
                            key={s.id}
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

            {/* ===== SUBMIT BUTTON ===== */}
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
