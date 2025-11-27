// src/action/server/announcements.ts

import dbConnect from "@/lib/dbConnection";
import { AnnouncementModel } from "@/models/Announcement";

export async function fetchAnnouncements(page = 1, limit = 10): Promise<PaginatedAnnouncements> {
    await dbConnect();
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
        AnnouncementModel.find().sort({ date: -1 }).skip(skip).limit(limit).lean().exec(),
        AnnouncementModel.countDocuments(),
    ]);

    const data: AnnouncementRow[] = docs.map((doc) => ({
        _id: doc._id.toString(),
        title: doc.title,
        date: doc.date.toISOString(),
        description: doc.description,
    }));

    const totalPages = Math.ceil(total / limit);
    return { data, page, total, totalPages };
}
