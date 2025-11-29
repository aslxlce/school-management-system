// app/api/assignments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createAssignment } from "@/action/server/assignment";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
    const session = await getSession();

    if (!session || (session.role !== "teacher" && session.role !== "admin")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as AssignmentCreateBody;
    const { title, description, dueDate, classId } = body;

    if (
        typeof title !== "string" ||
        typeof description !== "string" ||
        typeof dueDate !== "string" ||
        typeof classId !== "string" ||
        !title.trim() ||
        !description.trim() ||
        !dueDate.trim() ||
        !classId.trim()
    ) {
        return NextResponse.json({ message: "Missing or invalid fields" }, { status: 400 });
    }

    try {
        const assignment = await createAssignment({
            title: title.trim(),
            description: description.trim(),
            dueDate: dueDate.trim(),
            classId: classId.trim(),
            teacherId: session.id,
        });

        return NextResponse.json(assignment, { status: 201 });
    } catch (error) {
        console.error("[ASSIGNMENT_CREATE_ERROR]", error);
        return NextResponse.json({ message: "Failed to create assignment" }, { status: 500 });
    }
}
