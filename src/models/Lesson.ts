import mongoose, { Schema, models } from "mongoose";

const LessonSchema = new Schema({
    name: { type: String, required: true },
    subject: { type: String, required: true },
    gradeRange: {
        from: { type: Number, required: true },
        to: { type: Number, required: true },
    },
    assignedTeacher: { type: Schema.Types.ObjectId, ref: "User" },
    schedule: { type: String },
});

const LessonModel = models?.Lesson || mongoose.model("Lesson", LessonSchema);
export default LessonModel;
