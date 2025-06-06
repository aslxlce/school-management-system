"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
    {
        title: "MENU",
        items: [
            {
                icon: "/home.png",
                label: "Home",
                href: "/",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/teacher.png",
                label: "Teachers",
                href: "/list/teachers",
                visible: ["admin"],
            },
            {
                icon: "/student.png",
                label: "Students",
                href: "/list/students",
                visible: ["admin"],
            },
            {
                icon: "/parent.png",
                label: "Parents",
                href: "/list/parents",
                visible: ["admin"],
            },
            {
                icon: "/subject.png",
                label: "Subjects",
                href: "/list/subjects",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/class.png",
                label: "Classes",
                href: "/list/classes",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/lesson.png",
                label: "Lessons",
                href: "/list/lessons",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/exam.png",
                label: "Exams",
                href: "/list/exams",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/assignment.png",
                label: "Assignments",
                href: "/list/assignments",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/result.png",
                label: "Results",
                href: "/list/results",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/attendance.png",
                label: "Attendance",
                href: "/list/attendance",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/calendar.png",
                label: "Events",
                href: "/list/events",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/announcement.png",
                label: "Announcements",
                href: "/list/announcements",
                visible: ["admin", "teacher", "student", "parent"],
            },
        ],
    },
    {
        title: "OTHER",
        items: [
            {
                icon: "/profile.png",
                label: "Profile",
                href: "/profile",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/setting.png",
                label: "Settings",
                href: "/settings",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/logout.png",
                label: "Logout",
                href: "#", // keep as "#" since action handles sign-out
                visible: ["admin", "teacher", "student", "parent"],
                action: () => signOut({ callbackUrl: "/" }),
            },
        ],
    },
];

const Menu = () => {
    const { data: session } = useSession();
    const userRole = session?.user?.role || "student";

    return (
        <div className="mt-4 text-sm">
            {menuItems.map((group) => (
                <div className="flex flex-col gap-2" key={group.title}>
                    <span className="hidden lg:block text-gray-400 font-light my-4">
                        {group.title}
                    </span>
                    {group.items
                        .filter((item) => item.visible.includes(userRole))
                        .map((item) =>
                            item.label === "Logout" ? (
                                <button
                                    key={item.label}
                                    onClick={item.action}
                                    className="flex item-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-[var(--lightSkye-color)]"
                                >
                                    <Image
                                        src={item.icon}
                                        alt={item.label}
                                        width={20}
                                        height={20}
                                    />
                                    <span className="hidden lg:block">{item.label}</span>
                                </button>
                            ) : (
                                <Link
                                    href={item.href}
                                    key={item.label}
                                    className="flex item-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-[var(--lightSkye-color)]"
                                >
                                    <Image
                                        src={item.icon}
                                        alt={item.label}
                                        width={20}
                                        height={20}
                                    />
                                    <span className="hidden lg:block">{item.label}</span>
                                </Link>
                            )
                        )}
                </div>
            ))}
        </div>
    );
};

export default Menu;
