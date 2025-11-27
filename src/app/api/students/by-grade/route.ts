// src/app/api/students/by-grade/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnection";
import { StudentModel } from "@/models/User";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const grade = searchParams.get("grade");
        const classId = searchParams.get("classId");

        if (!grade) {
            return NextResponse.json({ message: "Missing grade parameter" }, { status: 400 });
        }

        const baseFilter = {
            grade,
            isActive: true,
        };

        const classFilter =
            classId && classId.trim().length > 0
                ? {
                      $or: [
                          { classId: "" },
                          { classId: null },
                          { classId: { $exists: false } },
                          { classId: classId.trim() },
                      ],
                  }
                : {
                      $or: [{ classId: "" }, { classId: null }, { classId: { $exists: false } }],
                  };

        const students = await StudentModel.find({
            ...baseFilter,
            ...classFilter,
        })
            .select(
                "_id username name surname email img phone grade classId address parentId birthday sex"
            )
            .lean();

        const payload = students.map((s) => ({
            id: String(s._id),
            username: s.username ?? "",
            name: s.name,
            surname: s.surname,
            email: s.email,
            img: s.img,
            phone: s.phone,
            grade: s.grade,
            classId: s.classId ?? "",
            address: s.address,
            parentId: s.parentId ? String(s.parentId) : undefined,
            birthday: s.birthday,
            sex: s.sex,
        }));

        return NextResponse.json(payload, { status: 200 });
    } catch (error) {
        console.error("[GET /students/by-grade] error:", error);
        return NextResponse.json({ message: "Failed to fetch eligible students" }, { status: 500 });
    }
}
