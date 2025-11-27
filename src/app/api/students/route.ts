import dbConnect from "@/lib/dbConnection";
import { StudentModel } from "@/models/User";
import { NextResponse } from "next/server";
import { MongoServerError } from "mongodb";
import fs from "fs/promises";
import path from "path";
import ClassModel from "@/models/Class";
import { IScheduleEntry } from "@/types/user";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const searchQuery = url.searchParams.get("search")?.trim() ?? "";

        if (searchQuery === "") {
            return NextResponse.json([], { status: 200 });
        }

        await dbConnect();

        const regex = new RegExp(searchQuery, "i");

        const foundStudents = await StudentModel.find(
            {
                $or: [{ name: regex }, { surname: regex }, { username: regex }],
            },
            { name: 1, surname: 1 }
        )
            .limit(20)
            .lean();

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

export const config = {
    api: { bodyParser: false },
};

interface ClassWithSchedule {
    schedule: IScheduleEntry[];
}

export async function POST(request: Request) {
    try {
        const form = await request.formData();
        const get = (key: string) => (form.get(key) as string | null) ?? "";

        const username = get("username");
        const password = get("password");
        const name = get("name");
        const surname = get("surname");
        const email = get("email") || undefined;
        const phone = get("phone") || undefined;
        const address = get("address");
        const sex = get("sex") as "male" | "female";
        const birthday = new Date(get("birthday"));
        const grade = get("grade");
        const parentId = get("parentId") || undefined;
        const classId = get("classId") || undefined;

        let imgUrl: string | undefined;
        const imgFile = form.get("img") as File | null;
        if (imgFile && imgFile.size > 0) {
            const buffer = Buffer.from(await imgFile.arrayBuffer());
            const uploadDir = path.join(process.cwd(), "public", "uploads");
            await fs.mkdir(uploadDir, { recursive: true });
            const safeName = imgFile.name.replace(/\s+/g, "_");
            const filename = `${Date.now()}_${safeName}`;
            await fs.writeFile(path.join(uploadDir, filename), buffer);
            imgUrl = `/uploads/${filename}`;
        }

        await dbConnect();

        const newStudent = await StudentModel.create({
            username,
            password,
            name,
            surname,
            email,
            phone,
            address,
            sex,
            birthday,
            grade,
            parentId,
            classId,
            ...(imgUrl ? { img: imgUrl } : {}),
            schedule: [],
            isActive: true,
        });

        if (classId) {
            await ClassModel.findByIdAndUpdate(
                classId,
                { $addToSet: { studentIds: newStudent._id } },
                { new: true }
            );

            const cls = await ClassModel.findById(classId).lean<ClassWithSchedule>();
            if (cls?.schedule?.length) {
                await StudentModel.findByIdAndUpdate(newStudent._id, {
                    schedule: cls.schedule,
                });
            }
        }

        return NextResponse.json(newStudent, { status: 201 });
    } catch (err: unknown) {
        console.error("[API /students POST] Error:", err);
        const message =
            err instanceof MongoServerError
                ? err.message
                : err instanceof Error
                ? err.message
                : "Unknown server error";
        return NextResponse.json({ message }, { status: 500 });
    }
}
