// import Image from "next/image";

// const UserCard = ({ type }: { type: string }) => {
//     return (
//         <div className="rounded-2xl odd:bg-[var(--purplee-color)] even:bg-[var(--yelloww-color)] p-4 flex-1 min-w-[130px]">
//             <div className="flex justify-between items-center">
//                 <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
//                     2024/2025
//                 </span>
//                 <Image src="/more.png" alt="" width={20} height={20} className="cursor-pointer" />
//             </div>
//             <h1 className="text-2xl font-semibold my-4">1,431</h1>
//             <h2 className="capitalize text-sm font0medium text-gray-500">{type}s</h2>
//         </div>
//     );
// };

// export default UserCard;

import Image from "next/image";

type UserType = "student" | "teacher" | "parent" | "staff";

interface UserCardProps {
    type: UserType;
    count?: number; // 👈 dynamic number (optional)
}

const LABELS: Record<UserType, string> = {
    student: "Student",
    teacher: "Teacher",
    parent: "Parent",
    staff: "Staff",
};

const UserCard = ({ type, count }: UserCardProps) => {
    const label = LABELS[type] ?? type;
    const value = count ?? 0; // fallback if no count passed

    return (
        <div className="rounded-2xl odd:bg-[var(--purplee-color)] even:bg-[var(--yelloww-color)] p-4 flex-1 min-w-[130px]">
            <div className="flex justify-between items-center">
                <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
                    2025/2026
                </span>
                <Image src="/more.png" alt="" width={20} height={20} className="cursor-pointer" />
            </div>

            {/* dynamic number */}
            <h1 className="text-2xl font-semibold my-4">{value.toLocaleString()}</h1>

            {/* “Students”, “Teachers”, etc. */}
            <h2 className="capitalize text-sm font0medium text-gray-500">
                {label}
                {value === 1 ? "" : "s"}
            </h2>
        </div>
    );
};

export default UserCard;
