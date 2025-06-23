// lib/auth.ts

import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import dbConnect from "./dbConnection";
import { UserModel } from "@/models/User";
import { getServerSession } from "next-auth";
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

        // async redirect({ url, baseUrl }) {
        //     // Always fallback to base URL, dynamic redirection happens client-side
        //     return baseUrl;
        // },
    },
};

export const getSession = async () => {
    const session = await getServerSession(authOptions);
    if (session) return session.user as IUserBase;
    else return null;
};
