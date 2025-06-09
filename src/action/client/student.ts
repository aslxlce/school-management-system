import axiosConfig from "./axiosConfig";

export interface IUserStudent {
    id: string; // ← this must come from raw._id.toString()
    name: string;
    surname: string;
    email?: string;
    img?: string;
    phone?: string;
    grade: string;
    classId?: string;
    address: string;
    parentId?: string;
    birthday: string;
    sex: "male" | "female";
}

export const createStudent = async (formData: FormData): Promise<{ message: string }> => {
    try {
        const res = await axiosConfig.post("/students", formData);
        return res.data;
    } catch (error) {
        console.error("[STUDENT_CREATE_ERROR]:", error);
        throw new Error("Student creation failed.");
    }
};

export const updateStudent = async (
    id: string,
    formData: FormData
): Promise<{ message: string }> => {
    try {
        const res = await axiosConfig.put(`/students/${id}`, formData);
        return res.data;
    } catch (error) {
        console.error("[STUDENT_UPDATE_ERROR]:", error);
        throw new Error("Student update failed.");
    }
};

interface RawStudent {
    _id: { toString(): string };
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

export async function getEligibleStudentsByGrade(grade: string): Promise<IUserStudent[]> {
    try {
        const res = await axiosConfig.get<RawStudent[]>("/students/by-grade", {
            params: { grade },
        });
        return res.data.map((s) => ({
            id: s._id.toString(),
            name: s.name,
            surname: s.surname,
            email: s.email,
            img: s.img,
            phone: s.phone,
            grade: s.grade,
            classId: s.classId?.toString(),
            address: s.address,
            parentId: s.parentId?.toString(),
            birthday: typeof s.birthday === "string" ? s.birthday : s.birthday.toISOString(),
            sex: s.sex,
        }));
    } catch (err) {
        console.error("[FETCH_STUDENTS_BY_GRADE_ERROR]:", err);
        return [];
    }
}

export const fetchStudents = getEligibleStudentsByGrade;

export interface StudentOption {
    _id: string;
    name: string;
    surname: string;
    username: string;
}
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
        return res.data.data; // unwrap
    } catch (err) {
        console.error("[SEARCH_STUDENTS_BY_NAME_ERROR]:", err);
        return [];
    }
}
