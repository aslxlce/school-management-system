import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    _id: String,
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);
