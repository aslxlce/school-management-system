// types/events.d.ts

declare interface IEvent {
    id?: string; // filled by MongoDB
    title: string; // event title
    start: Date; // start date/time
    end: Date; // end date/time
    allDay?: boolean; // defaults to false
    description?: string; // optional longer description
    createdBy: string; // user ID or role who created this event
}
