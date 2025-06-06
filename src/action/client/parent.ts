import axiosConfig from "./axiosConfig";

export interface IParentLite {
    _id: string;
    name: string;
    surname: string;
}

export const fetchParentsByName = async (q: string) => {
    if (!q.trim()) return [];
    const { data } = await axiosConfig.get<IParentLite[]>("/parents", {
        params: { search: q.trim() },
    });
    return data;
};

export interface ParentPayload {
    username: string;
    password: string;
    email: string;
    name: string;
    surname: string;
    phone: string;
    address: string;
    childrenIds?: string[];
}

export const createParent = async (data: ParentPayload) => {
    console.log("🟢 [createParent] called with:", data);
    try {
        const res = await axiosConfig.post("/parents", data);
        console.log("🟢 [createParent] response:", res.data);
        return res.data;
    } catch (err) {
        console.error("🔴 [createParent] caught error:", err);
        throw err;
    }
};
