// src/types/exam.d.ts

/**
 * Canonical exam shape used across the app & APIs.
 * - All IDs are strings
 * - `date` is an ISO date string (e.g. "2025-11-28T09:00:00.000Z")
 */
export interface IExam {
    id: string;
    classId: string;
    subject: string;
    date: string; // ISO string
    startTime: string; // "09:00"
    endTime: string; // "10:30"
    room?: string;
    teacherId?: string;
    /** denormalized teacher full name if available */
    teacherName?: string;
}

/**
 * Generic payload for creating/updating exams via API
 * (optionally includes teacherId).
 */
export interface ExamPayload {
    classId: string;
    subject: string;
    date: string;
    startTime: string;
    endTime: string;
    room?: string;
    teacherId?: string;
}

/**
 * Simple alias used by the UI when creating exams
 * (no teacher selection in the current UI).
 */
export type CreateExamPayload = Omit<ExamPayload, "teacherId">;
