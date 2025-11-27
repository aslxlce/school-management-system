// // src/action/server/assignment.ts
// import dbConnect from "@/lib/dbConnection";
// import AssignmentModel from "@/models/Assignment";
// import { Types } from "mongoose";

// interface RawTeacherForAssignment {
//     _id: Types.ObjectId;
//     name: string;
//     surname: string;
// }

// interface RawAssignment {
//     _id: Types.ObjectId;
//     title: string;
//     description: string;
//     dueDate: Date;
//     classId: Types.ObjectId;
//     teacherId: RawTeacherForAssignment;
//     createdAt: Date;
//     updatedAt: Date;
// }

// export interface IAssignment {
//     id: string;
//     title: string;
//     description: string;
//     dueDate: string; // ISO
//     classId: string;
//     teacher: {
//         id: string;
//         name: string;
//         surname: string;
//     };
//     createdAt: string;
// }

// export interface CreateAssignmentInput {
//     title: string;
//     description: string;
//     dueDate: string; // ISO string, e.g. "2025-11-27"
//     classId: string;
//     teacherId: string;
// }

// function mapAssignment(raw: RawAssignment): IAssignment {
//     return {
//         id: raw._id.toString(),
//         title: raw.title,
//         description: raw.description,
//         dueDate: raw.dueDate.toISOString(),
//         classId: raw.classId.toString(),
//         teacher: {
//             id: raw.teacherId._id.toString(),
//             name: raw.teacherId.name,
//             surname: raw.teacherId.surname,
//         },
//         createdAt: raw.createdAt.toISOString(),
//     };
// }

// export async function createAssignment(input: CreateAssignmentInput): Promise<IAssignment> {
//     await dbConnect();

//     const dueDate = new Date(input.dueDate);

//     const doc = await AssignmentModel.create({
//         title: input.title,
//         description: input.description,
//         dueDate,
//         classId: new Types.ObjectId(input.classId),
//         teacherId: new Types.ObjectId(input.teacherId),
//     });

//     const populated = await doc
//         .populate<{ teacherId: RawTeacherForAssignment }>("teacherId", "name surname")
//         .then((d) => d.toObject() as RawAssignment);

//     return mapAssignment(populated);
// }

// /**
//  * Fetch all assignments for a given class.
//  */
// export async function fetchAssignmentsByClass(classId: string): Promise<IAssignment[]> {
//     await dbConnect();

//     const docs = await AssignmentModel.find({ classId: new Types.ObjectId(classId) })
//         .sort({ dueDate: 1 })
//         .populate<{ teacherId: RawTeacherForAssignment }>("teacherId", "name surname")
//         .lean<RawAssignment[]>();

//     return docs.map(mapAssignment);
// }

// src/action/server/assignment.ts
import dbConnect from "@/lib/dbConnection";
import AssignmentModel from "@/models/Assignment";
import { Types } from "mongoose";

interface RawTeacherForAssignment {
    _id: Types.ObjectId;
    name: string;
    surname: string;
}

interface RawAssignment {
    _id: Types.ObjectId;
    title: string;
    description: string;
    dueDate: Date;
    classId: Types.ObjectId;
    teacherId: RawTeacherForAssignment;
    createdAt: Date;
    updatedAt: Date;
}

export interface IAssignment {
    id: string;
    title: string;
    description: string;
    dueDate: string; // ISO
    classId: string;
    teacher: {
        id: string;
        name: string;
        surname: string;
    };
    createdAt: string;
}

export interface CreateAssignmentInput {
    title: string;
    description: string;
    dueDate: string; // ISO, e.g. "2025-11-27"
    classId: string;
    teacherId: string;
}

function mapAssignment(raw: RawAssignment): IAssignment {
    return {
        id: raw._id.toString(),
        title: raw.title,
        description: raw.description,
        dueDate: raw.dueDate.toISOString(),
        classId: raw.classId.toString(),
        teacher: {
            id: raw.teacherId._id.toString(),
            name: raw.teacherId.name,
            surname: raw.teacherId.surname,
        },
        createdAt: raw.createdAt.toISOString(),
    };
}

export async function createAssignment(input: CreateAssignmentInput): Promise<IAssignment> {
    await dbConnect();

    const dueDate = new Date(input.dueDate);

    // 1) Create the document
    const created = await AssignmentModel.create({
        title: input.title,
        description: input.description,
        dueDate,
        classId: new Types.ObjectId(input.classId),
        teacherId: new Types.ObjectId(input.teacherId),
    });

    // 2) Re-fetch it with populate + lean, typed as RawAssignment
    const populated = await AssignmentModel.findById(created._id)
        .populate<{ teacherId: RawTeacherForAssignment }>("teacherId", "name surname")
        .lean<RawAssignment>()
        .exec();

    if (!populated) {
        throw new Error("Failed to load created assignment");
    }

    return mapAssignment(populated);
}

/**
 * Fetch all assignments for a given class.
 */
export async function fetchAssignmentsByClass(classId: string): Promise<IAssignment[]> {
    await dbConnect();

    const docs = await AssignmentModel.find({
        classId: new Types.ObjectId(classId),
    })
        .sort({ dueDate: 1 })
        .populate<{ teacherId: RawTeacherForAssignment }>("teacherId", "name surname")
        .lean<RawAssignment[]>()
        .exec();

    return docs.map(mapAssignment);
}
