type DayOfWeek = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday";

declare interface IScheduleEntry {
    day: DayOfWeek;
    startTime: string; // e.g., "08:00"
    endTime: string; // e.g., "09:30"
    subject: string;
    classId: string;
    teacherId: string;
}
