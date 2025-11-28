// import dbConnect from "@/lib/dbConnection";
// import { TeacherModel } from "@/models/User";
// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { MongoServerError } from "mongodb";

// export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
//     const session = await getServerSession(authOptions);
//     if (!session || (session.user?.role !== "admin" && session.user?.id !== params.id)) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     try {
//         await dbConnect();
//         const data = await req.json();
//         const updated = await TeacherModel.findByIdAndUpdate(params.id, data, {
//             new: true,
//             runValidators: true,
//         });
//         if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
//         return NextResponse.json(updated, { status: 200 });
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

// export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
//     if (!params.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
//     await dbConnect();
//     const t = await TeacherModel.findById(params.id).lean();
//     if (!t) return NextResponse.json({ error: "Not found" }, { status: 404 });
//     return NextResponse.json({
//         id: t._id.toString(),
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
//         role: "teacher",
//         schedule: t.schedule,
//     });
// }

// src/app/api/teachers/[id]/route.ts
import dbConnect from "@/lib/dbConnection";
import { TeacherModel } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MongoServerError } from "mongodb";

// Next 15 route context type
interface RouteContext {
    params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, context: RouteContext) {
    const { id } = await context.params;

    const session = await getServerSession(authOptions);
    if (!session || (session.user?.role !== "admin" && session.user?.id !== id)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();
        const data = await req.json();

        const updated = await TeacherModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        if (!updated) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
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

export async function GET(_req: NextRequest, context: RouteContext) {
    const { id } = await context.params;

    if (!id) {
        return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await dbConnect();
    const t = await TeacherModel.findById(id).lean();
    if (!t) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
        id: t._id.toString(),
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
        role: "teacher",
        schedule: t.schedule,
    });
}
