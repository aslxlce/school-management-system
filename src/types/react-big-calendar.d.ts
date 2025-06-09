// types/react-big-calendar.d.ts
import { CalendarProps as OriginalCalendarProps } from "react-big-calendar";

declare module "react-big-calendar" {
    // Use unknown instead of any for the EventType, and give excludedDays a number[] signature
    interface CalendarProps<EventType = unknown> extends OriginalCalendarProps<EventType> {
        excludedDays?: number[];
    }
}
