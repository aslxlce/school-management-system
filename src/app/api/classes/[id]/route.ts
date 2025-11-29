// src/app/api/classes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnection";
import ClassModel from "@/models/Class";
import { StudentModel } from "@/models/User";

interface ClassUpdateBody {
    name?: string;
    grade?: string;
    supervisor?: string;
    teacherIds?: string[];
    studentIds?: string[];
}

// Next 15: context.params is a Promise
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();

        const { id } = await context.params;
        const classId = id;

        const body = (await req.json()) as ClassUpdateBody;

        // 1) Load existing class
        const cls = await ClassModel.findById(classId);
        if (!cls) {
            return NextResponse.json({ message: "Class not found" }, { status: 404 });
        }

        // Make sure these are strongly typed as string[]
        const currentStudentIds: string[] = (cls.studentIds ?? []).map((sid: unknown) =>
            String(sid)
        );
        const newStudentIds: string[] = (body.studentIds ?? []).map((id) => id.trim());

        // 2) Update students' classId

        // students removed from the class
        const removedStudentIds: string[] = currentStudentIds.filter(
            (id) => !newStudentIds.includes(id)
        );
        if (removedStudentIds.length > 0) {
            await StudentModel.updateMany(
                { _id: { $in: removedStudentIds } },
                { $set: { classId: "" } }
            );
        }

        // students newly added to the class
        const addedStudentIds: string[] = newStudentIds.filter(
            (id) => !currentStudentIds.includes(id)
        );
        if (addedStudentIds.length > 0) {
            await StudentModel.updateMany({ _id: { $in: addedStudentIds } }, { $set: { classId } });
        }

        // 3) Update the class document itself
        if (typeof body.name === "string") cls.name = body.name.trim();
        if (typeof body.grade === "string") cls.grade = body.grade.trim();

        if (typeof body.supervisor === "string" && body.supervisor.trim()) {
            cls.supervisor = body.supervisor.trim();
        } else if (body.supervisor === "") {
            cls.supervisor = undefined;
        }

        if (Array.isArray(body.teacherIds)) {
            cls.teacherIds = body.teacherIds;
        }

        cls.studentIds = newStudentIds;

        await cls.save();

        // Reload with populated relations if you want
        const updated = await ClassModel.findById(classId).lean();

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("[PUT /classes/:id] error:", error);
        return NextResponse.json({ message: "Failed to update class" }, { status: 500 });
    }
}
