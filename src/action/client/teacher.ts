import { getGradeLevelFromGrade } from "@/lib/gradeLessons";
import axiosConfig from "./axiosConfig";

export const createTeacher = async (formData: FormData): Promise<{ message: string }> => {
    try {
        const res = await axiosConfig.post("/teachers", formData); // now works
        return res.data;
    } catch (error) {
        console.error("[TEACHER_CREATE_ERROR]:", error);
        throw new Error("Teacher creation failed.");
    }
};

export const updateTeacher = async (id: string, formData: FormData) => {
    try {
        const res = await axiosConfig.put(`/teachers/${id}`, formData);
        return res.data;
    } catch (error) {
        console.log(error);
        throw new Error("Teacher update failed.");
    }
};

// export async function getEligibleTeachersByGradeAndLesson(
//     grade: string,
//     subject: string
// ): Promise<IUserTeacher[]> {
//     const gradeLevel = getGradeLevelFromGrade(grade);

//     try {
//         const { data } = await axiosConfig.get<IUserTeacher[]>("/api/teachers/by-grade-level", {
//             params: {
//                 gradeLevel,
//                 subject,
//             },
//         });

//         return data;
//     } catch (error) {
//         console.error("Failed to fetch teachers:", error);
//         return [];
//     }
// }

export async function getEligibleTeachersByGradeAndLesson(
    grade: string,
    subject: string
): Promise<IUserTeacher[]> {
    try {
        const gradeLevel = getGradeLevelFromGrade(grade);

        const { data } = await axiosConfig.get<IUserTeacher[]>("/teachers/by-grade-level", {
            params: {
                gradeLevel,
                subject,
            },
        });

        return data;
    } catch (error) {
        console.error("Failed to fetch eligible teachers:", error);
        return [];
    }
}

export const fetchTeachers = async (grade: string): Promise<IUserTeacher[]> => {
    const res = await axiosConfig.get(`/teachers/by-grade-level?grade=${grade}`);
    return res.data;
};
