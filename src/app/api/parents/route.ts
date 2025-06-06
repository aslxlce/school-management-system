import dbConnect from "@/lib/dbConnection";
import { ParentModel } from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("search")?.trim() ?? "";

    await dbConnect();

    // Build a flexible case-insensitive regex for name, surname or phone
    const re = new RegExp(q, "i");
    const parents = await ParentModel.find({
        $or: [{ name: re }, { surname: re }, { phone: re }],
    })
        .select("_id name surname phone") // only what StudentForm needs
        .limit(20)
        .lean();

    return NextResponse.json(parents);
}

// export async function POST(req: Request) {
//     await dbConnect();

//     try {
//         const body = await req.json();
//         const { username, password, name, surname, phone, address, email, childrenIds } = body;

//         const newParent = await ParentModel.create({
//             username,
//             password,
//             name,
//             surname,
//             phone,
//             address,
//             email,
//             childrenIds: childrenIds || [],
//         });

//         return NextResponse.json(newParent, { status: 201 });
//     } catch (error) {
//         console.error("Error creating parent:", error);
//         return NextResponse.json({ error: "Failed to create parent" }, { status: 500 });
//     }
// }

interface CreateParentBody {
    username: string;
    password: string;
    name: string;
    surname: string;
    phone: string;
    address: string;
    email?: string;
    childrenIds?: unknown;
}

export async function POST(req: Request) {
    try {
        // Parse JSON body
        const body: unknown = await req.json();

        // Verify it's an object
        if (typeof body !== "object" || body === null) {
            return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
        }

        const { username, password, name, surname, phone, address, email, childrenIds } =
            body as CreateParentBody;

        // Validate required fields
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

        // Only accept childrenIds if it's an array of strings
        let validChildrenIds: string[] = [];
        if (
            Array.isArray(childrenIds) &&
            childrenIds.every((id): id is string => typeof id === "string")
        ) {
            validChildrenIds = childrenIds.map((id) => id.trim());
        }

        const newParent = await ParentModel.create({
            username: username.trim(),
            password: password.trim(),
            role: "parent" as const,
            name: name.trim(),
            surname: surname.trim(),
            phone: phone.trim(),
            address: address.trim(),
            email: typeof email === "string" && email.trim().length > 0 ? email.trim() : undefined,
            childrenIds: validChildrenIds,
        });

        const {
            _id,
            role,
            name: savedName,
            surname: savedSurname,
            phone: savedPhone,
            address: savedAddress,
            email: savedEmail,
            childrenIds: savedChildren,
        } = newParent;

        const publicParent = {
            id: _id.toString(),
            username: newParent.username,
            role,
            name: savedName,
            surname: savedSurname,
            phone: savedPhone,
            address: savedAddress,
            email: savedEmail,
            childrenIds: savedChildren,
        };

        return NextResponse.json(publicParent, { status: 201 });
    } catch (error: unknown) {
        console.error("[API /parents] POST error", error);

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            (error as { code?: number }).code === 11000
        ) {
            const keyPattern = (error as { keyPattern?: Record<string, unknown> }).keyPattern;
            if (keyPattern && "username" in keyPattern) {
                return NextResponse.json({ message: "Username already exists." }, { status: 409 });
            }
            if (keyPattern && "phone" in keyPattern) {
                return NextResponse.json({ message: "Phone already exists." }, { status: 409 });
            }
            if (keyPattern && "email" in keyPattern) {
                return NextResponse.json({ message: "Email already exists." }, { status: 409 });
            }
        }

        const message =
            typeof error === "object" && error !== null && "message" in error
                ? (error as { message: string }).message
                : String(error);

        return NextResponse.json(
            { message: "Failed to create parent.", error: message },
            { status: 500 }
        );
    }
}
