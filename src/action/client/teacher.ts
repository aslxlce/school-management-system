// import { IUserTeacher } from "@/types/user";
// import axiosConfig from "./axiosConfig";
// import { getGradeLevelFromGrade } from "@/lib/gradeLessons";

// interface RawTeacher {
//     _id: { toString(): string };
//     name: string;
//     surname: string;
//     email: string;
//     phone?: string;
//     address: string;
//     img?: string;
//     sex: "male" | "female";
//     subject: string;
//     birthday: string | Date;
//     gradeLevel: "primary" | "middle" | "high";
// }

// export const createTeacher = async (formData: FormData): Promise<{ message: string }> => {
//     try {
//         const res = await axiosConfig.post("/teachers", formData);
//         return res.data;
//     } catch (error) {
//         console.error("[TEACHER_CREATE_ERROR]:", error);
//         throw new Error("Teacher creation failed.");
//     }
// };

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
//             name: t.name,
//             surname: t.surname,
//             email: t.email,
//             phone: t.phone,
//             address: t.address,
//             img: t.img,
//             sex: t.sex,
//             subject: t.subject,
//             birthday: typeof t.birthday === "string" ? t.birthday : t.birthday.toISOString(),
//             gradeLevel: t.gradeLevel,
//         }));
//     } catch (err) {
//         console.error("[CLIENT] FETCH_TEACHERS_BY_GRADE_AND_SUBJECT_ERROR:", err);
//         return [];
//     }
// }

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

// export async function fetchMyTeacherProfile(id: string): Promise<IUserTeacher> {
//     const res = await axiosConfig.get<IUserTeacher>(`/teachers/${id}`);
//     if (!res.status.toString().startsWith("2")) {
//         throw new Error(`Load teacher failed: ${res.statusText}`);
//     }
//     return res.data;
// }

// src/action/client/teacher.ts
import axiosConfig from "./axiosConfig";
import type { IUserTeacher, Sex, IScheduleEntry } from "@/types/user";
import { getGradeLevelFromGrade } from "@/lib/gradeLessons";

interface RawTeacher {
    _id: { toString(): string };
    username: string;
    name: string;
    surname: string;
    email: string;
    phone?: string;
    address: string;
    img?: string;
    sex: Sex;
    subject: string;
    birthday: string | Date;
    gradeLevel: "primary" | "middle" | "high";
}

/**
 * Create a new teacher.
 */
export const createTeacher = async (formData: FormData): Promise<{ message: string }> => {
    try {
        const res = await axiosConfig.post("/teachers", formData);
        return res.data;
    } catch (error) {
        console.error("[TEACHER_CREATE_ERROR]:", error);
        throw new Error("Teacher creation failed.");
    }
};

/**
 * Update an existing teacher by ID.
 */
export const updateTeacher = async (
    id: string,
    formData: FormData
): Promise<{ message: string }> => {
    try {
        const res = await axiosConfig.put(`/teachers/${id}`, formData);
        return res.data;
    } catch (error) {
        console.error("[TEACHER_UPDATE_ERROR]:", error);
        throw new Error("Teacher update failed.");
    }
};

/**
 * Fetch teachers eligible for a given gradeLevel & subject.
 * Returns IUserTeacher[], so we must supply `role` and `schedule`.
 */
export async function getEligibleTeachersByGradeAndLesson(
    gradeLevel: string,
    subject: string
): Promise<IUserTeacher[]> {
    try {
        const res = await axiosConfig.get<RawTeacher[]>("/teachers/by-grade-level", {
            params: { gradeLevel, subject },
        });
        console.log("[CLIENT] raw teachers for", gradeLevel, subject, "→", res.data);

        return res.data.map((t) => ({
            id: t._id.toString(),
            username: t.username,
            role: "teacher",
            name: t.name,
            surname: t.surname,
            email: t.email,
            phone: t.phone ?? "",
            address: t.address,
            img: t.img,
            sex: t.sex,
            subject: t.subject,
            birthday: typeof t.birthday === "string" ? new Date(t.birthday) : t.birthday,
            gradeLevel: t.gradeLevel,
            schedule: [] as IScheduleEntry[],
        }));
    } catch (err) {
        console.error("[CLIENT] FETCH_TEACHERS_BY_GRADE_AND_SUBJECT_ERROR:", err);
        return [];
    }
}

/**
 * Fetch paginated teachers for a given student-grade.
 */
export async function fetchTeachers(grade: string): Promise<IUserTeacher[]> {
    const gradeLevel = getGradeLevelFromGrade(grade);
    try {
        const res = await axiosConfig.get<{
            data: IUserTeacher[];
            total: number;
            page: number;
            totalPages: number;
        }>("/teachers", {
            params: { gradeLevel },
        });
        return res.data.data;
    } catch (error) {
        console.error("[FETCH_TEACHERS_BY_GRADE_ERROR]:", error);
        return [];
    }
}

/**
 * Fetch the currently-logged-in teacher’s profile.
 */
export async function fetchMyTeacherProfile(id: string): Promise<IUserTeacher> {
    const res = await axiosConfig.get<IUserTeacher>(`/teachers/${id}`);
    if (!res.status.toString().startsWith("2")) {
        throw new Error(`Load teacher failed: ${res.statusText}`);
    }
    // ensure birthday is a Date
    const t = res.data;
    return {
        ...t,
        birthday: new Date(t.birthday),
    };
}
