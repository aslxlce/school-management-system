// src/models/User.ts
import { Schema, model, models, Document, Model, Types } from "mongoose";
import bcrypt from "bcryptjs";
import { IScheduleEntry } from "@/types/user";

/** --------------------------------------------------------------------------
 * 1. Shared types and runtime arrays
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
export const gradeValues: Grade[] = [
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
];
export type GradeLevel = "primary" | "middle" | "high";

/** --------------------------------------------------------------------------
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
    return bcrypt.compare(candidate, this.password);
};

export const UserModel: Model<IUserBase> =
    (models.User as Model<IUserBase>) || model<IUserBase>("User", userSchema);

/** --------------------------------------------------------------------------
 * 3. Admin
 * -------------------------------------------------------------------------- */
export interface IAdmin extends IUserBase {
    role: "admin";
}

export const AdminModel: Model<IAdmin> =
    (models.admin as Model<IAdmin>) ||
    UserModel.discriminator<IAdmin>("admin", new Schema({}, { _id: false }));

/** --------------------------------------------------------------------------
 * 4. Parent
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
        email: { type: String, sparse: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        childrenIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    { _id: false }
);

export const ParentModel: Model<IParent> =
    (models.parent as Model<IParent>) || UserModel.discriminator<IParent>("parent", parentSchema);

/** --------------------------------------------------------------------------
 * 5. Shared schedule sub‐schema (string days)
 * -------------------------------------------------------------------------- */
const scheduleEntrySchema = new Schema(
    {
        day: {
            type: String,
            enum: ["monday", "tuesday", "wednesday", "thursday", "friday"],
            required: true,
        },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        subject: { type: String, required: true },
        classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
        teacherId: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { _id: false }
);

/** --------------------------------------------------------------------------
 * 6. Student (with schedule)
 * -------------------------------------------------------------------------- */
export interface IStudent extends IUserBase {
    role: "student";
    name: string;
    surname: string;
    email?: string;
    img?: string;
    phone?: string;
    grade: Grade;
    // classId?: Types.ObjectId;
    classId?: string;
    address: string;
    parentId?: Types.ObjectId;
    birthday: Date;
    sex: Sex;
    schedule?: IScheduleEntry[];
    isActive: boolean;
}

const studentSchema = new Schema<IStudent>(
    {
        name: { type: String, required: true },
        surname: { type: String, required: true },
        email: { type: String, unique: true, sparse: true },
        img: { type: String },
        phone: { type: String, unique: true, sparse: true },
        grade: { type: String, enum: gradeValues, required: true },
        classId: { type: String, default: "" },
        address: { type: String, required: true },
        parentId: { type: Schema.Types.ObjectId, ref: "parent" },
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

/** --------------------------------------------------------------------------
 * 7. Teacher (with schedule)
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
