// // src/action/client/teacher.ts
// import axiosConfig from "./axiosConfig";
// import type { IUserTeacher, Sex, IScheduleEntry } from "@/types/user";
// import { getGradeLevelFromGrade } from "@/lib/gradeLessons";

// interface RawTeacher {
//     _id: { toString(): string };
//     username: string;
//     name: string;
//     surname: string;
//     email: string;
//     phone?: string;
//     address: string;
//     img?: string;
//     sex: Sex;
//     subject: string;
//     birthday: string | Date;
//     gradeLevel: "primary" | "middle" | "high";
// }

// /**
//  * Create a new teacher.
//  */
// export const createTeacher = async (formData: FormData): Promise<{ message: string }> => {
//     try {
//         const res = await axiosConfig.post("/teachers", formData);
//         return res.data;
//     } catch (error) {
//         console.error("[TEACHER_CREATE_ERROR]:", error);
//         throw new Error("Teacher creation failed.");
//     }
// };

// /**
//  * Update an existing teacher by ID.
//  */
// export const updateTeacher = async (
//     id: string,
//     formData: FormData
// ): Promise<{ message: string }> => {
//     try {
//         const res = await axiosConfig.put(`/teachers/${id}`, formData);
//         return res.data;
//     } catch (error) {
//         console.error("[TEACHER_UPDATE_ERROR]:", error);
//         throw new Error("Teacher update failed.");
//     }
// };

// /**
//  * Fetch teachers eligible for a given gradeLevel & subject.
//  * Returns IUserTeacher[], so we must supply `role` and `schedule`.
//  */
// export async function getEligibleTeachersByGradeAndLesson(
//     gradeLevel: string,
//     subject: string
// ): Promise<IUserTeacher[]> {
//     try {
//         const res = await axiosConfig.get<RawTeacher[]>("/teachers/by-grade-level", {
//             params: { gradeLevel, subject },
//         });
//         console.log("[CLIENT] raw teachers for", gradeLevel, subject, "→", res.data);

//         return res.data.map((t) => ({
//             id: t._id.toString(),
//             username: t.username,
//             role: "teacher",
//             name: t.name,
//             surname: t.surname,
//             email: t.email,
//             phone: t.phone ?? "",
//             address: t.address,
//             img: t.img,
//             sex: t.sex,
//             subject: t.subject,
//             birthday: typeof t.birthday === "string" ? t.birthday : t.birthday.toISOString(),
//             gradeLevel: t.gradeLevel,
//             schedule: [] as IScheduleEntry[],
//         }));
//     } catch (err) {
//         console.error("[CLIENT] FETCH_TEACHERS_BY_GRADE_AND_SUBJECT_ERROR:", err);
//         return [];
//     }
// }

// /**
//  * Fetch paginated teachers for a given student-grade.
//  */
// export async function fetchTeachers(grade: string): Promise<IUserTeacher[]> {
//     const gradeLevel = getGradeLevelFromGrade(grade);
//     try {
//         const res = await axiosConfig.get<{
//             data: IUserTeacher[];
//             total: number;
//             page: number;
//             totalPages: number;
//         }>("/teachers", {
//             params: { gradeLevel },
//         });
//         return res.data.data;
//     } catch (error) {
//         console.error("[FETCH_TEACHERS_BY_GRADE_ERROR]:", error);
//         return [];
//     }
// }

// /**
//  * Fetch the currently-logged-in teacher’s profile.
//  */
// export async function fetchMyTeacherProfile(id: string): Promise<IUserTeacher> {
//     const res = await axiosConfig.get<IUserTeacher>(`/teachers/${id}`);
//     if (!res.status.toString().startsWith("2")) {
//         throw new Error(`Load teacher failed: ${res.statusText}`);
//     }
//     // now birthday is already a string matching IUserTeacher
//     return res.data;
// }

// src/action/client/teacher.ts
import axiosConfig from "./axiosConfig";
import type { IUserTeacher, Sex } from "@/types/user";
import { getGradeLevelFromGrade } from "@/lib/gradeLessons";

/**
 * Payload for creating/updating a teacher.
 */
export type TeacherPayload = {
    username: string;
    email: string;
    password?: string;
    name: string;
    surname: string;
    phone: string;
    address: string;
    img?: string;
    sex: Sex;
    subject: string;
    birthday: string; // ISO string
    gradeLevel: "primary" | "middle" | "high";
};

/**
 * Create a new teacher.
 */
export const createTeacher = async (payload: TeacherPayload): Promise<{ message: string }> => {
    const res = await axiosConfig.post<{ message: string }>("/teachers", payload);
    return res.data;
};

/**
 * Update existing teacher.
 */
export const updateTeacher = async (
    id: string,
    payload: TeacherPayload
): Promise<{ message: string }> => {
    const res = await axiosConfig.put<{ message: string }>(`/teachers/${id}`, payload);
    return res.data;
};

/**
 * Fetch teachers eligible for a given gradeLevel & subject.
 * API already returns valid IUserTeacher objects.
 */
export async function getEligibleTeachersByGradeAndLesson(
    gradeLevel: string,
    subject: string
): Promise<IUserTeacher[]> {
    const res = await axiosConfig.get<IUserTeacher[]>("/teachers/by-grade-level", {
        params: { gradeLevel, subject },
    });

    return res.data; // API already sends correct IUserTeacher[]
}

/**
 * Fetch paginated teachers for class/student listing.
 */
export async function fetchTeachers(grade: string): Promise<IUserTeacher[]> {
    const gradeLevel = getGradeLevelFromGrade(grade);

    const res = await axiosConfig.get<{
        data: IUserTeacher[];
        total: number;
        page: number;
        totalPages: number;
    }>("/teachers", {
        params: { gradeLevel },
    });

    return res.data.data;
}

/**
 * Fetch logged-in teacher profile.
 */
export async function fetchMyTeacherProfile(id: string): Promise<IUserTeacher> {
    const res = await axiosConfig.get<IUserTeacher>(`/teachers/${id}`);

    if (res.status < 200 || res.status > 299) {
        throw new Error(`Load teacher failed: ${res.statusText}`);
    }

    return res.data;
}
