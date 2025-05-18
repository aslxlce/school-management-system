import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
    {
        _id: String,
        username: { type: String, unique: true, required: true },
        name: { type: String, required: true },
        surname: { type: String, required: true },
        email: { type: String, unique: true, sparse: true },
        phone: { type: String, unique: true, sparse: true },
        address: { type: String, required: true },
        img: String,
        sex: { type: String, enum: ["MALE", "FEMALE"], required: true },
        subjects: [{ type: Number, ref: "Subject" }],
        birthday: { type: Date, required: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);
