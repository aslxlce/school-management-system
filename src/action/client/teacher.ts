// action/client/user.ts
import axiosConfig from "./axiosConfig";

export const createTeacher = async (formData: FormData) => {
    try {
        const res = await axiosConfig.post("/teacher", formData);
        return res.data;
    } catch (error) {
        console.log(error);
        throw new Error("Teacher creation failed.");
    }
};

export const updateTeacher = async (id: string, formData: FormData) => {
    try {
        const res = await axiosConfig.put(`/teacher/${id}`, formData);
        return res.data;
    } catch (error) {
        console.log(error);
        throw new Error("Teacher update failed.");
    }
};
