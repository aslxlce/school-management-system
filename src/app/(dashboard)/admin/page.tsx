// import Announcements from "@/components/Announcements";
// import AttendanceChart from "@/components/AttendanceChart";
// import CountChart from "@/components/CountChart";
// import EventCalendar from "@/components/EventCalendar";
// import FinanceChart from "@/components/FinanceChart";
// import UserCard from "@/components/UserCard";
// import { getSession } from "@/lib/auth";
// import { fetchEvents as fetchEventsServer } from "@/action/server/events";

// import { redirect } from "next/navigation";

// export default async function AdminPage() {
//     const session = await getSession();
//     const initialEvents = await fetchEventsServer(1, 10); // Fetch initial events for the calendar
//     if (!session) return redirect("/auth/sign-in"); // Not logged in

//     if (session.role !== "admin") return redirect("/unauthorized"); // Logged in but not admin
//     const events = initialEvents.events || []; // Ensure events is an array
//     console.log(events);
//     return (
//         <div className="p-4 flex gap-4 flex-col md:flex-row">
//             {/* Left  */}
//             <div className="w-full lg:w-2/3 flex flex-col gap-8">
//                 {/* User Cards  */}
//                 <div className="flex gap-4 justify-between flex-wrap">
//                     <UserCard type="student" />
//                     <UserCard type="teacher" />
//                     <UserCard type="parent" />
//                     <UserCard type="staff" />
//                 </div>
//                 {/* Middle chart  */}
//                 <div className="flex gap-4 flex-col lg:flex-row ">
//                     {/* Count chart  */}
//                     <div className="w-full lg:w-1/3 h-[450px]">
//                         <CountChart />
//                     </div>
//                     {/* Attendence chart  */}
//                     <div className="w-full lg:w-2/3 h-[450px]">
//                         <AttendanceChart />
//                     </div>
//                 </div>
//                 {/* Bottom chart  */}
//                 <div className="w-full h-[500px]">
//                     <FinanceChart />
//                 </div>
//             </div>
//             {/* Right  */}
//             <div className="w-full lg:w-1/3 flex flex-col gap-8">
//                 <EventCalendar initialEvents={events} />
//                 <Announcements />
//             </div>
//         </div>
//     );
// }
import Announcements from "@/components/Announcements";
import AttendanceChart from "@/components/AttendanceChart";
import CountChart from "@/components/CountChart";
import EventCalendar from "@/components/EventCalendar";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";

import { getSession } from "@/lib/auth";
import { fetchEvents as fetchEventsServer } from "@/action/server/events";

import dbConnect from "@/lib/dbConnection";
import { StudentModel, TeacherModel, ParentModel } from "@/models/User";

import { redirect } from "next/navigation";

export default async function AdminPage() {
    const session = await getSession();
    if (!session) return redirect("/auth/sign-in");
    if (session.role !== "admin") return redirect("/unauthorized");

    await dbConnect();

    // MAIN COUNTS
    const studentCountPromise = StudentModel.countDocuments({});
    const teacherCountPromise = TeacherModel.countDocuments({});
    const parentCountPromise = ParentModel.countDocuments({});

    // BOYS / GIRLS COUNT
    const boyCountPromise = StudentModel.countDocuments({ sex: "male" });
    const girlCountPromise = StudentModel.countDocuments({ sex: "female" });

    const eventsPromise = fetchEventsServer(1, 10);

    const [studentCount, teacherCount, parentCount, boyCount, girlCount, initialEvents] =
        await Promise.all([
            studentCountPromise,
            teacherCountPromise,
            parentCountPromise,
            boyCountPromise,
            girlCountPromise,
            eventsPromise,
        ]);

    const events = initialEvents.events || [];

    return (
        <div className="p-4 flex gap-4 flex-col md:flex-row">
            <div className="w-full lg:w-2/3 flex flex-col gap-8">
                {/* User Cards */}
                <div className="flex gap-4 justify-between flex-wrap">
                    <UserCard type="student" count={studentCount} />
                    <UserCard type="teacher" count={teacherCount} />
                    <UserCard type="parent" count={parentCount} />
                    <UserCard type="staff" />
                </div>

                {/* CHARTS */}
                <div className="flex gap-4 flex-col lg:flex-row ">
                    <div className="w-full lg:w-1/3 h-[450px]">
                        {/* pass boys/girls to CountChart */}
                        <CountChart boys={boyCount} girls={girlCount} />
                    </div>

                    <div className="w-full lg:w-2/3 h-[450px]">
                        <AttendanceChart />
                    </div>
                </div>

                <div className="w-full h-[500px]">
                    <FinanceChart />
                </div>
            </div>

            <div className="w-full lg:w-1/3 flex flex-col gap-8">
                <EventCalendar initialEvents={events} />
                <Announcements />
            </div>
        </div>
    );
}
