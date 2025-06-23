// "use client";

// const Announcements = () => {
//     return (
//         <div className="bg-white p-4 rounded-md">
//             <div className="flex items-center justify-between">
//                 <h1 className="text-xl font-semibold">Announcements</h1>
//                 <span className="text-sm text-gray-400">View All</span>
//             </div>
//             <div className="flex flex-col gap-4 mt-4">
//                 <div className="bg-[var(--lightSkye-color)] rounded-md p-4">
//                     <div className="flex items-center justify-between">
//                         <h2 className="font-medium">Lorem ipsum dolor sit.</h2>
//                         <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
//                             25-05-2025
//                         </span>
//                     </div>
//                     <p className="text-sm text-gray-400 mt-1">
//                         Lorem ipsum nanani nanana Lorem ipsum nanani nanana
//                     </p>
//                 </div>
//                 <div className="bg-[var(--purpleeLight-color)] rounded-md p-4">
//                     <div className="flex items-center justify-between">
//                         <h2 className="font-medium">Lorem ipsum dolor sit.</h2>
//                         <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
//                             25-05-2025
//                         </span>
//                     </div>
//                     <p className="text-sm text-gray-400 mt-1">
//                         Lorem ipsum nanani nanana Lorem ipsum nanani nanana
//                     </p>
//                 </div>
//                 <div className="bg-[var(--yellowwLight-color)] rounded-md p-4">
//                     <div className="flex items-center justify-between">
//                         <h2 className="font-medium">Lorem ipsum dolor sit.</h2>
//                         <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
//                             25-05-2025
//                         </span>
//                     </div>
//                     <p className="text-sm text-gray-400 mt-1">
//                         Lorem ipsum nanani nanana Lorem ipsum nanani nanana
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Announcements;

// // src/components/Announcements.tsx
// import { fetchAnnouncements } from "@/action/server/announcements";
// import AnnouncementActions from "./AnnouncementActions";

// interface AnnouncementsProps {
//     page?: number;
//     limit?: number;
// }

// export default async function Announcements({ page = 1, limit = 10 }: AnnouncementsProps) {
//     // fetch on the server
//     const { data: list } = await fetchAnnouncements(page, limit);

//     return (
//         <div>
//             <h2 className="text-xl font-semibold mb-2">Announcements</h2>

//             {list.length === 0 ? (
//                 <p className="text-gray-500">No announcements found.</p>
//             ) : (
//                 <ul className="space-y-4">
//                     {list.map((a) => (
//                         <li
//                             key={a.id}
//                             className="p-4 border rounded flex justify-between items-start"
//                         >
//                             <div>
//                                 <h3 className="font-medium">{a.title}</h3>
//                                 <time className="text-sm text-gray-500">
//                                     {new Date(a.date).toLocaleDateString()}
//                                 </time>
//                                 <p className="mt-1 text-gray-700">{a.description}</p>
//                             </div>
//                             <AnnouncementActions id={a.id} title={a.title} date={a.date} />
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// }

////////////////////////////////////////////////////////////////////////////////////////
// "use client";

// import React from "react";

// const mockAnnouncements = [
//     {
//         id: 1,
//         title: "New Feature Deployed!",
//         content: "We’ve added a new grading dashboard for teachers.",
//         timestamp: "2025-05-21 10:00 AM",
//     },
//     {
//         id: 2,
//         title: "Maintenance Scheduled",
//         content: "The system will be down for maintenance this Friday from 2–4 PM.",
//         timestamp: "2025-05-20 6:00 PM",
//     },
//     {
//         id: 3,
//         title: "Reminder",
//         content: "Parent-teacher meetings will be held next week.",
//         timestamp: "2025-05-18 2:00 PM",
//     },
// ];

// const AnnouncementsPage = () => {
//     return (
//         <div className="min-h-screen  text-gray-500 p-6">
//             <h1 className="text-3xl font-bold mb-6">📢 Announcements</h1>
//             <div className="flex flex-col gap-4">
//                 {mockAnnouncements.map((announcement) => (
//                     <div
//                         key={announcement.id}
//                         className="bg-[#313338] p-4 rounded-lg border border-[#3C3F45] hover:bg-[#393B40] transition-colors"
//                     >
//                         <div className="text-sm text-gray-400 mb-1">{announcement.timestamp}</div>
//                         <h2 className="text-xl font-semibold text-[#F2F3F5]">
//                             {announcement.title}
//                         </h2>
//                         <p className="text-[#DCDDDE] mt-1">{announcement.content}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default AnnouncementsPage;

///////////////////////////////////////////////////////////////////////////////////

// // src/app/list/announcements/AnnouncementsPage.tsx
// "use client";

// import React from "react";
// import { AnnouncementRow } from "@/action/server/announcement";

// interface AnnouncementsPageProps {
//     announcements: AnnouncementRow[];
// }

// export default function AnnouncementsPage({ announcements }: AnnouncementsPageProps) {
//     return (
//         <div className="min-h-screen text-gray-500 p-6">
//             {/* <h1 className="text-3xl font-bold mb-6">📢 Announcements</h1> */}
//             <div className="flex flex-col gap-4">
//                 {announcements.map((a) => (
//                     <div
//                         key={a.id}
//                         className="bg-[#313338] p-4 rounded-lg border border-[#3C3F45] hover:bg-[#393B40] transition-colors"
//                     >
//                         <div className="text-sm text-gray-400 mb-1">
//                             {new Date(a.date).toLocaleString()}
//                         </div>
//                         <h2 className="text-xl font-semibold text-[#F2F3F5]">{a.title}</h2>
//                         <p className="text-[#DCDDDE] mt-1">{a.description}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

////////////////////////////////////////////////////////////////////
// components/Announcements.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import Link from "next/link";
// import AnnouncementForm from "./forms/AnnouncementForm";
// import { Announcement, fetchAnnouncements } from "@/action/client/announcements";

// export default function Announcements() {
//     const { data: session } = useSession();
//     const isAdmin = session?.user?.role === "admin";

//     const [list, setList] = useState<Announcement[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [showForm, setShowForm] = useState(false);

//     useEffect(() => {
//         (async () => {
//             try {
//                 const items = await fetchAnnouncements();
//                 setList(items);
//             } catch (err) {
//                 console.error("Failed loading announcements", err);
//             } finally {
//                 setLoading(false);
//             }
//         })();
//     }, []);

//     const handleSuccess = async () => {
//         setShowForm(false);
//         setLoading(true);
//         const items = await fetchAnnouncements();
//         setList(items);
//         setLoading(false);
//     };

//     return (
//         <div className="bg-white p-4 rounded-md">
//             <div className="flex items-center justify-between">
//                 <h1 className="text-xl font-semibold">Announcements</h1>
//                 <div className="flex items-center gap-2">
//                     <Link
//                         href={isAdmin ? "/dashboard/announcements" : "/list/announcements"}
//                         className="text-sm text-gray-400 hover:underline"
//                     >
//                         View All
//                     </Link>
//                     {isAdmin && (
//                         <button
//                             onClick={() => setShowForm(true)}
//                             className="bg-blue-600 text-white px-3 py-1 rounded"
//                         >
//                             + New
//                         </button>
//                     )}
//                 </div>
//             </div>

//             {showForm && (
//                 <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//                     <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
//                         <AnnouncementForm
//                             onSuccess={handleSuccess}
//                             onCancel={() => setShowForm(false)}
//                         />
//                     </div>
//                 </div>
//             )}

//             {loading ? (
//                 <p className="mt-4 text-gray-500">Loading…</p>
//             ) : (
//                 <ul className="flex flex-col gap-4 mt-4">
//                     {list.map((a) => (
//                         <li
//                             key={a._id}
//                             className={`
//                 rounded-md p-4
//                 ${
//                     a._id.charCodeAt(0) % 3 === 0
//                         ? "bg-[var(--lightSkye-color)]"
//                         : a._id.charCodeAt(0) % 3 === 1
//                         ? "bg-[var(--purpleeLight-color)]"
//                         : "bg-[var(--yellowwLight-color)]"
//                 }
//               `}
//                         >
//                             <div className="flex items-center justify-between">
//                                 <h2 className="font-medium">{a.title}</h2>
//                                 <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
//                                     {new Date(a.date).toLocaleDateString()}
//                                 </span>
//                             </div>
//                             <p className="text-sm text-gray-400 mt-1">{a.description}</p>
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import Link from "next/link";
// import AnnouncementForm from "./forms/AnnouncementForm";
// import { Announcement, fetchAnnouncements } from "@/action/client/announcements";

// export default function Announcements() {
//     const { data: session } = useSession();
//     const isAdmin = session?.user?.role === "admin";

//     const [list, setList] = useState<Announcement[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [showForm, setShowForm] = useState(false);

//     useEffect(() => {
//         (async () => {
//             try {
//                 const items = await fetchAnnouncements();
//                 setList(items);
//             } catch (err) {
//                 console.error("Failed loading announcements", err);
//             } finally {
//                 setLoading(false);
//             }
//         })();
//     }, []);

//     const handleSuccess = async () => {
//         setShowForm(false);
//         setLoading(true);
//         const items = await fetchAnnouncements();
//         setList(items);
//         setLoading(false);
//     };

//     return (
//         <div className="bg-white p-4 rounded-md">
//             <div className="flex items-center justify-between mb-4">
//                 <h1 className="text-xl font-semibold">Announcements</h1>
//                 <div className="flex items-center gap-2">
//                     <Link
//                         href="/dashboard/announcements"
//                         className="text-sm text-gray-400 hover:underline"
//                     >
//                         View All
//                     </Link>
//                     {isAdmin && (
//                         <button
//                             onClick={() => setShowForm(true)}
//                             className="bg-blue-600 text-white px-3 py-1 rounded"
//                         >
//                             + New
//                         </button>
//                     )}
//                 </div>
//             </div>

//             {showForm && (
//                 <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//                     <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
//                         <AnnouncementForm
//                             onSuccess={handleSuccess}
//                             onCancel={() => setShowForm(false)}
//                         />
//                     </div>
//                 </div>
//             )}

//             {loading ? (
//                 <p className="mt-4 text-gray-500">Loading…</p>
//             ) : (
//                 <table className="w-full table-auto">
//                     <thead>
//                         <tr className="bg-gray-100">
//                             <th className="p-2 text-left">Title</th>
//                             <th className="p-2 text-left hidden md:table-cell">Date</th>
//                             <th className="p-2">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {list.map((a) => (
//                             <tr key={a._id} className="border-b hover:bg-gray-50">
//                                 <td className="p-2">{a.title}</td>
//                                 <td className="p-2 hidden md:table-cell">
//                                     {new Date(a.date).toLocaleDateString()}
//                                 </td>
//                                 <td className="p-2">
//                                     {isAdmin && (
//                                         <>
//                                             {/* For edit/delete buttons, use your AnnouncementActions or FormModal */}
//                                             <AnnouncementForm
//                                                 type="update"
//                                                 data={a}
//                                                 onSuccess={handleSuccess}
//                                             />
//                                         </>
//                                     )}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}
//         </div>
//     );
// }

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

    // track current page if you ever want pagination
    const [page, setPage] = useState(1);

    const load = async () => {
        setLoading(true);
        try {
            const result = await fetchAnnouncementsClient(page, 10);
            // result: { data, page, total, totalPages }
            setList(result.data);
        } catch (err) {
            console.error("Failed loading announcements", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
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
