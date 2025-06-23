// import Pagination from "@/components/Pagination";
// import Table from "@/components/Table";
// import TableSearch from "@/components/TableSearch";
// import { eventsData, role } from "@/lib/data";
// import Image from "next/image";
// import Link from "next/link";

// type Event = {
//     id: number;
//     title: string;
//     class: string;
//     date: string;
//     startTime: string;
//     endTime: string;
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
//         header: "Start Time",
//         accessor: "startTime",
//         className: "hidden md:table-cell",
//     },
//     {
//         header: "End Time",
//         accessor: "endTime",
//         className: "hidden md:table-cell",
//     },
//     {
//         header: "Actions",
//         accessor: "actions",
//     },
// ];

// const EventListPage = () => {
//     const renderRow = (item: Event) => (
//         <tr
//             key={item.id}
//             className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[var(--purpleeLight-color)]"
//         >
//             <td className="flex items-center gap-4 p-4">{item.title}</td>
//             <td>{item.class}</td>
//             <td className="hidden md:table-cell">{item.date}</td>
//             <td className="hidden md:table-cell">{item.startTime}</td>
//             <td className="hidden md:table-cell">{item.endTime}</td>
//             <td>
//                 <div className="flex items-center gap-2">
//                     <Link href={`/list/teachers/${item.id}`}>
//                         <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[var(--sky-color)]">
//                             <Image src="/edit.png" alt="" width={16} height={16} />
//                         </button>
//                     </Link>
//                     {role === "admin" && (
//                         <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[var(--purplee-color)]">
//                             <Image src="/delete.png" alt="" width={16} height={16} />
//                         </button>
//                     )}
//                 </div>
//             </td>
//         </tr>
//     );

//     return (
//         <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//             {/* Top  */}
//             <div className="flex justify-between items-center">
//                 <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
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
//                             <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
//                                 <Image src="/plus.png" alt="" width={14} height={14} />
//                             </button>
//                         )}
//                     </div>
//                 </div>
//             </div>
//             {/* List  */}
//             <Table columns={columns} renderRow={renderRow} data={eventsData} />
//             {/* Pagination  */}
//             <Pagination />
//         </div>
//     );
// };

// export default EventListPage;

// list/events/page.tsx

// list/events/page.tsx

// "use client";

// import Image from "next/image";
// import EventCalendar from "@/components/EventCalendar";
// import TableSearch from "@/components/TableSearch";
// import { role } from "@/lib/data";

// export default function EventListPage() {
//     return (
//         <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//             {/* Top bar */}
//             <div className="flex justify-between items-center mb-4">
//                 <h1 className="text-lg font-semibold">All Events</h1>
//                 <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
//                     <TableSearch />
//                     <div className="flex items-center gap-4">
//                         <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
//                             <Image src="/filter.png" alt="Filter" width={14} height={14} />
//                         </button>
//                         <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
//                             <Image src="/sort.png" alt="Sort" width={14} height={14} />
//                         </button>
//                         {role === "admin" && (
//                             <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
//                                 <Image src="/plus.png" alt="Add" width={14} height={14} />
//                             </button>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Calendar & Event Form */}
//             <EventCalendar isAdmin={role === "admin"} />

//             {/* Optional Pagination if still needed */}
//             <div className="mt-6">{/* <Pagination /> */}</div>
//         </div>
//     );
// }

// list/events/page.tsx

import Image from "next/image";
import { getSession } from "@/lib/auth";
import { fetchEvents as fetchEventsServer } from "@/action/server/events";
import TableSearch from "@/components/TableSearch";
import EventCalendar from "@/components/EventCalendar";
import Pagination from "@/components/Pagination";
import FormModal from "@/components/FormModal";

interface PageProps {
    searchParams?: Promise<{ page?: string | string[] }>;
}

export default async function EventListPage({ searchParams }: PageProps) {
    const s = await searchParams;
    // parse page
    const pageParam = s?.page;
    const currentPage = Array.isArray(pageParam)
        ? parseInt(pageParam[0], 10) || 1
        : parseInt(pageParam ?? "1", 10);
    const limit = 10;

    // fetch session + events
    const [session, { events, total }] = await Promise.all([
        getSession(),
        fetchEventsServer(currentPage, limit),
    ]);
    const totalPages = Math.ceil(total / limit);

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* Top bar */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-semibold">All Events</h1>
                <div className="flex items-center gap-4">
                    <TableSearch />
                    {session?.role === "admin" && <FormModal table="event" type="create" />}
                    <button className="w-8 h-8 ...">
                        <Image src="/filter.png" alt="Filter" width={14} height={14} />
                    </button>
                    <button className="w-8 h-8 ...">
                        <Image src="/sort.png" alt="Sort" width={14} height={14} />
                    </button>
                </div>
            </div>

            {/* Calendar & Event List */}
            <EventCalendar initialEvents={events} />

            {/* Pagination */}
            <div className="mt-6">
                <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>
        </div>
    );
}
