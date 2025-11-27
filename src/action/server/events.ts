import dbConnect from "@/lib/dbConnection";
import EventModel from "@/models/Events";

export interface ServerPaginatedEvents {
    events: IEvent[];
    total: number;
}

export async function fetchEvents(page: number, limit: number): Promise<ServerPaginatedEvents> {
    await dbConnect();
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
        EventModel.find({}).sort({ start: 1 }).skip(skip).limit(limit).lean(),
        EventModel.countDocuments(),
    ]);

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
