// "use client";

// import { SessionProvider as Provider } from "next-auth/react";

// export function SessionProvider({ children, session }: any) {
//     return <Provider session={session}>{children}</Provider>;
// }

// "use client";

// import { SessionProvider as Provider } from "next-auth/react";
// import { Session } from "next-auth";

// export function SessionProvider({ children, user }: { children: React.ReactNode; user: any }) {
//     const session: Session = {
//         user,
//         expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24hr fallback expiry
//     };

//     return <Provider session={session}>{children}</Provider>;
// }

"use client";

import { SessionProvider as Provider } from "next-auth/react";
import type { Session } from "next-auth";

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
