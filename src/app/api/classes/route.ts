// src/app/api/classes/route.ts
import { NextRequest, NextResponse } from "next/server";
import ClassModel from "@/models/Class";
import dbConnect from "@/lib/dbConnection";
import type { IClass } from "@/types/class";
import type { IScheduleEntry } from "@/types/user";

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
    // schedule is managed by /api/classes/[id]/schedule, so we ignore it here
}

/**
 * Payload we send to Mongoose when creating a class.
 * Mongoose will cast string ids into ObjectIds for the relevant fields.
 */
interface ClassCreateDoc {
    name: string;
    grade: string;
    supervisor?: string;
    teacherIds?: string[];
    studentIds?: string[];
    lessons?: LessonEntry[];
}

/**
 * Minimal shape of a Class document we need to map → IClass.
 * We only type the fields we actually use.
 */
interface ClassDoc {
    _id: { toString(): string };
    name: string;
    grade: string;
    supervisor?: unknown;
    teacherIds?: unknown[];
    studentIds?: unknown[];
    lessons?: { lessonId: unknown; teacherId: unknown }[];
    schedule?: IScheduleEntry[];
}

/**
 * Helper: map a Mongoose document (or plain object) into canonical IClass.
 */
function mapDocToIClass(doc: ClassDoc): IClass {
    const teacherIds =
        Array.isArray(doc.teacherIds) && doc.teacherIds.length > 0
            ? doc.teacherIds.map((id) => String(id))
            : [];

    const studentIds =
        Array.isArray(doc.studentIds) && doc.studentIds.length > 0
            ? doc.studentIds.map((id) => String(id))
            : [];

    const lessons =
        Array.isArray(doc.lessons) && doc.lessons.length > 0
            ? doc.lessons.map((l) => ({
                  lessonId: String(l.lessonId),
                  teacherId: String(l.teacherId),
              }))
            : [];

    const schedule = Array.isArray(doc.schedule) ? doc.schedule : [];

    return {
        id: doc._id.toString(),
        name: doc.name,
        grade: doc.grade as IClass["grade"],
        // IMPORTANT: supervisor is an ObjectId here, not a string
        supervisorId: doc.supervisor ? String(doc.supervisor) : undefined,
        teacherIds,
        studentIds,
        lessons,
        schedule,
    };
}

export async function POST(req: NextRequest): Promise<NextResponse<IClass | { error: string }>> {
    try {
        await dbConnect();

        const body = (await req.json()) as ClassRequestBody;

        console.log("[API] POST /api/classes body:", body);

        if (typeof body.name !== "string" || body.name.trim() === "") {
            return NextResponse.json({ error: "Missing or invalid 'name'" }, { status: 400 });
        }
        if (typeof body.grade !== "string" || body.grade.trim() === "") {
            return NextResponse.json({ error: "Missing or invalid 'grade'" }, { status: 400 });
        }

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

        console.log("[API] Creating ClassModel with:", newDoc);

        const createdDoc = await ClassModel.create(newDoc);
        const createdClass = createdDoc.toObject() as ClassDoc;

        const publicClass = mapDocToIClass(createdClass);

        return NextResponse.json(publicClass, { status: 201 });
    } catch (error) {
        console.error("[API] POST /api/classes error:", error);
        const message = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const gradeParam = searchParams.get("grade");

    await dbConnect();

    const filter: Record<string, unknown> = {};

    if (gradeParam) {
        const trimmed = gradeParam.trim();
        const numeric = Number(trimmed);
        const isDigits = /^\d+$/.test(trimmed);

        if (isDigits) {
            filter.$or = [
                { grade: numeric },
                { grade: trimmed },
                { gradeId: numeric },
                { gradeId: trimmed },
            ];
        } else {
            filter.$or = [{ grade: trimmed }, { gradeId: trimmed }];
        }
    }

    console.log("[API /classes] filter =", filter);

    const classes = await ClassModel.find(filter).select("_id name grade gradeId").lean();

    return NextResponse.json(classes);
}
