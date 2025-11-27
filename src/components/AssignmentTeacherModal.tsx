// src/components/AssignmentTeacherModal.tsx
"use client";

import { useState } from "react";

interface AssignmentTeacherModalProps {
    classId: string;
    className: string;
}

interface AssignmentFormState {
    title: string;
    description: string;
    dueDate: string;
}

export default function AssignmentTeacherModal({
    classId,
    className,
}: AssignmentTeacherModalProps) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<AssignmentFormState>({
        title: "",
        description: "",
        dueDate: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleChange<K extends keyof AssignmentFormState>(
        key: K,
        value: AssignmentFormState[K]
    ) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch("/api/assignments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...form,
                    classId,
                }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({ message: "Unknown error" }));
                throw new Error(body.message ?? "Failed to create assignment");
            }

            setForm({ title: "", description: "", dueDate: "" });
            setOpen(false);
        } catch (err) {
            console.error(err);
            setError((err as Error).message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="px-3 py-1 text-xs rounded-full bg-[var(--yelloww-color)]"
            >
                Add Assignment
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-md p-6 max-w-lg w-full">
                        <h2 className="text-lg font-semibold mb-4">
                            New Assignment for {className}
                        </h2>

                        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => handleChange("title", e.target.value)}
                                    className="w-full border rounded px-2 py-1 text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Due date</label>
                                <input
                                    type="date"
                                    value={form.dueDate}
                                    onChange={(e) => handleChange("dueDate", e.target.value)}
                                    className="w-full border rounded px-2 py-1 text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => handleChange("description", e.target.value)}
                                    className="w-full border rounded px-2 py-1 text-sm min-h-[120px]"
                                    required
                                />
                            </div>

                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 text-sm rounded bg-indigo-600 text-white disabled:opacity-50"
                                >
                                    {submitting ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
