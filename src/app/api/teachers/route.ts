// src/app/api/teachers/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnection";
import { TeacherModel } from "@/models/User";
import { MongoServerError } from "mongodb";
import type { IUserTeacher } from "@/types/user";

/**
 * GET /api/teachers
 * Admin-only paginated list of teachers.
 */
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
        const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10);
        const skip = (page - 1) * limit;

        const [teachers, total] = await Promise.all([
            TeacherModel.find({}).skip(skip).limit(limit).select("-password").lean(),
            TeacherModel.countDocuments({}),
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({ data: teachers, total, page, totalPages });
    } catch (error) {
        console.error("Failed to fetch teachers:", error);
        return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 });
    }
}

/**
 * POST /api/teachers
 * Create teacher using JSON body (no file upload yet).
 * This matches the TeacherPayload you send from the client.
 */
export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as {
            username: string;
            password: string;
            name: string;
            surname: string;
            email?: string;
            phone?: string;
            address: string;
            sex: "male" | "female";
            subject: string;
            birthday: string; // ISO
            gradeLevel: "primary" | "middle" | "high";
            img?: string;
        };

        const {
            username,
            password,
            name,
            surname,
            email,
            phone,
            address,
            sex,
            subject,
            birthday,
            gradeLevel,
            img,
        } = body;

        await dbConnect();

        const teacherDoc = await TeacherModel.create({
            username,
            password,
            name,
            surname,
            email,
            phone,
            address,
            sex,
            subject,
            birthday: new Date(birthday),
            gradeLevel,
            ...(img ? { img } : {}),
            schedule: [],
        });

        const teacher: IUserTeacher = {
            id: teacherDoc._id.toString(),
            role: "teacher",
            username: teacherDoc.username,
            name: teacherDoc.name,
            surname: teacherDoc.surname,
            email: teacherDoc.email,
            phone: teacherDoc.phone,
            address: teacherDoc.address,
            img: teacherDoc.img,
            sex: teacherDoc.sex,
            subject: teacherDoc.subject,
            birthday: teacherDoc.birthday.toISOString(),
            gradeLevel: teacherDoc.gradeLevel,
            schedule: teacherDoc.schedule ?? [],
        };

        // include message so client type `{ message: string }` is satisfied
        return NextResponse.json(
            { message: "Teacher created successfully", teacher },
            { status: 201 }
        );
    } catch (e: unknown) {
        console.error(e);
        const msg =
            e instanceof MongoServerError
                ? e.message
                : e instanceof Error
                ? e.message
                : "Unknown error";
        return NextResponse.json({ message: msg }, { status: 500 });
    }
}
