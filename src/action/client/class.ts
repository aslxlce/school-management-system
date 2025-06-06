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
