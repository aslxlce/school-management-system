"use server";

import dbConnect from "@/lib/dbConnection";
import { TeacherModel } from "@/models/User";
import { IUserTeacher } from "@/types/user";
import { HydratedDocument } from "mongoose";

interface PaginatedTeacherResponse {
    data: IUserTeacher[];
    page: number;
    total: number;
    totalPages: number;
}

export async function fetchTeachers(page = 1, limit = 10): Promise<PaginatedTeacherResponse> {
    try {
        await dbConnect();

        const skip = (page - 1) * limit;
        const [teachers, total] = await Promise.all([
            TeacherModel.find().skip(skip).limit(limit),
            TeacherModel.countDocuments(),
        ]);

        const data: IUserTeacher[] = (teachers as HydratedDocument<IUserTeacher>[]).map(
            (teacher) => ({
                id: teacher._id.toString(),
                username: teacher.username,
                name: teacher.name,
                surname: teacher.surname,
                email: teacher.email,
                phone: teacher.phone,
                address: teacher.address,
                img: teacher.img,
                sex: teacher.sex,
                subject: teacher.subject,
                birthday: teacher.birthday,
                gradeLevel: teacher.gradeLevel,
            })
        );

        return {
            data,
            page,
            total,
            totalPages: Math.ceil(total / limit),
        };
    } catch (error) {
        console.error("Failed to fetch teachers:", error);
        throw new Error("Failed to fetch teachers");
    }
}
