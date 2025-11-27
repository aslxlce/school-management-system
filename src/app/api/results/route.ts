// src/app/api/results/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createResult } from "@/action/server/result";

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session || (session.role !== "teacher" && session.role !== "admin")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { studentId, classId, subject, type, grade, date } = body;

    if (!studentId || !classId || !subject || !type || grade === undefined) {
        return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    try {
        const parsedGrade = Number(grade);
        const result = await createResult({
            studentId,
            classId,
            teacherId: session.id,
            subject,
            type,
            grade: parsedGrade,
            date,
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("[RESULT_CREATE_ERROR]", error);
        return NextResponse.json({ message: "Failed to create result" }, { status: 500 });
    }
}
