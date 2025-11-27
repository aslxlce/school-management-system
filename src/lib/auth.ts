import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import dbConnect from "./dbConnection";
import { UserModel, StudentModel, ParentModel } from "@/models/User";
import { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";

type SessionRole = "admin" | "teacher" | "student" | "parent";

export interface ISessionUser {
    id: string;
    username: string;
    role: SessionRole;

    classId?: string;
}

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
                const user = await UserModel.findOne({ username }).select("+password role");

                if (!user) return null;

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) return null;

                const payload: ISessionUser = {
                    id: user._id.toString(),
                    username: user.username,
                    role: user.role as SessionRole,
                };

                if (user.role === "student") {
                    const stuLean = await StudentModel.findById(user._id)
                        .select("classId")
                        .lean<{ classId?: string }>();

                    if (stuLean?.classId) {
                        payload.classId = String(stuLean.classId);
                    }
                } else if (user.role === "parent") {
                    const parentLean = await ParentModel.findById(user._id)
                        .select("childrenIds")
                        .lean<{ childrenIds?: string[] }>();

                    if (parentLean?.childrenIds && parentLean.childrenIds.length > 0) {
                        const firstChildId = parentLean.childrenIds[0];
                        const childLean = await StudentModel.findById(firstChildId)
                            .select("classId")
                            .lean<{ classId?: string }>();

                        if (childLean?.classId) {
                            payload.classId = String(childLean.classId);
                        }
                    }
                }

                return payload;
            },
        }),
    ],
    pages: {
        signIn: "/auth/sign-in",
    },
    callbacks: {
        async session({ session, token }) {
            if (token.user) {
                session.user = token.user as ISessionUser;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.user = user as ISessionUser;
            }
            return token;
        },
    },
};

export const getSession = async (): Promise<ISessionUser | null> => {
    const session = await getServerSession(authOptions);
    if (session) return session.user as ISessionUser;
    return null;
};
