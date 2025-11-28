// types/result.d.ts

/** What kind of result this is linked to */
export type ResultType = "exam" | "assignment";

/** Minimal person summary used inside results */
export interface IResultPerson {
    id: string;
    name: string;
    surname: string;
}

/**
 * Canonical Result DTO used across the app
 * - All IDs are strings
 * - Dates are ISO strings
 * - Student & teacher are summarized persons
 */
export interface IResult {
    id: string;

    student: IResultPerson;
    teacher: IResultPerson;

    classId: string;
    subject: string;
    type: ResultType;
    grade: number; // 0–100

    /** When the exam/assignment happened (ISO date string) */
    date: string;

    /** Creation timestamp (ISO) */
    createdAt: string;
}

/**
 * Payload used when creating a result from server/api.
 * `date` is optional – defaults to "today" when omitted.
 */
export interface CreateResultInput {
    studentId: string;
    classId: string;
    teacherId: string;
    subject: string;
    type: ResultType;
    grade: number;
    date?: string;
}
