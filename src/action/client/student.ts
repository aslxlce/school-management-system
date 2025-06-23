// // src/action/client/student.ts
// import axiosConfig from "./axiosConfig";
// import type { Grade, IUserStudent } from "@/types/user";

// /**
//  * Create a new student.
//  * @param formData - FormData containing student fields.
//  * @returns A message indicating success.
//  */
// export const createStudent = async (formData: FormData): Promise<{ message: string }> => {
//     try {
//         const res = await axiosConfig.post("/students", formData);
//         return res.data;
//     } catch (error) {
//         console.error("[STUDENT_CREATE_ERROR]:", error);
//         throw new Error("Student creation failed.");
//     }
// };

// /**
//  * Update an existing student.
//  * @param id - The student’s ID.
//  * @param formData - FormData containing updated fields.
//  * @returns A message indicating success.
//  */
// export const updateStudent = async (
//     id: string,
//     formData: FormData
// ): Promise<{ message: string }> => {
//     try {
//         const res = await axiosConfig.put(`/students/${id}`, formData);
//         return res.data;
//     } catch (error) {
//         console.error("[STUDENT_UPDATE_ERROR]:", error);
//         throw new Error("Student update failed.");
//     }
// };

// /** Raw shape returned by the API before mapping. */
// interface RawStudent {
//     _id: { toString(): string };
//     username: string;
//     name: string;
//     surname: string;
//     email?: string;
//     img?: string;
//     phone?: string;
//     grade: string;
//     classId?: { toString(): string };
//     address: string;
//     parentId?: { toString(): string };
//     birthday: string | Date;
//     sex: "male" | "female";
// }

// /**
//  * Fetch students eligible by grade.
//  * @param gradeFilter - Grade string to filter by.
//  * @returns An array of IUserStudent.
//  */
// export async function getEligibleStudentsByGrade(gradeFilter: string): Promise<IUserStudent[]> {
//     try {
//         const res = await axiosConfig.get<RawStudent[]>("/students/by-grade", {
//             params: { grade: gradeFilter },
//         });

//         return res.data.map((s) => ({
//             id: s._id.toString(),
//             username: "", // fill in if available from your API
//             role: "student",
//             name: s.name,
//             surname: s.surname,
//             email: s.email,
//             img: s.img,
//             phone: s.phone ?? "",
//             grade: s.grade as Grade,
//             classId: s.classId?.toString(),
//             address: s.address,
//             parentId: s.parentId?.toString(),
//             birthday: typeof s.birthday === "string" ? new Date(s.birthday) : s.birthday,
//             sex: s.sex,
//         }));
//     } catch (err) {
//         console.error("[FETCH_STUDENTS_BY_GRADE_ERROR]:", err);
//         return [];
//     }
// }

// /** Alias for clarity elsewhere in your components. */
// export const fetchStudents = getEligibleStudentsByGrade;

// /** Shape returned when searching by name. */
// export interface StudentOption {
//     _id: string;
//     name: string;
//     surname: string;
//     username: string;
// }

// /**
//  * Search for students by name.
//  * @param q - Search query string.
//  * @returns An array of StudentOption.
//  */
// export async function fetchStudentsByName(q: string): Promise<StudentOption[]> {
//     if (!q.trim()) return [];

//     try {
//         const res = await axiosConfig.get<{
//             data: StudentOption[];
//             total: number;
//             page: number;
//             totalPages: number;
//         }>("/students", {
//             params: { search: q.trim() },
//         });

//         return res.data.data;
//     } catch (err) {
//         console.error("[SEARCH_STUDENTS_BY_NAME_ERROR]:", err);
//         return [];
//     }
// }

// export async function fetchMyStudentProfile(id: string): Promise<IUserStudent> {
//     const res = await axiosConfig.get<IUserStudent>(`/students/${id}`);
//     if (!res.status.toString().startsWith("2")) {
//         throw new Error(`Failed to load student ${id}: ${res.statusText}`);
//     }
//     return res.data;
// }

// src/action/client/student.ts
import axiosConfig from "./axiosConfig";
import type { Grade, IUserStudent } from "@/types/user";

/**
 * Create a new student.
 * @param formData - FormData containing student fields.
 * @returns The created student record.
 */
export const createStudent = async (formData: FormData): Promise<IUserStudent> => {
    // Convert FormData into a plain object
    const payload = Object.fromEntries(formData.entries());
    console.log("Creating student with payload:", payload);

    try {
        const res = await axiosConfig.post<IUserStudent>("/students", payload, {
            headers: { "Content-Type": "application/json" },
        });
        return res.data;
    } catch (error) {
        console.error("[STUDENT_CREATE_ERROR]:", error);
        throw new Error("Student creation failed.");
    }
};

/**
 * Update an existing student.
 * @param id - The student’s ID.
 * @param formData - FormData containing updated fields.
 * @returns A message indicating success.
 */
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

/** Raw shape returned by the API before mapping. */
interface RawStudent {
    _id: { toString(): string };
    username: string;
    name: string;
    surname: string;
    email?: string;
    img?: string;
    phone?: string;
    grade: string;
    classId?: { toString(): string };
    address: string;
    parentId?: { toString(): string };
    birthday: string | Date;
    sex: "male" | "female";
}

/**
 * Fetch students eligible by grade.
 * @param gradeFilter - Grade string to filter by.
 * @returns An array of IUserStudent.
 */
export async function getEligibleStudentsByGrade(gradeFilter: string): Promise<IUserStudent[]> {
    try {
        const res = await axiosConfig.get<RawStudent[]>("/students/by-grade", {
            params: { grade: gradeFilter },
        });

        return res.data.map((s) => ({
            id: s._id.toString(),
            username: "", // fill in if available from your API
            role: "student",
            name: s.name,
            surname: s.surname,
            email: s.email,
            img: s.img,
            phone: s.phone ?? "",
            grade: s.grade as Grade,
            classId: s.classId?.toString(),
            address: s.address,
            parentId: s.parentId?.toString(),
            birthday: typeof s.birthday === "string" ? new Date(s.birthday) : s.birthday,
            sex: s.sex,
        }));
    } catch (err) {
        console.error("[FETCH_STUDENTS_BY_GRADE_ERROR]:", err);
        return [];
    }
}

/** Alias for clarity elsewhere in your components. */
export const fetchStudents = getEligibleStudentsByGrade;

/** Shape returned when searching by name. */
export interface StudentOption {
    _id: string;
    name: string;
    surname: string;
    username: string;
}

/**
 * Search for students by name.
 * @param q - Search query string.
 * @returns An array of StudentOption.
 */
export async function fetchStudentsByName(q: string): Promise<StudentOption[]> {
    if (!q.trim()) return [];

    try {
        const res = await axiosConfig.get<{
            data: StudentOption[];
            total: number;
            page: number;
            totalPages: number;
        }>("/students", {
            params: { search: q.trim() },
        });

        return res.data.data;
    } catch (err) {
        console.error("[SEARCH_STUDENTS_BY_NAME_ERROR]:", err);
        return [];
    }
}

/**
 * Fetch the currently authenticated student’s full profile.
 * @param id - The student’s ID.
 * @returns An IUserStudent object.
 */
export async function fetchMyStudentProfile(id: string): Promise<IUserStudent> {
    const res = await axiosConfig.get<IUserStudent>(`/students/${id}`);
    if (!res.status.toString().startsWith("2")) {
        throw new Error(`Failed to load student ${id}: ${res.statusText}`);
    }
    return res.data;
}
