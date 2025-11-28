// // // declare interface IClass {
// // //     id: string;
// // //     name: string;
// // //     grade: string;
// // //     teacherIds?: string[];
// // //     studentIds?: string[];
// // //     supervisor?: string;
// // //     lessons?: {
// // //         lessonId: string;
// // //         teacherId: string;
// // //     }[];

// // //     schedule?: string;
// // // }

// // // types/class.d.ts
// // import type { Grade, IScheduleEntry } from "./user";

// // /**
// //  * Canonical class shape used across the app & APIs
// //  * - IDs are *strings*
// //  * - Relations are IDs only (teacherIds, studentIds, supervisorId)
// //  * - `schedule` uses the shared IScheduleEntry
// //  */
// // export interface IClass {
// //     id: string;
// //     name: string;
// //     grade: Grade;

// //     teacherIds?: string[];
// //     studentIds?: string[];

// //     /** Homeroom / supervisor teacher ID */
// //     supervisorId?: string;

// //     /** Mapping of subject/lesson → teacher (by ID) */
// //     lessons?: {
// //         lessonId: string;
// //         teacherId: string;
// //     }[];

// //     /** Weekly schedule for the class */
// //     schedule?: IScheduleEntry[];
// // }

// // src/types/class.d.ts
// import type { Grade, IScheduleEntry } from "./user";

// /**
//  * Canonical class shape used across the app & APIs
//  * - IDs are *strings*
//  * - Relations are IDs only (teacherIds, studentIds, supervisorId)
//  * - `schedule` uses the shared IScheduleEntry from user types
//  */
// export interface IClass {
//     id: string;
//     name: string;
//     grade: Grade;

//     /** IDs of teachers teaching this class (any subject) */
//     teacherIds?: string[];

//     /** IDs of students belonging to this class */
//     studentIds?: string[];

//     /** Homeroom / supervisor teacher ID */
//     supervisorId?: string;

//     /** Mapping of subject/lesson → teacher (by ID) */
//     lessons?: {
//         lessonId: string;
//         teacherId: string;
//     }[];

//     /** Weekly schedule for the class */
//     schedule?: IScheduleEntry[];
// }

// types/class.d.ts
import type { Grade, IScheduleEntry } from "./user";

/**
 * Canonical class shape used across the app & APIs
 * - IDs are *strings*
 * - Relations are IDs only (teacherIds, studentIds, supervisorId)
 */
export interface IClass {
    id: string;
    name: string;
    grade: Grade;

    /** IDs of teachers teaching this class (any subject) */
    teacherIds?: string[];

    /** IDs of students belonging to this class */
    studentIds?: string[];

    /** Homeroom / supervisor teacher ID */
    supervisorId?: string;

    /** Mapping of subject/lesson → teacher (by ID) */
    lessons?: {
        lessonId: string;
        teacherId: string;
    }[];

    /** Weekly schedule for the class */
    schedule?: IScheduleEntry[];
}

/** Populated supervisor for view types */
export interface IPopulatedSupervisorRef {
    id: string;
    name: string;
    surname: string;
}

/** Populated teacher for view types */
export interface IPopulatedTeacherRef {
    id: string;
    name?: string;
    surname?: string;
}

/**
 * View type for list/detail pages where we need populated relations.
 * Server actions that populate supervisor/teachers should return this.
 */
export interface IClassWithRelations extends IClass {
    supervisor?: IPopulatedSupervisorRef;
    teachers?: IPopulatedTeacherRef[];
}
