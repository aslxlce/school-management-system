// // app/api/events/route.ts
// import dbConnect from "@/lib/dbConnection";
// import EventModel from "@/models/Events";
// import { NextResponse } from "next/server";

// export async function GET() {
//     await dbConnect();
//     const events = await EventModel.find({});
//     return NextResponse.json(events);
// }

// export async function POST(request: Request) {
//     await dbConnect();
//     const body = await request.json();
//     const created = await EventModel.create(body);
//     return NextResponse.json(created, { status: 201 });
// }

// app/api/events/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnection";
import EventModel from "@/models/Events";

export async function POST(request: Request) {
    // 1) Auth guard
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2) Parse client payload (does NOT include createdBy)
    const { title, start, end, description, allDay } = await request.json();

    try {
        await dbConnect();

        // 3) Create and let Mongoose inject _id and createdBy
        const created = await EventModel.create({
            title,
            start,
            end,
            allDay,
            description,
            createdBy: session.user.id,
        });

        // 4) Use created.id (string) instead of touching _id
        const result = {
            id: created.id,
            title: created.title,
            start: created.start,
            end: created.end,
            allDay: created.allDay,
            description: created.description,
            createdBy: created.createdBy,
        };

        return NextResponse.json(result, { status: 201 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to create event";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
