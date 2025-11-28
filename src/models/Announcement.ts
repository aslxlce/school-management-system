// // src/models/Announcement.ts

// import { Schema, model, Model, models } from "mongoose";

// const announcementSchema = new Schema<AnnouncementRow<Date>>(
//     {
//         title: { type: String, required: true },
//         date: { type: Date, required: true },
//         description: { type: String, required: true },
//     },
//     { timestamps: true }
// );
// console.log(models);
// export const AnnouncementModel: Model<AnnouncementRow<Date>> =
//     (models.announcements as Model<AnnouncementRow<Date>>) ||
//     model<AnnouncementRow<Date>>("announcements", announcementSchema);

// src/models/Announcement.ts

import { Schema, model, Model, models, Document, Types } from "mongoose";

// Mongoose document shape
export interface IAnnouncementDocument extends Document {
    _id: Types.ObjectId;
    title: string;
    date: Date;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

const announcementSchema = new Schema<IAnnouncementDocument>(
    {
        title: { type: String, required: true, trim: true },
        date: { type: Date, required: true },
        description: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

// Optional debug, you can remove if you don't need it
// console.log(models);

export const AnnouncementModel: Model<IAnnouncementDocument> =
    (models.announcements as Model<IAnnouncementDocument>) ||
    model<IAnnouncementDocument>("announcements", announcementSchema);
