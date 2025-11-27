// api/teachers/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnection";
import { TeacherModel } from "@/models/User";
import { MongoServerError } from "mongodb";
import fs from "fs/promises";
import path from "path";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
        const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10);
        const skip = (page - 1) * limit;

        const [teachers, total] = await Promise.all([
            TeacherModel.find({}).skip(skip).limit(limit).select("-password").lean(),
            TeacherModel.countDocuments({}),
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({ data: teachers, total, page, totalPages });
    } catch (error) {
        console.error("Failed to fetch teachers:", error);
        return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 });
    }
}

export const config = { api: { bodyParser: false } };

export async function POST(request: Request) {
    try {
        const form = await request.formData();
        const get = (k: string) => (form.get(k) as string | null) ?? "";

        const username = get("username");
        const password = get("password");
        const name = get("name");
        const surname = get("surname");
        const email = get("email") || undefined;
        const phone = get("phone") || undefined;
        const address = get("address");
        const sex = get("sex") as "male" | "female";
        const subject = get("subject");
        const birthday = new Date(get("birthday"));
        const gradeLevel = get("gradeLevel") as "primary" | "middle" | "high";

        // handle optional photo
        let imgUrl: string | undefined;
        const file = form.get("img") as File | null;
        if (file && file.size > 0) {
            const buf = Buffer.from(await file.arrayBuffer());
            const dir = path.join(process.cwd(), "public", "uploads");
            await fs.mkdir(dir, { recursive: true });
            const nameSafe = file.name.replace(/\s+/g, "_");
            const fn = `${Date.now()}_${nameSafe}`;
            await fs.writeFile(path.join(dir, fn), buf);
            imgUrl = `/uploads/${fn}`;
        }

        await dbConnect();

        const teacher = await TeacherModel.create({
            username,
            password,
            name,
            surname,
            email,
            phone,
            address,
            sex,
            subject,
            birthday,
            gradeLevel,
            ...(imgUrl ? { img: imgUrl } : {}),
            schedule: [],
        });

        return NextResponse.json(teacher, { status: 201 });
    } catch (e: unknown) {
        console.error(e);
        const msg =
            e instanceof MongoServerError
                ? e.message
                : e instanceof Error
                ? e.message
                : "Unknown error";
        return NextResponse.json({ message: msg }, { status: 500 });
    }
}
