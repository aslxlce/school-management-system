import axiosConfig from "./axiosConfig";
import { getGradeLevelFromGrade } from "@/lib/gradeLessons";

export interface IUserTeacher {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone?: string;
    address: string;
    img?: string;
    sex: "male" | "female";
    subject: string;
    birthday: string;
    gradeLevel: "primary" | "middle" | "high";
}

interface RawTeacher {
    _id: { toString(): string };
    name: string;
    surname: string;
    email: string;
    phone?: string;
    address: string;
    img?: string;
    sex: "male" | "female";
    subject: string;
    birthday: string | Date;
    gradeLevel: "primary" | "middle" | "high";
}

export const createTeacher = async (formData: FormData): Promise<{ message: string }> => {
    try {
        const res = await axiosConfig.post("/teachers", formData);
        return res.data;
    } catch (error) {
        console.error("[TEACHER_CREATE_ERROR]:", error);
        throw new Error("Teacher creation failed.");
    }
};

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
            name: t.name,
            surname: t.surname,
            email: t.email,
            phone: t.phone,
            address: t.address,
            img: t.img,
            sex: t.sex,
            subject: t.subject,
            birthday: typeof t.birthday === "string" ? t.birthday : t.birthday.toISOString(),
            gradeLevel: t.gradeLevel,
        }));
    } catch (err) {
        console.error("[CLIENT] FETCH_TEACHERS_BY_GRADE_AND_SUBJECT_ERROR:", err);
        return [];
    }
}

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
