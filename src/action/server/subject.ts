// "use server";

// import dbConnect from "@/lib/dbConnection";
// import { TeacherModel } from "@/models/User";
// import type { IUserTeacher } from "@/types/user";

// export interface ISubjectWithTeachers {
//     name: string;
//     teacherNames: string[];
// }

// export interface PaginatedSubjects {
//     data: ISubjectWithTeachers[];
//     totalPages: number;
// }

// /**
//  * Fetch distinct subjects with the names of their teachers (paginated).
//  */
// export async function fetchSubjects(
//     page: number = 1,
//     limit: number = 10
// ): Promise<PaginatedSubjects> {
//     await dbConnect();

//     const skip = (page - 1) * limit;

//     const aggregateResult = await TeacherModel.aggregate([
//         {
//             $group: {
//                 _id: "$subject",
//                 teachers: {
//                     $push: { name: "$name", surname: "$surname" },
//                 },
//             },
//         },
//         { $sort: { _id: 1 } },
//         { $skip: skip },
//         { $limit: limit },
//     ]);

//     type SubjectAggregateRow = {
//         _id: string;
//         teachers: { name: string; surname: string }[];
//     };

//     const casted = aggregateResult as SubjectAggregateRow[];

//     const data: ISubjectWithTeachers[] = casted.map((row) => ({
//         name: row._id,
//         teacherNames: row.teachers.map((t) => `${t.name} ${t.surname}`),
//     }));

//     const distinctSubjects = await TeacherModel.distinct("subject");
//     const totalPages = Math.ceil(distinctSubjects.length / limit);

//     return { data, totalPages };
// }

// /**
//  * Fetch all teachers that teach a given subject.
//  */
// export async function fetchTeachersBySubject(subject: string): Promise<IUserTeacher[]> {
//     await dbConnect();

//     const teachersRaw = await TeacherModel.find({ subject }).lean();

//     type TeacherRow = {
//         _id: string;
//         username: string;
//         name: string;
//         surname: string;
//         email: string;
//         phone: string;
//         address: string;
//         img?: string;
//         sex: "male" | "female";
//         subject: string;
//         birthday: Date;
//         gradeLevel: "primary" | "middle" | "high";
//         schedule?: IUserTeacher["schedule"];
//     };

//     const casted = teachersRaw as TeacherRow[];

//     const mapped: IUserTeacher[] = casted.map((t) => ({
//         id: String(t._id),
//         username: t.username,
//         name: t.name,
//         surname: t.surname,
//         email: t.email,
//         phone: t.phone,
//         address: t.address,
//         img: t.img,
//         sex: t.sex,
//         subject: t.subject,
//         birthday: t.birthday,
//         gradeLevel: t.gradeLevel,
//         schedule: t.schedule,
//         role: "teacher",
//     }));

//     return mapped;
// }

// src/action/server/subject.ts

"use server";

import dbConnect from "@/lib/dbConnection";
import { TeacherModel } from "@/models/User";
import type { IUserTeacher } from "@/types/user";

/**
 * One row in the subjects list.
 */
export interface ISubjectRow {
    name: string; // subject name (e.g. "Math")
    teacherNames: string[]; // ["Alice Doe", "Bob Smith", ...]
}

/**
 * Fetch distinct subjects with the names of their teachers (paginated).
 */
export async function fetchSubjects(
    page: number = 1,
    limit: number = 10
): Promise<{ data: ISubjectRow[]; totalPages: number }> {
    await dbConnect();

    const skip = (page - 1) * limit;

    // Group teachers by subject
    type SubjectAggregateRow = {
        _id: string;
        teachers: { name: string; surname: string }[];
    };

    const aggregateResult = await TeacherModel.aggregate<SubjectAggregateRow>([
        {
            $group: {
                _id: "$subject",
                teachers: {
                    $push: { name: "$name", surname: "$surname" },
                },
            },
        },
        { $sort: { _id: 1 } },
        { $skip: skip },
        { $limit: limit },
    ]);

    const data: ISubjectRow[] = aggregateResult.map((row) => ({
        name: row._id,
        teacherNames: row.teachers.map((t) => `${t.name} ${t.surname}`),
    }));

    // Count total distinct subjects for pagination
    const distinctSubjects = await TeacherModel.distinct("subject");
    const totalPages = Math.ceil(distinctSubjects.length / limit);

    return { data, totalPages };
}

/**
 * Fetch all teachers who teach a given subject.
 */
export async function fetchTeachersBySubject(subject: string): Promise<IUserTeacher[]> {
    await dbConnect();

    // Lean teacher docs (array)
    const teachersRaw = await TeacherModel.find({ subject }).lean();

    const mapped: IUserTeacher[] = teachersRaw.map((t) => ({
        id: String(t._id),
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
        schedule: t.schedule ?? [],
        role: "teacher",
    }));

    return mapped;
}
