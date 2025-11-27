// app/api/events/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnection";
import EventModel from "@/models/Events";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, start, end, description, allDay } = await request.json();

    try {
        await dbConnect();

        const created = await EventModel.create({
            title,
            start,
            end,
            allDay,
            description,
            createdBy: session.user.id,
        });

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
