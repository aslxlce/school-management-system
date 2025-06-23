import axiosConfig from "./axiosConfig";

export const createClass = async (data: Omit<IClass, "id">): Promise<void> => {
    try {
        await axiosConfig.post("/classes", data);
        console.log("Class created successfully");
    } catch (error) {
        console.error("Error creating class:", error);
        throw error;
    }
};

export interface IClassLite {
    _id: string;
    name: string;
}

export const fetchClassesByGrade = async (grade: string) => {
    if (!grade) return [];
    const { data } = await axiosConfig.get<IClassLite[]>("/classes", {
        params: { grade },
    });
    return data;
};

export interface IScheduleEntry {
    day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
    startTime: string;
    endTime: string;
    subject: string;
    classId: string;
    teacherId: string;
}

export interface IClassWithSchedule {
    id: string;
    name: string;
    grade: string;
    schedule: IScheduleEntry[];
}

/** Fetch a class (with its schedule) by ID */
export async function fetchClassByIdClient(id: string): Promise<IClassWithSchedule> {
    const res = await axiosConfig.get<IClassWithSchedule>(`/classes/${id}`);
    if (res.status < 200 || res.status >= 300) {
        throw new Error(`Failed to load class ${id}: ${res.statusText}`);
    }
    return res.data;
}
