// src/models/Assignment.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IAssignmentDocument extends Document {
    title: string;
    description: string;
    classId: Types.ObjectId;
    teacherId: Types.ObjectId;
    dueDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignmentDocument>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
        teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        dueDate: { type: Date, required: true },
    },
    { timestamps: true }
);

const AssignmentModel: Model<IAssignmentDocument> =
    (mongoose.models.Assignment as Model<IAssignmentDocument>) ||
    mongoose.model<IAssignmentDocument>("Assignment", AssignmentSchema);

export default AssignmentModel;
