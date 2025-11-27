"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AnnouncementForm from "./forms/AnnouncementForm";
import { fetchAnnouncementsClient } from "@/action/client/announcements";

export default function Announcements() {
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === "admin";

    const [list, setList] = useState<AnnouncementRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [page, setPage] = useState(1);

    const load = async () => {
        setLoading(true);
        try {
            const result = await fetchAnnouncementsClient(page, 10);
            setList(result.data);
        } catch (err) {
            console.error("Failed loading announcements", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const handleSuccess = async () => {
        setShowForm(false);
        await load();
    };

    return (
        <div className="bg-white p-4 rounded-md">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Announcements</h1>
                <div className="flex items-center gap-2">
                    <Link
                        href={isAdmin ? "/dashboard/announcements" : "/list/announcements"}
                        className="text-sm text-gray-400 hover:underline"
                    >
                        View All
                    </Link>
                    {isAdmin && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                            + New
                        </button>
                    )}
                </div>
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

            {loading ? (
                <p className="mt-4 text-gray-500">Loading…</p>
            ) : (
                <ul className="flex flex-col gap-4 mt-4">
                    {list.map((a) => (
                        <li
                            key={a._id}
                            className={`
                rounded-md p-4
                ${
                    a._id.charCodeAt(0) % 3 === 0
                        ? "bg-[var(--lightSkye-color)]"
                        : a._id.charCodeAt(0) % 3 === 1
                        ? "bg-[var(--purpleeLight-color)]"
                        : "bg-[var(--yellowwLight-color)]"
                }
              `}
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="font-medium">{a.title}</h2>
                                <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                                    {new Date(a.date).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{a.description}</p>
                        </li>
                    ))}
                </ul>
            )}

            {/* optional simple pagination controls */}
            {!loading && list.length > 0 && (
                <div className="flex justify-between mt-4">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="self-center text-sm text-gray-500">Page {page}</span>
                    <button
                        onClick={() => setPage((p) => p + 1)}
                        className="px-3 py-1 bg-gray-200 rounded"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
