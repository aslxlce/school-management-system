// // src/action/client/student.ts
// import axios, { AxiosError } from "axios";
// import axiosConfig from "./axiosConfig";
// import type { Grade, IUserStudent } from "@/types/user";

// export const updateStudent = async (
//     id: string,
//     formData: FormData
// ): Promise<{ message: string }> => {
//     const payload = Object.fromEntries(formData.entries());
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
//  * Fetch students eligible for a class of the given grade:
//  * - correct grade
//  * - active / unassigned filtering is done on the server
//  */
// export async function getEligibleStudentsByGrade(gradeFilter: string): Promise<IUserStudent[]> {
//     try {
//         const trimmed = gradeFilter.trim();
//         if (!trimmed) return [];

//         const res = await axiosConfig.get<RawStudentApi[]>("/students/by-grade", {
//             params: { grade: trimmed },
//         });

//         const apiStudents = res.data;
//         console.log("[CLIENT] raw eligible students for grade", trimmed, "→", apiStudents);

//         if (!Array.isArray(apiStudents)) {
//             console.error("[getEligibleStudentsByGrade] Non-array response:", apiStudents);
//             return [];
//         }

//         const mapped: IUserStudent[] = apiStudents
//             .map((s): IUserStudent | null => {
//                 const id = s._id ?? s.id;
//                 if (!id) {
//                     console.warn("[getEligibleStudentsByGrade] Missing id/_id for student:", s);
//                     return null;
//                 }

//                 return {
//                     id,
//                     username: s.username ?? "", // you don't really need username here
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
//                     birthday: typeof s.birthday === "string" ? new Date(s.birthday) : s.birthday,
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

// // you were re-exporting this; keep it if something else relies on it
// export const fetchStudents = getEligibleStudentsByGrade;

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
//     return {
//         ...res.data,
//         birthday: new Date(res.data.birthday),
//     };
// }

// export async function createStudent(formData: FormData): Promise<IUserStudent> {
//     // Log exactly what we're sending:
//     const entries: Array<[string, string]> = Array.from(formData.entries()).map(([key, value]) => {
//         if (value instanceof FileList) {
//             return [key, `[FileList:${value.length}]`];
//         } else {
//             return [key, String(value)];
//         }
//     });
//     console.log("Creating student, FormData entries:", entries);

//     try {
//         // Send the raw FormData; let Axios set the multipart headers
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

//=======================================================================================

// // src/action/client/student.ts
// import axios, { AxiosError } from "axios";
// import axiosConfig from "./axiosConfig";
// import type { Grade, IUserStudent } from "@/types/user";

// export const updateStudent = async (
//     id: string,
//     formData: FormData
// ): Promise<{ message: string }> => {
//     const payload = Object.fromEntries(formData.entries());
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
//  * Fetch students eligible for a class of the given grade:
//  * - correct grade
//  * - active / unassigned filtering is done on the server
//  * - if classId is provided, includes students already assigned to that class
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
//                 const id = s._id ?? s.id;
//                 if (!id) {
//                     console.warn("[getEligibleStudentsByGrade] Missing id/_id for student:", s);
//                     return null;
//                 }

//                 return {
//                     id,
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
//                     birthday: typeof s.birthday === "string" ? new Date(s.birthday) : s.birthday,
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

// // you were re-exporting this; keep it if something else relies on it
// export const fetchStudents = getEligibleStudentsByGrade;

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
//     return {
//         ...res.data,
//         birthday: new Date(res.data.birthday),
//     };
// }

// export async function createStudent(formData: FormData): Promise<IUserStudent> {
//     // Log exactly what we're sending:
//     const entries: Array<[string, string]> = Array.from(formData.entries()).map(([key, value]) => {
//         if (value instanceof FileList) {
//             return [key, `[FileList:${value.length}]`];
//         }
//         return [key, String(value)];
//     });
//     console.log("Creating student, FormData entries:", entries);

//     try {
//         // Send the raw FormData; let Axios set the multipart headers
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

export const updateStudent = async (
    id: string,
    formData: FormData
): Promise<{ message: string }> => {
    const payload = Object.fromEntries(formData.entries());
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
