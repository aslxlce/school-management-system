// types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user?: {
            id: string;
            username: string;
            role: "admin" | "student" | "teacher" | "parent";
        };
    }

    interface User {
        id: string;
        username: string;
        role: "admin" | "student" | "teacher" | "parent";
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user?: {
            id: string;
            username: string;
            role: "admin" | "student" | "teacher" | "parent";
        };
    }
}
