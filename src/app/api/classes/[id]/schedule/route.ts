// // src/app/api/classes/[id]/schedule/route.ts
// export const dynamic = "force-dynamic";

// import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnection";
// import ClassModel from "@/models/Class";
// import { StudentModel, TeacherModel } from "@/models/User";
// import { Types } from "mongoose";
// import type { IScheduleEntry, DayOfWeek } from "@/types/user";

// // Raw, untrusted shape coming from the client
// interface RawScheduleEntry {
//     day: unknown;
//     startTime: unknown;
//     endTime: unknown;
//     subject: unknown;
//     classId: unknown;
//     teacherId?: unknown;
// }

// function isRawEntry(x: unknown): x is RawScheduleEntry {
//     if (typeof x !== "object" || x === null) return false;
//     const e = x as Record<string, unknown>;
//     return (
//         typeof e.day === "string" &&
//         typeof e.startTime === "string" &&
//         typeof e.endTime === "string" &&
//         typeof e.subject === "string" &&
//         typeof e.classId === "string" &&
//         (e.teacherId === undefined || typeof e.teacherId === "string")
//     );
// }

// // Next 15: context.params is a Promise
// export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
//     await dbConnect();

//     const { id: classId } = await context.params;

//     // 1) parse JSON
//     let body: unknown;
//     try {
//         body = await req.json();
//     } catch {
//         return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
//     }

//     // 2) require schedule field
//     if (typeof body !== "object" || body === null || !("schedule" in body)) {
//         return NextResponse.json({ error: "Missing schedule" }, { status: 400 });
//     }

//     // 3) validate raw entries
//     const raw = (body as Record<string, unknown>).schedule;
//     if (!Array.isArray(raw) || !raw.every(isRawEntry)) {
//         return NextResponse.json({ error: "Invalid schedule format" }, { status: 400 });
//     }

//     // 4) cast into your typed array
//     const cleanSchedule: IScheduleEntry[] = raw.map((e) => ({
//         day: e.day as DayOfWeek,
//         startTime: e.startTime as string,
//         endTime: e.endTime as string,
//         subject: e.subject as string,
//         classId: e.classId as string,
//         ...(typeof e.teacherId === "string" && Types.ObjectId.isValid(e.teacherId)
//             ? { teacherId: e.teacherId as string }
//             : {}),
//     }));

//     // build teacherMap once
//     const teacherMap: Record<string, IScheduleEntry[]> = {};
//     cleanSchedule.forEach((entry) => {
//         if (entry.teacherId) {
//             teacherMap[entry.teacherId] ||= [];
//             teacherMap[entry.teacherId].push(entry);
//         }
//     });

//     // 5–7) persist + propagate
//     try {
//         const updatedClass = await ClassModel.findByIdAndUpdate(
//             classId,
//             { schedule: cleanSchedule },
//             { new: true }
//         ).lean<{
//             studentIds?: Types.ObjectId[];
//             schedule?: IScheduleEntry[];
//         }>();

//         if (!updatedClass) {
//             return NextResponse.json({ error: "Class not found" }, { status: 404 });
//         }

//         // 6) overwrite student schedules
//         const students = updatedClass.studentIds ?? [];
//         await Promise.all(
//             students.map((sid) =>
//                 StudentModel.findByIdAndUpdate(sid, { schedule: cleanSchedule }).exec()
//             )
//         );

//         // 7) overwrite each teacher's schedule with only their entries
//         const teacherIds = Object.keys(teacherMap);
//         await Promise.all(
//             teacherIds.map((tid) => {
//                 const entriesForTeacher = teacherMap[tid]!;
//                 return TeacherModel.findByIdAndUpdate(
//                     tid,
//                     { schedule: entriesForTeacher },
//                     { new: true }
//                 ).exec();
//             })
//         );

//         // 8) return saved schedule
//         return NextResponse.json(
//             { schedule: updatedClass.schedule ?? cleanSchedule },
//             { status: 200 }
//         );
//     } catch (err) {
//         console.error("❌ PUT /api/classes/[id]/schedule failed:", err);
//         return NextResponse.json({ error: "Failed to update schedule" }, { status: 500 });
//     }
// }

// src/app/api/classes/[id]/schedule/route.ts
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnection";
import ClassModel from "@/models/Class";
import { StudentModel, TeacherModel } from "@/models/User";
import { Types } from "mongoose";
import type { IScheduleEntry, DayOfWeek } from "@/types/user";

// Raw, untrusted shape coming from the client
interface RawScheduleEntry {
    day: unknown;
    startTime: unknown;
    endTime: unknown;
    subject: unknown;
    classId?: unknown;
    teacherId?: unknown;
}

function isRawEntry(x: unknown): x is RawScheduleEntry {
    if (typeof x !== "object" || x === null) return false;
    const e = x as Record<string, unknown>;

    return (
        typeof e.day === "string" &&
        typeof e.startTime === "string" &&
        typeof e.endTime === "string" &&
        typeof e.subject === "string" &&
        // classId / teacherId are optional on the wire
        (e.classId === undefined || typeof e.classId === "string") &&
        (e.teacherId === undefined || typeof e.teacherId === "string")
    );
}

// NOTE: params is a Promise in Next 15 type defs
interface RouteContext {
    params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
    await dbConnect();

    // resolve the params
    const { id: classId } = await params;

    // 1) Parse JSON body
    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // 2) Require schedule field
    if (typeof body !== "object" || body === null || !("schedule" in body)) {
        return NextResponse.json({ error: "Missing schedule" }, { status: 400 });
    }

    const rawSchedule = (body as { schedule?: unknown }).schedule;

    // 3) Validate entries
    if (!Array.isArray(rawSchedule) || !rawSchedule.every(isRawEntry)) {
        return NextResponse.json({ error: "Invalid schedule format" }, { status: 400 });
    }

    // 4) Cast into typed schedule entries
    const cleanSchedule: IScheduleEntry[] = rawSchedule.map((e) => ({
        day: e.day as DayOfWeek,
        startTime: e.startTime as string,
        endTime: e.endTime as string,
        subject: e.subject as string,
        // we always trust the URL param for classId
        classId,
        ...(typeof e.teacherId === "string" && e.teacherId.trim().length > 0
            ? { teacherId: e.teacherId }
            : {}),
    }));

    // Build a map of teacherId -> entries for that teacher (for this class)
    const teacherMap: Record<string, IScheduleEntry[]> = {};
    cleanSchedule.forEach((entry) => {
        if (entry.teacherId) {
            const tid = entry.teacherId;
            if (!teacherMap[tid]) teacherMap[tid] = [];
            teacherMap[tid].push(entry);
        }
    });

    try {
        // 5) Save schedule on the Class document
        const updatedClass = await ClassModel.findByIdAndUpdate(
            classId,
            { schedule: cleanSchedule },
            { new: true }
        ).lean<{
            studentIds?: Types.ObjectId[];
            schedule?: IScheduleEntry[];
        }>();

        if (!updatedClass) {
            return NextResponse.json({ error: "Class not found" }, { status: 404 });
        }

        // 6) Overwrite each student's schedule with this class schedule
        const students = updatedClass.studentIds ?? [];
        await Promise.all(
            students.map((sid) =>
                StudentModel.findByIdAndUpdate(sid, { schedule: cleanSchedule }).exec()
            )
        );

        // 7) Merge into each teacher's schedule instead of overwriting
        const teacherIds = Object.keys(teacherMap);

        await Promise.all(
            teacherIds.map(async (tid) => {
                const entriesForTeacher = teacherMap[tid] ?? [];

                // Load existing schedule for this teacher (if any)
                const teacherLean = await TeacherModel.findById(tid)
                    .select("schedule")
                    .lean<{ schedule?: IScheduleEntry[] }>();

                const currentSchedule: IScheduleEntry[] = teacherLean?.schedule ?? [];

                // Remove all entries that belong to THIS class
                const withoutThisClass = currentSchedule.filter(
                    (entry) => entry.classId !== classId
                );

                // Add fresh entries for this class
                const mergedSchedule = [...withoutThisClass, ...entriesForTeacher];

                await TeacherModel.findByIdAndUpdate(
                    tid,
                    { schedule: mergedSchedule },
                    { new: false }
                ).exec();
            })
        );

        // 8) Return the class schedule
        return NextResponse.json(
            { schedule: updatedClass.schedule ?? cleanSchedule },
            { status: 200 }
        );
    } catch (err) {
        console.error("❌ PUT /api/classes/[id]/schedule failed:", err);
        return NextResponse.json({ error: "Failed to update schedule" }, { status: 500 });
    }
}
