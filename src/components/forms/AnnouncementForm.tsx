// src/components/forms/AnnouncementForm.tsx
"use client";

import { createAnnouncement } from "@/action/client/announcements";
import { useState } from "react";

interface Props {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function AnnouncementForm({ onSuccess, onCancel }: Props) {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [desc, setDesc] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title || !date || !desc) {
            setError("All fields required");
            return;
        }
        try {
            await createAnnouncement({ title, date, description: desc });
            onSuccess();
        } catch {
            setError("Failed to create");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex flex-col">
                <label>Title</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2 rounded"
                />
            </div>
            <div className="flex flex-col">
                <label>Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border p-2 rounded"
                />
            </div>
            <div className="flex flex-col">
                <label>Description</label>
                <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="border p-2 rounded"
                />
            </div>
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onCancel} className="px-3 py-1 border rounded">
                    Cancel
                </button>
                <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">
                    Save
                </button>
            </div>
        </form>
    );
}
