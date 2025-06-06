import { NextRequest, NextResponse } from "next/server";
import ClassModel from "@/models/Class";
import dbConnect from "@/lib/dbConnection";

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();

        const { name, grade, supervisorId, lessons, studentIds, schedule } = body;

        // Extract teacherIds from lessons
        const teacherIds = lessons.map((l: { teacherId: string }) => l.teacherId).filter(Boolean);

        const newClass = await ClassModel.create({
            name,
            grade: parseInt(grade), // grade is a string from the form
            teacherIds,
            studentIds,
            supervisor: supervisorId,
            lessons: lessons.map((l: { subject: string }) => l.subject),
            schedule,
        });

        return NextResponse.json(newClass, { status: 201 });
    } catch (error) {
        console.error("Error creating class:", error);
        return NextResponse.json({ error: "Failed to create class" }, { status: 500 });
    }
}

// export async function GET(req: NextRequest) {
//     const { searchParams } = new URL(req.url);
//     const gradeParam = searchParams.get("grade"); // e.g. "7" | "11M" | null

//     await dbConnect();

//     const filter: Record<string, unknown> = {};

//     if (gradeParam) {
//         /* ----------------------------------------------------------
//          * 1.  If the string is a pure integer ("7", " 9 ", etc.)
//          *     use a **Number**.  That matches your schema exactly.
//          * 2.  Otherwise fall back to the raw string for alpha-grades.
//          * ----------------------------------------------------------*/
//         const num = Number(gradeParam.trim());
//         const isNumeric = !Number.isNaN(num) && gradeParam.trim() === String(num);

//         filter.grade = isNumeric ? num : gradeParam.trim();
//     }

//     // ─────────────────────────  DEBUG  ──────────────────────────
//     console.log("[API /classes] filter =", filter);
//     // ────────────────────────────────────────────────────────────

//     const classes = await ClassModel.find(filter)
//         .select("_id name grade") // keep grade in the payload for sanity-checks
//         .lean();

//     return NextResponse.json(classes);
// }

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const gradeParam = searchParams.get("grade"); // null | "7" | "11M" …

    await dbConnect();

    /* ------------------------------------------------------------
     * Build a filter tolerant to legacy fields & storage styles
     * -----------------------------------------------------------*/
    const filter: Record<string, unknown> = {};

    if (gradeParam) {
        const trimmed = gradeParam.trim();
        const numeric = Number(trimmed);
        const isDigits = /^\d+$/.test(trimmed); // "7", "09" …

        if (isDigits) {
            // match either Number(7) OR the string "7"
            filter.$or = [
                { grade: numeric },
                { grade: trimmed }, // new schema
                { gradeId: numeric },
                { gradeId: trimmed }, // legacy field
            ];
        } else {
            // alpha-suffix grades are always stored as strings
            filter.$or = [{ grade: trimmed }, { gradeId: trimmed }];
        }
    }

    console.log("[API /classes] filter =", filter);

    const classes = await ClassModel.find(filter)
        .select("_id name grade gradeId") // keep payload small
        .lean();

    return NextResponse.json(classes);
}
