"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AnnouncementForm from "@/components/forms/AnnouncementForm";
import { fetchAnnouncementsClient } from "@/action/client/announcements";

export default function AnnouncementsPage() {
    const { data: session } = useSession();
    const role = session?.user?.role;
    const canAdd = role === "admin" || role === "teacher";

    const [paginatedAnnouncements, setPaginatedAnnouncements] =
        useState<PaginatedAnnouncements | null>(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const list = paginatedAnnouncements?.data || [];
    const load = async () => {
        setLoading(true);
        try {
            const items = await fetchAnnouncementsClient();
            setPaginatedAnnouncements(items);
        } catch (err) {
            console.error("Failed loading announcements", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleSuccess = () => {
        setShowForm(false);
        load();
    };

    if (loading) {
        return <p className="p-6 text-gray-500">Loading…</p>;
    }

    return (
        <div className="min-h-screen text-gray-500 p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">📢 Announcements</h1>
                {canAdd && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        + New
                    </button>
                )}
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <AnnouncementForm
                            onSuccess={handleSuccess}
                            onCancel={() => setShowForm(false)}
                        />
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-4">
                {list.map((announcement, idx) => {
                    const bgColor =
                        idx % 3 === 0
                            ? "bg-[#313338]"
                            : idx % 3 === 1
                            ? "bg-[#3C3F45]"
                            : "bg-[#393B40]";
                    const timestamp = new Date(announcement.date).toLocaleString([], {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                    });

                    return (
                        <div
                            key={announcement._id}
                            className={`${bgColor} p-4 rounded-lg border border-[#3C3F45] hover:opacity-90 transition`}
                        >
                            <div className="text-sm text-gray-400 mb-1">{timestamp}</div>
                            <h2 className="text-xl font-semibold text-[#F2F3F5]">
                                {announcement.title}
                            </h2>
                            <p className="text-[#DCDDDE] mt-1">{announcement.description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
