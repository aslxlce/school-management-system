// import Announcements from "@/components/Announcements";
// import BigCalendar from "@/components/BigCalendar";
// import FormModal from "@/components/FormModal";
// // import Performance from "@/components/Performance";
// import Image from "next/image";
// import Link from "next/link";

// const SingleTeacherPage = () => {
//     return (
//         <div className="flex-1 p-4  flex flex-col gap-4 xl:flex-row">
//             {/* Left  */}
//             <div className="w-full xl:w-2/3">
//                 {/* Top  */}
//                 <div className=" flex flex-col gap-4 lg:flex-row">
//                     {/* User Info card  */}
//                     <div className="bg-[var(--sky-color)] py-6 px-4 rounded-md flex-1 flex gap-4">
//                         <div className="w-1/3">
//                             <Image
//                                 src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1200"
//                                 alt=""
//                                 width={144}
//                                 height={144}
//                                 className="w-36 h-36 rounded-full object-cover"
//                             />
//                         </div>
//                         <div className="w-2/3 flex flex-col justify-between gap-4">
//                             <div className="flex items-center gap-4">
//                                 <h1 className="text-xl font-semibold">Leo</h1>
//                                 <FormModal
//                                     table="teacher"
//                                     type="update"
//                                     data={{
//                                         id: 1,
//                                         username: "mohbebeloued",
//                                         email: "mohbebeloued@gmail.co",
//                                         password: "password",
//                                         phone: "+213 123456789",
//                                         adress: "Algeria, Oran",
//                                         bloodType: "A+",
//                                         birthday: "2000-01-01",
//                                         sex: "male",
//                                         img: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1200",
//                                     }}
//                                 />
//                             </div>
//                             <p className="text-sm text-gray-500">
//                                 Lorem ipsum dolor sit amet consectetur adipisicing elit.
//                             </p>
//                             <div className="flex items-center justify-between gap-2 flex-wrap text-sm font-medium">
//                                 <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
//                                     <Image src="/blood.png" alt="" width={14} height={14} />
//                                     <span>A+</span>
//                                 </div>
//                                 <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
//                                     <Image src="/date.png" alt="" width={14} height={14} />
//                                     <span>Jan 2025</span>
//                                 </div>
//                                 <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
//                                     <Image src="/mail.png" alt="" width={14} height={14} />
//                                     <span>hahahuhu@gmail.com</span>
//                                 </div>
//                                 <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
//                                     <Image src="/phone.png" alt="" width={14} height={14} />
//                                     <span>+9012345678</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     {/* Small Info card  */}
//                     <div className="flex-1 flex gap-4 justify-between flex-wrap">
//                         {/* Card  */}
//                         <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
//                             <Image
//                                 src="/singleAttendance.png"
//                                 alt=""
//                                 width={24}
//                                 height={24}
//                                 className="w-6 h-6"
//                             />
//                             <div className="">
//                                 <h1 className="text-xl font-semibold">90%</h1>
//                                 <span className="text-sm text-gray-400">Attendance</span>
//                             </div>
//                         </div>
//                         {/* Card  */}
//                         <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
//                             <Image
//                                 src="/singleBranch.png"
//                                 alt=""
//                                 width={24}
//                                 height={24}
//                                 className="w-6 h-6"
//                             />
//                             <div className="">
//                                 <h1 className="text-xl font-semibold">2</h1>
//                                 <span className="text-sm text-gray-400">Branches</span>
//                             </div>
//                         </div>
//                         {/* Card  */}
//                         <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
//                             <Image
//                                 src="/singleLesson.png"
//                                 alt=""
//                                 width={24}
//                                 height={24}
//                                 className="w-6 h-6"
//                             />
//                             <div className="">
//                                 <h1 className="text-xl font-semibold">6</h1>
//                                 <span className="text-sm text-gray-400">Lessons</span>
//                             </div>
//                         </div>
//                         {/* Card  */}
//                         <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
//                             <Image
//                                 src="/singleClass.png"
//                                 alt=""
//                                 width={24}
//                                 height={24}
//                                 className="w-6 h-6"
//                             />
//                             <div className="">
//                                 <h1 className="text-xl font-semibold">6</h1>
//                                 <span className="text-sm text-gray-400">Classes</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {/* Bottom  */}
//                 <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
//                     <h1 className="">Teacher&apos;s Schecule</h1>
//                     <BigCalendar />
//                 </div>
//             </div>
//             {/* Right  */}
//             <div className="w-full xl:w-1/3 flex flex-col gap-4">
//                 <div className="bg-white p-4 rounded-md">
//                     <h1 className="text-xl font-semibold">Shortcuts</h1>
//                     <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
//                         <Link className="p-3 rounded-md bg-[var(--lightSkye-color)]" href="/">
//                             Teacher&apos;s Classes
//                         </Link>
//                         <Link className="p-3 rounded-md bg-[var(--purpleeLight-color)]" href="/">
//                             Teacher&apos;s Students
//                         </Link>
//                         <Link className="p-3 rounded-md bg-[var(--yellowwLight-color)]" href="/">
//                             Teacher&apos;s Lessons
//                         </Link>
//                         <Link className="p-3 rounded-md bg-pink-50" href="/">
//                             Teacher&apos;s Exams
//                         </Link>
//                         <Link className="p-3 rounded-md bg-[var(--lightSkye-color)]" href="/">
//                             Teacher&apos;s Assignments
//                         </Link>
//                     </div>
//                 </div>
//                 {/* <Performance /> */}
//                 <Announcements />
//             </div>
//         </div>
//     );
// };

// export default SingleTeacherPage;

//--------------------------------------------------------------------------------------------------------------------

// src/app/dashboard/list/teachers/[id]/page.tsx
export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";
import FormModal from "@/components/FormModal";
import { fetchTeacherById } from "@/action/server/teacher";

interface PageProps {
    params: { id: string };
}

export default async function SingleTeacherPage({ params }: PageProps) {
    // 1) Fetch teacher data
    const teacher = await fetchTeacherById(params.id);
    if (!teacher) notFound();

    return (
        <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
            {/* Left */}
            <div className="w-full xl:w-2/3">
                {/* Header */}
                <div className="flex flex-col gap-4 lg:flex-row">
                    {/* Profile Card */}
                    <div className="bg-[var(--sky-color)] py-6 px-4 rounded-md flex-1 flex gap-4">
                        <div className="w-1/3">
                            <Image
                                src={teacher.img || "/default-avatar.jpg"}
                                alt={`${teacher.name} ${teacher.surname}`}
                                width={144}
                                height={144}
                                className="w-36 h-36 rounded-full object-cover"
                            />
                        </div>
                        <div className="w-2/3 flex flex-col justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <h1 className="text-xl font-semibold">
                                    {teacher.name} {teacher.surname}
                                </h1>
                                {/* Spread into a plain object to satisfy `data: Record<string, unknown>` */}
                                <FormModal table="teacher" type="update" data={{ ...teacher }} />
                            </div>
                            {/* Description */}
                            <p className="text-sm text-gray-500">Teaches {teacher.subject}</p>
                            {/* Contact Info */}
                            <div className="flex flex-wrap gap-2 text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    <Image src="/date.png" alt="Birthday" width={14} height={14} />
                                    <span>{new Date(teacher.birthday).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Image src="/mail.png" alt="Email" width={14} height={14} />
                                    <span>{teacher.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Image src="/phone.png" alt="Phone" width={14} height={14} />
                                    <span>{teacher.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Stats Cards */}
                    <div className="flex-1 flex gap-4 justify-between flex-wrap">
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%]">
                            <Image src="/singleLesson.png" alt="Lessons" width={24} height={24} />
                            <div>
                                <h1 className="text-xl font-semibold">{teacher.lessonsCount}</h1>
                                <span className="text-sm text-gray-400">Lessons</span>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%]">
                            <Image src="/singleClass.png" alt="Classes" width={24} height={24} />
                            <div>
                                <h1 className="text-xl font-semibold">{teacher.classesCount}</h1>
                                <span className="text-sm text-gray-400">Classes</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Calendar */}
                <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
                    <h2 className="text-lg font-semibold mb-2">Teacher’s Schedule</h2>
                    <BigCalendar events={teacher.scheduleEvents} />
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-full xl:w-1/3 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-md">
                    <h2 className="text-xl font-semibold">Shortcuts</h2>
                    <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
                        <Link
                            href={`/dashboard/list/teachers/${params.id}/classes`}
                            className="p-3 rounded-md bg-[var(--lightSkye-color)]"
                        >
                            Classes
                        </Link>
                        <Link
                            href={`/dashboard/list/teachers/${params.id}/students`}
                            className="p-3 rounded-md bg-[var(--purpleeLight-color)]"
                        >
                            Students
                        </Link>
                        <Link
                            href={`/dashboard/list/teachers/${params.id}/lessons`}
                            className="p-3 rounded-md bg-[var(--yellowwLight-color)]"
                        >
                            Lessons
                        </Link>
                    </div>
                </div>
                <Announcements />
            </div>
        </div>
    );
}
