import mongoose from "mongoose";

const parentSchema = new mongoose.Schema(
    {
        _id: String,
        username: { type: String, unique: true, required: true },
        name: { type: String, required: true },
        surname: { type: String, required: true },
        email: { type: String, unique: true, sparse: true },
        phone: { type: String, unique: true, required: true },
        address: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Parent || mongoose.model("Parent", parentSchema);
