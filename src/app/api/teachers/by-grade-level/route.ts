// import { NextRequest, NextResponse } from "next/server";
// import { TeacherModel } from "@/models/User";
// import dbConnect from "@/lib/dbConnection";

// export async function GET(req: NextRequest) {
//     await dbConnect();

//     const { searchParams } = new URL(req.url);
//     const gradeLevel = searchParams.get("gradeLevel");
//     const subject = searchParams.get("subject");

//     if (!gradeLevel || !subject) {
//         return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
//     }

//     try {
//         const teachers = await TeacherModel.find({
//             gradeLevel,
//             subject,
//         }).lean();

//         return NextResponse.json(teachers);
//     } catch (error) {
//         console.error("[GET /teachers/by-grade-level]", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }

// src/app/api/teachers/by-grade-level/route.ts
import { NextRequest, NextResponse } from "next/server";
import { TeacherModel } from "@/models/User";
import dbConnect from "@/lib/dbConnection";
import type { IUserTeacher } from "@/types/user";

export async function GET(req: NextRequest) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const gradeLevel = searchParams.get("gradeLevel");
    const subject = searchParams.get("subject");

    if (!gradeLevel || !subject) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    try {
        const rawTeachers = await TeacherModel.find({
            gradeLevel,
            subject,
        }).lean();

        const teachers: IUserTeacher[] = rawTeachers.map((t) => ({
            id: t._id.toString(),
            role: "teacher",
            username: t.username,
            name: t.name,
            surname: t.surname,
            email: t.email,
            phone: t.phone,
            address: t.address,
            img: t.img,
            sex: t.sex,
            subject: t.subject,
            birthday: t.birthday instanceof Date ? t.birthday.toISOString() : String(t.birthday),
            gradeLevel: t.gradeLevel,
            schedule: t.schedule ?? [],
        }));

        return NextResponse.json(teachers);
    } catch (error) {
        console.error("[GET /teachers/by-grade-level]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
