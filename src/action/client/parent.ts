// import axiosConfig from "./axiosConfig";

// // export interface IParentLite {
// //     _id: string;
// //     name: string;
// //     surname: string;
// // }

// // export const fetchParentsByName = async (q: string) => {
// //     if (!q.trim()) return [];
// //     const { data } = await axiosConfig.get<IParentLite[]>("/parents", {
// //         params: { search: q.trim() },
// //     });
// //     return data;
// // };

// export interface IStudentLite {
//     _id: string;
//     username: string;
//     name: string;
//     surname: string;
// }

// export const fetchStudentsByName = async (q: string): Promise<IStudentLite[]> => {
//     if (!q.trim()) return [];
//     const { data } = await axiosConfig.get<IStudentLite[]>("/students", {
//         params: { search: q.trim() },
//     });
//     return data;
// };

// export interface ParentPayload {
//     username: string;
//     password: string;
//     email: string;
//     name: string;
//     surname: string;
//     phone: string;
//     address: string;
//     childrenIds?: string[];
// }

// export const createParent = async (data: ParentPayload) => {
//     console.log("🟢 [createParent] called with:", data);
//     try {
//         const res = await axiosConfig.post("/parents", data);
//         console.log("🟢 [createParent] response:", res.data);
//         return res.data;
//     } catch (err) {
//         console.error("🔴 [createParent] caught error:", err);
//         throw err;
//     }
// };

// src/action/client/parent.ts
import axiosConfig from "./axiosConfig";

export interface IParentLite {
    _id: string;
    name: string;
    surname: string;
}

export const fetchParentsByName = async (q: string): Promise<IParentLite[]> => {
    const query = q.trim();
    if (!query) return [];

    const { data } = await axiosConfig.get<IParentLite[]>("/parents", {
        params: { search: query },
    });

    return Array.isArray(data) ? data : [];
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

export const updateParent = async (id: string, data: ParentPayload) => {
    console.log("🟣 [updateParent] called with:", id, data);
    try {
        const res = await axiosConfig.put(`/parents/${id}`, data);
        console.log("🟣 [updateParent] response:", res.data);
        return res.data;
    } catch (err) {
        console.error("🔴 [updateParent] caught error:", err);
        throw err;
    }
};
