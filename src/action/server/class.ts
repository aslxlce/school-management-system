import dbConnect from "@/lib/dbConnection";
import ClassModel from "@/models/Class";

export const fetchClasses = async (page: number = 1, limit: number = 5) => {
    await dbConnect();

    const skip = (page - 1) * limit;
    const total = await ClassModel.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const classes = await ClassModel.find().skip(skip).limit(limit).lean();

    const data = classes.map((cls) => ({
        id: cls._id?.toString() ?? "", // Ensure _id is string
        name: cls.name,
        grade: cls.grade,
    }));

    return { data, totalPages };
};

export const fetchClassById = async (id: string) => {
    await dbConnect();

    const cls = await ClassModel.findById(id)
        .populate("teacherIds")
        .populate("studentIds")
        .populate("supervisor")
        .lean();

    if (!cls) return null;

    return {
        id: cls._id.toString(),
        name: cls.name,
        grade: cls.grade,
        teacherIds: cls.teacherIds as IUserTeacher[],
        studentIds: cls.studentIds as IUserStudent[],
        supervisor: cls.supervisor as IUserTeacher,
        lessons: cls.lessons,
        schedule: cls.schedule,
    };
};
