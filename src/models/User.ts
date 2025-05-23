import mongoose, { Schema, Document, Types } from "mongoose";
import bcrypt from "bcryptjs";

// Base User Interface
interface IUserBase extends Document<Types.ObjectId> {
    username: string;
    password: string;
    role?: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// Base Schema
const baseUserSchema = new Schema<IUserBase>(
    {
        username: { type: String, unique: true, required: true },
        password: { type: String, required: true },
    },
    {
        discriminatorKey: "role",
        timestamps: true,
    }
);

// Hash password before saving
baseUserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Add method to compare passwords
baseUserSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Prevent redefining the model in development
const UserModel = mongoose.models["User"] || mongoose.model<IUserBase>("User", baseUserSchema);

// ------------------------------------
// Register Discriminators Only Once
// ------------------------------------

let AdminModel = mongoose.models["admin"];
let StudentModel = mongoose.models["student"];
let ParentModel = mongoose.models["parent"];
let TeacherModel = mongoose.models["teacher"];

// Admin
if (!AdminModel) {
    AdminModel = UserModel.discriminator("admin", new Schema({}, { _id: false }));
}

// Student
if (!StudentModel) {
    StudentModel = UserModel.discriminator(
        "student",
        new Schema(
            {
                name: { type: String, required: true },
                surname: { type: String, required: true },
                email: { type: String, unique: true, sparse: true },
                phone: { type: String, unique: true, sparse: true },
                address: { type: String, required: true },
                img: String,
                sex: { type: String, enum: ["MALE", "FEMALE"], required: true },
                parentId: { type: String, ref: "Parent", required: true },
                classId: { type: Number, ref: "Class", required: true },
                gradeId: { type: Number, ref: "Grade", required: true },
                birthday: { type: Date, required: true },
            },
            { _id: false }
        )
    );
}

// Parent
if (!ParentModel) {
    ParentModel = UserModel.discriminator(
        "parent",
        new Schema(
            {
                name: { type: String, required: true },
                surname: { type: String, required: true },
                email: { type: String, unique: true, sparse: true },
                phone: { type: String, unique: true, required: true },
                address: { type: String, required: true },
            },
            { _id: false }
        )
    );
}

// Teacher
if (!TeacherModel) {
    TeacherModel = UserModel.discriminator(
        "teacher",
        new Schema(
            {
                name: { type: String, required: true },
                surname: { type: String, required: true },
                email: { type: String, unique: true, sparse: true },
                phone: { type: String, unique: true, sparse: true },
                address: { type: String, required: true },
                img: String,
                sex: { type: String, enum: ["male", "female"], required: true },
                subject: [{ type: String, ref: "Subject" }],
                birthday: { type: Date, required: true },
            },
            { _id: false }
        )
    );
}

export { UserModel, AdminModel, StudentModel, ParentModel, TeacherModel };
