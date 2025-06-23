// import Image from "next/image";

// const Navbar = () => {
//     return (
//         <div className="flex items-center justify-between p-4">
//             {/* Search bar */}
//             <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
//                 <Image src="/search.png" alt="" width={14} height={14} />
//                 <input
//                     type="text"
//                     placeholder="Search..."
//                     className="w-[200px] p-2 bg-transparent outline-none"
//                 />
//             </div>
//             {/* Icons and user */}
//             <div className="flex items-center gap-6 justify-end w-full">
//                 <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
//                     <Image src="/message.png" alt="" width={20} height={20} />
//                 </div>
//                 <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
//                     <Image src="/announcement.png" alt="" width={20} height={20} />
//                     <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
//                         2
//                     </div>
//                 </div>
//                 <div className="flex flex-col">
//                     <span className="text-xs leading-3 font-medium">Leo</span>
//                     <span className="text-[10px] text-gray-500 text-right">Admin</span>
//                 </div>
//                 <Image src="/avatar.png" alt="" width={36} height={36} className="rounded-full" />
//             </div>
//         </div>
//     );
// };

// export default Navbar;

"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

const Navbar = () => {
    const { data: session, status } = useSession();

    if (status !== "authenticated" || !session?.user) {
        return null;
    }

    // Define the extended shape locally for assertion
    interface AuthUser {
        id: string;
        username: string;
        role: "admin" | "teacher" | "student" | "parent";
        name: string;
        surname: string;
    }
    const user = session.user as AuthUser;
    const { role, username, name, surname } = user;

    // Choose display name
    // If name/surname missing, fallback to username
    const rawName = name && surname ? `${name} ${surname}` : username;
    const displayName = role === "admin" ? username : rawName;

    return (
        <div className="flex items-center justify-between p-4">
            {/* Search bar */}
            <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
                <Image src="/search.png" alt="Search" width={14} height={14} />
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-[200px] p-2 bg-transparent outline-none"
                />
            </div>

            {/* Announcements and user info */}
            <div className="flex items-center gap-6 justify-end w-full">
                <Link
                    href="/list/announcements"
                    className="relative bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer"
                >
                    <Image src="/announcement.png" alt="Announcements" width={20} height={20} />
                    <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
                        2
                    </div>
                </Link>

                <div className="flex flex-col">
                    <span className="text-xs leading-3 font-medium">{displayName}</span>
                    <span className="text-[10px] text-gray-500 text-right capitalize">{role}</span>
                </div>

                <Image
                    src="/avatar.png"
                    alt={`${displayName} avatar`}
                    width={36}
                    height={36}
                    className="rounded-full"
                />
            </div>
        </div>
    );
};

export default Navbar;
