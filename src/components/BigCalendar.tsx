// "use client";

// import React, { useState } from "react";
// import { Calendar, momentLocalizer, View, Views, CalendarProps } from "react-big-calendar";
// import moment from "moment";
// import "react-big-calendar/lib/css/react-big-calendar.css";

// export interface CalendarEvent {
//     title: string;
//     start: Date;
//     end: Date;
//     allDay?: boolean;
// }

// interface BigCalendarProps {
//     events: CalendarEvent[];
//     // optional control from parent
//     view?: View;
//     onViewChange?(view: View): void;
// }

// const localizer = momentLocalizer(moment);

// const BigCalendar: React.FC<BigCalendarProps> = ({
//     events,
//     view: controlledView,
//     onViewChange,
// }) => {
//     const [view, setView] = useState<View>(Views.WORK_WEEK);
//     const actualView = controlledView ?? view;

//     const handleView = (v: View) => {
//         setView(v);
//         onViewChange?.(v);
//     };

//     const props: CalendarProps<CalendarEvent> = {
//         localizer,
//         events,
//         startAccessor: "start",
//         endAccessor: "end",
//         views: ["work_week", "day"],
//         view: actualView,
//         onView: handleView,
//         min: new Date(0, 0, 0, 8, 0),
//         max: new Date(0, 0, 0, 18, 0),
//         style: { height: "100%" },
//     };

//     return <Calendar<CalendarEvent> {...props} />;
// };

// export default BigCalendar;

"use client";

import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, View, Views, CalendarProps } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { IScheduleEntry } from "@/types/schedule";

// Your runtime event type
export interface CalendarEvent {
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
}

// Match your schedule API entries

interface BigCalendarProps {
    /** e.g. `/api/schedule?classId=abc123` or `?teacherId=xyz` */
    fetchUrl: string;
    view?: View;
    onViewChange?(view: View): void;
}

const localizer = momentLocalizer(moment);

const dayIndexMap: Record<IScheduleEntry["day"], number> = {
    monday: 0,
    tuesday: 1,
    wednesday: 2,
    thursday: 3,
    friday: 4,
};
const BigCalendar: React.FC<BigCalendarProps> = ({
    fetchUrl,
    view: controlledView,
    onViewChange,
}) => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [view, setView] = useState<View>(Views.WORK_WEEK);
    const actualView = controlledView ?? view;

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(fetchUrl);
                if (!res.ok) throw new Error(res.statusText);
                const data = (await res.json()) as IScheduleEntry[];

                const today = moment();
                const weekStart = today.clone().startOf("isoWeek"); // Monday
                const mapped: CalendarEvent[] = data.map((entry) => {
                    const dayOffset = dayIndexMap[entry.day];
                    const baseDate = weekStart.clone().add(dayOffset, "days");

                    const [sh, sm] = entry.startTime.split(":").map(Number);
                    const [eh, em] = entry.endTime.split(":").map(Number);

                    const start = baseDate.clone().hour(sh).minute(sm).toDate();
                    const end = baseDate.clone().hour(eh).minute(em).toDate();

                    return {
                        title: entry.subject,
                        start,
                        end,
                    };
                });

                setEvents(mapped);
            } catch (err) {
                console.error("Failed loading schedule:", err);
            }
        }

        load();
    }, [fetchUrl]);

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
