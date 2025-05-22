// const SingleClassResults = () => {
//     return <div className="">Results here</div>;
// };

// export default SingleClassResults;

// type Course = {
//     subject: string;
//     teacher: string;
//     grade: string;
//     credits: number;
// };

// type Props = {
//     year: string;
//     student: {
//         fullName: string;
//         id: number;
//         subject: string;
//         class: string;
//         teacher: string;
//         student: string;
//         date: Date;
//         type: "exam" | "assignment";
//         score: number;
//     };
// };

// const HighSchoolTranscript: React.FC<Props> = ({ year, student }) => {
//     return (
//         <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8 border border-gray-300">
//             {/* Header */}
//             <div className="text-center mb-6">
//                 <p className="text-gray-600 text-sm">Official High School Transcript – {year}</p>
//             </div>

//             {/* Student Info */}
//             <div className="grid grid-cols-2 text-sm mb-6 gap-y-1">
//                 <p>
//                     <span className="font-semibold">Full Name:</span> {student.fullName}
//                 </p>
//                 <p>
//                     <span className="font-semibold">Student ID:</span> {student.id}
//                 </p>
//                 <p>{/* <span className="font-semibold">Type</span> {student.gradeLevel} */}</p>
//                 <p>
//                     <span className="font-semibold">score:</span> {student.score}
//                 </p>
//             </div>

//             {/* Courses Table */}
//             <table className="w-full text-sm border border-gray-300 mb-6">
//                 <thead className="bg-gray-100">
//                     <tr>
//                         <th className="text-left px-4 py-2 border">Subject</th>
//                         <th className="text-left px-4 py-2 border">Teacher</th>
//                         <th className="text-left px-4 py-2 border">Credits</th>
//                         <th className="text-left px-4 py-2 border">Grade</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {student.courses.map((course, idx) => (
//                         <tr key={idx} className="hover:bg-gray-50">
//                             <td className="px-4 py-2 border">{course.subject}</td>
//                             <td className="px-4 py-2 border">{course.teacher}</td>
//                             <td className="px-4 py-2 border">{course.credits}</td>
//                             <td className="px-4 py-2 border">{course.grade}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             {/* Footer / Signature */}
//             <div className="flex justify-between items-center mt-6 text-sm">
//                 <p>
//                     <span className="font-semibold">Total Credits:</span>{" "}
//                     {student.courses.reduce((sum, c) => sum + c.credits, 0)}
//                 </p>
//                 <div className="text-center">
//                     <p className="border-t border-gray-400 w-48 mx-auto pt-1">
//                         Principal’s Signature
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HighSchoolTranscript;

// app/results/[id]/page.tsx

////////

// "use client";

// import { useParams } from "next/navigation";

// type Result = {
//     id: number;
//     subject: string;
//     class: string;
//     teacher: string;
//     student: string;
//     date: string;
//     type: string;
//     score: number;
// };

// // Hardcoded data with multiple results for class 1A
// const allResults: Result[] = [
//     {
//         id: 1,
//         subject: "Math",
//         class: "1A",
//         teacher: "John Doe",
//         student: "John Doe",
//         date: "2025-01-01",
//         type: "exam",
//         score: 90,
//     },
//     {
//         id: 2,
//         subject: "Math",
//         class: "1A",
//         teacher: "John Doe",
//         student: "John Doe",
//         date: "2025-02-01",
//         type: "exam",
//         score: 85,
//     },
//     {
//         id: 3,
//         subject: "Math",
//         class: "1A",
//         teacher: "John Doe",
//         student: "John Doe",
//         date: "2025-03-01",
//         type: "assignment",
//         score: 95,
//     },
//     {
//         id: 4,
//         subject: "English",
//         class: "2A",
//         teacher: "John Doe",
//         student: "John Doe",
//         date: "2025-01-01",
//         type: "exam",
//         score: 88,
//     },
// ];

// const classMap: Record<string, string> = {
//     "1": "1A",
//     "2": "2A",
// };

// export default function StudentResultsPage() {
//     const params = useParams();
//     const classId = Array.isArray(params.id) ? params.id[0] : params.id;
//     const className = classMap[classId];
//     const studentName = "John Doe";

//     const filteredResults = allResults.filter(
//         (res) =>
//             res.class === className &&
//             res.student === studentName &&
//             (res.type === "exam" || res.type === "assignment")
//     );

//     return (
//         <main className="p-6">
//             <h1 className="text-2xl font-bold mb-4">
//                 Results for {studentName} in Class {className ?? "(Unknown)"}
//             </h1>
//             {filteredResults.length > 0 ? (
//                 <ul className="space-y-4">
//                     {filteredResults.map((res) => (
//                         <li key={res.id} className="border rounded-lg p-4 shadow-sm">
//                             <p>
//                                 <strong>Subject:</strong> {res.subject}
//                             </p>
//                             <p>
//                                 <strong>Type:</strong> {res.type}
//                             </p>
//                             <p>
//                                 <strong>Date:</strong> {res.date}
//                             </p>
//                             <p>
//                                 <strong>Score:</strong> {res.score}
//                             </p>
//                         </li>
//                     ))}
//                 </ul>
//             ) : (
//                 <p className="text-gray-500">No exam or assignment results found.</p>
//             )}
//         </main>
//     );
// }

import Bulletin from "@/components/Bulletin";

export default function Page() {
    return <Bulletin />;
}
