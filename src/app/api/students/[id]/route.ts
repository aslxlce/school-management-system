import dbConnect from "@/lib/dbConnection";
import { StudentModel } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user?.role !== "admin" && session.user?.id !== params.id)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userData = await req.json();
        await dbConnect();

        const updatedUser = await StudentModel.findByIdAndUpdate(params.id, userData, {
            new: true,
            runValidators: true,
        });

        if (!updatedUser) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: `Student updated successfully!`, user: updatedUser },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
    }
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    if (!params.id) {
        return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    await dbConnect();
    const s = await StudentModel.findById(params.id).lean();
    if (!s) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Return exactly the fields your client expects
    return NextResponse.json({
        id: s._id.toString(),
        username: s.username,
        name: s.name,
        surname: s.surname,
        email: s.email,
        phone: s.phone,
        address: s.address,
        img: s.img,
        sex: s.sex,
        grade: s.grade,
        birthday: s.birthday.toISOString(),
        role: "student",
        schedule: s.schedule, // pass along the embedded schedule array
    });
}
