// src/lib/auth.ts
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import dbConnect from "./dbConnection";
import { UserModel, StudentModel, ParentModel } from "@/models/User";
import { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import type { User } from "@/types/user";

// Reuse the role type from your shared user union
type SessionRole = User["role"];

export interface ISessionUser {
    id: string;
    username: string;
    role: SessionRole;

    // Extra info for UI
    name?: string;
    surname?: string;
    img?: string;

    // For students/parents
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
            authorize: async (credentials): Promise<ISessionUser | null> => {
                const parsed = credentialsSchema.safeParse(credentials);
                if (!parsed.success) return null;

                const { username, password } = parsed.data;

                await dbConnect();

                // Load base user (Mongoose document)
                const userDoc = await UserModel.findOne({ username }).select(
                    "+password role name surname img"
                );

                if (!userDoc) return null;

                const isMatch = await bcrypt.compare(password, userDoc.password);
                if (!isMatch) return null;

                // Convert to plain object and type it with your shared User type
                const userObj = userDoc.toObject() as User & { _id: typeof userDoc._id };

                // Prepare optional fields based on role
                let name: string | undefined;
                let surname: string | undefined;
                // let img: string | undefined;

                if (userObj.role === "teacher" || userObj.role === "student") {
                    name = userObj.name;
                    surname = userObj.surname;
                    // img = userObj.img;
                } else if (userObj.role === "parent") {
                    // Parent has name/surname but no img in types
                    name = userObj.name;
                    surname = userObj.surname;
                }
                // Admin keeps only username

                const payload: ISessionUser = {
                    id: userObj._id.toString(),
                    username: userObj.username,
                    role: userObj.role,
                    name,
                    surname,
                    // img,
                };

                // Attach classId for students
                if (userObj.role === "student") {
                    const stuLean = await StudentModel.findById(userDoc._id)
                        .select("classId")
                        .lean<{ classId?: unknown }>();

                    if (stuLean?.classId) {
                        payload.classId = String(stuLean.classId);
                    }
                }

                // For parents, derive classId from their first child
                if (userObj.role === "parent") {
                    const parentLean = await ParentModel.findById(userDoc._id)
                        .select("childrenIds")
                        .lean<{ childrenIds?: unknown }>();

                    if (
                        parentLean?.childrenIds &&
                        Array.isArray(parentLean.childrenIds) &&
                        parentLean.childrenIds.length > 0
                    ) {
                        const firstChildId = String(parentLean.childrenIds[0]);
                        const childLean = await StudentModel.findById(firstChildId)
                            .select("classId")
                            .lean<{ classId?: unknown }>();

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
        async jwt({ token, user }) {
            // On login we get the full ISessionUser as `user`
            if (user) {
                const sessionUser = user as ISessionUser;
                const tokenWithUser = token as { user?: ISessionUser };

                tokenWithUser.user = {
                    id: sessionUser.id,
                    username: sessionUser.username,
                    role: sessionUser.role,
                    name: sessionUser.name,
                    surname: sessionUser.surname,
                    img: sessionUser.img,
                    classId: sessionUser.classId,
                };
            }

            return token;
        },
        async session({ session, token }) {
            const tokenWithUser = token as { user?: ISessionUser };

            if (tokenWithUser.user) {
                session.user = {
                    id: tokenWithUser.user.id,
                    username: tokenWithUser.user.username,
                    role: tokenWithUser.user.role,
                    name: tokenWithUser.user.name,
                    surname: tokenWithUser.user.surname,
                    img: tokenWithUser.user.img,
                    classId: tokenWithUser.user.classId,
                } as ISessionUser;
            }

            return session;
        },
    },
};

export const getSession = async (): Promise<ISessionUser | null> => {
    const session = await getServerSession(authOptions);
    if (session && session.user) {
        return session.user as ISessionUser;
    }
    return null;
};

// // src/lib/auth.ts
// import Credentials from "next-auth/providers/credentials";
// import { z } from "zod";
// import dbConnect from "./dbConnection";
// import { UserModel, StudentModel, ParentModel } from "@/models/User";
// import { getServerSession } from "next-auth";
// import type { NextAuthOptions } from "next-auth";
// import bcrypt from "bcryptjs";
// import type { User } from "@/types/user";

// // We only reuse the role union from your shared User type
// type SessionRole = User["role"];

// // What we store in session.user
// export interface ISessionUser {
//     id: string;
//     username: string;
//     role: SessionRole;

//     // Optional UI fields
//     name?: string;
//     surname?: string;
//     img?: string;

//     // Contact info
//     email?: string;
//     phone?: string;

//     // For students
//     classId?: string;

//     // For parents
//     childId?: string;
//     childName?: string;
// }

// const credentialsSchema = z.object({
//     username: z.string(),
//     password: z.string().min(6),
// });

// export const authOptions: NextAuthOptions = {
//     providers: [
//         Credentials({
//             credentials: {
//                 username: { label: "Username", type: "text" },
//                 password: { label: "Password", type: "password" },
//             },
//             authorize: async (credentials): Promise<ISessionUser | null> => {
//                 const parsed = credentialsSchema.safeParse(credentials);
//                 if (!parsed.success) return null;

//                 const { username, password } = parsed.data;

//                 await dbConnect();

//                 // Fetch the user from Mongo, including password + UI fields
//                 const userDoc = await UserModel.findOne({ username }).select(
//                     "+password role username name surname img email phone"
//                 );

//                 if (!userDoc) return null;

//                 const isMatch = await bcrypt.compare(password, userDoc.password);
//                 if (!isMatch) return null;

//                 // Local type describing the fields we actually use from Mongo
//                 type UserDbObject = {
//                     _id: typeof userDoc._id;
//                     username: string;
//                     role: SessionRole;
//                     name?: string;
//                     surname?: string;
//                     img?: string;
//                     email?: string;
//                     phone?: string;
//                 };

//                 const userObj = userDoc.toObject() as UserDbObject;

//                 // Base session payload
//                 const payload: ISessionUser = {
//                     id: userObj._id.toString(),
//                     username: userObj.username,
//                     role: userObj.role,
//                     name: userObj.name,
//                     surname: userObj.surname,
//                     img: userObj.img,
//                     email: userObj.email,
//                     phone: userObj.phone,
//                 };

//                 // ─────────────────────────────────────────────
//                 // Extra data for students
//                 // ─────────────────────────────────────────────
//                 if (userObj.role === "student") {
//                     const stuLean = await StudentModel.findById(userObj._id)
//                         .select("classId")
//                         .lean<{ classId?: string }>();

//                     if (stuLean?.classId) {
//                         payload.classId = stuLean.classId;
//                     }
//                 }

//                 // ─────────────────────────────────────────────
//                 // Extra data for parents → classId + child info
//                 // ─────────────────────────────────────────────
//                 if (userObj.role === "parent") {
//                     const parentLean = await ParentModel.findById(userObj._id)
//                         .select("childrenIds")
//                         .lean<{ childrenIds?: string[] }>();

//                     if (parentLean?.childrenIds && parentLean.childrenIds.length > 0) {
//                         const firstChildId = parentLean.childrenIds[0];

//                         const childLean = await StudentModel.findById(firstChildId)
//                             .select("classId name surname")
//                             .lean<{
//                                 classId?: string;
//                                 name?: string;
//                                 surname?: string;
//                             }>();

//                         if (childLean?.classId) {
//                             payload.classId = childLean.classId;
//                         }

//                         payload.childId = firstChildId;

//                         if (childLean?.name) {
//                             payload.childName = childLean.surname
//                                 ? `${childLean.name} ${childLean.surname}`
//                                 : childLean.name;
//                         }
//                     }
//                 }

//                 return payload;
//             },
//         }),
//     ],
//     pages: {
//         signIn: "/auth/sign-in",
//     },
//     callbacks: {
//         async jwt({ token, user }) {
//             if (user) {
//                 const sessionUser = user as ISessionUser;
//                 (token as { user?: ISessionUser }).user = sessionUser;
//             }
//             return token;
//         },
//         async session({ session, token }) {
//             const tokenWithUser = token as { user?: ISessionUser };
//             if (tokenWithUser.user) {
//                 session.user = tokenWithUser.user;
//             }
//             return session;
//         },
//     },
// };

// export const getSession = async (): Promise<ISessionUser | null> => {
//     const session = await getServerSession(authOptions);
//     return session?.user ? (session.user as ISessionUser) : null;
// };
