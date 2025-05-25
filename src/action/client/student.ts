import axiosConfig from "./axiosConfig";

export const createStudent = async (formData: FormData) => {
    try {
        const res = await axiosConfig.post("/student", formData);
        return res.data;
    } catch (error) {
        console.log(error);
        throw new Error("Student creation failed.");
    }
};

export const updateStudent = async (id: string, formData: FormData) => {
    try {
        const res = await axiosConfig.put(`/student/${id}`, formData);
        return res.data;
    } catch (error) {
        console.log(error);
        throw new Error("Student update failed.");
    }
};
