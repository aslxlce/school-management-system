// src/models/Result.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type ResultType = "exam" | "assignment";

export interface IResultDocument extends Document {
    studentId: Types.ObjectId;
    classId: Types.ObjectId;
    teacherId: Types.ObjectId;
    subject: string;
    type: ResultType;
    grade: number; // 0–100
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ResultSchema = new Schema<IResultDocument>(
    {
        studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
        teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        subject: { type: String, required: true },
        type: { type: String, enum: ["exam", "assignment"], required: true },
        grade: { type: Number, min: 0, max: 100, required: true },
        date: { type: Date, required: true },
    },
    { timestamps: true }
);

const ResultModel: Model<IResultDocument> =
    (mongoose.models.Result as Model<IResultDocument>) ||
    mongoose.model<IResultDocument>("Result", ResultSchema);

export default ResultModel;
