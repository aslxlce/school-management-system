declare interface ILesson {
    id: string;
    name: string;
    subject: string;
    gradeRange: {
        from: number;
        to: number;
    };
    assignedTeacher?: IUserTeacher;
    schedule?: string;
}
