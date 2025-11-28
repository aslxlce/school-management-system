// export const dynamic = "force-dynamic";

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
//     childrenIds: string[];
//     children: string[]; // labels (child full names)
// }

// type ParentRow = {
//     id: string;
//     username: string;
//     name: string;
//     surname: string;
//     email?: string;
//     phone?: string;
//     address?: string;
//     childrenIds: string[];
//     childrenLabels: string[];
// };

// // Table column definitions
// const columns = [
//     { header: "Info", accessor: "info" },
//     { header: "Username", accessor: "username", className: "hidden md:table-cell" },
//     { header: "Children", accessor: "children", className: "hidden lg:table-cell" },
//     { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
//     { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
//     { header: "Actions", accessor: "actions" },
// ];

// export default async function ParentsPage({
//     searchParams,
// }: {
//     // Next.js now passes this as a Promise
//     searchParams: Promise<Record<string, string | string[] | undefined>>;
// }) {
//     // 0) Session & authorization: allow only admin + teacher
//     const session = await getSession();
//     const role = session?.role;

//     const isAdmin = role === "admin";
//     const isTeacher = role === "teacher";

//     if (!session || (!isAdmin && !isTeacher)) {
//         return (
//             <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//                 <h1 className="text-lg font-semibold mb-2">Parents</h1>
//                 <p className="text-sm text-gray-500">
//                     You don&apos;t have permission to view the parents list.
//                 </p>
//             </div>
//         );
//     }

//     // 1) Await searchParams before using
//     const resolvedSearchParams = await searchParams;
//     const pageRaw = resolvedSearchParams.page;

//     const currentPage = Array.isArray(pageRaw)
//         ? parseInt(pageRaw[0] || "1", 10)
//         : parseInt(pageRaw || "1", 10);

//     const limit = 10;

//     // 2) Fetch parents
//     const parentData = await fetchParents(currentPage, limit);
//     const { data: parents, totalPages } = parentData;

//     // 3) Map IParentWithChildren → ParentRow
//     const rows: ParentRow[] = parents.map((p: IParentWithChildren) => ({
//         id: p.id,
//         username: p.username,
//         name: p.name,
//         surname: p.surname,
//         email: p.email,
//         phone: p.phone ?? "—",
//         address: p.address ?? "—",
//         childrenIds: p.childrenIds ?? [],
//         childrenLabels: p.children ?? [],
//     }));

//     // 4) Render function for a single row
//     const renderRow = (parent: ParentRow) => (
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
//                 {parent.childrenLabels.length > 0
//                     ? parent.childrenLabels.join(", ")
//                     : "No children"}
//             </td>
//             <td className="hidden lg:table-cell">{parent.phone}</td>
//             <td className="hidden lg:table-cell">{parent.address}</td>
//             <td>
//                 <div className="flex items-center gap-2">
//                     {/* Only admin can edit/delete parents */}
//                     {isAdmin && (
//                         <>
//                             <FormModal
//                                 table="parent"
//                                 type="update"
//                                 data={parent as Record<string, unknown>}
//                             />
//                             <FormModal
//                                 table="parent"
//                                 type="delete"
//                                 // if FormModal expects string id, change this to: id={parent.id}
//                                 id={parseInt(parent.id, 10)}
//                             />
//                         </>
//                     )}
//                 </div>
//             </td>
//         </tr>
//     );

//     return (
//         <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//             {/* Header + create button (no filter/sort) */}
//             <div className="flex justify-between items-center mb-4">
//                 <h1 className="text-lg font-semibold">All Parents</h1>
//                 {/* Only admin can create parents */}
//                 {isAdmin && <FormModal table="parent" type="create" />}
//             </div>

//             {Array.isArray(rows) && (
//                 <Table<ParentRow> columns={columns} renderRow={renderRow} data={rows} />
//             )}

//             <Pagination currentPage={currentPage} totalPages={totalPages} />
//         </div>
//     );
// }

// src/app/dashboard/list/parents/page.tsx
export const dynamic = "force-dynamic";

import Image from "next/image";

import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import FormModal from "@/components/FormModal";

import { fetchParents, IParentWithChildren } from "@/action/server/parents";
import { getSession } from "@/lib/auth";

// Table column definitions
const columns = [
    { header: "Info", accessor: "info" },
    { header: "Username", accessor: "username", className: "hidden md:table-cell" },
    { header: "Children", accessor: "children", className: "hidden lg:table-cell" },
    { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
    { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
    { header: "Actions", accessor: "actions" },
];

export default async function ParentsPage({
    searchParams,
}: {
    // Next.js now passes this as a Promise
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    // 0) Session & authorization: allow only admin + teacher
    const session = await getSession();
    const role = session?.role;

    const isAdmin = role === "admin";
    const isTeacher = role === "teacher";

    if (!session || (!isAdmin && !isTeacher)) {
        return (
            <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                <h1 className="text-lg font-semibold mb-2">Parents</h1>
                <p className="text-sm text-gray-500">
                    You don&apos;t have permission to view the parents list.
                </p>
            </div>
        );
    }

    // 1) Await searchParams before using
    const resolvedSearchParams = await searchParams;
    const pageRaw = resolvedSearchParams.page;

    const currentPage = Array.isArray(pageRaw)
        ? parseInt(pageRaw[0] || "1", 10)
        : parseInt(pageRaw || "1", 10);

    const limit = 10;

    // 2) Fetch parents
    const parentData = await fetchParents(currentPage, limit);
    const { data: parents, totalPages } = parentData;

    // 3) Render function for a single row
    const renderRow = (parent: IParentWithChildren) => (
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
                    {/* Only admin can edit/delete parents */}
                    {isAdmin && (
                        <>
                            <FormModal
                                table="parent"
                                type="update"
                                data={parent as unknown as Record<string, unknown>}
                            />
                            <FormModal
                                table="parent"
                                type="delete"
                                // FormModal now expects string IDs
                                id={parent.id}
                            />
                        </>
                    )}
                </div>
            </td>
        </tr>
    );

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* Header + create button (no filter/sort) */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-semibold">All Parents</h1>
                {/* Only admin can create parents */}
                {isAdmin && <FormModal table="parent" type="create" />}
            </div>

            {Array.isArray(parents) && (
                <Table<IParentWithChildren>
                    columns={columns}
                    renderRow={renderRow}
                    data={parents}
                />
            )}

            <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
    );
}
