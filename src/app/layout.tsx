// // import "./globals.css";

// // export default function RootLayout({
// //     children,
// // }: Readonly<{
// //     children: React.ReactNode;
// // }>) {
// //     return (
// //         <html lang="en">
// //             <body className="">{children}</body>
// //         </html>
// //     );
// // }

// // import { SessionProvider } from "@/components/SessionProvider";
// // import "./globals.css";
// // import { getServerSession } from "next-auth";

// // export default async function RootLayout({
// //     children,
// // }: Readonly<{
// //     children: React.ReactNode;
// // }>) {
// //     const session = await getServerSession();

// //     return (
// //         <html lang="en">
// //             <body>
// //                 <SessionProvider session={session}>{children}</SessionProvider>
// //             </body>
// //         </html>
// //     );
// // }

// import "./globals.css";
// import { getSession } from "@/lib/auth"; // Custom function that returns session.user
// import { SessionProvider } from "@/components/SessionProvider";

// export default async function RootLayout({
//     children,
// }: Readonly<{
//     children: React.ReactNode;
// }>) {
//     const user = await getSession();

//     return (
//         <html lang="en">
//             <body>
//                 <SessionProvider user={user}>
//                     {" "}
//                     {/* Passing only user */}
//                     {children}
//                 </SessionProvider>
//             </body>
//         </html>
//     );
// }

import "./globals.css";
import { getSession } from "@/lib/auth"; // returns ISessionUser | null
import { SessionProvider } from "@/components/SessionProvider";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getSession();

    return (
        <html lang="en">
            <body>
                {user ? (
                    // user is non-null here, OK for IUserBase
                    <SessionProvider user={user}>{children}</SessionProvider>
                ) : (
                    // no session: render children without provider
                    children
                )}
            </body>
        </html>
    );
}
