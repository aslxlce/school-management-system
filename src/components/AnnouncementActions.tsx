// src/components/AnnouncementActions.tsx
"use client";

import FormModal from "./FormModal";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

interface Props {
    id: string;
    title: string;
    date: string;
}

export default function AnnouncementActions({ id, title, date }: Props) {
    const { data: session } = useSession();

    return (
        <div className="flex items-center gap-2">
            {session?.user?.role === "admin" ? (
                <>
                    <FormModal
                        table="announcement"
                        type="update"
                        data={{ id: Number(id), title, date }}
                    />
                    <FormModal table="announcement" type="delete" id={Number(id)} />
                </>
            ) : (
                <Link href={`/dashboard/list/announcements/${id}`}>
                    <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[var(--sky-color)]">
                        <Image src="/view.png" alt="View" width={16} height={16} />
                    </button>
                </Link>
            )}
        </div>
    );
}
