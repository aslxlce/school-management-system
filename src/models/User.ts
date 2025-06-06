// import mongoose, { Schema, Document, Types } from "mongoose";
// import bcrypt from "bcryptjs";

// // Base User Interface
// interface IUserBase extends Document<Types.ObjectId> {
//     username: string;
//     password: string;
//     role?: string;
//     comparePassword(candidatePassword: string): Promise<boolean>;
// }

// // Base Schema
// const baseUserSchema = new Schema<IUserBase>(
//     {
//         username: { type: String, unique: true, required: true },
//         password: { type: String, required: true },
//     },
//     {
//         discriminatorKey: "role",
//         timestamps: true,
//     }
// );

// // Hash password before saving
// baseUserSchema.pre("save", async function (next) {
//     if (this.isModified("password")) {
//         this.password = await bcrypt.hash(this.password, 10);
//     }
//     next();
// });

// // Add method to compare passwords
// baseUserSchema.methods.comparePassword = async function (candidatePassword: string) {
//     return bcrypt.compare(candidatePassword, this.password);
// };

// // Prevent redefining the model in development
// const UserModel = mongoose.models["User"] || mongoose.model<IUserBase>("User", baseUserSchema);

// // ------------------------------------
// // Register Discriminators Only Once
// // ------------------------------------

// let AdminModel = mongoose.models["admin"];
// let StudentModel = mongoose.models["student"];
// let ParentModel = mongoose.models["parent"];
// let TeacherModel = mongoose.models["teacher"];

// // Admin
// if (!AdminModel) {
//     AdminModel = UserModel.discriminator("admin", new Schema({}, { _id: false }));
// }

// if (!StudentModel) {
//     StudentModel = UserModel.discriminator(
//         "student",
//         new Schema(
//             {
//                 name: { type: String, required: true },
//                 surname: { type: String, required: true },
//                 email: { type: String, unique: true, sparse: true },
//                 phone: { type: String, unique: true, sparse: true },
//                 address: { type: String, required: true },
//                 img: String,
//                 sex: { type: String, enum: ["male", "female"], required: true },
//                 parentId: { type: String, ref: "Parent", required: true },
//                 classId: { type: String, ref: "Class", required: true },
//                 gradeId: { type: String, required: true },
//                 birthday: { type: Date, required: true },
//                 isActive: { type: Boolean, default: true },
//             },
//             { _id: false }
//         )
//     );
// }

// // Parent
// if (!ParentModel) {
//     ParentModel = UserModel.discriminator(
//         "parent",
//         new Schema(
//             {
//                 name: { type: String, required: true },
//                 surname: { type: String, required: true },
//                 email: { type: String, unique: true, sparse: true },
//                 phone: { type: String, unique: true, required: true },
//                 address: { type: String, required: true },
//             },
//             { _id: false }
//         )
//     );
// }

// if (!TeacherModel) {
//     TeacherModel = UserModel.discriminator(
//         "teacher",
//         new Schema(
//             {
//                 name: { type: String, required: true },
//                 surname: { type: String, required: true },
//                 email: { type: String, unique: true, sparse: true },
//                 phone: { type: String, unique: true, sparse: true },
//                 address: { type: String, required: true },
//                 img: String,
//                 sex: { type: String, enum: ["male", "female"], required: true },
//                 subject: { type: String, required: true },
//                 birthday: { type: Date, required: true },
//                 gradeLevel: {
//                     type: String,
//                     enum: ["primary", "middle", "high"],
//                     required: true,
//                 },
//             },
//             { _id: false }
//         )
//     );
// }
// export { UserModel, AdminModel, StudentModel, ParentModel, TeacherModel };

// src/models/User.ts

import { Schema, model, models, Document, Model, Types } from "mongoose";
import bcrypt from "bcryptjs";

/* --------------------------------------------------------------------------
 * 1. Shared types (for reference / alignment with “User.d”)
 * -------------------------------------------------------------------------- */
export type Role = "admin" | "parent" | "teacher" | "student";
export type Sex = "male" | "female";
export type Grade =
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10S"
    | "11S"
    | "11M"
    | "11Mt"
    | "12S"
    | "12M"
    | "12Mt";
export type GradeLevel = "primary" | "middle" | "high";

/** Matches the TS “IScheduleEntry” */
export interface IScheduleEntry {
    day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    start: string; // “HH:MM”
    end: string; // “HH:MM”
    subject?: string;
    classId?: string; // ObjectId → string
    lessonId?: string;
}

/* --------------------------------------------------------------------------
 * 2. Base user interface & schema
 * -------------------------------------------------------------------------- */
export interface IUserBase extends Document {
    _id: Types.ObjectId;
    username: string;
    password: string;
    role: Role;
    comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUserBase>(
    {
        username: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true, select: false },
        // “role” is set by discriminatorKey below
    },
    {
        timestamps: true,
        discriminatorKey: "role",
    }
);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const plain = this.get("password");
        this.set("password", await bcrypt.hash(plain, 10));
    }
    next();
});

userSchema.methods.comparePassword = async function (candidate: string) {
    // `this.password` will be the hashed password
    return bcrypt.compare(candidate, this.password);
};

export const UserModel: Model<IUserBase> =
    (models.User as Model<IUserBase>) || model<IUserBase>("User", userSchema);

/* --------------------------------------------------------------------------
 * 3. Admin (no extra fields beyond IUserBase.role = "admin")
 * -------------------------------------------------------------------------- */
export interface IAdmin extends IUserBase {
    role: "admin";
}

export const AdminModel: Model<IAdmin> =
    (models.admin as Model<IAdmin>) ||
    UserModel.discriminator<IAdmin>("admin", new Schema({}, { _id: false }));

/* --------------------------------------------------------------------------
 * 4. Parent (now has childrenIds?: string[])
 * -------------------------------------------------------------------------- */
export interface IParent extends IUserBase {
    role: "parent";
    name: string;
    surname: string;
    email?: string;
    phone: string;
    address: string;
    childrenIds?: string[];
}

const parentSchema = new Schema<IParent>(
    {
        name: { type: String, required: true },
        surname: { type: String, required: true },
        email: { type: String, unique: true, sparse: true },
        phone: { type: String, required: true, unique: true },
        address: { type: String, required: true },
        childrenIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    { _id: false }
);

export const ParentModel: Model<IParent> =
    (models.parent as Model<IParent>) || UserModel.discriminator<IParent>("parent", parentSchema);

/* --------------------------------------------------------------------------
 * 5. Student (parentId & classId optional, schedule optional)
 * -------------------------------------------------------------------------- */
export interface IStudent extends IUserBase {
    role: "student";
    name: string;
    surname: string;
    email?: string;
    img?: string;
    phone?: string;
    grade: Grade;
    classId?: Types.ObjectId;
    address: string;
    parentId?: Types.ObjectId;
    birthday: Date;
    sex: Sex;
    schedule?: IScheduleEntry[];
    isActive: boolean;
}

const scheduleEntrySchema = new Schema<IScheduleEntry>(
    {
        day: { type: Number, required: true, min: 0, max: 6 },
        start: { type: String, required: true }, // should be "HH:MM"
        end: { type: String, required: true }, // should be "HH:MM"
        subject: { type: String },
        classId: { type: Schema.Types.ObjectId, ref: "Class" },
        lessonId: { type: Schema.Types.ObjectId, ref: "Lesson" },
    },
    { _id: false }
);

const studentSchema = new Schema<IStudent>(
    {
        name: { type: String, required: true },
        surname: { type: String, required: true },
        email: { type: String, unique: true, sparse: true },
        img: { type: String },
        phone: { type: String, unique: true, sparse: true },
        grade: {
            type: String,
            enum: [
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "10S",
                "11S",
                "11M",
                "11Mt",
                "12S",
                "12M",
                "12Mt",
            ],
            required: true,
        },
        classId: { type: Schema.Types.ObjectId, ref: "Class", required: false },
        address: { type: String, required: true },
        parentId: { type: Schema.Types.ObjectId, ref: "parent", required: false },
        birthday: { type: Date, required: true },
        sex: { type: String, enum: ["male", "female"], required: true },
        schedule: { type: [scheduleEntrySchema], default: [] },
        isActive: { type: Boolean, default: true },
    },
    { _id: false }
);

export const StudentModel: Model<IStudent> =
    (models.student as Model<IStudent>) ||
    UserModel.discriminator<IStudent>("student", studentSchema);

/* --------------------------------------------------------------------------
 * 6. Teacher (schedule optional)
 * -------------------------------------------------------------------------- */
export interface ITeacher extends IUserBase {
    role: "teacher";
    name: string;
    surname: string;
    email: string;
    phone: string;
    address: string;
    img?: string;
    sex: Sex;
    subject: string;
    birthday: Date;
    gradeLevel: GradeLevel;
    schedule?: IScheduleEntry[];
}

const teacherSchema = new Schema<ITeacher>(
    {
        name: { type: String, required: true },
        surname: { type: String, required: true },
        email: { type: String, unique: true, sparse: true, required: true },
        phone: { type: String, unique: true, sparse: true },
        address: { type: String, required: true },
        img: { type: String },
        sex: { type: String, enum: ["male", "female"], required: true },
        subject: { type: String, required: true },
        birthday: { type: Date, required: true },
        gradeLevel: { type: String, enum: ["primary", "middle", "high"], required: true },
        schedule: { type: [scheduleEntrySchema], default: [] },
    },
    { _id: false }
);

export const TeacherModel: Model<ITeacher> =
    (models.teacher as Model<ITeacher>) ||
    UserModel.discriminator<ITeacher>("teacher", teacherSchema);
