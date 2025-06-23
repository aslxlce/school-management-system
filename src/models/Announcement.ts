// src/models/Announcement.ts

import { Schema, model, Model, models } from "mongoose";

const announcementSchema = new Schema<AnnouncementRow<Date>>(
    {
        title: { type: String, required: true },
        date: { type: Date, required: true },
        description: { type: String, required: true },
    },
    { timestamps: true }
);
console.log(models);
export const AnnouncementModel: Model<AnnouncementRow<Date>> =
    (models.announcements as Model<AnnouncementRow<Date>>) ||
    model<AnnouncementRow<Date>>("announcements", announcementSchema);
