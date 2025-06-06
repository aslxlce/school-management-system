import axiosConfig from "./axiosConfig";

export const createStudent = async (formData: FormData) => {
    try {
        const res = await axiosConfig.post("/students", formData);
        return res.data;
    } catch (error) {
        console.log(error);
        throw new Error("Student creation failed.");
    }
};

export const updateStudent = async (id: string, formData: FormData) => {
    try {
        const res = await axiosConfig.put(`/students/${id}`, formData);
        return res.data;
    } catch (error) {
        console.log(error);
        throw new Error("Student update failed.");
    }
};

export async function getEligibleStudentsByGrade(grade: string): Promise<IUserStudent[]> {
    try {
        const { data } = await axiosConfig.get<IUserStudent[]>("/students/by-grade", {
            params: {
                grade,
            },
        });

        return data;
    } catch (error) {
        console.error("Failed to fetch students:", error);
        return [];
    }
}

export const fetchStudents = async (grade: string): Promise<IUserStudent[]> => {
    const res = await axiosConfig.get(`/students/by-grade?grade=${grade}`);
    return res.data;
};

export interface StudentOption {
    _id: string;
    name: string;
    surname: string;
    username: string;
}

/**
 * Fetch a list of students whose name or surname matches the given query.
 * Returns an array of { _id, name, surname, username }.
 */
export async function fetchStudentsByName(q: string): Promise<StudentOption[]> {
    if (!q.trim()) {
        return [];
    }

    const response = await axiosConfig.get<StudentOption[]>(
        `/students?search=${encodeURIComponent(q)}`
    );
    return response.data;
}
