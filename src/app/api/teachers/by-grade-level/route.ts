import { NextRequest, NextResponse } from "next/server";
import { TeacherModel } from "@/models/User";
import dbConnect from "@/lib/dbConnection";

export async function GET(req: NextRequest) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const gradeLevel = searchParams.get("gradeLevel");
    const subject = searchParams.get("subject");

    if (!gradeLevel || !subject) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    try {
        const teachers = await TeacherModel.find({
            gradeLevel,
            subject,
        }).lean();

        return NextResponse.json(teachers);
    } catch (error) {
        console.error("[GET /teachers/by-grade-level]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
