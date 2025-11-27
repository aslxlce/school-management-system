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
