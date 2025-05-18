export interface UserType {
    _id: string;
    username: string;
    email: string;
    role: "user" | "admin";
    createdAt: string;
    updatedAt: string;
}
