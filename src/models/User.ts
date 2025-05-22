// import mongoose, { Document, Schema } from "mongoose";
// import bcrypt from "bcryptjs";

// // Base interface for all user types
// interface IUser {
//     username: string;
//     email: string;
//     password: string;
//     role: "admin" | "teacher" | "student" | "parent";
//     name: string;
//     surname: string;
//     phone?: string;
//     address?: string;
//     img?: string;
// }

// interface ITeacher extends IUser {
//     role: "teacher";
//     subjects: number[];
//     birthday: Date;
//     sex: "MALE" | "FEMALE";
// }

// interface IStudent extends IUser {
//     role: "student";
//     parentId: string;
//     classId: number;
//     gradeId: number;
//     birthday: Date;
//     sex: "MALE" | "FEMALE";
// }

// interface IParent extends IUser {
//     role: "parent";
// }

// interface IAdmin extends IUser {
//     role: "admin";
// }

// // Document interfaces
// interface UserDocument extends IUser, Document {
//     comparePassword(candidatePassword: string): Promise<boolean>;
// }

// interface TeacherDocument extends ITeacher, UserDocument {}
// interface StudentDocument extends IStudent, UserDocument {}
// interface ParentDocument extends IParent, UserDocument {}
// interface AdminDocument extends IAdmin, UserDocument {}

// // Schema definition
// const userSchema = new Schema<UserDocument>(
//     {
//         username: { type: String, required: true, unique: true },
//         email: { type: String, required: true, unique: true },
//         password: { type: String, required: true },
//         role: { type: String, required: true, enum: ["admin", "teacher", "student", "parent"] },
//         name: { type: String, required: true },
//         surname: { type: String, required: true },
//         phone: String,
//         address: String,
//         img: String,
//     },
//     {
//         timestamps: true,
//         discriminatorKey: "role",
//     }
// );

// // Password hashing middleware
// userSchema.pre("save", async function (next) {
//     if (this.isModified("password")) {
//         this.password = await bcrypt.hash(this.password, 10);
//     }
//     next();
// });

// // Password comparison method
// userSchema.methods.comparePassword = async function (candidatePassword: string) {
//     return bcrypt.compare(candidatePassword, this.password);
// };

// // Create the base model
// const UserModel = mongoose.models.User || mongoose.model<UserDocument>("User", userSchema);

// // Create discriminator models
// const TeacherModel = UserModel.discriminator<TeacherDocument>(
//     "Teacher",
//     new Schema({
//         subjects: [{ type: Number, ref: "Subject" }],
//         birthday: { type: Date, required: true },
//         sex: { type: String, enum: ["MALE", "FEMALE"], required: true },
//     })
// );

// const StudentModel = UserModel.discriminator<StudentDocument>(
//     "Student",
//     new Schema({
//         parentId: { type: String, ref: "Parent", required: true },
//         classId: { type: Number, ref: "Class", required: true },
//         gradeId: { type: Number, ref: "Grade", required: true },
//         birthday: { type: Date, required: true },
//         sex: { type: String, enum: ["MALE", "FEMALE"], required: true },
//     })
// );

// const ParentModel = UserModel.discriminator<ParentDocument>("Parent", new Schema({}));
// const AdminModel = UserModel.discriminator<AdminDocument>("Admin", new Schema({}));

// export { UserModel, TeacherModel, StudentModel, ParentModel, AdminModel };
// export type { IUser, ITeacher, IStudent, IParent, IAdmin };

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
