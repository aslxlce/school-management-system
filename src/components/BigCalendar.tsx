// "use client";

// import React, { useState } from "react";
// import {
//     Calendar,
//     momentLocalizer,
//     View,
//     Views,
//     CalendarProps,
//     DateLocalizer,
//     Formats,
// } from "react-big-calendar";
// import moment from "moment";
// import "react-big-calendar/lib/css/react-big-calendar.css";

// // 1) Make sure week starts on Monday
// moment.updateLocale("en", {
//     week: {
//         dow: 1, // Monday is day 1
//     },
// });

// const localizer: DateLocalizer = momentLocalizer(moment);

// export interface CalendarEvent {
//     title: string;
//     start: Date;
//     end: Date;
//     allDay?: boolean;
// }

// interface BigCalendarProps {
//     events: CalendarEvent[];
// }

// const BigCalendar: React.FC<BigCalendarProps> = ({ events }) => {
//     // 2) Track view & date so navigation works
//     const [view, setView] = useState<View>(Views.WORK_WEEK);
//     const [date, setDate] = useState<Date>(new Date());

//     // 3) Drop minutes, show only hour + AM/PM
//     const formats: Formats = {
//         // gutter on the left
//         timeGutterFormat: (date: Date) => moment(date).format("h A"),
//         // event label in the slot
//         eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
//             `${moment(start).format("h A")} – ${moment(end).format("h A")}`,
//     };

//     const props: CalendarProps<CalendarEvent> = {
//         localizer,
//         events,
//         startAccessor: "start",
//         endAccessor: "end",

//         // 4) Only work_week (Mon–Fri) and day views
//         views: [Views.WORK_WEEK, Views.DAY],
//         view,
//         date,

//         onView: (v) => setView(v as View),
//         onNavigate: (newDate) => setDate(newDate),

//         min: new Date(0, 0, 0, 8, 0), // 08:00
//         max: new Date(0, 0, 0, 18, 0), // 18:00

//         style: { height: "100%" },

//         // 5) And our custom formats
//         formats,
//     };

//     return <Calendar<CalendarEvent> {...props} />;
// };

// export default BigCalendar;

"use client";

import React, { useState } from "react";
import { Calendar, momentLocalizer, View, Views, CalendarProps } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

export interface CalendarEvent {
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
}

interface BigCalendarProps {
    events: CalendarEvent[];
    // optional control from parent
    view?: View;
    onViewChange?(view: View): void;
}

const localizer = momentLocalizer(moment);

const BigCalendar: React.FC<BigCalendarProps> = ({
    events,
    view: controlledView,
    onViewChange,
}) => {
    const [view, setView] = useState<View>(Views.WORK_WEEK);
    const actualView = controlledView ?? view;

    const handleView = (v: View) => {
        setView(v);
        onViewChange?.(v);
    };

    const props: CalendarProps<CalendarEvent> = {
        localizer,
        events,
        startAccessor: "start",
        endAccessor: "end",
        views: ["work_week", "day"],
        view: actualView,
        onView: handleView,
        min: new Date(0, 0, 0, 8, 0),
        max: new Date(0, 0, 0, 18, 0),
        style: { height: "100%" },
    };

    return <Calendar<CalendarEvent> {...props} />;
};

export default BigCalendar;
