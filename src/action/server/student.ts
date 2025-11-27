import dbConnect from "@/lib/dbConnection";
import { StudentModel } from "@/models/User";
import { fetchClassById } from "@/action/server/class";
import { Types, Document } from "mongoose";
import type { IUserStudent, Grade } from "@/types/user";

interface RawStudent extends Document {
    _id: Types.ObjectId;
    username: string;
    name: string;
    surname: string;
    email?: string;
    phone?: string;
    address: string;
    img?: string;
    sex: "male" | "female";
    grade: string;
    classId?: Types.ObjectId;
    parentId?: Types.ObjectId;
    birthday: Date;
}

/** Calendar event for BigCalendar */
export interface CalendarEvent {
    title: string;
    start: Date;
    end: Date;
}

export interface StudentDetail extends IUserStudent {
    scheduleEvents: CalendarEvent[];
}

export async function fetchStudentById(id: string): Promise<StudentDetail | null> {
    await dbConnect();

    const s = await StudentModel.findById(id).lean<RawStudent>();
    if (!s) return null;

    const student: IUserStudent = {
        id: s._id.toString(),
        username: s.username,
        role: "student",
        name: s.name,
        surname: s.surname,
        email: s.email,
        phone: s.phone ?? "",
        address: s.address,
        img: s.img,
        sex: s.sex,
        grade: s.grade as Grade,
        classId: s.classId?.toString(),
        parentId: s.parentId?.toString(),
        birthday: s.birthday,
        schedule: [],
    };

    let scheduleEvents: CalendarEvent[] = [];
    if (student.classId) {
        const cls = await fetchClassById(student.classId);
        if (cls) {
            scheduleEvents = cls.schedule.map((e) => ({
                title: e.subject,
                start: new Date(e.startTime),
                end: new Date(e.endTime),
            }));
        }
    }

    return { ...student, scheduleEvents };
}

export interface PaginatedStudentResponse {
    data: IUserStudent[];
    page: number;
    total: number;
    totalPages: number;
}

export async function fetchStudents(page = 1, limit = 10): Promise<PaginatedStudentResponse> {
    await dbConnect();
    const skip = (page - 1) * limit;

    const [rawList, total] = await Promise.all([
        StudentModel.find().skip(skip).limit(limit).lean<RawStudent[]>(),
        StudentModel.countDocuments(),
    ]);

    const data: IUserStudent[] = rawList.map((s) => ({
        id: s._id.toString(),
        username: s.username,
        role: "student",
        name: s.name,
        surname: s.surname,
        email: s.email,
        img: s.img,
        phone: s.phone ?? "",
        address: s.address,
        grade: s.grade as Grade,
        classId: s.classId?.toString(),
        parentId: s.parentId?.toString(),
        birthday: s.birthday,
        sex: s.sex,
        schedule: [],
    }));

    const totalPages = Math.ceil(total / limit);
    return { data, page, total, totalPages };
}
