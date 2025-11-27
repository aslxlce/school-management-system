// import dbConnect from "@/lib/dbConnection";
// import ClassModel from "@/models/Class";
// import { Types, Document } from "mongoose";
// import { IUserTeacher, IUserStudent, IScheduleEntry } from "@/types/user";
// import { Grade, GradeLevel } from "@/models/User";

// interface RawTeacher {
//     _id: Types.ObjectId;
//     username: string;
//     name: string;
//     surname: string;
//     email?: string;
//     phone?: string;
//     address: string;
//     img?: string;
//     subject: string;
//     birthday: Date;
//     gradeLevel: GradeLevel;
//     sex: "male" | "female";
// }

// interface RawStudent {
//     _id: Types.ObjectId;
//     username: string;
//     name: string;
//     surname: string;
//     email?: string;
//     img?: string;
//     phone?: string;
//     address: string;
//     grade: string;
//     classId?: Types.ObjectId;
//     parentId?: Types.ObjectId;
//     birthday: Date;
//     sex: "male" | "female";
// }

// interface RawClassDetail extends Document {
//     _id: Types.ObjectId;
//     name: string;
//     grade: string;
//     supervisor?: RawTeacher;
//     teacherIds: RawTeacher[];
//     studentIds: RawStudent[];
//     lessons: { lessonId: Types.ObjectId; teacherId: Types.ObjectId }[];
//     schedule?: Array<{
//         day: IScheduleEntry["day"];
//         startTime: string;
//         endTime: string;
//         subject: string;
//         classId: Types.ObjectId;
//         teacherId?: Types.ObjectId;
//     }>;
// }

// export interface IClass {
//     id: string;
//     name: string;
//     grade: string;
//     supervisor?: { id: string; name: string; surname: string };
//     teacherIds?: { id: string }[];
// }

// export interface IClassDetail {
//     id: string;
//     name: string;
//     grade: string;
//     supervisor?: IUserTeacher;
//     teacherIds: IUserTeacher[];
//     studentIds: IUserStudent[];
//     lessons: { lessonId: string; teacherId: string }[];
//     schedule: IScheduleEntry[];
// }

// export const fetchClasses = async (
//     page = 1,
//     limit = 5
// ): Promise<{ data: IClass[]; totalPages: number }> => {
//     await dbConnect();
//     const skip = (page - 1) * limit;
//     const total = await ClassModel.countDocuments();
//     const totalPages = Math.ceil(total / limit);

//     const raw = await ClassModel.find()
//         .skip(skip)
//         .limit(limit)
//         .populate<{ supervisor: RawTeacher }>("supervisor", "name surname")
//         .populate<{ teacherIds: RawTeacher[] }>("teacherIds", "_id")
//         .lean<RawClassDetail[]>();

//     const data: IClass[] = raw.map((cls) => ({
//         id: cls._id.toString(),
//         name: cls.name,
//         grade: cls.grade,
//         supervisor: cls.supervisor
//             ? {
//                   id: cls.supervisor._id.toString(),
//                   name: cls.supervisor.name,
//                   surname: cls.supervisor.surname,
//               }
//             : undefined,
//         teacherIds: Array.isArray(cls.teacherIds)
//             ? cls.teacherIds.map((t) => ({
//                   id: t._id.toString(),
//               }))
//             : [],
//     }));

//     return { data, totalPages };
// };

// export const fetchClassById = async (id: string): Promise<IClassDetail | null> => {
//     await dbConnect();

//     const cls = await ClassModel.findById(id)
//         .populate<RawTeacher>("supervisor")
//         .populate<RawTeacher[]>("teacherIds")
//         .populate<RawStudent[]>("studentIds")
//         .lean<RawClassDetail>();

//     if (!cls) return null;

//     const mapTeacher = (t: RawTeacher): IUserTeacher => ({
//         id: t._id.toString(),
//         username: t.username,
//         name: t.name,
//         surname: t.surname,
//         email: t.email ?? "",
//         phone: t.phone ?? "",
//         address: t.address,
//         img: t.img ?? "",
//         subject: t.subject,
//         birthday: t.birthday,
//         gradeLevel: t.gradeLevel,
//         sex: t.sex,
//         role: "teacher",
//         schedule: [],
//     });

//     const mapStudent = (s: RawStudent): IUserStudent => ({
//         id: s._id.toString(),
//         username: s.username,
//         name: s.name,
//         surname: s.surname,
//         email: s.email ?? "",
//         img: s.img ?? "",
//         phone: s.phone ?? "",
//         address: s.address,
//         grade: s.grade as Grade,
//         classId: s.classId?.toString(),
//         parentId: s.parentId?.toString(),
//         birthday: s.birthday,
//         sex: s.sex,
//         role: "student",
//         schedule: [],
//     });

//     const rawSchedule = Array.isArray(cls.schedule) ? cls.schedule : [];
//     const schedule: IScheduleEntry[] = rawSchedule.map((e) => ({
//         day: e.day,
//         startTime: e.startTime,
//         endTime: e.endTime,
//         subject: e.subject,
//         classId: e.classId.toString(),
//         teacherId: e.teacherId?.toString() ?? "",
//     }));

//     return {
//         id: cls._id.toString(),
//         name: cls.name,
//         grade: cls.grade,
//         supervisor: cls.supervisor ? mapTeacher(cls.supervisor) : undefined,
//         teacherIds: cls.teacherIds.map(mapTeacher),
//         studentIds: cls.studentIds.map(mapStudent),
//         lessons: cls.lessons.map((l) => ({
//             lessonId: l.lessonId.toString(),
//             teacherId: l.teacherId.toString(),
//         })),
//         schedule,
//     };
// };

// src/action/server/class.ts
import dbConnect from "@/lib/dbConnection";
import ClassModel from "@/models/Class";
import { Types, Document } from "mongoose";
import { IUserTeacher, IUserStudent, IScheduleEntry } from "@/types/user";
import { Grade, GradeLevel } from "@/models/User";

interface RawTeacher {
    _id: Types.ObjectId;
    username: string;
    name: string;
    surname: string;
    email?: string;
    phone?: string;
    address: string;
    img?: string;
    subject: string;
    birthday: Date;
    gradeLevel: GradeLevel;
    sex: "male" | "female";
}

interface RawStudent {
    _id: Types.ObjectId;
    username: string;
    name: string;
    surname: string;
    email?: string;
    img?: string;
    phone?: string;
    address: string;
    grade: string;
    classId?: Types.ObjectId;
    parentId?: Types.ObjectId;
    birthday: Date;
    sex: "male" | "female";
}

interface RawClassDetail extends Document {
    _id: Types.ObjectId;
    name: string;
    grade: string;
    supervisor?: RawTeacher;
    teacherIds: RawTeacher[];
    studentIds: RawStudent[];
    lessons: { lessonId: Types.ObjectId; teacherId: Types.ObjectId }[];
    schedule?: Array<{
        day: IScheduleEntry["day"];
        startTime: string;
        endTime: string;
        subject: string;
        classId: Types.ObjectId;
        teacherId?: Types.ObjectId;
    }>;
}

export interface IClass {
    id: string;
    name: string;
    grade: string;
    supervisor?: { id: string; name: string; surname: string };
    // 🔥 now available for teacher filtering on list pages
    teacherIds?: { id: string }[];
}

export interface IClassDetail {
    id: string;
    name: string;
    grade: string;
    supervisor?: IUserTeacher;
    teacherIds: IUserTeacher[];
    studentIds: IUserStudent[];
    lessons: { lessonId: string; teacherId: string }[];
    schedule: IScheduleEntry[];
}

export const fetchClasses = async (
    page = 1,
    limit = 5
): Promise<{ data: IClass[]; totalPages: number }> => {
    await dbConnect();
    const skip = (page - 1) * limit;
    const total = await ClassModel.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const raw = await ClassModel.find()
        .skip(skip)
        .limit(limit)
        .populate<{ supervisor: RawTeacher }>("supervisor", "name surname")
        .populate<{ teacherIds: RawTeacher[] }>("teacherIds", "_id")
        .lean<RawClassDetail[]>();

    const data: IClass[] = raw.map((cls) => ({
        id: cls._id.toString(),
        name: cls.name,
        grade: cls.grade,
        supervisor: cls.supervisor
            ? {
                  id: cls.supervisor._id.toString(),
                  name: cls.supervisor.name,
                  surname: cls.supervisor.surname,
              }
            : undefined,
        teacherIds: Array.isArray(cls.teacherIds)
            ? cls.teacherIds.map((t) => ({ id: t._id.toString() }))
            : [],
    }));

    return { data, totalPages };
};

export const fetchClassById = async (id: string): Promise<IClassDetail | null> => {
    await dbConnect();

    const cls = await ClassModel.findById(id)
        .populate<RawClassDetail>("supervisor")
        .populate<RawClassDetail[]>("teacherIds")
        .populate<RawClassDetail[]>("studentIds")
        .lean<RawClassDetail>();

    if (!cls) return null;

    const mapTeacher = (t: RawTeacher): IUserTeacher => ({
        id: t._id.toString(),
        username: t.username,
        name: t.name,
        surname: t.surname,
        email: t.email ?? "",
        phone: t.phone ?? "",
        address: t.address,
        img: t.img ?? "",
        subject: t.subject,
        birthday: t.birthday,
        gradeLevel: t.gradeLevel,
        sex: t.sex,
        role: "teacher",
        schedule: [],
    });

    const mapStudent = (s: RawStudent): IUserStudent => ({
        id: s._id.toString(),
        username: s.username,
        name: s.name,
        surname: s.surname,
        email: s.email ?? "",
        img: s.img ?? "",
        phone: s.phone ?? "",
        address: s.address,
        grade: s.grade as Grade,
        classId: s.classId?.toString(),
        parentId: s.parentId?.toString(),
        birthday: s.birthday,
        sex: s.sex,
        role: "student",
        schedule: [],
    });

    const rawSchedule = Array.isArray(cls.schedule) ? cls.schedule : [];
    const schedule: IScheduleEntry[] = rawSchedule.map((e) => ({
        day: e.day,
        startTime: e.startTime,
        endTime: e.endTime,
        subject: e.subject,
        classId: e.classId.toString(),
        teacherId: e.teacherId?.toString() ?? "",
    }));

    return {
        id: cls._id.toString(),
        name: cls.name,
        grade: cls.grade,
        supervisor: cls.supervisor ? mapTeacher(cls.supervisor) : undefined,
        teacherIds: cls.teacherIds.map(mapTeacher),
        studentIds: cls.studentIds.map(mapStudent),
        lessons: cls.lessons.map((l) => ({
            lessonId: l.lessonId.toString(),
            teacherId: l.teacherId.toString(),
        })),
        schedule,
    };
};
