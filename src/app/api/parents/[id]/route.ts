// src/app/api/parents/[id]/route.ts
import dbConnect from "@/lib/dbConnection";
import { ParentModel } from "@/models/User";
import { NextResponse } from "next/server";

interface UpdateParentBody {
    username: string;
    password: string;
    name: string;
    surname: string;
    phone: string;
    address: string;
    email?: string;
    childrenIds?: unknown;
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body: unknown = await req.json();

        if (typeof body !== "object" || body === null) {
            return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
        }

        const { username, password, name, surname, phone, address, email, childrenIds } =
            body as UpdateParentBody;

        if (
            typeof username !== "string" ||
            typeof password !== "string" ||
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

        await dbConnect();

        let validChildrenIds: string[] = [];
        if (
            Array.isArray(childrenIds) &&
            childrenIds.every((id): id is string => typeof id === "string")
        ) {
            validChildrenIds = childrenIds.map((id) => id.trim());
        }

        const updatedParent = await ParentModel.findByIdAndUpdate(
            params.id,
            {
                username: username.trim(),
                password: password.trim(),
                name: name.trim(),
                surname: surname.trim(),
                phone: phone.trim(),
                address: address.trim(),
                email:
                    typeof email === "string" && email.trim().length > 0 ? email.trim() : undefined,
                childrenIds: validChildrenIds,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedParent) {
            return NextResponse.json({ message: "Parent not found." }, { status: 404 });
        }

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
        } = updatedParent;

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
