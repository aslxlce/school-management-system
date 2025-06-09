// // app/api/classes/[id]/schedule/route.ts
// export const dynamic = "force-dynamic";

// import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnection";
// import ClassModel from "@/models/Class";
// import { Types } from "mongoose";

// // mirror your IScheduleEntry fields here
// interface RawScheduleEntry {
//     day: string;
//     startTime: string;
//     endTime: string;
//     subject: string;
//     classId: string;
//     teacherId?: string;
// }

// // a quick runtime guard
// function isRawEntry(obj: unknown): obj is RawScheduleEntry {
//     if (typeof obj !== "object" || obj === null) {
//         return false;
//     }
//     const e = obj as Record<string, unknown>;
//     return (
//         typeof e.day === "string" &&
//         typeof e.startTime === "string" &&
//         typeof e.endTime === "string" &&
//         typeof e.subject === "string" &&
//         typeof e.classId === "string" &&
//         (e.teacherId === undefined || typeof e.teacherId === "string")
//     );
// }

// export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
//     await dbConnect();

//     let body: unknown;
//     try {
//         body = await req.json();
//     } catch {
//         return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
//     }

//     if (typeof body !== "object" || body === null || !("schedule" in body)) {
//         return NextResponse.json({ error: "Missing schedule" }, { status: 400 });
//     }

//     const raw = (body as Record<string, unknown>).schedule;
//     if (!Array.isArray(raw) || !raw.every(isRawEntry)) {
//         return NextResponse.json({ error: "Invalid schedule format" }, { status: 400 });
//     }

//     // sanitize: only valid ObjectId teacherIds get passed through
//     const cleanSchedule = raw.map((e) => {
//         const entry: Record<string, unknown> = {
//             day: e.day,
//             startTime: e.startTime,
//             endTime: e.endTime,
//             subject: e.subject,
//             classId: e.classId,
//         };
//         if (typeof e.teacherId === "string" && Types.ObjectId.isValid(e.teacherId)) {
//             entry.teacherId = e.teacherId;
//         }
//         return entry;
//     });

//     try {
//         const updated = await ClassModel.findByIdAndUpdate(
//             params.id,
//             { schedule: cleanSchedule },
//             { new: true }
//         );
//         if (!updated) {
//             return NextResponse.json({ error: "Class not found" }, { status: 404 });
//         }
//         return NextResponse.json({ schedule: updated.schedule });
//     } catch (err) {
//         console.error("PUT /api/classes/[id]/schedule error:", err);
//         return NextResponse.json({ error: "Failed to update schedule" }, { status: 500 });
//     }
// }

// app/api/classes/[id]/schedule/route.ts
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnection";
import ClassModel from "@/models/Class";
import { Types } from "mongoose";

// Re-declare the schedule interface locally:
type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";

interface IScheduleEntry {
    day: DayOfWeek;
    startTime: string;
    endTime: string;
    subject: string;
    classId: string;
    teacherId?: string;
}

// Raw, untrusted shape check:
interface RawScheduleEntry {
    day: unknown;
    startTime: unknown;
    endTime: unknown;
    subject: unknown;
    classId: unknown;
    teacherId?: unknown;
}

function isRawEntry(obj: unknown): obj is RawScheduleEntry {
    if (typeof obj !== "object" || obj === null) return false;
    const e = obj as Record<string, unknown>;
    return (
        typeof e.day === "string" &&
        typeof e.startTime === "string" &&
        typeof e.endTime === "string" &&
        typeof e.subject === "string" &&
        typeof e.classId === "string" &&
        (e.teacherId === undefined || typeof e.teacherId === "string")
    );
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    // 1) parse JSON
    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // 2) must include schedule array
    if (typeof body !== "object" || body === null || !("schedule" in body)) {
        return NextResponse.json({ error: "Missing schedule" }, { status: 400 });
    }

    // 3) guard each element
    const raw = (body as Record<string, unknown>).schedule;
    if (!Array.isArray(raw) || !raw.every(isRawEntry)) {
        return NextResponse.json({ error: "Invalid schedule format" }, { status: 400 });
    }

    // 4) fully‐typed schedule
    const cleanSchedule: IScheduleEntry[] = raw.map((e) => ({
        day: e.day as DayOfWeek,
        startTime: e.startTime as string,
        endTime: e.endTime as string,
        subject: e.subject as string,
        classId: e.classId as string,
        ...(typeof e.teacherId === "string" && Types.ObjectId.isValid(e.teacherId)
            ? { teacherId: e.teacherId as string }
            : {}),
    }));

    // 5) save it on the class
    try {
        const updated = await ClassModel.findByIdAndUpdate(
            params.id,
            { schedule: cleanSchedule },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({ error: "Class not found" }, { status: 404 });
        }

        // 6) return the persisted schedule
        return NextResponse.json({ schedule: updated.schedule });
    } catch (err) {
        console.error("PUT /api/classes/[id]/schedule error:", err);
        return NextResponse.json({ error: "Failed to update schedule" }, { status: 500 });
    }
}
