import Announcements from "@/components/Announcements";
import AttendanceChart from "@/components/AttendanceChart";
import CountChart from "@/components/CountChart";
import EventCalendar from "@/components/EventCalendar";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";
import { getSession } from "@/lib/auth";

// const AdminPage = () => {
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
//                 <EventCalendar />
//                 <Announcements />
//             </div>
//         </div>
//     );
// };

// export default AdminPage;

import { redirect } from "next/navigation";

export default async function AdminPage() {
    const session = await getSession();

    if (!session) return redirect("/auth/sign-in"); // Not logged in

    if (session.role !== "admin") return redirect("/unauthorized"); // Logged in but not admin

    return (
        <div className="p-4 flex gap-4 flex-col md:flex-row">
            {/* Left  */}
            <div className="w-full lg:w-2/3 flex flex-col gap-8">
                {/* User Cards  */}
                <div className="flex gap-4 justify-between flex-wrap">
                    <UserCard type="student" />
                    <UserCard type="teacher" />
                    <UserCard type="parent" />
                    <UserCard type="staff" />
                </div>
                {/* Middle chart  */}
                <div className="flex gap-4 flex-col lg:flex-row ">
                    {/* Count chart  */}
                    <div className="w-full lg:w-1/3 h-[450px]">
                        <CountChart />
                    </div>
                    {/* Attendence chart  */}
                    <div className="w-full lg:w-2/3 h-[450px]">
                        <AttendanceChart />
                    </div>
                </div>
                {/* Bottom chart  */}
                <div className="w-full h-[500px]">
                    <FinanceChart />
                </div>
            </div>
            {/* Right  */}
            <div className="w-full lg:w-1/3 flex flex-col gap-8">
                <EventCalendar />
                <Announcements />
            </div>
        </div>
    );
}
