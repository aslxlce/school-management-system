// import FormModal from "@/components/FormModal";
// import Pagination from "@/components/Pagination";
// import Table from "@/components/Table";
// import TableSearch from "@/components/TableSearch";
// import { announcementsData, role } from "@/lib/data";
// import Image from "next/image";
// import Link from "next/link";

// type Announcement = {
//     id: number;
//     title: string;
//     class: string;
//     date: string;
// };

// const columns = [
//     {
//         header: "Title",
//         accessor: "title",
//     },
//     {
//         header: "Class",
//         accessor: "class",
//     },
//     {
//         header: "Date",
//         accessor: "date",
//         className: "hidden md:table-cell",
//     },
//     {
//         header: "Actions",
//         accessor: "actions",
//     },
// ];

// const AnnouncementListPage = () => {
//     const renderRow = (item: Announcement) => (
//         <tr
//             key={item.id}
//             className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[var(--purpleeLight-color)]"
//         >
//             <td className="flex items-center gap-4 p-4">{item.title}</td>
//             <td>{item.class}</td>
//             <td className="hidden md:table-cell">{item.date}</td>
//             <td>
//                 <div className="flex items-center gap-2">
//                     {role === "admin" && (
//                         <>
//                             <FormModal table="announcement" type="update" data={item} />
//                             <FormModal table="announcement" type="delete" id={item.id} />
//                         </>
//                     )}
//                     {role === "student" && (
//                         <>
//                             <Link href={`/list/announcements/${item.id}`}>
//                                 <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[var(--sky-color)]">
//                                     <Image src="/view.png" alt="" width={16} height={16} />
//                                 </button>
//                             </Link>
//                         </>
//                     )}
//                 </div>
//             </td>
//         </tr>
//     );

//     return (
//         <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//             {/* Top  */}
//             <div className="flex justify-between items-center">
//                 <h1 className="hidden md:block text-lg font-semibold">All Announcements</h1>
//                 <div className="flex flex-col md:flex-row gap-4  w-full md:w-auto">
//                     <TableSearch />
//                     <div className="flex items-center gap-4 self-end">
//                         <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
//                             <Image src="/filter.png" alt="" width={14} height={14} />
//                         </button>
//                         <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
//                             <Image src="/sort.png" alt="" width={14} height={14} />
//                         </button>
//                         {role === "admin" && (
//                             // <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
//                             //     <Image src="/plus.png" alt="" width={14} height={14} />
//                             // </button>
//                             <FormModal table="announcement" type="create" />
//                         )}
//                     </div>
//                 </div>
//             </div>
//             {/* List  */}
//             <Table columns={columns} renderRow={renderRow} data={announcementsData} />
//             {/* Pagination  */}
//             <Pagination />
//         </div>
//     );
// };

// export default AnnouncementListPage;

"use client";

import React from "react";

const mockAnnouncements = [
    {
        id: 1,
        title: "New Feature Deployed!",
        content: "We’ve added a new grading dashboard for teachers.",
        timestamp: "2025-05-21 10:00 AM",
    },
    {
        id: 2,
        title: "Maintenance Scheduled",
        content: "The system will be down for maintenance this Friday from 2–4 PM.",
        timestamp: "2025-05-20 6:00 PM",
    },
    {
        id: 3,
        title: "Reminder",
        content: "Parent-teacher meetings will be held next week.",
        timestamp: "2025-05-18 2:00 PM",
    },
];

const AnnouncementsPage = () => {
    return (
        <div className="min-h-screen  text-gray-500 p-6">
            <h1 className="text-3xl font-bold mb-6">📢 Announcements</h1>
            <div className="flex flex-col gap-4">
                {mockAnnouncements.map((announcement) => (
                    <div
                        key={announcement.id}
                        className="bg-[#313338] p-4 rounded-lg border border-[#3C3F45] hover:bg-[#393B40] transition-colors"
                    >
                        <div className="text-sm text-gray-400 mb-1">{announcement.timestamp}</div>
                        <h2 className="text-xl font-semibold text-[#F2F3F5]">
                            {announcement.title}
                        </h2>
                        <p className="text-[#DCDDDE] mt-1">{announcement.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnnouncementsPage;
