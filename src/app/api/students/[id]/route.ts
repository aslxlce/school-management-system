// app/api/students/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnection";
import { StudentModel } from "@/models/User";
import ClassModel from "@/models/Class";
import type { IScheduleEntry } from "@/types/user";
import { MongoServerError } from "mongodb";
import { Types } from "mongoose";

interface ClassWithSchedule {
    schedule: IScheduleEntry[];
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user?.role !== "admin" && session.user?.id !== params.id)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();
        const body = await req.json();

        const updated = await StudentModel.findByIdAndUpdate(
            params.id,
            { ...body },
            { new: true, runValidators: true }
        );
        if (!updated) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        if (body.classId) {
            await ClassModel.findByIdAndUpdate(body.classId, {
                $addToSet: { studentIds: updated._id },
            });
            const cls = await ClassModel.findById(body.classId).lean<ClassWithSchedule>();
            if (cls?.schedule?.length) {
                updated.schedule = cls.schedule;
                await updated.save();
            }
        }

        return NextResponse.json({ message: "Updated", user: updated }, { status: 200 });
    } catch (err: unknown) {
        console.error("[API /students/[id] PUT] Error:", err);
        const message =
            err instanceof MongoServerError
                ? err.message
                : err instanceof Error
                ? err.message
                : "Unknown error";
        return NextResponse.json({ message }, { status: 500 });
    }
}

interface RawStudent {
    _id: Types.ObjectId;
    username: string;
    name: string;
    surname: string;
    email?: string;
    phone?: string;
    address: string;
    img?: string;
    sex: "male" | "female";
    grade: string;
    birthday: Date;
    classId?: Types.ObjectId;
    parentId?: Types.ObjectId;
}

interface ClassWithSchedule {
    schedule: IScheduleEntry[];
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== "admin" && session.user.id !== params.id)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const s = await StudentModel.findById(params.id).lean<RawStudent>();
    if (!s) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    let schedule: IScheduleEntry[] = [];
    if (s.classId) {
        const cls = await ClassModel.findById(s.classId).lean<ClassWithSchedule>();
        if (cls?.schedule) {
            schedule = cls.schedule;
        }
    }

    return NextResponse.json({
        id: s._id.toString(),
        username: s.username,
        name: s.name,
        surname: s.surname,
        email: s.email,
        phone: s.phone,
        address: s.address,
        img: s.img,
        sex: s.sex,
        grade: s.grade,
        birthday: s.birthday.toISOString(),
        role: "student",
        classId: s.classId?.toString(),
        parentId: s.parentId?.toString(),
        schedule,
    });
}
