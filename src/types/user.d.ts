// declare interface IUserBase {
//     id: string;
//     username: string;
//     role: "student" | "admin" | "teacher" | "parent";
// }

// declare interface IUserTeacher {
//     id: string;
//     username: string;
//     name: string;
//     surname: string;
//     email: string;
//     phone: string;
//     address: string;
//     img?: string;
//     sex: "male" | "female";
//     subject: string;
//     birthday: Date;
//     gradeLevel: "primary" | "middle" | "high";
// }

// declare interface IUserStudent {
//     id: string;
//     name: string;
//     surname: string;
//     email?: string;
//     img: string;
//     phone?: string;
//     gradeId: string; // change from number to string to allow "10S", "12Mt", etc.
//     classId?: string;
//     adress: string;
//     parentId: string;
//     birthday: string;
//     sex: "male" | "female";
// }

/* --------------------------------------------------------------------------
 * Global type declarations for the User domain
 * --------------------------------------------------------------------------
 * 1.  Grade literals are synchronised with `gradeLessons.ts` (manual copy‑paste).
 * 2.  A reusable `IScheduleEntry` is introduced and embedded in Teacher &
 *     Student interfaces.
 * 3.  All previous `any` types removed.  Address typo fixed.
 * --------------------------------------------------------------------------*/

// -----------------------------------------------------------------------------
// Shared literals & helpers
// -----------------------------------------------------------------------------

/* -------------------------------------------------
 * Shared primitives
 * -------------------------------------------------*/

export type Sex = "male" | "female";

/** All grades we support – keep in sync with `gradeLessons.ts` */
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

/* -------------------------------------------------
 * Base user & discriminated sub-types
 * -------------------------------------------------*/

export interface IUserBase {
    /** MongoDB _id as string */
    id: string;
    username: string;
    role: "admin" | "parent" | "teacher" | "student";
}

/* ---------- Admin (no extra props right now) ----- */
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
    birthday: Date;
    gradeLevel: "primary" | "middle" | "high";
}

/* ---------- Student -------------------------------*/
export interface IUserStudent extends IUserBase {
    role: "student";
    name: string;
    surname: string;
    email?: string;
    phone: string;
    address: string;
    img?: string;
    sex: Sex;
    /** e.g. `"7"`, `"10S"`, `"12Mt"` … */
    grade: Grade;
    classId?: string;
    parentId?: string;
    birthday: Date;
}

/* -------------------------------------------------
 * Convenience union
 * -------------------------------------------------*/
export type User = IUserAdmin | IUserParent | IUserTeacher | IUserStudent;
