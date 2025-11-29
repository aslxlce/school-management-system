// src/app/api/students/[id]/route.ts
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

// Next 15 route context for dynamic routes
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
        const body = await req.json();

        // Load doc so pre("save") hooks (password hashing) run
        const student = await StudentModel.findById(id);
        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        const { classId, ...rest } = body as Record<string, unknown>;

        // Apply all scalar/normal fields to the doc
        student.set(rest);

        // We’ll handle class + schedule after we update the class
        let newSchedule: IScheduleEntry[] | undefined;

        if (typeof classId === "string" && classId.trim().length > 0) {
            // update classId on student document
            student.set({ classId });

            // ensure the student is in the class' studentIds
            await ClassModel.findByIdAndUpdate(classId, {
                $addToSet: { studentIds: student._id },
            });

            const cls = await ClassModel.findById(classId).lean<ClassWithSchedule>();
            if (cls?.schedule && cls.schedule.length > 0) {
                newSchedule = cls.schedule;
            }
        }

        if (newSchedule) {
            student.set({ schedule: newSchedule });
        }

        // ⬇️ This triggers pre("save") on the schema → password will be hashed
        await student.save();

        return NextResponse.json({ message: "Updated", user: student }, { status: 200 });
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

export async function GET(_req: NextRequest, context: RouteContext) {
    const { id } = await context.params;

    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== "admin" && session.user.id !== id)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const s = await StudentModel.findById(id).lean<RawStudent>();
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
