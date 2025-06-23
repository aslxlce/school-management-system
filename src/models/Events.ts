import mongoose from "mongoose";

// Extend global IEvent and mongoose.Document, omitting id to avoid conflict
declare interface IEventDocument extends mongoose.Document, Omit<IEvent, "id"> {}

const EventSchema = new mongoose.Schema<IEventDocument>(
    {
        title: { type: String, required: true },
        start: { type: Date, required: true },
        end: { type: Date, required: true },
        allDay: { type: Boolean, default: false },
        description: { type: String },
        createdBy: { type: String, required: true },
    },
    { timestamps: true }
);

// Register or reuse existing model
const EventModel =
    (mongoose.models.Event as mongoose.Model<IEventDocument>) ||
    mongoose.model<IEventDocument>("Event", EventSchema);

export default EventModel;
