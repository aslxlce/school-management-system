import dbConnect from "@/lib/dbConnection";
import { StudentModel } from "@/models/User";
import { IUserStudent } from "@/types/user";

export const fetchStudents = async (
    page: number,
    limit: number
): Promise<{ data: IUserStudent[]; totalPages: number }> => {
    await dbConnect();

    const skip = (page - 1) * limit;

    const [students, count] = await Promise.all([
        StudentModel.find().skip(skip).limit(limit),
        StudentModel.countDocuments(),
    ]);

    const data: IUserStudent[] = students.map((student) => ({
        id: student._id.toString(),
        name: student.name,
        surname: student.surname,
        email: student.email,
        img: student.img,
        phone: student.phone,
        gradeId: student.gradeId,
        classId: student.classId,
        adress: student.adress,
        parentId: student.parentId,
        birthday: student.birthday,
        sex: student.sex,
    }));

    const totalPages = Math.ceil(count / limit);

    return { data, totalPages };
};
