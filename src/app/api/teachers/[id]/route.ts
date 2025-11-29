// // src/app/api/teachers/[id]/route.ts

// import dbConnect from "@/lib/dbConnection";
// import { TeacherModel } from "@/models/User";
// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { MongoServerError } from "mongodb";
// import type { IUserTeacher } from "@/types/user";

// /**
//  * PUT /api/teachers/[id]
//  * Update teacher via JSON body (matches TeacherPayload).
//  *
//  * In Next 15, `params` is a Promise and must be awaited.
//  */
// export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
//     const { id } = await context.params;

//     const session = await getServerSession(authOptions);
//     if (!session || (session.user?.role !== "admin" && session.user?.id !== id)) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     try {
//         await dbConnect();

//         const data = (await req.json()) as {
//             username: string;
//             email: string;
//             password?: string;
//             name: string;
//             surname: string;
//             phone: string;
//             address: string;
//             img?: string;
//             sex: "male" | "female";
//             subject: string;
//             birthday: string; // ISO or anything Date-parsable
//             gradeLevel: "primary" | "middle" | "high";
//         };

//         const updatedDoc = await TeacherModel.findByIdAndUpdate(
//             id,
//             {
//                 ...data,
//                 birthday: new Date(data.birthday),
//             },
//             {
//                 new: true,
//                 runValidators: true,
//             }
//         ).lean<(IUserTeacher & { _id: unknown }) | null>();

//         if (!updatedDoc) {
//             return NextResponse.json({ error: "Not found" }, { status: 404 });
//         }

//         const teacher: IUserTeacher = {
//             id: String(updatedDoc._id),
//             role: "teacher",
//             username: updatedDoc.username,
//             name: updatedDoc.name,
//             surname: updatedDoc.surname,
//             email: updatedDoc.email,
//             phone: updatedDoc.phone,
//             address: updatedDoc.address,
//             img: updatedDoc.img,
//             sex: updatedDoc.sex,
//             subject: updatedDoc.subject,
//             birthday: updatedDoc.birthday,
//             gradeLevel: updatedDoc.gradeLevel,
//             schedule: updatedDoc.schedule ?? [],
//         };

//         return NextResponse.json(
//             { message: "Teacher updated successfully", teacher },
//             { status: 200 }
//         );
//     } catch (e: unknown) {
//         console.error(e);
//         const msg =
//             e instanceof MongoServerError
//                 ? e.message
//                 : e instanceof Error
//                 ? e.message
//                 : "Unknown error";
//         return NextResponse.json({ message: msg }, { status: 500 });
//     }
// }

// /**
//  * GET /api/teachers/[id]
//  * In Next 15, `params` is a Promise and must be awaited.
//  */
// export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
//     const { id } = await context.params;

//     if (!id) {
//         return NextResponse.json({ error: "Missing id" }, { status: 400 });
//     }

//     await dbConnect();
//     const t = await TeacherModel.findById(id).lean();

//     if (!t) {
//         return NextResponse.json({ error: "Not found" }, { status: 404 });
//     }

//     const teacher: IUserTeacher = {
//         id: t._id.toString(),
//         role: "teacher",
//         username: t.username,
//         name: t.name,
//         surname: t.surname,
//         email: t.email,
//         phone: t.phone,
//         address: t.address,
//         img: t.img,
//         sex: t.sex,
//         subject: t.subject,
//         birthday: t.birthday.toISOString(),
//         gradeLevel: t.gradeLevel,
//         schedule: t.schedule ?? [],
//     };

//     return NextResponse.json(teacher);
// }

// src/app/api/teachers/[id]/route.ts

import dbConnect from "@/lib/dbConnection";
import { TeacherModel } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MongoServerError } from "mongodb";
import type { IUserTeacher } from "@/types/user";

/**
 * PUT /api/teachers/[id]
 * Update teacher via JSON body (matches TeacherPayload).
 *
 * IMPORTANT: We now load the document and call `save()` so that
 * pre("save") hooks (password hashing) run correctly.
 */
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    const session = await getServerSession(authOptions);
    if (!session || (session.user?.role !== "admin" && session.user?.id !== id)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();

        const data = (await req.json()) as {
            username: string;
            email: string;
            password?: string;
            name: string;
            surname: string;
            phone: string;
            address: string;
            img?: string;
            sex: "male" | "female";
            subject: string;
            birthday: string; // ISO or anything Date-parsable
            gradeLevel: "primary" | "middle" | "high";
        };

        // Load the existing teacher so pre("save") hooks will fire
        const teacherDoc = await TeacherModel.findById(id);
        if (!teacherDoc) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        // Apply scalar fields
        teacherDoc.username = data.username;
        teacherDoc.email = data.email;
        teacherDoc.name = data.name;
        teacherDoc.surname = data.surname;
        teacherDoc.phone = data.phone;
        teacherDoc.address = data.address;
        teacherDoc.img = data.img;
        teacherDoc.sex = data.sex;
        teacherDoc.subject = data.subject;
        teacherDoc.gradeLevel = data.gradeLevel;
        teacherDoc.birthday = new Date(data.birthday);

        // Only update password if a non-empty one is provided.
        // pre("save") hook on the model will hash it.
        if (data.password && data.password.trim().length > 0) {
            teacherDoc.password = data.password;
        }

        const saved = await teacherDoc.save(); // <-- password hashing happens here

        const teacher: IUserTeacher = {
            id: saved._id.toString(),
            role: "teacher",
            username: saved.username,
            name: saved.name,
            surname: saved.surname,
            email: saved.email,
            phone: saved.phone,
            address: saved.address,
            img: saved.img,
            sex: saved.sex,
            subject: saved.subject,
            birthday: saved.birthday.toISOString(),
            gradeLevel: saved.gradeLevel,
            schedule: saved.schedule ?? [],
        };

        return NextResponse.json(
            { message: "Teacher updated successfully", teacher },
            { status: 200 }
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

/**
 * GET /api/teachers/[id]
 * In Next 15, `params` is a Promise and must be awaited.
 */
export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    if (!id) {
        return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await dbConnect();
    const t = await TeacherModel.findById(id).lean();

    if (!t) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const teacher: IUserTeacher = {
        id: t._id.toString(),
        role: "teacher",
        username: t.username,
        name: t.name,
        surname: t.surname,
        email: t.email,
        phone: t.phone,
        address: t.address,
        img: t.img,
        sex: t.sex,
        subject: t.subject,
        birthday: t.birthday.toISOString(),
        gradeLevel: t.gradeLevel,
        schedule: t.schedule ?? [],
    };

    return NextResponse.json(teacher);
}
