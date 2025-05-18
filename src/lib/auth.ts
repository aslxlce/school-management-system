// import Credentials from "next-auth/providers/credentials";
// import { z } from "zod";
// import dbConnect from "./dbConnection";
// import { UserModel } from "@/models/User";
// import { AuthOptions, getServerSession } from "next-auth";

// export const authOptions = {
//     providers: [
//         Credentials({
//             credentials: {
//                 username: { label: "Username", type: "text" },
//                 password: { label: "Password", type: "password" },
//             },
//             authorize: async (credentials) => {
//                 const parsedCredentials = z
//                     .object({
//                         username: z.string(),
//                         password: z.string().min(6),
//                     })
//                     .safeParse(credentials);
//                 try {
//                     if (!parsedCredentials.success) throw new Error("Invalid credentials");
//                     const { username, password } = parsedCredentials.data;

//                     await dbConnect();
//                     const user = await UserModel.findOne({ username });

//                     if (!user) throw new Error("No user found");

//                     const passwordMatch = await user.comparePassword(password);
//                     if (!passwordMatch) throw new Error("credentials wrong");

//                     return {
//                         id: user._id.toString(),
//                         ...user.toUser(),
//                     };
//                 } catch (error) {
//                     console.log(error);
//                     return null;
//                 }
//             },
//         }),
//     ],
//     pages: {
//         signIn: "/auth/sign-in",
//     },
//     callbacks: {
//         async session({ session, token }) {
//             // Attach the `id` to the session user object
//             if (token?.user) {
//                 session.user = {
//                     ...session.user,
//                     ...token.user,
//                 };
//             }

//             return session;
//         },
//         async jwt({ token, user, trigger }) {
//             // Attach the `id` to the JWT token
//             if (user) {
//                 if (trigger === "update") {
//                     console.log("JWT token called");
//                 }
//                 token.user = user;
//             }

//             return token;
//         },
//     },
// } satisfies AuthOptions;

// export const getSession = async () => {
//     const session = await getServerSession();
//     if (session) return session.user as UserI;
//     else return null;
// };

import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import dbConnect from "./dbConnection";
import { UserModel } from "@/models/User";
import { AuthOptions, getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";

const credentialsSchema = z.object({
    username: z.string(),
    password: z.string().min(6),
});

export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const parsed = credentialsSchema.safeParse(credentials);
                if (!parsed.success) return null;

                const { username, password } = parsed.data;

                await dbConnect();
                const user = await UserModel.findOne({ username }).select("+password");

                if (!user) return null;

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) return null;

                return {
                    id: user._id.toString(),
                    username: user.username,
                    role: user.role, // comes from discriminatorKey
                };
            },
        }),
    ],
    pages: {
        signIn: "/auth/sign-in",
    },
    callbacks: {
        async session({ session, token }) {
            if (token.user) {
                session.user = token.user as typeof session.user;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async redirect({ url, baseUrl }) {
            // Role-based redirection
            return baseUrl;
        },
    },
};

export const getSession = async () => {
    const session = await getServerSession(authOptions);
    return session?.user ?? null;
};
