// src/components/EventCalendar.tsx
"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export interface EventCalendarProps {
    initialEvents?: IEvent[];
}

export default function EventCalendar({ initialEvents = [] }: EventCalendarProps) {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const events = initialEvents;

    return (
        <div className="bg-white p-4 rounded-md">
            <Calendar
                value={selectedDate}
                onChange={(value) => {
                    let dt: Date;
                    if (Array.isArray(value)) {
                        dt = value[0] ?? new Date();
                    } else if (value) {
                        dt = value;
                    } else {
                        dt = new Date();
                    }
                    setSelectedDate(dt);
                }}
            />

            <h1 className="text-xl font-semibold mt-4">Events</h1>

            <div className="mt-6 space-y-4">
                {events.map((evt, i) => (
                    <div key={evt.id ?? i} className="p-4 border rounded shadow-sm hover:shadow">
                        <div className="flex justify-between">
                            <h2 className="font-semibold">{evt.title}</h2>
                            <span className="text-sm text-gray-500">
                                {new Date(evt.start).toLocaleString()} –{" "}
                                {new Date(evt.end).toLocaleString()}
                            </span>
                        </div>
                        {evt.description && <p className="mt-2 text-gray-600">{evt.description}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}
