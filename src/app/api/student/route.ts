import dbConnect from "@/lib/dbConnection";
import { StudentModel } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const userData = await req.json();
        await dbConnect();
        const newUser = await StudentModel.create(userData);
        return NextResponse.json(
            { message: `User '${newUser.name} ${newUser.surname}' created successfully!` },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to create" }, { status: 500 });
    }
}
