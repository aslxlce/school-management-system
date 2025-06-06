// api/teachers/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnection";
import { TeacherModel } from "@/models/User";

// ────────────────────────────────────────────────────────────────────────────
// POST: Create a new teacher via multipart/form-data
// ────────────────────────────────────────────────────────────────────────────
//
// The old JSON-based POST is preserved below, commented out, for reference:
//
// // import { getServerSession } from "next-auth";
// // import { authOptions } from "@/lib/auth";
// //
// // export async function POST(req: NextRequest) {
// //     try {
// //         const userData = await req.json();
// //         await dbConnect();
// //         const newUser = await TeacherModel.create(userData);
// //         return NextResponse.json(
// //             { message: `User '${newUser.name} ${newUser.surname}' created successfully!` },
// //             { status: 201 }
// //         );
// //     } catch (error) {
// //         console.log(error);
// //         return NextResponse.json({ error: "Failed to create" }, { status: 500 });
// //     }
// // }

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        console.log("Received formData:");
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        const requiredFields = [
            "username",
            "password",
            "email",
            "name",
            "surname",
            "phone",
            "address",
            "subject",
            "birthday",
            "sex",
            "gradeLevel",
        ];

        for (const field of requiredFields) {
            if (!formData.get(field)) {
                return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
            }
        }

        const newTeacher = {
            username: formData.get("username") as string,
            password: formData.get("password") as string,
            email: formData.get("email") as string,
            name: formData.get("name") as string,
            surname: formData.get("surname") as string,
            phone: formData.get("phone") as string,
            address: formData.get("address") as string,
            subject: formData.get("subject") as string,
            birthday: new Date(formData.get("birthday") as string),
            sex: formData.get("sex") as "male" | "female",
            gradeLevel: formData.get("gradeLevel") as "primary" | "middle" | "high",
            role: "teacher", // ✅ add this line
        };

        await dbConnect();
        const created = await TeacherModel.create(newTeacher);

        return NextResponse.json(
            { message: `User '${created.name} ${created.surname}' created successfully!` },
            { status: 201 }
        );
    } catch (error) {
        console.error("[TEACHER_CREATE_ERROR]:", error);
        return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 });
    }
}

// ────────────────────────────────────────────────────────────────────────────
// GET: Fetch paginated teachers, only for admins
// ────────────────────────────────────────────────────────────────────────────
//
// The old non-paginated GET is preserved below, commented out, for reference:
//
// // export async function GET() {
// //   try {
// //     const session = await getServerSession(authOptions);
// //     if (!session || session.user?.role !== "admin") {
// //       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// //     }
// //
// //     await dbConnect();
// //     const teachers = await TeacherModel.find({}).select("-password");
// //     return NextResponse.json(teachers);
// //   } catch (error) {
// //     console.error("Failed to fetch teachers:", error);
// //     return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 });
// //   }
// // }

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

// ────────────────────────────────────────────────────────────────────────────
// The PUT handler is preserved below, commented out, for reference:
//
// // export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
// //   try {
// //     const session = await getServerSession(authOptions);
// //     if (!session || (session.user?.role !== "admin" && session.user?.id !== params.id)) {
// //       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// //     }
// //
// //     const userData = await req.json();
// //     await dbConnect();
// //
// //     const updatedUser = await TeacherModel.findByIdAndUpdate(params.id, userData, {
// //       new: true,
// //       runValidators: true,
// //     });
// //
// //     if (!updatedUser) {
// //       return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
// //     }
// //
// //     return NextResponse.json(
// //       { message: `Teacher updated successfully!`, user: updatedUser },
// //       { status: 200 }
// //     );
// //   } catch (error) {
// //     console.log(error);
// //     return NextResponse.json({ error: "Failed to update teacher" }, { status: 500 });
// //   }
// // }
