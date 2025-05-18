import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
    _id: Number,
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    classId: { type: Number, ref: "Class" },
});

export default mongoose.models.Announcement || mongoose.model("Announcement", announcementSchema);
