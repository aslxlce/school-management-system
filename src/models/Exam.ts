// // src/models/Exam.ts
// import { Schema, model, models, Document, Types, Model } from "mongoose";

// export interface IExam extends Document {
//     _id: Types.ObjectId;
//     classId: Types.ObjectId;
//     subject: string;
//     date: Date; // calendar day of exam
//     startTime: string; // "09:00"
//     endTime: string; // "10:30"
//     room?: string;
//     teacherId?: Types.ObjectId;
// }

// const examSchema = new Schema<IExam>(
//     {
//         classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
//         subject: { type: String, required: true, trim: true },
//         date: { type: Date, required: true },
//         startTime: { type: String, required: true },
//         endTime: { type: String, required: true },
//         room: { type: String },
//         teacherId: { type: Schema.Types.ObjectId, ref: "teacher" },
//     },
//     { timestamps: true }
// );

// // ✅ Correct, strongly-typed model so `find` / `create` exist
// export const ExamModel: Model<IExam> =
//     (models.Exam as Model<IExam> | undefined) || model<IExam>("Exam", examSchema);

// src/models/Exam.ts
import { Schema, model, models, Document, Types, Model } from "mongoose";

export interface IExamDocument extends Document {
    _id: Types.ObjectId;
    classId: Types.ObjectId;
    subject: string;
    date: Date; // calendar day of exam
    startTime: string; // "09:00"
    endTime: string; // "10:30"
    room?: string;
    teacherId?: Types.ObjectId;
}

const examSchema = new Schema<IExamDocument>(
    {
        classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
        subject: { type: String, required: true, trim: true },
        date: { type: Date, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        room: { type: String },
        teacherId: { type: Schema.Types.ObjectId, ref: "teacher" },
    },
    { timestamps: true }
);

// ✅ Correct, strongly-typed model so `find` / `create` exist
export const ExamModel: Model<IExamDocument> =
    (models.Exam as Model<IExamDocument> | undefined) || model<IExamDocument>("Exam", examSchema);
