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

export interface BigCalendarProps {
    events: CalendarEvent[];
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
