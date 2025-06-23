// "use client";

// import Image from "next/image";
// import { useState } from "react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";

// type ValuePiece = Date | null;

// type Value = ValuePiece | [ValuePiece, ValuePiece];

// //Temporary data for events
// const events = [
//     {
//         id: 1,
//         title: "Hakuna Matata",
//         time: "12:00 PM - 1:00 PM",
//         description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     },
//     {
//         id: 2,
//         title: "Hakuna Matata",
//         time: "12:00 PM - 1:00 PM",
//         description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     },
//     {
//         id: 3,
//         title: "Hakuna Matata",
//         time: "12:00 PM - 1:00 PM",
//         description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     },
// ];

// const EventCalendar = () => {
//     const [value, onChange] = useState<Value>(new Date());

//     return (
//         <div className="bg-white p-4 rounded-md">
//             {" "}
//             <Calendar onChange={onChange} value={value} />
//             <div className="flex items-center justify-between">
//                 <h1 className="text-xl font-semibold my-4">Events</h1>
//                 <Image
//                     src="/moreDark.png"
//                     alt=""
//                     width={20}
//                     height={20}
//                     className="cursor-pointer"
//                 />
//             </div>
//             <div className="flex flex-col gap-4">
//                 {events.map((event) => (
//                     <div
//                         className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-[var(--sky-color)] even:border-t-[var(--purplee-color)]"
//                         key={event.id}
//                     >
//                         <div className="flex items-center justify-between">
//                             <h1 className="font-semibold text-gray-600">{event.title}</h1>
//                             <span className="text-gray-300 text-xs">{event.time}</span>
//                         </div>
//                         <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default EventCalendar;

// src/components/EventCalendar.tsx
"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export interface EventCalendarProps {
    /** An optional list of events to display; defaults to empty array */
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
