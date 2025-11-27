// app/api/events/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnection";
import { fetchAnnouncements } from "@/action/server/announcements";
import { AnnouncementModel } from "@/models/Announcement";

export async function POST(request: Request) {
    // 1) Get session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();

        // 2) Read the incoming fields
        const { title, date, description } = (await request.json()) as Omit<AnnouncementRow, "_id">;

        // 3) Inject createdBy from the session
        const created = await AnnouncementModel.create({
            title,
            date: new Date(date),
            description,
        });

        return NextResponse.json(created, { status: 201 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to create event";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        // 1) Parse pagination from URL
        const url = new URL(request.url);
        const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
        const limit = Math.max(1, parseInt(url.searchParams.get("limit") ?? "10", 10));

        // 2) Delegate to your server helper
        const result = await fetchAnnouncements(page, limit);
        // result: { data: AnnouncementRow[], page, total, totalPages }

        // 3) Return JSON
        return NextResponse.json(result);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
