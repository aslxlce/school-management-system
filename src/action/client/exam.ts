// src/action/client/exam.ts
import axiosConfig from "./axiosConfig";

export interface IExam {
    id: string;
    classId: string;
    subject: string;
    date: string; // ISO string
    startTime: string;
    endTime: string;
    room?: string;
    teacherId?: string;
    teacherName?: string;
}

export interface ExamPayload {
    classId: string;
    subject: string;
    date: string;
    startTime: string;
    endTime: string;
    room?: string;
    teacherId?: string;
}

export interface CreateExamPayload {
    classId: string;
    subject: string;
    date: string;
    startTime: string;
    endTime: string;
    room?: string;
}

/** Fetch all exams for a given class */
export async function fetchExamsByClass(classId: string): Promise<IExam[]> {
    const trimmed = classId.trim();
    if (!trimmed) return [];

    const res = await axiosConfig.get<IExam[]>("/exams", {
        params: { classId: trimmed },
    });

    return res.data;
}

/** Create a new exam */
export async function createExam(payload: ExamPayload): Promise<IExam> {
    const res = await axiosConfig.post<IExam>("/exams", payload);
    return res.data;
}

/**
 * Alias to keep old imports working:
 *   import { IExam, getExamsByClass } from "@/action/client/exam";
 */
export const getExamsByClass = fetchExamsByClass;
