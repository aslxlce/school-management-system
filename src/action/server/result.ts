// src/action/server/result.ts
import dbConnect from "@/lib/dbConnection";
import ResultModel, { ResultType } from "@/models/Result";
import { Types } from "mongoose";

interface RawStudentForResult {
    _id: Types.ObjectId;
    name: string;
    surname: string;
}

interface RawTeacherForResult {
    _id: Types.ObjectId;
    name: string;
    surname: string;
}

interface RawResult {
    _id: Types.ObjectId;
    studentId: RawStudentForResult;
    classId: Types.ObjectId;
    teacherId: RawTeacherForResult;
    subject: string;
    type: ResultType;
    grade: number;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface IResult {
    id: string;
    student: { id: string; name: string; surname: string };
    teacher: { id: string; name: string; surname: string };
    classId: string;
    subject: string;
    type: ResultType;
    grade: number;
    date: string; // ISO
    createdAt: string;
}

export interface CreateResultInput {
    studentId: string;
    classId: string;
    teacherId: string;
    subject: string;
    type: ResultType;
    grade: number;
    date?: string; // optional; defaults to today if omitted
}

function mapResult(raw: RawResult): IResult {
    return {
        id: raw._id.toString(),
        student: {
            id: raw.studentId._id.toString(),
            name: raw.studentId.name,
            surname: raw.studentId.surname,
        },
        teacher: {
            id: raw.teacherId._id.toString(),
            name: raw.teacherId.name,
            surname: raw.teacherId.surname,
        },
        classId: raw.classId.toString(),
        subject: raw.subject,
        type: raw.type,
        grade: raw.grade,
        date: raw.date.toISOString(),
        createdAt: raw.createdAt.toISOString(),
    };
}

export async function createResult(input: CreateResultInput): Promise<IResult> {
    await dbConnect();

    if (input.grade < 0 || input.grade > 100) {
        throw new Error("Grade must be between 0 and 100");
    }

    const date = input.date ? new Date(input.date) : new Date();

    const created = await ResultModel.create({
        studentId: new Types.ObjectId(input.studentId),
        classId: new Types.ObjectId(input.classId),
        teacherId: new Types.ObjectId(input.teacherId),
        subject: input.subject,
        type: input.type,
        grade: input.grade,
        date,
    });

    const populated = await ResultModel.findById(created._id)
        .populate<{ studentId: RawStudentForResult }>("studentId", "name surname")
        .populate<{ teacherId: RawTeacherForResult }>("teacherId", "name surname")
        .lean<RawResult | null>()
        .exec();

    if (!populated) {
        throw new Error("Failed to load created result");
    }

    return mapResult(populated);
}

export async function fetchResultsByStudent(studentId: string): Promise<IResult[]> {
    await dbConnect();

    const docs = await ResultModel.find({
        studentId: new Types.ObjectId(studentId),
    })
        .sort({ date: -1 })
        .populate<{ studentId: RawStudentForResult }>("studentId", "name surname")
        .populate<{ teacherId: RawTeacherForResult }>("teacherId", "name surname")
        .lean<RawResult[]>()
        .exec();

    return docs.map(mapResult);
}

export async function fetchResultsByStudentAndSubject(
    studentId: string,
    subject: string
): Promise<IResult[]> {
    await dbConnect();

    const docs = await ResultModel.find({
        studentId: new Types.ObjectId(studentId),
        subject,
    })
        .sort({ date: -1 })
        .populate<{ studentId: RawStudentForResult }>("studentId", "name surname")
        .populate<{ teacherId: RawTeacherForResult }>("teacherId", "name surname")
        .lean<RawResult[]>()
        .exec();

    return docs.map(mapResult);
}

export async function fetchResultsByClass(classId: string): Promise<IResult[]> {
    await dbConnect();

    const docs = await ResultModel.find({
        classId: new Types.ObjectId(classId),
    })
        .sort({ date: -1 })
        .populate<{ studentId: RawStudentForResult }>("studentId", "name surname")
        .populate<{ teacherId: RawTeacherForResult }>("teacherId", "name surname")
        .lean<RawResult[]>()
        .exec();

    return docs.map(mapResult);
}
