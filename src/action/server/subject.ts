// // src/action/server/subject.ts

// "use server";

// import dbConnect from "@/lib/dbConnection";
// import { TeacherModel } from "@/models/User";
// import type { IUserTeacher } from "@/types/user";

// /**
//  * One row in the subjects list.
//  */
// export interface ISubjectRow {
//     name: string; // subject name (e.g. "Math")
//     teacherNames: string[]; // ["Alice Doe", "Bob Smith", ...]
// }

// /**
//  * Fetch distinct subjects with the names of their teachers (paginated).
//  */
// export async function fetchSubjects(
//     page: number = 1,
//     limit: number = 10
// ): Promise<{ data: ISubjectRow[]; totalPages: number }> {
//     await dbConnect();

//     const skip = (page - 1) * limit;

//     // Group teachers by subject
//     type SubjectAggregateRow = {
//         _id: string;
//         teachers: { name: string; surname: string }[];
//     };

//     const aggregateResult = await TeacherModel.aggregate<SubjectAggregateRow>([
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

//     const data: ISubjectRow[] = aggregateResult.map((row) => ({
//         name: row._id,
//         teacherNames: row.teachers.map((t) => `${t.name} ${t.surname}`),
//     }));

//     // Count total distinct subjects for pagination
//     const distinctSubjects = await TeacherModel.distinct("subject");
//     const totalPages = Math.ceil(distinctSubjects.length / limit);

//     return { data, totalPages };
// }

// /**
//  * Fetch all teachers who teach a given subject.
//  */
// export async function fetchTeachersBySubject(subject: string): Promise<IUserTeacher[]> {
//     await dbConnect();

//     // Lean teacher docs (array)
//     const teachersRaw = await TeacherModel.find({ subject }).lean();

//     const mapped: IUserTeacher[] = teachersRaw.map((t) => ({
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
//         schedule: t.schedule ?? [],
//         role: "teacher",
//     }));

//     return mapped;
// }

"use server";

import dbConnect from "@/lib/dbConnection";
import { TeacherModel } from "@/models/User";
import type { IUserTeacher, IScheduleEntry } from "@/types/user";

/**
 * One row in the subjects list.
 */
export interface ISubjectRow {
    name: string;
    teacherNames: string[];
}

/**
 * Type guard to validate schedule entries without using `any`
 */
function isScheduleEntryArray(value: unknown): value is IScheduleEntry[] {
    return (
        Array.isArray(value) &&
        value.every((e) => {
            return (
                typeof e === "object" &&
                e !== null &&
                typeof (e as Record<string, unknown>).day === "string" &&
                typeof (e as Record<string, unknown>).startTime === "string" &&
                typeof (e as Record<string, unknown>).endTime === "string" &&
                typeof (e as Record<string, unknown>).subject === "string" &&
                typeof (e as Record<string, unknown>).classId === "string"
            );
        })
    );
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

    type SubjectAggregateRow = {
        _id: string;
        teachers: { name: string; surname: string }[];
    };

    const aggregateResult = await TeacherModel.aggregate<SubjectAggregateRow>([
        {
            $group: {
                _id: "$subject",
                teachers: { $push: { name: "$name", surname: "$surname" } },
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

    const distinctSubjects = await TeacherModel.distinct("subject");
    const totalPages = Math.ceil(distinctSubjects.length / limit);

    return { data, totalPages };
}

/**
 * Fetch all teachers who teach a given subject.
 */
export async function fetchTeachersBySubject(subject: string): Promise<IUserTeacher[]> {
    await dbConnect();

    const teachersRaw = await TeacherModel.find({ subject }).lean();

    const mapped: IUserTeacher[] = teachersRaw.map((t) => {
        const scheduleValue: unknown = (t as Record<string, unknown>).schedule;

        const schedule: IScheduleEntry[] = isScheduleEntryArray(scheduleValue) ? scheduleValue : [];

        return {
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
            birthday: t.birthday instanceof Date ? t.birthday.toISOString() : String(t.birthday),
            gradeLevel: t.gradeLevel,
            schedule,
            role: "teacher",
        };
    });

    return mapped;
}
