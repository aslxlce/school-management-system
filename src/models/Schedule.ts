import mongoose, { Schema, Document, Types } from "mongoose";

/* ------------------------------------------------------------------ */
/*  Shared literals & interfaces                                       */
/* ------------------------------------------------------------------ */

/** Same literal union used in `schedule.d.ts` */
export type DayOfWeek = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday";

/**
 * One lesson-slot in a class timetable
 * (matches the global   `IScheduleEntry`  interface)
 */
export interface IScheduleEntry extends Document<Types.ObjectId> {
    day: DayOfWeek; // “monday”, “tuesday”, …
    startTime: string; // "08:00"
    endTime: string; // "09:30"
    subject: string; // free text or enum
    classId: Types.ObjectId; // linked class
    teacherId: Types.ObjectId; // teacher running the lesson
}

/* ------------------------------------------------------------------ */
/*  Schema                                                             */
/* ------------------------------------------------------------------ */

const scheduleSchema = new Schema<IScheduleEntry>(
    {
        day: {
            type: String,
            enum: ["sunday", "monday", "tuesday", "wednesday", "thursday"],
            required: true,
        },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        subject: { type: String, required: true },

        /* --- relations ------------------------------------------------- */
        classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
        teacherId: { type: Schema.Types.ObjectId, ref: "teacher", required: true },
    },
    { timestamps: true }
);

/* Optional composite index: avoid double-booking a teacher            */
scheduleSchema.index(
    { teacherId: 1, day: 1, startTime: 1, endTime: 1 },
    { unique: true, name: "uniqTeacherSlot" }
);

/* ------------------------------------------------------------------ */
/*  Model                                                              */
/* ------------------------------------------------------------------ */

export const ScheduleModel =
    mongoose.models.Schedule || mongoose.model<IScheduleEntry>("Schedule", scheduleSchema);
