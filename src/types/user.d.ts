declare interface IUserBase {
    id: string;
    username: string;
    role: "student" | "admin" | "teacher" | "parent";
}

declare interface IUserTeacher {
    username: string;
    name: string;
    surname: string;
    email: string;
    phone: number;
    address: string;
    img: string;
    sex: "male" | "female";
    subject: string;
    birthday: date;
}
