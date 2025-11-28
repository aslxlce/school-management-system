// // src/app/api/exams/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { Types } from "mongoose";

// import dbConnect from "@/lib/dbConnection";
// import { ExamModel, IExam } from "@/models/Exam";
// import { TeacherModel } from "@/models/User";

// export interface ExamDTO {
//     id: string;
//     classId: string;
//     subject: string;
//     date: string;
//     startTime: string;
//     endTime: string;
//     room?: string;
//     teacherId?: string;
//     teacherName?: string;
// }

// type ExamLean = {
//     _id: Types.ObjectId;
//     classId: Types.ObjectId;
//     subject: string;
//     date: Date;
//     startTime: string;
//     endTime: string;
//     room?: string;
//     teacherId?: Types.ObjectId;
// };

// export async function GET(req: NextRequest) {
//     try {
//         await dbConnect();

//         const { searchParams } = new URL(req.url);
//         const classId = searchParams.get("classId");

//         if (!classId) {
//             return NextResponse.json({ message: "Missing classId parameter" }, { status: 400 });
//         }

//         const classObjectId = new Types.ObjectId(classId);

//         const examsLean = await ExamModel.find({ classId: classObjectId })
//             .sort({ date: 1, startTime: 1 })
//             .lean<ExamLean[]>();

//         const teacherIds = examsLean
//             .map((e) => e.teacherId)
//             .filter((id): id is Types.ObjectId => Boolean(id));

//         const teacherDocs =
//             teacherIds.length > 0
//                 ? await TeacherModel.find({ _id: { $in: teacherIds } })
//                       .select("name surname")
//                       .lean()
//                 : [];

//         const teacherMap = new Map<string, string>();
//         teacherDocs.forEach((t) => {
//             teacherMap.set(String(t._id), `${t.name} ${t.surname}`);
//         });

//         const payload: ExamDTO[] = examsLean.map((e: ExamLean) => {
//             const teacherIdStr = e.teacherId ? e.teacherId.toString() : undefined;
//             return {
//                 id: e._id.toString(),
//                 classId: e.classId.toString(),
//                 subject: e.subject,
//                 date: e.date.toISOString(),
//                 startTime: e.startTime,
//                 endTime: e.endTime,
//                 room: e.room,
//                 teacherId: teacherIdStr,
//                 teacherName: teacherIdStr ? teacherMap.get(teacherIdStr) : undefined,
//             };
//         });

//         return NextResponse.json(payload, { status: 200 });
//     } catch (error) {
//         console.error("[GET /api/exams] error:", error);
//         return NextResponse.json({ message: "Failed to fetch exams for class." }, { status: 500 });
//     }
// }

// interface CreateExamBody {
//     classId?: string;
//     subject?: string;
//     date?: string;
//     startTime?: string;
//     endTime?: string;
//     room?: string;
//     teacherId?: string;
// }

// export async function POST(req: NextRequest) {
//     try {
//         await dbConnect();

//         const body = (await req.json()) as CreateExamBody;

//         const { classId, subject, date, startTime, endTime, room, teacherId } = body;

//         if (!classId || !subject || !date || !startTime || !endTime) {
//             return NextResponse.json({ message: "Missing required exam fields." }, { status: 400 });
//         }

//         const classObjectId = new Types.ObjectId(classId);
//         const teacherObjectId =
//             teacherId && teacherId.trim().length > 0 ? new Types.ObjectId(teacherId) : undefined;

//         const examDoc: IExam = await ExamModel.create({
//             classId: classObjectId,
//             subject: subject.trim(),
//             date: new Date(date),
//             startTime: startTime.trim(),
//             endTime: endTime.trim(),
//             room: room?.trim() || undefined,
//             teacherId: teacherObjectId,
//         });

//         const dto: ExamDTO = {
//             id: examDoc._id.toString(),
//             classId: examDoc.classId.toString(),
//             subject: examDoc.subject,
//             date: examDoc.date.toISOString(),
//             startTime: examDoc.startTime,
//             endTime: examDoc.endTime,
//             room: examDoc.room,
//             teacherId: examDoc.teacherId ? examDoc.teacherId.toString() : undefined,
//             teacherName: undefined,
//         };

//         return NextResponse.json(dto, { status: 201 });
//     } catch (error) {
//         console.error("[POST /api/exams] error:", error);
//         return NextResponse.json({ message: "Failed to create exam." }, { status: 500 });
//     }
// }

// src/app/api/exams/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

import dbConnect from "@/lib/dbConnection";
import { ExamModel } from "@/models/Exam";
import { TeacherModel } from "@/models/User";
import type { IExam } from "@/types/exam";

type ExamLean = {
    _id: Types.ObjectId;
    classId: Types.ObjectId;
    subject: string;
    date: Date;
    startTime: string;
    endTime: string;
    room?: string;
    teacherId?: Types.ObjectId;
};

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const classId = searchParams.get("classId");

        if (!classId) {
            return NextResponse.json({ message: "Missing classId parameter" }, { status: 400 });
        }

        const classObjectId = new Types.ObjectId(classId);

        const examsLean = await ExamModel.find({ classId: classObjectId })
            .sort({ date: 1, startTime: 1 })
            .lean<ExamLean[]>();

        const teacherIds = examsLean
            .map((e) => e.teacherId)
            .filter((id): id is Types.ObjectId => Boolean(id));

        const teacherDocs =
            teacherIds.length > 0
                ? await TeacherModel.find({ _id: { $in: teacherIds } })
                      .select("name surname")
                      .lean()
                : [];

        const teacherMap = new Map<string, string>();
        teacherDocs.forEach((t) => {
            teacherMap.set(String(t._id), `${t.name} ${t.surname}`);
        });

        const payload: IExam[] = examsLean.map((e: ExamLean) => {
            const teacherIdStr = e.teacherId ? e.teacherId.toString() : undefined;
            return {
                id: e._id.toString(),
                classId: e.classId.toString(),
                subject: e.subject,
                date: e.date.toISOString(),
                startTime: e.startTime,
                endTime: e.endTime,
                room: e.room,
                teacherId: teacherIdStr,
                teacherName: teacherIdStr ? teacherMap.get(teacherIdStr) : undefined,
            };
        });

        return NextResponse.json(payload, { status: 200 });
    } catch (error) {
        console.error("[GET /api/exams] error:", error);
        return NextResponse.json({ message: "Failed to fetch exams for class." }, { status: 500 });
    }
}

interface CreateExamBody {
    classId?: string;
    subject?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    room?: string;
    teacherId?: string;
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const body = (await req.json()) as CreateExamBody;

        const { classId, subject, date, startTime, endTime, room, teacherId } = body;

        if (!classId || !subject || !date || !startTime || !endTime) {
            return NextResponse.json({ message: "Missing required exam fields." }, { status: 400 });
        }

        const classObjectId = new Types.ObjectId(classId);
        const teacherObjectId =
            teacherId && teacherId.trim().length > 0 ? new Types.ObjectId(teacherId) : undefined;

        const examDoc = await ExamModel.create({
            classId: classObjectId,
            subject: subject.trim(),
            date: new Date(date),
            startTime: startTime.trim(),
            endTime: endTime.trim(),
            room: room?.trim() || undefined,
            teacherId: teacherObjectId,
        });

        const dto: IExam = {
            id: examDoc._id.toString(),
            classId: examDoc.classId.toString(),
            subject: examDoc.subject,
            date: examDoc.date.toISOString(),
            startTime: examDoc.startTime,
            endTime: examDoc.endTime,
            room: examDoc.room,
            teacherId: examDoc.teacherId ? examDoc.teacherId.toString() : undefined,
            teacherName: undefined,
        };

        return NextResponse.json(dto, { status: 201 });
    } catch (error) {
        console.error("[POST /api/exams] error:", error);
        return NextResponse.json({ message: "Failed to create exam." }, { status: 500 });
    }
}
