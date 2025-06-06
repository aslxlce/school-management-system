// // app/list/parents/page.tsx

// export const dynamic = "force-dynamic";

// import React from "react";
// import Image from "next/image";

// import Pagination from "@/components/Pagination";
// import Table from "@/components/Table";
// import FormModal from "@/components/FormModal";

// import { fetchParents } from "@/action/server/parents";
// import { getSession } from "@/lib/auth";

// interface IParentWithChildren {
//     id: string;
//     username: string;
//     name: string;
//     surname: string;
//     email?: string;
//     phone?: string;
//     address?: string;
//     children: string[]; // array of "Name Surname"
// }

// interface PageProps {
//     searchParams?: Record<string, string | string[] | undefined>;
// }

// const columns = [
//     { header: "Info", accessor: "info" },
//     { header: "Username", accessor: "username", className: "hidden md:table-cell" },
//     { header: "Children", accessor: "children", className: "hidden lg:table-cell" },
//     { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
//     { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
//     { header: "Actions", accessor: "actions" },
// ];

// const ParentsPage = async ({ searchParams }: PageProps) => {
//     const pageRaw = searchParams?.page;
//     const currentPage = Array.isArray(pageRaw)
//         ? parseInt(pageRaw[0] || "1", 10)
//         : parseInt(pageRaw || "1", 10);

//     const limit = 10;

//     const [session, parentData] = await Promise.all([
//         getSession(),
//         fetchParents(currentPage, limit),
//     ]);

//     const { data: parents, totalPages } = parentData;

//     const renderRow = (parent: IParentWithChildren) => (
//         <tr
//             key={parent.id}
//             className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[var(--purpleeLight-color)]"
//         >
//             <td className="flex items-center gap-4 p-4">
//                 <Image
//                     src="/default-avatar.jpg"
//                     alt="Parent"
//                     width={40}
//                     height={40}
//                     className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
//                 />
//                 <div className="flex flex-col">
//                     <h3 className="font-semibold">{`${parent.name} ${parent.surname}`}</h3>
//                     <p className="text-xs text-gray-500">{parent.email}</p>
//                 </div>
//             </td>
//             <td className="hidden md:table-cell">{parent.username}</td>
//             <td className="hidden lg:table-cell">
//                 {parent.children.length > 0 ? parent.children.join(", ") : "No children"}
//             </td>
//             <td className="hidden lg:table-cell">{parent.phone}</td>
//             <td className="hidden lg:table-cell">{parent.address}</td>
//             <td>
//                 <div className="flex items-center gap-2">
//                     {session?.role === "admin" && (
//                         <>
//                             <FormModal table="parent" type="update" data={parent} />
//                             <FormModal table="parent" type="delete" id={parent.id} />
//                         </>
//                     )}
//                 </div>
//             </td>
//         </tr>
//     );

//     return (
//         <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//             <div className="flex justify-between items-center mb-4">
//                 <h1 className="text-lg font-semibold">All Parents</h1>
//                 <div className="flex items-center gap-4">
//                     <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
//                         <Image src="/filter.png" alt="Filter" width={14} height={14} />
//                     </button>
//                     <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
//                         <Image src="/sort.png" alt="Sort" width={14} height={14} />
//                     </button>
//                     {session?.role === "admin" && <FormModal table="parent" type="create" />}
//                 </div>
//             </div>

//             {Array.isArray(parents) && (
//                 <Table<IParentWithChildren>
//                     columns={columns}
//                     renderRow={renderRow}
//                     data={parents}
//                 />
//             )}

//             <Pagination currentPage={currentPage} totalPages={totalPages} />
//         </div>
//     );
// };

// export default ParentsPage;

// app/list/parents/page.tsx

export const dynamic = "force-dynamic";

import React from "react";
import Image from "next/image";

import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import FormModal from "@/components/FormModal";

import { fetchParents } from "@/action/server/parents";
import { getSession } from "@/lib/auth";

interface PageProps {
    searchParams?: Record<string, string | string[] | undefined>;
}

interface IParentWithChildren {
    id: string;
    username: string;
    name: string;
    surname: string;
    email?: string;
    phone?: string;
    address?: string;
    children: string[];
}

type ParentRow = {
    id: string;
    username: string;
    name: string;
    surname: string;
    email?: string;
    children: string[];
    phone?: string;
    address?: string;
};

// Table column definitions
const columns = [
    { header: "Info", accessor: "info" },
    { header: "Username", accessor: "username", className: "hidden md:table-cell" },
    { header: "Children", accessor: "children", className: "hidden lg:table-cell" },
    { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
    { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
    { header: "Actions", accessor: "actions" },
];

export default async function ParentsPage({ searchParams }: PageProps) {
    // 1) Read `page` from searchParams (passed by Next.js)
    const pageRaw = searchParams?.page;
    const currentPage = Array.isArray(pageRaw)
        ? parseInt(pageRaw[0] || "1", 10)
        : parseInt(pageRaw || "1", 10);

    const limit = 10;

    // 2) Fetch session and parents concurrently
    const [session, parentData] = await Promise.all([
        getSession(),
        fetchParents(currentPage, limit),
    ]);

    const { data: parents, totalPages } = parentData;

    // 3) Map ParentWithChildren → ParentRow
    const rows: ParentRow[] = parents.map((p: IParentWithChildren) => ({
        id: p.id,
        username: p.username,
        name: p.name,
        surname: p.surname,
        email: p.email,
        children: p.children.length > 0 ? p.children : [],
        phone: p.phone ?? "—",
        address: p.address ?? "—",
    }));

    // 4) Get role from session
    const role = session?.role;

    // 5) Render function for a single row
    const renderRow = (parent: ParentRow) => (
        <tr
            key={parent.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[var(--purpleeLight-color)]"
        >
            <td className="flex items-center gap-4 p-4">
                <Image
                    src="/default-avatar.jpg"
                    alt="Parent"
                    width={40}
                    height={40}
                    className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                    <h3 className="font-semibold">{`${parent.name} ${parent.surname}`}</h3>
                    <p className="text-xs text-gray-500">{parent.email}</p>
                </div>
            </td>
            <td className="hidden md:table-cell">{parent.username}</td>
            <td className="hidden lg:table-cell">
                {parent.children.length > 0 ? parent.children.join(", ") : "No children"}
            </td>
            <td className="hidden lg:table-cell">{parent.phone}</td>
            <td className="hidden lg:table-cell">{parent.address}</td>
            <td>
                <div className="flex items-center gap-2">
                    {role === "admin" && (
                        <>
                            <FormModal
                                table="parent"
                                type="update"
                                data={parent as Record<string, unknown>}
                            />
                            <FormModal table="parent" type="delete" id={parseInt(parent.id, 10)} />
                        </>
                    )}
                </div>
            </td>
        </tr>
    );

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* Header + filter/sort + create button */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-semibold">All Parents</h1>
                <div className="flex items-center gap-4">
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
                        <Image src="/filter.png" alt="Filter" width={14} height={14} />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--yelloww-color)]">
                        <Image src="/sort.png" alt="Sort" width={14} height={14} />
                    </button>
                    {role === "admin" && <FormModal table="parent" type="create" />}
                </div>
            </div>

            {Array.isArray(rows) && (
                <Table<ParentRow> columns={columns} renderRow={renderRow} data={rows} />
            )}

            <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
    );
}
