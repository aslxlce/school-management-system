// types/react-big-calendar.d.ts
import { CalendarProps as OriginalCalendarProps } from "react-big-calendar";

declare module "react-big-calendar" {
    interface CalendarProps<EventType = unknown> extends OriginalCalendarProps<EventType> {
        excludedDays?: number[];
    }
}
