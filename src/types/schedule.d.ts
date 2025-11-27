export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";

declare interface IScheduleEntry {
    day: DayOfWeek;
    startTime: string;
    endTime: string;
    subject: string;
    classId: string;
    teacherId: string;
}
