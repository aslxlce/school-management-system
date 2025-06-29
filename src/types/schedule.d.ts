// type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";

// declare interface IScheduleEntry {
//     day: DayOfWeek;
//     startTime: string; // e.g., "08:00"
//     endTime: string; // e.g., "09:30"
//     subject: string;
//     classId: string;
//     teacherId: string;
// }

export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";

declare interface IScheduleEntry {
    day: DayOfWeek;
    startTime: string;
    endTime: string;
    subject: string;
    classId: string;
    teacherId: string;
}
