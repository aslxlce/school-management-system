import { NextRequest, NextResponse } from "next/server";
import ClassModel from "@/models/Class";
import dbConnect from "@/lib/dbConnection";

// export async function POST(req: NextRequest) {
//     await dbConnect();

//     try {
//         const body = await req.json();

//         const { name, grade, supervisorId, lessons, studentIds, schedule } = body;

//         // Extract teacherIds from lessons
//         const teacherIds = lessons.map((l: { teacherId: string }) => l.teacherId).filter(Boolean);

//         const newClass = await ClassModel.create({
//             name,
//             grade: parseInt(grade), // grade is a string from the form
//             teacherIds,
//             studentIds,
//             supervisor: supervisorId,
//             lessons: lessons.map((l: { subject: string }) => l.subject),
//             schedule,
//         });

//         return NextResponse.json(newClass, { status: 201 });
//     } catch (error) {
//         console.error("Error creating class:", error);
//         return NextResponse.json({ error: "Failed to create class" }, { status: 500 });
//     }
// }

interface LessonEntry {
    lessonId: string;
    teacherId: string;
}
interface ClassRequestBody {
    name: string;
    grade: string;
    supervisor?: string;
    teacherIds?: string[];
    studentIds?: string[];
    lessons?: LessonEntry[];
    schedule?: string;
}

/** The portion of ClassRequestBody that’s actually stored in Mongo */
type ClassCreateDoc = {
    name: string;
    grade: string;
    supervisor?: string;
    teacherIds?: string[];
    studentIds?: string[];
    lessons?: LessonEntry[];
    schedule?: string;
};

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        await dbConnect();

        // Parse and type‐assert the request JSON
        const body = (await req.json()) as ClassRequestBody;

        console.log("[API] POST /api/classes body:", body);

        // Validate required fields
        if (typeof body.name !== "string" || body.name.trim() === "") {
            return NextResponse.json({ error: "Missing or invalid 'name'" }, { status: 400 });
        }
        if (typeof body.grade !== "string" || body.grade.trim() === "") {
            return NextResponse.json({ error: "Missing or invalid 'grade'" }, { status: 400 });
        }

        // Build the document to insert, strictly typed as ClassCreateDoc
        const newDoc: ClassCreateDoc = {
            name: body.name.trim(),
            grade: body.grade.trim(),
        };

        if (body.supervisor && body.supervisor.trim() !== "") {
            newDoc.supervisor = body.supervisor.trim();
        }
        if (Array.isArray(body.teacherIds) && body.teacherIds.length > 0) {
            newDoc.teacherIds = body.teacherIds
                .filter((id) => typeof id === "string" && id.trim() !== "")
                .map((id) => id.trim());
        }
        if (Array.isArray(body.studentIds) && body.studentIds.length > 0) {
            newDoc.studentIds = body.studentIds
                .filter((id) => typeof id === "string" && id.trim() !== "")
                .map((id) => id.trim());
        }
        if (Array.isArray(body.lessons) && body.lessons.length > 0) {
            const validLessons: LessonEntry[] = body.lessons
                .filter(
                    (l): l is LessonEntry =>
                        typeof l.lessonId === "string" &&
                        l.lessonId.trim() !== "" &&
                        typeof l.teacherId === "string" &&
                        l.teacherId.trim() !== ""
                )
                .map((l) => ({
                    lessonId: l.lessonId.trim(),
                    teacherId: l.teacherId.trim(),
                }));
            if (validLessons.length > 0) {
                newDoc.lessons = validLessons;
            }
        }
        if (typeof body.schedule === "string" && body.schedule.trim() !== "") {
            newDoc.schedule = body.schedule.trim();
        }

        console.log("[API] Creating ClassModel with:", newDoc);

        const created = await ClassModel.create(newDoc);
        return NextResponse.json(
            { message: "Class created", id: created._id.toString() },
            { status: 201 }
        );
    } catch (error) {
        console.error("[API] POST /api/classes error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

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
