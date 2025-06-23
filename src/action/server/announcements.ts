// // src/action/server/announcement.ts
// import dbConnect from "@/lib/dbConnection";
// import { AnnouncementModel } from "@/models/Announcement";
// import { Types, Document } from "mongoose";

// // 1) Raw mongoose doc shape
// interface RawAnnouncement extends Document {
//     _id: Types.ObjectId;
//     title: string;
//     date: Date;
//     description: string;
// }

// // 2) UI row
// export interface AnnouncementRow {
//     id: string;
//     title: string;
//     date: string;
// }

// export interface PaginatedAnnouncements {
//     data: AnnouncementRow[];
//     page: number;
//     total: number;
//     totalPages: number;
// }

// export async function fetchAnnouncements(page = 1, limit = 10): Promise<PaginatedAnnouncements> {
//     await dbConnect();
//     const skip = (page - 1) * limit;

//     // ✔ Use the generic on find()
//     const docs = await AnnouncementModel.find<RawAnnouncement>()
//         .sort({ date: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean() // no generic here
//         .exec(); // docs is now RawAnnouncement[]

//     const data: AnnouncementRow[] = docs.map((doc) => ({
//         id: doc._id.toString(),
//         title: doc.title,
//         date: doc.date.toISOString(),
//     }));

//     const total = await AnnouncementModel.countDocuments();
//     return {
//         data,
//         page,
//         total,
//         totalPages: Math.ceil(total / limit),
//     };
// }
// src/action/server/announcements.ts

// src/action/server/announcements.ts

/**
 * Ambient global types in src/types/announcement.d.ts:
 *
 *   declare interface AnnouncementRow {
 *     id: string;
 *     title: string;
 *     date: string;
 *     description: string;
 *   }
 *
 *   declare interface PaginatedAnnouncements {
 *     data: AnnouncementRow[];
 *     page: number;
 *     total: number;
 *     totalPages: number;
 *   }
 */

// src/action/server/announcements.ts

import dbConnect from "@/lib/dbConnection";
import { AnnouncementModel } from "@/models/Announcement";

/**
 * Ambient global types in src/types/announcement.d.ts:
 *
 *   declare interface AnnouncementRow {
 *     id: string;
 *     title: string;
 *     date: string;
 *     description: string;
 *   }
 *
 *   declare interface PaginatedAnnouncements {
 *     data: AnnouncementRow[];
 *     page: number;
 *     total: number;
 *     totalPages: number;
 *   }
 */

// src/action/server/announcements.ts

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
