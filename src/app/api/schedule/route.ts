// app/api/schedule/route.ts
import { NextRequest, NextResponse } from "next/server";
import { FilterQuery, Types } from "mongoose";
import { ScheduleModel, IScheduleEntry } from "@/models/Schedule";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const teacherId = searchParams.get("teacherId");
        const classId = searchParams.get("classId");

        const filter: FilterQuery<IScheduleEntry> = {};
        if (teacherId) {
            // Mongoose will cast string to ObjectId automatically, but you can be explicit:
            filter.teacherId = new Types.ObjectId(teacherId);
        }
        if (classId) {
            filter.classId = new Types.ObjectId(classId);
        }

        const entries = await ScheduleModel.find(filter).lean();
        // entries is Array<{ day, startTime, endTime, subject, classId, teacherId, ...timestamps }>

        return NextResponse.json(entries, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message }, { status: 500 });
    }
}
