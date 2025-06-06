import dbConnect from "@/lib/dbConnection";
import { TeacherModel } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export async function POST(req: NextRequest) {
//     try {
//         const userData = await req.json();
//         await dbConnect();
//         const newUser = await TeacherModel.create(userData);
//         return NextResponse.json(
//             { message: `User '${newUser.name} ${newUser.surname}' created successfully!` },
//             { status: 201 }
//         );
//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({ error: "Failed to create" }, { status: 500 });
//     }
// }

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        console.log("Received formData:");
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        const requiredFields = [
            "username",
            "password",
            "email",
            "name",
            "surname",
            "phone",
            "address",
            "subject",
            "birthday",
            "sex",
            "gradeLevel",
        ];

        for (const field of requiredFields) {
            if (!formData.get(field)) {
                return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
            }
        }

        const newTeacher = {
            username: formData.get("username") as string,
            password: formData.get("password") as string,
            email: formData.get("email") as string,
            name: formData.get("name") as string,
            surname: formData.get("surname") as string,
            phone: formData.get("phone") as string,
            address: formData.get("address") as string,
            subject: formData.get("subject") as string,
            birthday: new Date(formData.get("birthday") as string),
            sex: formData.get("sex") as "male" | "female",
            gradeLevel: formData.get("gradeLevel") as "primary" | "middle" | "high",
            role: "teacher", // ✅ add this line
        };

        await dbConnect();
        const created = await TeacherModel.create(newTeacher);

        return NextResponse.json(
            { message: `User '${created.name} ${created.surname}' created successfully!` },
            { status: 201 }
        );
    } catch (error) {
        console.error("[TEACHER_CREATE_ERROR]:", error);
        return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 });
    }
}

// export async function GET(req: NextRequest) {
//     try {
//         await dbConnect();

//         const searchParams = req.nextUrl.searchParams;
//         const page = parseInt(searchParams.get("page") || "1", 10);
//         const limit = parseInt(searchParams.get("limit") || "10", 10);
//         const skip = (page - 1) * limit;

//         // 🔍 Filter only teachers – make sure this matches your schema setup
//         const query = { role: "teacher" }; // <-- Adjust this if you use discriminator instead of role field

//         const [data, total] = await Promise.all([
//             UserModel.find(query).skip(skip).limit(limit),
//             UserModel.countDocuments(query),
//         ]);

//         const totalPages = Math.ceil(total / limit);

//         return NextResponse.json({ data, total, page, totalPages });
//     } catch (error) {
//         console.error("❌ GET /api/teachers failed:", error);
//         return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 });
//     }
// }

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
        const limit = parseInt(req.nextUrl.searchParams.get("limit") || "5");
        const skip = (page - 1) * limit;

        const total = await TeacherModel.countDocuments();
        const totalPages = Math.ceil(total / limit);

        const teachers = await TeacherModel.find().skip(skip).limit(limit).lean();

        return NextResponse.json({
            data: teachers,
            total,
            page,
            totalPages,
        });
    } catch (error) {
        console.error("Failed to fetch teachers:", error);
        return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 });
    }
}
// export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
//     try {
//         const session = await getServerSession(authOptions);
//         if (!session || (session.user?.role !== "admin" && session.user?.id !== params.id)) {
//             return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//         }

//         const userData = await req.json();
//         await dbConnect();

//         const updatedUser = await TeacherModel.findByIdAndUpdate(params.id, userData, {
//             new: true,
//             runValidators: true,
//         });

//         if (!updatedUser) {
//             return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
//         }

//         return NextResponse.json(
//             { message: `Teacher updated successfully!`, user: updatedUser },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({ error: "Failed to update teacher" }, { status: 500 });
//     }
// }
