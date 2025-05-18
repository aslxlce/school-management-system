export interface UserType {
    _id: string;
    username: string;
    email: string;
    role: "student" | "admin" | "teacher" | "parent";
    name: string;
    surname: string;
    createdAt: string;
    updatedAt: string;
}
