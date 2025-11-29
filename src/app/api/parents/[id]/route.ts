// src/app/api/parents/[id]/route.ts
import dbConnect from "@/lib/dbConnection";
import { ParentModel } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

interface UpdateParentBody {
    username: string;
    password?: string; // optional on update
    name: string;
    surname: string;
    phone: string;
    address: string;
    email?: string;
    childrenIds?: unknown;
}

// Next 15: context.params is a Promise
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;

        const body: unknown = await req.json();

        if (typeof body !== "object" || body === null) {
            return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
        }

        const { username, password, name, surname, phone, address, email, childrenIds } =
            body as UpdateParentBody;

        // Basic required-field validation (password is optional here)
        if (
            typeof username !== "string" ||
            typeof name !== "string" ||
            typeof surname !== "string" ||
            typeof phone !== "string" ||
            typeof address !== "string"
        ) {
            return NextResponse.json(
                { message: "Missing or invalid required parent fields." },
                { status: 400 }
            );
        }

        // If password is present, it must be a string
        if (password !== undefined && typeof password !== "string") {
            return NextResponse.json({ message: "Invalid password field." }, { status: 400 });
        }

        await dbConnect();

        // Load existing parent so pre("save") hooks run (for hashing password)
        const parentDoc = await ParentModel.findById(id);
        if (!parentDoc) {
            return NextResponse.json({ message: "Parent not found." }, { status: 404 });
        }

        // Normalize childrenIds (optional)
        let validChildrenIds: string[] = [];
        if (
            Array.isArray(childrenIds) &&
            childrenIds.every((childId): childId is string => typeof childId === "string")
        ) {
            validChildrenIds = childrenIds.map((childId) => childId.trim());
        }

        // Apply updates
        parentDoc.username = username.trim();
        parentDoc.name = name.trim();
        parentDoc.surname = surname.trim();
        parentDoc.phone = phone.trim();
        parentDoc.address = address.trim();
        parentDoc.email =
            typeof email === "string" && email.trim().length > 0 ? email.trim() : undefined;
        parentDoc.childrenIds = validChildrenIds;

        // Only update password if a non-empty one is provided.
        // Your pre("save") hook will hash it.
        if (typeof password === "string" && password.trim().length > 0) {
            parentDoc.password = password.trim();
        }

        const savedParent = await parentDoc.save(); // <-- hashing happens here

        const {
            _id,
            role,
            name: savedName,
            surname: savedSurname,
            phone: savedPhone,
            address: savedAddress,
            email: savedEmail,
            childrenIds: savedChildren,
            username: savedUsername,
        } = savedParent;

        const publicParent = {
            id: _id.toString(),
            username: savedUsername,
            role,
            name: savedName,
            surname: savedSurname,
            phone: savedPhone,
            address: savedAddress,
            email: savedEmail,
            childrenIds: savedChildren,
        };

        return NextResponse.json(publicParent, { status: 200 });
    } catch (error: unknown) {
        console.error("[API /parents/:id] PUT error", error);

        // Handle duplicate username
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            (error as { code?: number }).code === 11000
        ) {
            return NextResponse.json({ message: "Username already exists." }, { status: 409 });
        }

        const message =
            typeof error === "object" && error !== null && "message" in error
                ? (error as { message: string }).message
                : String(error);

        return NextResponse.json(
            { message: "Failed to update parent.", error: message },
            { status: 500 }
        );
    }
}
