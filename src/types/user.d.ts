// // types/user.d.ts
// export type Sex = "male" | "female";

// export type Grade =
//     | "1"
//     | "2"
//     | "3"
//     | "4"
//     | "5"
//     | "6"
//     | "7"
//     | "8"
//     | "9"
//     | "10S"
//     | "11S"
//     | "11M"
//     | "11Mt"
//     | "12S"
//     | "12M"
//     | "12Mt";

// export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";

// export interface IScheduleEntry {
//     day: DayOfWeek;
//     startTime: string;
//     endTime: string;
//     subject: string;
//     classId: string;
//     teacherId?: string;
// }

// export interface IUserBase {
//     id: string;
//     username: string;
//     role: "admin" | "parent" | "teacher" | "student";
// }

// export interface IUserAdmin extends IUserBase {
//     role: "admin";
// }

// /* ---------- Parent --------------------------------*/
// export interface IUserParent extends IUserBase {
//     role: "parent";
//     name: string;
//     surname: string;
//     phone: string;
//     address: string;
//     email?: string;
// }

// /* ---------- Teacher -------------------------------*/
// export interface IUserTeacher extends IUserBase {
//     role: "teacher";
//     name: string;
//     surname: string;
//     email: string;
//     phone: string;
//     address: string;
//     img?: string;
//     sex: Sex;
//     subject: string;
//     birthday: string; // ISO on the wire
//     gradeLevel: "primary" | "middle" | "high";
//     schedule?: IScheduleEntry[];
// }

// /* ---------- Student -------------------------------*/
// export interface IUserStudent extends IUserBase {
//     role: "student";
//     name: string;
//     surname: string;
//     email?: string;
//     phone?: string;
//     address: string;
//     img?: string;
//     sex: Sex;
//     grade: Grade;
//     classId?: string;
//     parentId?: string;
//     // ISO string from APIs, convert locally with `new Date(birthday)`
//     birthday: string;
//     // Optional: many endpoints don't send schedule; we can default to []
//     schedule?: IScheduleEntry[];
// }

// export type User = IUserAdmin | IUserParent | IUserTeacher | IUserStudent;

// types/user.d.ts
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

export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";

export interface IScheduleEntry {
    day: DayOfWeek;
    startTime: string;
    endTime: string;
    subject: string;
    classId: string;
    teacherId?: string;
}

export interface IUserBase {
    id: string;
    username: string;
    role: "admin" | "parent" | "teacher" | "student";
}

export interface IUserAdmin extends IUserBase {
    role: "admin";
}

/* ---------- Parent --------------------------------*/
export interface IUserParent extends IUserBase {
    role: "parent";
    name: string;
    surname: string;
    phone: string;
    address: string;
    email?: string;
    /** Optional array of child student IDs */
    childrenIds?: string[];
}

/* ---------- Teacher -------------------------------*/
export interface IUserTeacher extends IUserBase {
    role: "teacher";
    name: string;
    surname: string;
    email: string;
    phone: string;
    address: string;
    img?: string;
    sex: Sex;
    subject: string;
    birthday: string; // ISO on the wire
    gradeLevel: "primary" | "middle" | "high";
    schedule?: IScheduleEntry[];
}

/* ---------- Student -------------------------------*/
export interface IUserStudent extends IUserBase {
    role: "student";
    name: string;
    surname: string;
    email?: string;
    phone?: string;
    address: string;
    img?: string;
    sex: Sex;
    grade: Grade;
    classId?: string;
    parentId?: string;
    // ISO string from APIs, convert locally with `new Date(birthday)`
    birthday: string;
    // Optional: many endpoints don't send schedule; we can default to []
    schedule?: IScheduleEntry[];
}

export type User = IUserAdmin | IUserParent | IUserTeacher | IUserStudent;
