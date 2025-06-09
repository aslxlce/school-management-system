// import { Schema, model, models, Types } from "mongoose";

// const classLessonSubSchema = new Schema(
//     {
//         lessonId: { type: Types.ObjectId, ref: "Lesson", required: true },
//         teacherId: { type: Types.ObjectId, ref: "User", required: true },
//     },
//     { _id: false }
// );

// const scheduleEntrySchema = new Schema(
//     {
//         day: {
//             type: String,
//             enum: ["sunday", "monday", "tuesday", "wednesday", "thursday"],
//             required: true,
//         },
//         startTime: { type: String, required: true },
//         endTime: { type: String, required: true },
//         subject: { type: String, required: true },
//         classId: { type: Types.ObjectId, ref: "Class", required: true },
//         teacherId: { type: Types.ObjectId, ref: "User" },
//     },
//     { _id: false }
// );

// const classSchema = new Schema(
//     {
//         name: { type: String, required: true },
//         grade: { type: String, required: true },
//         teacherIds: [{ type: Types.ObjectId, ref: "User" }],
//         studentIds: [{ type: Types.ObjectId, ref: "User" }],
//         supervisor: { type: Types.ObjectId, ref: "User" },
//         lessons: { type: [classLessonSubSchema], default: [] },
//         schedule: { type: [scheduleEntrySchema], default: [] },
//     },
//     { timestamps: true }
// );

// const ClassModel = models.Class || model("Class", classSchema);
// export default ClassModel;

// models/Class.ts

import { Schema, model, models, Types } from "mongoose";

// 1) Define a schema for one schedule entry:
const scheduleEntrySchema = new Schema(
    {
        day: { type: String, required: true }, // e.g. "monday"
        startTime: { type: String, required: true }, // e.g. "08:00"
        endTime: { type: String, required: true }, // e.g. "09:00"
        subject: { type: String, required: true },
        classId: { type: Types.ObjectId, ref: "Class", required: true },
        teacherId: { type: Types.ObjectId, ref: "User" },
    },
    { _id: false }
);

const classSchema = new Schema(
    {
        name: { type: String, required: true },
        grade: { type: String, required: true },
        teacherIds: [{ type: Types.ObjectId, ref: "User" }],
        studentIds: [{ type: Types.ObjectId, ref: "User" }],
        supervisor: { type: Types.ObjectId, ref: "User" },
        lessons: [{ lessonId: String, teacherId: String }],
        // 2) Change this from a String to an array of scheduleEntrySchema:
        schedule: { type: [scheduleEntrySchema], default: [] },
    },
    { timestamps: true }
);

const ClassModel = models.Class || model("Class", classSchema);
export default ClassModel;
