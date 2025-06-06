// import mongoose, { Schema, model, models } from "mongoose";

// const classSchema = new Schema(
//     {
//         name: { type: String, required: true },
//         grade: { type: Number, required: true },
//         teacherIds: [{ type: mongoose.Types.ObjectId, ref: "User" }],
//         studentIds: [{ type: mongoose.Types.ObjectId, ref: "User" }],
//         supervisor: { type: mongoose.Types.ObjectId, ref: "User" },
//         lessons: [{ type: String }],
//         schedule: { type: String },
//     },
//     { timestamps: true }
// );

// const ClassModel = models.Class || model("Class", classSchema);
// export default ClassModel;

import { Schema, model, models, Types } from "mongoose";

/** One school class – e.g. “7-A”, “11M-2”, … */
const classSchema = new Schema(
    {
        name: { type: String, required: true }, // “7-A”
        grade: { type: String, required: true }, // “7”, “11M”, … 🔄 changed
        teacherIds: [{ type: Types.ObjectId, ref: "User" }],
        studentIds: [{ type: Types.ObjectId, ref: "User" }],
        supervisor: { type: Types.ObjectId, ref: "User" },
        lessons: [{ type: String }],
        schedule: { type: String }, // (will move to its own model later)
    },
    { timestamps: true }
);

const ClassModel = models.Class || model("Class", classSchema);
export default ClassModel;
