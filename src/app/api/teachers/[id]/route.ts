import dbConnect from "@/lib/dbConnection";
import { TeacherModel } from "@/models/User";
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

        const updatedUser = await TeacherModel.findByIdAndUpdate(params.id, userData, {
            new: true,
            runValidators: true,
        });

        if (!updatedUser) {
            return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: `Teacher updated successfully!`, user: updatedUser },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to update teacher" }, { status: 500 });
    }
}
