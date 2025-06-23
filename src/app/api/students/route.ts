import dbConnect from "@/lib/dbConnection";
import { StudentModel } from "@/models/User";
import { NextResponse } from "next/server";
import { MongoServerError } from "mongodb";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const searchQuery = url.searchParams.get("search")?.trim() ?? "";

        // If no search parameter was provided, return an empty array:
        if (searchQuery === "") {
            return NextResponse.json([], { status: 200 });
        }

        await dbConnect();

        // Build a case-insensitive regex for partial matching:
        const regex = new RegExp(searchQuery, "i");

        // Query for students whose name, surname, or username matches:
        const foundStudents = await StudentModel.find(
            {
                $or: [{ name: regex }, { surname: regex }, { username: regex }],
            },
            // Only select the fields we need:
            { name: 1, surname: 1 }
        )
            .limit(20) // limit to 20 results
            .lean();

        // Map the returned documents into a simple JSON payload:
        const payload = foundStudents.map((doc) => ({
            id: doc._id.toString(),
            name: doc.name,
            surname: doc.surname,
        }));

        return NextResponse.json(payload, { status: 200 });
    } catch (error: unknown) {
        console.error("[API /students] GET error", error);

        const message =
            typeof error === "object" && error !== null && "message" in error
                ? (error as { message: string }).message
                : String(error);

        return NextResponse.json(
            { message: "Failed to fetch students.", error: message },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();

        // Parse the JSON body:
        const body: Record<string, unknown> = await req.json();

        // Create a new student document:
        const newStudent = await StudentModel.create(body);

        return NextResponse.json(newStudent, { status: 201 });
    } catch (error: unknown) {
        console.error("[API /students] POST error", error);

        const message =
            error instanceof MongoServerError ? error.message : "Failed to create student.";

        return NextResponse.json({ message, error: String(error) }, { status: 500 });
    }
}
