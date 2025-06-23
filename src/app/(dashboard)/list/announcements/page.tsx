// // src/app/dashboard/list/announcements/page.tsx
// export const dynamic = "force-dynamic";

// import TableSearch from "@/components/TableSearch";
// import Pagination from "@/components/Pagination";
// import Table from "@/components/Table";
// import Image from "next/image";
// import { getSession } from "@/lib/auth";
// import { fetchAnnouncements, AnnouncementRow } from "@/action/server/announcement";
// import { AnnouncementActions } from "@/components/AnnouncementActions";
// import FormModal from "@/components/FormModal";

// interface Props {
//     searchParams?: { page?: string };
// }

// const columns = [
//     { header: "Title", accessor: "title" },
//     { header: "Date", accessor: "date", className: "hidden md:table-cell" },
//     { header: "Actions", accessor: "actions" },
// ];

// export default async function AnnouncementListPage({ searchParams }: Props) {
//     const pageRaw = searchParams?.page;
//     const currentPage = Array.isArray(pageRaw)
//         ? parseInt(pageRaw[0] || "1", 10)
//         : parseInt(pageRaw || "1", 10);

//     const [session, annPage] = await Promise.all([
//         getSession(),
//         fetchAnnouncements(currentPage, 10),
//     ]);
//     const { data: rows, totalPages } = annPage;

//     const renderRow = (item: AnnouncementRow) => (
//         <tr
//             key={item.id}
//             className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[var(--purpleeLight-color)]"
//         >
//             <td className="p-4">{item.title}</td>
//             <td className="hidden md:table-cell">{new Date(item.date).toLocaleDateString()}</td>
//             <td>
//                 <AnnouncementActions id={item.id} title={item.title} date={item.date} />
//             </td>
//         </tr>
//     );

//     return (
//         <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//             {/* Top */}
//             <div className="flex justify-between items-center mb-4">
//                 <h1 className="hidden md:block text-lg font-semibold">All Announcements</h1>
//                 <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
//                     <TableSearch />
//                     <div className="flex items-center gap-4 self-end">
//                         <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
//                             <Image src="/filter.png" alt="Filter" width={14} height={14} />
//                         </button>
//                         <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
//                             <Image src="/sort.png" alt="Sort" width={14} height={14} />
//                         </button>
//                         {(session?.role === "admin" || session?.role === "teacher") && (
//                             <FormModal table="announcement" type="create" />
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Table */}
//             <Table<AnnouncementRow> columns={columns} renderRow={renderRow} data={rows} />

//             {/* Pagination */}
//             <Pagination currentPage={currentPage} totalPages={totalPages} />
//         </div>
//     );
// }

// // src/app/list/announcements/page.tsx
// export const dynamic = "force-dynamic";

// import { getSession } from "@/lib/auth";
// import { fetchAnnouncements } from "@/action/server/announcement";
// import FormModal from "@/components/FormModal";
// import TableSearch from "@/components/TableSearch";
// import Pagination from "@/components/Pagination";
// import AnnouncementsPage from "@/components/Announcements";

// interface Props {
//     searchParams?: { page?: string };
// }

// export default async function AnnouncementListPage({ searchParams }: Props) {
//     const pageRaw = searchParams?.page;
//     const currentPage = Array.isArray(pageRaw)
//         ? parseInt(pageRaw[0] || "1", 10)
//         : parseInt(pageRaw || "1", 10);

//     const [session, annPage] = await Promise.all([
//         getSession(),
//         fetchAnnouncements(currentPage, 10),
//     ]);
//     const { data: rows, totalPages } = annPage;

//     return (
//         <div className="m-4">
//             {/* Top controls */}
//             <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-3xl font-bold">📢 Announcements</h1>
//                 <div className="flex items-center gap-4">
//                     <TableSearch />
//                     {(session?.role === "admin" || session?.role === "teacher") && (
//                         <FormModal table="announcement" type="create" />
//                     )}
//                 </div>
//             </div>

//             {/* Cards list */}
//             <AnnouncementsPage announcements={rows} />

//             {/* Pagination */}
//             <div className="mt-6">
//                 <Pagination currentPage={currentPage} totalPages={totalPages} />
//             </div>
//         </div>
//     );
// }

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
