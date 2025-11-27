declare interface IClass {
    id: string;
    name: string;
    grade: string;
    teacherIds?: string[];
    studentIds?: string[];
    supervisor?: string;
    lessons?: {
        lessonId: string;
        teacherId: string;
    }[];

    schedule?: string;
}
