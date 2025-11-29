// // src/components/Navbar.tsx
// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useSession } from "next-auth/react";

// interface AuthUser {
//     id: string;
//     role: "admin" | "teacher" | "student" | "parent";
//     username?: string;
//     name?: string;
//     surname?: string;
//     img?: string;
// }

// const Navbar = () => {
//     const { data: session, status } = useSession();

//     if (status !== "authenticated" || !session?.user) {
//         return null;
//     }

//     const user = session.user as AuthUser;
//     const { role, username, name, surname, img } = user;

//     const fullName =
//         typeof name === "string" && typeof surname === "string" && name && surname
//             ? `${name} ${surname}`
//             : undefined;

//     const displayName =
//         role === "admin"
//             ? username || fullName || name || "Admin"
//             : fullName || username || name || "User";

//     // Avatar: use user.img if present and non-empty, otherwise fallback
//     const avatarSrc = typeof img === "string" && img.trim().length > 0 ? img : "/avatar.png";

//     return (
//         <div className="flex items-center justify-between p-4">
//             {/* Right side: announcements + user info */}
//             <div className="flex items-center gap-6 justify-end w-full">
//                 <Link
//                     href="/list/announcements"
//                     className="relative bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer"
//                 >
//                     <Image src="/announcement.png" alt="Announcements" width={20} height={20} />
//                 </Link>

//                 <div className="flex flex-col">
//                     <span className="text-xs leading-3 font-medium">{displayName}</span>
//                     <span className="text-[10px] text-gray-500 text-right capitalize">{role}</span>
//                 </div>

//                 <Image
//                     src={avatarSrc}
//                     alt={`${displayName} avatar`}
//                     width={36}
//                     height={36}
//                     className="rounded-full object-cover"
//                 />
//             </div>
//         </div>
//     );
// };

// export default Navbar;

// src/components/Navbar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface AuthUser {
    id: string;
    role: "admin" | "teacher" | "student" | "parent";
    username?: string;
    name?: string;
    surname?: string;
    img?: string;
}

const Navbar = () => {
    const { data: session, status } = useSession();

    if (status !== "authenticated" || !session?.user) {
        return null;
    }

    const user = session.user as AuthUser;
    const { role, username, name, surname, img } = user;

    // Full name if exists
    const fullName = name && surname ? `${name} ${surname}` : undefined;

    // Display name rules
    const displayName = role === "admin" ? username || "Admin" : fullName || username || "User";

    // Avatar fallback
    const avatarSrc = img && img.trim().length > 0 ? img : "/avatar.png";

    return (
        <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-6 justify-end w-full">
                {/* Announcements */}
                <Link
                    href="/list/announcements"
                    className="relative bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer"
                >
                    <Image src="/announcement.png" alt="Announcements" width={20} height={20} />
                </Link>

                {/* Name + role */}
                <Link href="/profile" className="flex flex-col cursor-pointer select-none">
                    <span className="text-xs leading-3 font-medium hover:underline">
                        {displayName}
                    </span>
                    <span className="text-[10px] text-gray-500 text-right capitalize">{role}</span>
                </Link>

                {/* Avatar → also link to profile */}
                <Link href="/profile">
                    <Image
                        src={avatarSrc}
                        alt={`${displayName} avatar`}
                        width={36}
                        height={36}
                        className="rounded-full object-cover cursor-pointer"
                    />
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
