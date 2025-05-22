// // // app/api/teachers/route.ts
// // import { NextResponse } from "next/server";
// // import dbConnect from "@/lib/dbConnection";
// // import { TeacherModel } from "@/models/User";
// // import { writeFile } from "fs/promises";
// // import path from "path";

import dbConnect from "@/lib/dbConnection";
import { TeacherModel } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// // export async function POST(req: Request) {
// //     try {
// //         await dbConnect();

// //         const formData = await req.formData();

// //         const teacherData = {
// //             username: formData.get("username") as string,
// //             email: formData.get("email") as string,
// //             password: formData.get("password") as string,
// //             name: formData.get("firstName") as string,
// //             surname: formData.get("lastName") as string,
// //             phone: formData.get("phone") as string,
// //             address: formData.get("adress") as string,
// //             birthday: new Date(formData.get("birthday") as string),
// //             sex: formData.get("sex") as "MALE" | "FEMALE",
// //         };

// //         const file = formData.get("img") as File;

// //         if (file && file.size > 0) {
// //             const bytes = await file.arrayBuffer();
// //             const buffer = Buffer.from(bytes);
// //             const fileName = `${Date.now()}-${file.name}`;
// //             const uploadDir = path.join(process.cwd(), "public/uploads");

// //             await writeFile(`${uploadDir}/${fileName}`, buffer);
// //             teacherData["img"] = `/uploads/${fileName}`;
// //         }

// //         const newTeacher = new TeacherModel(teacherData);
// //         await newTeacher.save();

// //         return NextResponse.json({ success: true, message: "Teacher created!" }, { status: 201 });
// //     } catch (err) {
// //         console.error("Teacher creation failed:", err);
// //         return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
// //     }
// // }

// import { NextResponse } from "next/server";
// import { writeFile } from "fs/promises";
// import path from "path";
// import { v4 as uuidv4 } from "uuid";
// import { TeacherModel } from "@/models/User";
// import dbConnect from "@/lib/dbConnection";

// export async function POST(req: Request) {
//     try {
//         await dbConnect();

//         const formData = await req.formData();

//         const file = formData.get("img") as File | null;

//         // Handle image upload
//         let fileName = "";
//         if (file && file.size > 0) {
//             const bytes = await file.arrayBuffer();
//             const buffer = Buffer.from(bytes);
//             fileName = `${uuidv4()}-${file.name}`;
//             const filePath = path.join(process.cwd(), "public/uploads", fileName);
//             await writeFile(filePath, buffer);
//         }

//         // Construct teacher payload
//         const teacherData: TeacherPayload = {
//             username: formData.get("username") as string,
//             password: formData.get("password") as string,
//             email: formData.get("email") as string,
//             name: formData.get("firstName") as string,
//             surname: formData.get("lastName") as string,
//             phone: formData.get("phone") as string,
//             address: formData.get("adress") as string,
//             birthday: new Date(formData.get("birthday") as string),
//             sex: (formData.get("sex") as string).toUpperCase() as "MALE" | "FEMALE",
//             role: "teacher",
//         };

//         // Optional image
//         if (fileName) {
//             teacherData.img = `/uploads/${fileName}`;
//         }

//         const newTeacher = new TeacherModel(teacherData);
//         await newTeacher.save();

//         return NextResponse.json(
//             { message: "Teacher created successfully", teacher: newTeacher },
//             { status: 201 }
//         );
//     } catch (err: any) {
//         console.error("Teacher creation error:", err);
//         return NextResponse.json(
//             { error: "Failed to create teacher", details: err.message },
//             { status: 500 }
//         );
//     }
// }

// interface TeacherPayload {
//     username: string;
//     password: string;
//     email: string;
//     name: string;
//     surname: string;
//     phone: string;
//     address: string;
//     birthday: Date;
//     sex: "MALE" | "FEMALE";
//     img?: string;
//     role: "teacher";
// }

// app/api/user/teacher/route.ts
// import { NextResponse } from "next/server";
// import { TeacherModel } from "@/models/User";
// import dbConnection from "@/lib/dbConnection";
// import { writeFile } from "fs/promises";
// import path from "path";

// export async function POST(req: Request) {
//     await dbConnection();

//     const formData = await req.formData();

//     const file = formData.get("img") as File;
//     const fileBuffer = Buffer.from(await file.arrayBuffer());
//     const fileName = `${Date.now()}-${file.name}`;
//     const filePath = path.join(process.cwd(), "public/uploads", fileName);
//     await writeFile(filePath, fileBuffer);

//     const teacherData: any = {};
//     formData.forEach((value, key) => {
//         if (key !== "img") {
//             teacherData[key] = value;
//         }
//     });
//     teacherData["img"] = `/uploads/${fileName}`;
//     teacherData["role"] = "teacher";

//     const teacher = new TeacherModel(teacherData);
//     await teacher.save();

//     return NextResponse.json({ message: "Teacher created", teacher }, { status: 201 });
// }

export async function POST(req: NextRequest) {
    try {
        const userData = await req.json();
        await dbConnect();
        const newUser = await TeacherModel.create(userData);
        return NextResponse.json(
            { message: `User '${newUser.name} ${newUser.surname}' created successfully!` },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to create" }, { status: 500 });
    }
}
