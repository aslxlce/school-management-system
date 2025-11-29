// // src/action/client/student.ts
// import axios, { AxiosError } from "axios";
// import axiosConfig from "./axiosConfig";
// import type { Grade, IUserStudent } from "@/types/user";

// /** Helper: convert a File to base64 string */
// function fileToBase64(file: File): Promise<string> {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = () => {
//             if (typeof reader.result === "string") {
//                 resolve(reader.result);
//             } else {
//                 reject(new Error("Failed to read file as base64."));
//             }
//         };
//         reader.onerror = () => reject(reader.error ?? new Error("FileReader error"));
//         reader.readAsDataURL(file);
//     });
// }

// /**
//  * Update an existing student.
//  * We send JSON to /api/students/[id]. If a new image is selected,
//  * we send it as a base64 string in `img`.
//  */
// export const updateStudent = async (
//     id: string,
//     formData: FormData
// ): Promise<{ message: string }> => {
//     const payload: Record<string, unknown> = {};
//     let imgFile: File | null = null;

//     for (const [key, value] of formData.entries()) {
//         if (key === "img" && value instanceof File && value.size > 0) {
//             imgFile = value;
//             continue;
//         }

//         if (key === "birthday") {
//             payload.birthday = new Date(String(value)).toISOString();
//             continue;
//         }

//         payload[key] = value;
//     }

//     if (imgFile) {
//         payload.img = await fileToBase64(imgFile);
//     }

//     console.log(`Updating student ${id} with payload:`, payload);

//     try {
//         const res = await axiosConfig.put<{ message: string }>(`/students/${id}`, payload, {
//             headers: { "Content-Type": "application/json" },
//         });
//         return res.data;
//     } catch (error) {
//         console.error("[STUDENT_UPDATE_ERROR]:", error);
//         throw new Error("Student update failed.");
//     }
// };

// /**
//  * Shape returned by /api/students/by-grade.
//  * It supports both `_id` and `id` to be safe.
//  */
// interface RawStudentApi {
//     _id?: string;
//     id?: string;
//     username?: string;
//     name: string;
//     surname: string;
//     email?: string;
//     img?: string;
//     phone?: string;
//     grade: string;
//     classId?: string;
//     address: string;
//     parentId?: string;
//     birthday: string | Date;
//     sex: "male" | "female";
// }

// /**
//  * Fetch students eligible for a class of the given grade.
//  */
// export async function getEligibleStudentsByGrade(
//     gradeFilter: string,
//     classId?: string
// ): Promise<IUserStudent[]> {
//     try {
//         const trimmed = gradeFilter.trim();
//         if (!trimmed) return [];

//         const params: Record<string, string> = { grade: trimmed };
//         if (classId && classId.trim().length > 0) {
//             params.classId = classId.trim();
//         }

//         const res = await axiosConfig.get<RawStudentApi[]>("/students/by-grade", {
//             params,
//         });

//         const apiStudents = res.data;
//         console.log("[CLIENT] raw eligible students for grade", trimmed, "→", apiStudents);

//         if (!Array.isArray(apiStudents)) {
//             console.error("[getEligibleStudentsByGrade] Non-array response:", apiStudents);
//             return [];
//         }

//         const mapped: IUserStudent[] = apiStudents
//             .map((s): IUserStudent | null => {
//                 const sid = s._id ?? s.id;
//                 if (!sid) {
//                     console.warn("[getEligibleStudentsByGrade] Missing id/_id for student:", s);
//                     return null;
//                 }

//                 return {
//                     id: sid,
//                     username: s.username ?? "",
//                     role: "student",
//                     name: s.name,
//                     surname: s.surname,
//                     email: s.email,
//                     img: s.img,
//                     phone: s.phone ?? "",
//                     grade: s.grade as Grade,
//                     classId: s.classId ?? "",
//                     address: s.address,
//                     parentId: s.parentId,
//                     birthday:
//                         typeof s.birthday === "string" ? s.birthday : s.birthday.toISOString(),
//                     sex: s.sex,
//                     schedule: [],
//                 };
//             })
//             .filter((stu): stu is IUserStudent => stu !== null);

//         return mapped;
//     } catch (err) {
//         console.error("[FETCH_STUDENTS_BY_GRADE_ERROR]:", err);
//         return [];
//     }
// }

// // re-export alias if used elsewhere
// export const fetchStudentsByGrade = getEligibleStudentsByGrade;

// export interface StudentOption {
//     _id: string;
//     name: string;
//     surname: string;
//     username: string;
// }

// export interface IStudentLite {
//     _id?: string;
//     id?: string;
//     username: string;
//     name: string;
//     surname: string;
// }

// export const fetchStudentsByName = async (q: string): Promise<IStudentLite[]> => {
//     const query = q.trim();
//     if (!query) return [];

//     const res = await axiosConfig.get<IStudentLite[]>("/students", {
//         params: { search: query },
//     });

//     const data = res.data;
//     if (!Array.isArray(data)) {
//         console.error("[fetchStudentsByName] Unexpected response:", data);
//         return [];
//     }

//     return data;
// };

// export async function fetchMyStudentProfile(id: string): Promise<IUserStudent> {
//     const res = await axiosConfig.get<IUserStudent>(`/students/${id}`);
//     if (!res.status.toString().startsWith("2")) {
//         throw new Error(`Failed to load student ${id}: ${res.statusText}`);
//     }
//     // birthday already a string from API; just return it
//     return res.data;
// }

// export async function createStudent(formData: FormData): Promise<IUserStudent> {
//     const entries: Array<[string, string]> = Array.from(formData.entries()).map(([key, value]) => {
//         if (value instanceof FileList) {
//             return [key, `[FileList:${value.length}]`];
//         }
//         return [key, String(value)];
//     });
//     console.log("Creating student, FormData entries:", entries);

//     try {
//         const res = await axiosConfig.post<IUserStudent>("/students", formData);
//         return res.data;
//     } catch (err: unknown) {
//         console.error("[STUDENT_CREATE_ERROR]:", err);

//         let message = "Student creation failed.";
//         if (axios.isAxiosError(err)) {
//             const axiosErr = err as AxiosError<{ message?: string }>;
//             if (axiosErr.response?.data?.message) {
//                 message = axiosErr.response.data.message;
//             } else if (axiosErr.message) {
//                 message = axiosErr.message;
//             }
//         } else if (err instanceof Error) {
//             message = err.message;
//         }

//         throw new Error(message);
//     }
// }

// src/action/client/student.ts
import axios, { AxiosError } from "axios";
import axiosConfig from "./axiosConfig";
import type { Grade, IUserStudent } from "@/types/user";

// Payload used when updating a student from the client
export interface StudentUpdatePayload {
    username: string;
    email?: string;
    password?: string;
    name: string;
    surname: string;
    phone?: string;
    address: string;
    sex: "male" | "female";
    birthday: string; // ISO string
    grade: string;
    parentId?: string;
    classId?: string;
    img?: string; // URL or base64
}

export const updateStudent = async (
    id: string,
    payload: StudentUpdatePayload
): Promise<{ message: string }> => {
    console.log(`Updating student ${id} with payload:`, payload);

    try {
        const res = await axiosConfig.put<{ message: string }>(`/students/${id}`, payload, {
            headers: { "Content-Type": "application/json" },
        });
        return res.data;
    } catch (error) {
        console.error("[STUDENT_UPDATE_ERROR]:", error);
        throw new Error("Student update failed.");
    }
};

/**
 * Shape returned by /api/students/by-grade.
 * It supports both `_id` and `id` to be safe.
 */
interface RawStudentApi {
    _id?: string;
    id?: string;
    username?: string;
    name: string;
    surname: string;
    email?: string;
    img?: string;
    phone?: string;
    grade: string;
    classId?: string;
    address: string;
    parentId?: string;
    birthday: string | Date;
    sex: "male" | "female";
}

/**
 * Fetch students eligible for a class of the given grade.
 */
export async function getEligibleStudentsByGrade(
    gradeFilter: string,
    classId?: string
): Promise<IUserStudent[]> {
    try {
        const trimmed = gradeFilter.trim();
        if (!trimmed) return [];

        const params: Record<string, string> = { grade: trimmed };
        if (classId && classId.trim().length > 0) {
            params.classId = classId.trim();
        }

        const res = await axiosConfig.get<RawStudentApi[]>("/students/by-grade", {
            params,
        });

        const apiStudents = res.data;
        console.log("[CLIENT] raw eligible students for grade", trimmed, "→", apiStudents);

        if (!Array.isArray(apiStudents)) {
            console.error("[getEligibleStudentsByGrade] Non-array response:", apiStudents);
            return [];
        }

        const mapped: IUserStudent[] = apiStudents
            .map((s): IUserStudent | null => {
                const id = s._id ?? s.id;
                if (!id) {
                    console.warn("[getEligibleStudentsByGrade] Missing id/_id for student:", s);
                    return null;
                }

                return {
                    id,
                    username: s.username ?? "",
                    role: "student",
                    name: s.name,
                    surname: s.surname,
                    email: s.email,
                    img: s.img,
                    phone: s.phone ?? "",
                    grade: s.grade as Grade,
                    classId: s.classId ?? "",
                    address: s.address,
                    parentId: s.parentId,
                    birthday:
                        typeof s.birthday === "string" ? s.birthday : s.birthday.toISOString(),
                    sex: s.sex,
                    schedule: [],
                };
            })
            .filter((stu): stu is IUserStudent => stu !== null);

        return mapped;
    } catch (err) {
        console.error("[FETCH_STUDENTS_BY_GRADE_ERROR]:", err);
        return [];
    }
}

// re-export alias if used elsewhere
export const fetchStudentsByGrade = getEligibleStudentsByGrade;

export interface StudentOption {
    _id: string;
    name: string;
    surname: string;
    username: string;
}

export interface IStudentLite {
    _id?: string;
    id?: string;
    username: string;
    name: string;
    surname: string;
}

export const fetchStudentsByName = async (q: string): Promise<IStudentLite[]> => {
    const query = q.trim();
    if (!query) return [];

    const res = await axiosConfig.get<IStudentLite[]>("/students", {
        params: { search: query },
    });

    const data = res.data;
    if (!Array.isArray(data)) {
        console.error("[fetchStudentsByName] Unexpected response:", data);
        return [];
    }

    return data;
};

export async function fetchMyStudentProfile(id: string): Promise<IUserStudent> {
    const res = await axiosConfig.get<IUserStudent>(`/students/${id}`);
    if (!res.status.toString().startsWith("2")) {
        throw new Error(`Failed to load student ${id}: ${res.statusText}`);
    }
    // birthday already a string from API; just return it
    return res.data;
}

export async function createStudent(formData: FormData): Promise<IUserStudent> {
    const entries: Array<[string, string]> = Array.from(formData.entries()).map(([key, value]) => {
        if (value instanceof FileList) {
            return [key, `[FileList:${value.length}]`];
        }
        return [key, String(value)];
    });
    console.log("Creating student, FormData entries:", entries);

    try {
        const res = await axiosConfig.post<IUserStudent>("/students", formData);
        return res.data;
    } catch (err: unknown) {
        console.error("[STUDENT_CREATE_ERROR]:", err);

        let message = "Student creation failed.";
        if (axios.isAxiosError(err)) {
            const axiosErr = err as AxiosError<{ message?: string }>;
            if (axiosErr.response?.data?.message) {
                message = axiosErr.response.data.message;
            } else if (axiosErr.message) {
                message = axiosErr.message;
            }
        } else if (err instanceof Error) {
            message = err.message;
        }

        throw new Error(message);
    }
}
