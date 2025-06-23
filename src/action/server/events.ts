// // src/action/server/events.ts

import dbConnect from "@/lib/dbConnection";
import EventModel from "@/models/Events";

// import dbConnect from "@/lib/dbConnection";
// import EventModel from "@/models/Events";

// // Plain shape for clients
// interface ServerEvent {
//     id: string;
//     title: string;
//     start: Date;
//     end: Date;
//     allDay?: boolean;
//     description?: string;
//     createdBy: string;
// }

// export interface ServerPaginatedEvents {
//     events: ServerEvent[];
//     total: number;
// }

// export async function fetchEvents(page: number, limit: number): Promise<ServerPaginatedEvents> {
//     await dbConnect();
//     const skip = (page - 1) * limit;

//     const [docs, total] = await Promise.all([
//         EventModel.find({}).sort({ start: 1 }).skip(skip).limit(limit).lean(), // returns plain objects typed as Document
//         EventModel.countDocuments(),
//     ]);

//     // Map to our clean interface
//     const events: ServerEvent[] = docs.map((doc) => ({
//         id: doc._id.toString(),
//         title: doc.title,
//         start: doc.start,
//         end: doc.end,
//         allDay: doc.allDay,
//         description: doc.description,
//         createdBy: doc.createdBy,
//     }));

//     return { events, total };
// }

// src/action/server/events.ts

// src/action/server/events.ts

export interface ServerPaginatedEvents {
    events: IEvent[]; // now exactly IEvent[]
    total: number;
}

export async function fetchEvents(page: number, limit: number): Promise<ServerPaginatedEvents> {
    await dbConnect();
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
        EventModel.find({}).sort({ start: 1 }).skip(skip).limit(limit).lean(),
        EventModel.countDocuments(),
    ]);

    // Map each mongoose doc→IEvent
    const events: IEvent[] = docs.map((doc) => ({
        id: doc._id.toString(),
        title: doc.title,
        start: doc.start,
        end: doc.end,
        allDay: doc.allDay ?? false,
        description: doc.description ?? "",
        createdBy: doc.createdBy,
    }));

    return { events, total };
}
