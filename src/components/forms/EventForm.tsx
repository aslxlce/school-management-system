// src/components/forms/EventForm.tsx
"use client";

import { useState } from "react";
import { createEvent } from "@/action/client/events";
import type { FC } from "react";
import type { FormComponentProps } from "@/components/FormModal";

const EventForm: FC<FormComponentProps> = ({ onSuccess, onCancel }) => {
    const [title, setTitle] = useState<string>("");
    const [start, setStart] = useState<string>(new Date().toISOString().slice(0, 16));
    const [end, setEnd] = useState<string>(new Date().toISOString().slice(0, 16));
    const [description, setDescription] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: Omit<IEvent, "id" | "createdBy"> = {
            title,
            start: new Date(start),
            end: new Date(end),
            description,
        };

        await createEvent(payload);
        onSuccess?.();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full border rounded px-2 py-1"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Start</label>
                    <input
                        type="datetime-local"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        className="mt-1 block w-full border rounded px-2 py-1"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">End</label>
                    <input
                        type="datetime-local"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        className="mt-1 block w-full border rounded px-2 py-1"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full border rounded px-2 py-1"
                />
            </div>

            <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
                    Create Event
                </button>
                <button
                    type="button"
                    onClick={() => onCancel?.()}
                    className="px-4 py-2 border rounded"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default EventForm;
