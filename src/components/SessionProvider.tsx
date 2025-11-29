"use client";

import { SessionProvider as Provider } from "next-auth/react";
import type { Session } from "next-auth";
import { IUserBase } from "@/types/user";

interface Props {
    children: React.ReactNode;
    user: IUserBase;
}

export function SessionProvider({ children, user }: Props) {
    const session: Session = {
        user,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24-hour placeholder
    };

    return <Provider session={session}>{children}</Provider>;
}
