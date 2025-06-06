// declare interface IClass {
//     id: string;
//     name: string;
//     grade: number;
//     teacherIds?: IUserTeacher[];
//     studentIds?: IUserStudent[];
//     supervisor?: IUserTeacher;
//     lessons?: string[];
//     schedule?: string;
// }

declare interface IClass {
    id: string;
    name: string;
    grade: string; // e.g., "6", "10S", "12Mt"
    teacherIds?: IUserTeacher[];
    studentIds?: IUserStudent[];
    supervisor?: IUserTeacher;
    lessons?: {
        lessonId: string;
        teacherId: string;
    }[];
    schedule?: string;
}
