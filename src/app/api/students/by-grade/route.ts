// import { NextRequest, NextResponse } from "next/server";
// import { StudentModel } from "@/models/User";
// import dbConnect from "@/lib/dbConnection";

// export async function GET(req: NextRequest) {
//     await dbConnect();

//     const { searchParams } = new URL(req.url);
//     const grade = searchParams.get("grade");

//     if (!grade) {
//         return NextResponse.json({ error: "Missing grade" }, { status: 400 });
//     }

//     try {
//         const students = await StudentModel.find({
//             gradeId: grade,
//             classId: { $exists: false },
//         }).lean();

//         return NextResponse.json(students);
//     } catch (error) {
//         console.error("[GET /students/by-grade]", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }

// api/students/by-grade/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnection";
import { StudentModel } from "@/models/User";

export async function GET(req: NextRequest) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const grade = searchParams.get("grade"); // e.g. "7"

    if (!grade) {
        return NextResponse.json({ error: "Missing grade" }, { status: 400 });
    }

    try {
        // Instead of gradeId: grade, use grade: grade
        const students = await StudentModel.find({
            grade: grade,
            classId: { $exists: false },
        }).lean();

        return NextResponse.json(students);
    } catch (error) {
        console.error("[GET /students/by-grade]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
