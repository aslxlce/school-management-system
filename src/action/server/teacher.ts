// src/action/server/teacher.ts
"use server";

import dbConnect from "@/lib/dbConnection";
import ClassModel from "@/models/Class";
import { TeacherModel } from "@/models/User";
import { Types, Document } from "mongoose";

/** Our clean UI shape for a teacher */ /* 
export interface IUserTeacher {
    id: string;
    username: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    address: string;
    img?: string;
    sex: "male" | "female";
    subject: string;
    birthday: Date;
    gradeLevel: "primary" | "middle" | "high";
    role: "teacher";
} */

/** The raw shape returned by `.lean()` */
interface RawTeacher extends Document {
    _id: Types.ObjectId;
    username: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    address: string;
    img?: string;
    sex: "male" | "female";
    subject: string;
    birthday: Date;
    gradeLevel: "primary" | "middle" | "high";
    schedule?: Array<{
        day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
        startTime: string;
        endTime: string;
        subject: string;
        classId: Types.ObjectId;
        teacherId?: Types.ObjectId;
    }>;
}

/** Paged list response */
interface PaginatedTeacherResponse {
    data: IUserTeacher[];
    page: number;
    total: number;
    totalPages: number;
}

/** Calendar event shape */
export interface CalendarEvent {
    title: string;
    start: Date;
    end: Date;
}

/** Full detail for a single teacher */
export interface TeacherDetail extends IUserTeacher {
    scheduleEvents: CalendarEvent[];
    lessonsCount: number;
    classesCount: number;
}

export async function fetchTeachers(page = 1, limit = 10): Promise<PaginatedTeacherResponse> {
    await dbConnect();
    const skip = (page - 1) * limit;

    const [rawList, total] = await Promise.all([
        TeacherModel.find().skip(skip).limit(limit).lean<RawTeacher[]>(),
        TeacherModel.countDocuments(),
    ]);

    const data: IUserTeacher[] = rawList.map((t) => ({
        id: t._id.toString(),
        username: t.username,
        name: t.name,
        surname: t.surname,
        email: t.email,
        phone: t.phone,
        address: t.address,
        img: t.img,
        sex: t.sex,
        subject: t.subject,
        birthday: t.birthday,
        gradeLevel: t.gradeLevel,
        role: "teacher",
    }));

    return {
        data,
        page,
        total,
        totalPages: Math.ceil(total / limit),
    };
}

function parseHourAMPM(str: string): { h: number; m: number } {
    const [hourPart, period] = str.split(" ");
    let h = parseInt(hourPart, 10);
    if (period === "PM" && h < 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return { h, m: 0 };
}

export async function fetchTeacherById(id: string): Promise<TeacherDetail | null> {
    await dbConnect();

    // 1) Load teacher
    const t = await TeacherModel.findById(id).lean<RawTeacher>();
    if (!t) return null;

    // 2) Map base teacher fields
    const teacher: IUserTeacher = {
        id: t._id.toString(),
        username: t.username,
        name: t.name,
        surname: t.surname,
        email: t.email,
        phone: t.phone,
        address: t.address,
        img: t.img,
        sex: t.sex,
        subject: t.subject,
        birthday: t.birthday,
        gradeLevel: t.gradeLevel,
        role: "teacher",
    };

    // 3) Build a map of classId → className
    const schedule = t.schedule || [];
    const classIds = Array.from(new Set(schedule.map((e) => e.classId.toString())));
    const classes = await ClassModel.find({ _id: { $in: classIds } })
        .select("name")
        .lean<{ _id: Types.ObjectId; name: string }[]>();
    const classNameMap: Record<string, string> = {};
    classes.forEach((c) => (classNameMap[c._id.toString()] = c.name));

    // 4) Compute this week’s Monday
    const now = new Date();
    const dow = now.getDay();
    const mondayOffset = (dow + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - mondayOffset);
    monday.setHours(0, 0, 0, 0);

    // 5) Build calendar events with class name in title
    const scheduleEvents: CalendarEvent[] = schedule.map((e) => {
        const dayIndex = ["monday", "tuesday", "wednesday", "thursday", "friday"].indexOf(e.day);
        const base = new Date(monday);
        base.setDate(monday.getDate() + dayIndex);

        const { h: sh, m: sm } = parseHourAMPM(e.startTime);
        const { h: eh, m: em } = parseHourAMPM(e.endTime);

        const start = new Date(base);
        start.setHours(sh, sm, 0, 0);
        const end = new Date(base);
        end.setHours(eh, em, 0, 0);

        const className = classNameMap[e.classId.toString()] || "Class";
        return {
            title: `${e.subject} (${className})`,
            start,
            end,
        };
    });

    return {
        ...teacher,
        scheduleEvents,
        lessonsCount: scheduleEvents.length,
        classesCount: classIds.length,
    };
}
