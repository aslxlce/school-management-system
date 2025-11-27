// app/dashboard/parent/page.tsx

import Announcements from "@/components/Announcements";
import ClassScheduleSection, {
    IScheduleEntry as ClassScheduleEntry,
} from "@/components/ClassScheduleSection";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnection";
import { StudentModel, ParentModel } from "@/models/User";
import { fetchClassById } from "@/action/server/class";
import { Types } from "mongoose";

interface RawChild {
    _id: Types.ObjectId;
    name: string;
    surname: string;
    classId?: Types.ObjectId;
}

interface RawParent {
    _id: Types.ObjectId;
    name: string;
    surname: string;
    childrenIds?: Types.ObjectId[];
}

export default async function ParentPage() {
    const session = await getSession();
    const role = session?.role;
    const parentId = session?.id;

    const isParent = role === "parent";

    let childName: string | null = null;
    let classId: string | null = null;
    let schedule: ClassScheduleEntry[] = [];

    if (isParent && parentId) {
        await dbConnect();

        // 1) Load parent to get childrenIds
        const parent = await ParentModel.findById(parentId).lean<RawParent | null>();

        // 2) If parent has at least one child, load that student
        let child: RawChild | null = null;
        if (parent && Array.isArray(parent.childrenIds) && parent.childrenIds.length > 0) {
            const firstChildId = parent.childrenIds[0];
            child = await StudentModel.findById(firstChildId).lean<RawChild | null>();
        }

        // 3) Fill child name & classId from child if found
        if (child) {
            childName = `${child.name} ${child.surname}`;
            if (child.classId) {
                classId = child.classId.toString();
            }
        }

        // 4) If we still don't have a classId, fall back to session.classId
        if (!classId) {
            classId = session.classId ?? null;
        }

        // 5) If we have a classId, load the schedule
        if (classId) {
            const cls = await fetchClassById(classId);
            if (cls && Array.isArray(cls.schedule)) {
                schedule = cls.schedule as ClassScheduleEntry[];
            }
        }
    }

    const heading = !isParent ? "Schedule" : childName ? `Schedule (${childName})` : "Schedule";

    return (
        <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
            {/* Left  */}
            <div className="w-full xl:w-2/3">
                <div className="h-full bg-white p-4 rounded-md">
                    <h1 className="text-xl font-semibold">{heading}</h1>

                    {!isParent ? (
                        <p className="mt-4 text-gray-500">
                            This dashboard is only available for parent accounts.
                        </p>
                    ) : !parentId ? (
                        <p className="mt-4 text-gray-500">
                            No parent information found in session.
                        </p>
                    ) : !classId ? (
                        <p className="mt-4 text-gray-500">
                            No class is associated with this parent&apos;s student yet.
                        </p>
                    ) : schedule.length === 0 ? (
                        <p className="mt-4 text-gray-500">
                            No schedule has been defined for this student&apos;s class yet.
                        </p>
                    ) : (
                        <ClassScheduleSection
                            classId={classId}
                            initialSchedule={schedule}
                            readOnly
                        />
                    )}
                </div>
            </div>

            {/* Right  */}
            <div className="w-full xl:w-1/3 flex flex-col gap-8">
                <Announcements />
            </div>
        </div>
    );
}
