// // "use client";

// // import { useEffect, useState } from "react";
// // import { useForm, Controller } from "react-hook-form";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { z } from "zod";
// // import { gradeOptions, gradeLessonMap, getGradeLevelFromGrade } from "@/lib/gradeLessons";
// // import { getEligibleTeachersByGradeAndLesson } from "@/action/client/teacher";
// // import { getEligibleStudentsByGrade } from "@/action/client/student";
// // import { createClass } from "@/action/client/class";

// // const schema = z.object({
// //     name: z.string().min(1),
// //     grade: z.string(),
// //     lessons: z.array(z.string()),
// //     teacherMap: z.record(z.string(), z.string()),
// //     supervisorId: z.string().optional(),
// //     studentIds: z.array(z.string()),
// // });

// // type FormData = z.infer<typeof schema>;

// // export default function ClassForm() {
// //     const { register, handleSubmit, watch, control, setValue } = useForm<FormData>({
// //         resolver: zodResolver(schema),
// //         defaultValues: {
// //             lessons: [],
// //             teacherMap: {},
// //             studentIds: [],
// //         },
// //     });

// //     const grade = watch("grade");
// //     const teacherMap = watch("teacherMap");
// //     const [subjects, setSubjects] = useState<string[]>([]);
// //     const [teacherOptions, setTeacherOptions] = useState<Record<string, IUserTeacher[]>>({});
// //     const [studentOptions, setStudentOptions] = useState<IUserStudent[]>([]);

// //     useEffect(() => {
// //         if (!grade) return;

// //         const subjectList = gradeLessonMap[grade] || [];
// //         setSubjects(subjectList);
// //         setValue("lessons", subjectList);

// //         const fetchTeachers = async () => {
// //             const level = getGradeLevelFromGrade(grade);
// //             const teacherMap: Record<string, IUserTeacher[]> = {};

// //             for (const subject of subjectList) {
// //                 const teachers = await getEligibleTeachersByGradeAndLesson(level, subject);
// //                 teacherMap[subject] = teachers;
// //             }

// //             setTeacherOptions(teacherMap);
// //         };

// //         const fetchStudents = async () => {
// //             const students = await getEligibleStudentsByGrade(grade);
// //             setStudentOptions(students);
// //         };

// //         fetchTeachers();
// //         fetchStudents();
// //     }, [grade, setValue]);

// //     const onSubmit = async (data: FormData) => {
// //         const teachers = subjects
// //             .map(
// //                 (subject) => teacherOptions[subject].find((t) => t.id === data.teacherMap[subject])!
// //             )
// //             .filter(Boolean);

// //         const classData = {
// //             name: data.name,
// //             grade: parseInt(data.grade),
// //             lessons: subjects,
// //             teacherIds: teachers,
// //             supervisor: teachers.find((t) => t.id === data.supervisorId),
// //             studentIds: studentOptions.filter((s) => data.studentIds.includes(s.id)),
// //         };

// //         await createClass(classData);
// //     };

// //     const selectedTeachers = subjects
// //         .map((subject) => teacherOptions[subject]?.find((t) => t.id === teacherMap[subject]))
// //         .filter(Boolean) as IUserTeacher[];

// //     return (
// //         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
// //             <div>
// //                 <label className="block mb-1">Class Name</label>
// //                 <input {...register("name")} className="border rounded px-2 py-1 w-full" />
// //             </div>

// //             <div>
// //                 <label className="block mb-1">Grade</label>
// //                 <select {...register("grade")} className="border rounded px-2 py-1 w-full">
// //                     <option value="">Select Grade</option>
// //                     {gradeOptions.map((g) => (
// //                         <option key={g} value={g}>
// //                             {g}
// //                         </option>
// //                     ))}
// //                 </select>
// //             </div>

// //             {subjects.length > 0 && (
// //                 <div className="space-y-2">
// //                     <h3 className="font-semibold">Assign Teachers to Subjects</h3>
// //                     {subjects.map((subject) => (
// //                         <div key={subject}>
// //                             <label className="block mb-1">{subject}</label>
// //                             <Controller
// //                                 name={`teacherMap.${subject}`}
// //                                 control={control}
// //                                 render={({ field }) => (
// //                                     <select {...field} className="border rounded px-2 py-1 w-full">
// //                                         <option value="">Select Teacher</option>
// //                                         {teacherOptions[subject]?.map((t) => (
// //                                             <option key={t.id} value={t.id}>
// //                                                 {t.name} {t.surname} ({t.subject})
// //                                             </option>
// //                                         ))}
// //                                     </select>
// //                                 )}
// //                             />
// //                         </div>
// //                     ))}
// //                 </div>
// //             )}

// //             {selectedTeachers.length > 0 && (
// //                 <div>
// //                     <label className="block mb-1">Supervisor</label>
// //                     <select
// //                         {...register("supervisorId")}
// //                         className="border rounded px-2 py-1 w-full"
// //                     >
// //                         <option value="">Select Supervisor</option>
// //                         {selectedTeachers.map((t) => (
// //                             <option key={t.id} value={t.id}>
// //                                 {t.name} {t.surname}
// //                             </option>
// //                         ))}
// //                     </select>
// //                 </div>
// //             )}

// //             {studentOptions.length > 0 && (
// //                 <div>
// //                     <label className="block mb-1">Assign Students</label>
// //                     <select
// //                         multiple
// //                         {...register("studentIds")}
// //                         className="border rounded px-2 py-1 w-full h-40"
// //                     >
// //                         {studentOptions.map((s) => (
// //                             <option key={s.id} value={s.id}>
// //                                 {s.name} {s.surname}
// //                             </option>
// //                         ))}
// //                     </select>
// //                 </div>
// //             )}

// //             <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
// //                 Create Class
// //             </button>
// //         </form>
// //     );
// // }

// import { useForm, Controller, useWatch } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { gradeLessonMap, gradeOptions, getGradeLevelFromGrade } from "@/lib/gradeLessons";
// import {
// } from "@/services/classService";
//     getEligibleTeachersByGradeAndLesson,
//     getEligibleStudentsByGrade,

// // Zod schema for form validation
// const classFormSchema = z.object({
//     name: z.string().min(1, "Class name is required"),
//     grade: z.string().min(1, "Grade is required"),
//     subjectsAssignments: z.array(
//         z.object({
//             subject: z.string(),
//             teacherId: z.string().nullable(),
//         })
//     ),
//     supervisorId: z.string().nullable().optional(),
//     studentIds: z.array(z.string()).optional(),
// });

// type ClassFormValues = z.infer<typeof classFormSchema>;

// interface ClassFormProps {
//     onSubmit: (data: Omit<IClass, "id">) => void;
//     teachers: IUserTeacher[];
// }

// export default function ClassForm({ onSubmit, teachers }: ClassFormProps) {
//     const {
//         control,
//         register,
//         handleSubmit,
//         setValue,
//         formState: { errors },
//     } = useForm<ClassFormValues>({
//         resolver: zodResolver(classFormSchema),
//         defaultValues: {
//             subjectsAssignments: [],
//             supervisorId: null,
//             studentIds: [],
//         },
//     });

//     const currentGrade = useWatch({ control, name: "grade" });
//     const subjectsAssignments = useWatch({ control, name: "subjectsAssignments" });

//     // Determine available subjects based on selected grade
//     const subjects = currentGrade ? gradeLessonMap[currentGrade] || [] : [];

//     // Get eligible students for the selected grade
//     const loadStudents = async () => {
//         if (!currentGrade) return [];
//         try {
//             return await getEligibleStudentsByGrade(currentGrade);
//         } catch (error) {
//             console.error("Error loading students", error);
//             return [];
//         }
//     };

//     // Get eligible teachers for a specific subject
//     const loadTeachers = async (subject: string) => {
//         if (!currentGrade) return [];
//         try {
//             return await getEligibleTeachersByGradeAndLesson(currentGrade, subject);
//         } catch (error) {
//             console.error("Error loading teachers", error);
//             return [];
//         }
//     };

//     // Get assigned teachers for supervisor dropdown
//     const assignedTeachers = subjectsAssignments
//         .flatMap((assignment) =>
//             assignment.teacherId ? teachers.find((t) => t.id === assignment.teacherId) : null
//         )
//         .filter(Boolean) as IUserTeacher[];

//     // Handler for form submission
//     const handleFormSubmit = async (data: ClassFormValues) => {
//         const classData: Omit<IClass, "id"> = {
//             name: data.name,
//             grade: data.grade,
//             teacherIds: subjectsAssignments
//                 .filter((sa) => sa.teacherId)
//                 .map((sa) => teachers.find((t) => t.id === sa.teacherId)!),
//             studentIds: data.studentIds
//                 ? data.studentIds.map((id) => ({ id } as IUserStudent))
//                 : [],
//             supervisor: data.supervisorId
//                 ? teachers.find((t) => t.id === data.supervisorId)!
//                 : undefined,
//             lessons: subjectsAssignments
//                 .filter((sa) => sa.teacherId)
//                 .map((sa) => ({
//                     lessonId: sa.subject,
//                     teacherId: sa.teacherId!,
//                 })),
//         };
//         onSubmit(classData);
//     };

//     // Initialize subjects assignments when grade changes
//     const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const grade = e.target.value;
//         setValue("grade", grade);

//         const newSubjects = gradeLessonMap[grade] || [];
//         setValue(
//             "subjectsAssignments",
//             newSubjects.map((subject) => ({
//                 subject,
//                 teacherId: null,
//             }))
//         );
//     };

//     return (
//         <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Class</h2>

//             <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
//                 {/* Class Name Field */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Class Name
//                     </label>
//                     <input
//                         {...register("name")}
//                         className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                             errors.name ? "border-red-500" : "border-gray-300"
//                         }`}
//                         placeholder="e.g., Mathematics Advanced"
//                     />
//                     {errors.name && (
//                         <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
//                     )}
//                 </div>

//                 {/* Grade Selection */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Grade Level
//                     </label>
//                     <select
//                         {...register("grade")}
//                         onChange={handleGradeChange}
//                         className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                             errors.grade ? "border-red-500" : "border-gray-300"
//                         }`}
//                     >
//                         <option value="">Select Grade</option>
//                         {gradeOptions.map((grade) => (
//                             <option key={grade} value={grade}>
//                                 Grade {grade}
//                             </option>
//                         ))}
//                     </select>
//                     {errors.grade && (
//                         <p className="mt-1 text-sm text-red-600">{errors.grade.message}</p>
//                     )}
//                 </div>

//                 {/* Subject-Teacher Assignments */}
//                 {currentGrade && (
//                     <div className="space-y-4">
//                         <h3 className="text-lg font-semibold text-gray-700">Subject Assignments</h3>
//                         {subjects.map((subject, index) => (
//                             <div
//                                 key={subject}
//                                 className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg"
//                             >
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Subject
//                                     </label>
//                                     <input
//                                         value={subject}
//                                         readOnly
//                                         className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Teacher
//                                     </label>
//                                     <Controller
//                                         name={`subjectsAssignments.${index}.teacherId`}
//                                         control={control}
//                                         render={({ field }) => (
//                                             <Select
//                                                 options={teachers
//                                                     .filter(
//                                                         (t) =>
//                                                             t.subject === subject &&
//                                                             t.gradeLevel ===
//                                                                 getGradeLevelFromGrade(currentGrade)
//                                                     )
//                                                     .map((teacher) => ({
//                                                         value: teacher.id,
//                                                         label: `${teacher.name} ${teacher.surname}`,
//                                                     }))}
//                                                 isClearable
//                                                 placeholder="Select teacher..."
//                                                 onChange={(option) =>
//                                                     field.onChange(option?.value || null)
//                                                 }
//                                                 value={
//                                                     field.value
//                                                         ? {
//                                                               value: field.value,
//                                                               label:
//                                                                   teachers.find(
//                                                                       (t) => t.id === field.value
//                                                                   )?.name +
//                                                                   " " +
//                                                                   teachers.find(
//                                                                       (t) => t.id === field.value
//                                                                   )?.surname,
//                                                           }
//                                                         : null
//                                                 }
//                                                 styles={{
//                                                     control: (base) => ({
//                                                         ...base,
//                                                         minHeight: "44px",
//                                                         borderColor: errors.subjectsAssignments?.[
//                                                             index
//                                                         ]?.teacherId
//                                                             ? "#ef4444"
//                                                             : "#d1d5db",
//                                                         "&:hover": {
//                                                             borderColor: "#3b82f6",
//                                                         },
//                                                     }),
//                                                 }}
//                                             />
//                                         )}
//                                     />
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}

//                 {/* Supervisor Selection */}
//                 {currentGrade && assignedTeachers.length > 0 && (
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Class Supervisor
//                         </label>
//                         <Controller
//                             name="supervisorId"
//                             control={control}
//                             render={({ field }) => (
//                                 <Select
//                                     options={assignedTeachers.map((teacher) => ({
//                                         value: teacher.id,
//                                         label: `${teacher.name} ${teacher.surname}`,
//                                     }))}
//                                     isClearable
//                                     placeholder="Select supervisor..."
//                                     onChange={(option) => field.onChange(option?.value || null)}
//                                     value={
//                                         field.value
//                                             ? {
//                                                   value: field.value,
//                                                   label:
//                                                       assignedTeachers.find(
//                                                           (t) => t.id === field.value
//                                                       )?.name +
//                                                       " " +
//                                                       assignedTeachers.find(
//                                                           (t) => t.id === field.value
//                                                       )?.surname,
//                                               }
//                                             : null
//                                     }
//                                     styles={{
//                                         control: (base) => ({
//                                             ...base,
//                                             minHeight: "44px",
//                                             borderColor: errors.supervisorId
//                                                 ? "#ef4444"
//                                                 : "#d1d5db",
//                                             "&:hover": {
//                                                 borderColor: "#3b82f6",
//                                             },
//                                         }),
//                                     }}
//                                 />
//                             )}
//                         />
//                     </div>
//                 )}

//                 {/* Student Selection */}
//                 {currentGrade && (
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Students
//                         </label>
//                         <Controller
//                             name="studentIds"
//                             control={control}
//                             render={({ field }) => (
//                                 <Select
//                                     isMulti
//                                     loadOptions={loadStudents}
//                                     defaultOptions
//                                     getOptionLabel={(student: IUserStudent) =>
//                                         `${student.name} ${student.surname} (Grade ${student.gradeId})`
//                                     }
//                                     getOptionValue={(student: IUserStudent) => student.id}
//                                     onChange={(options) =>
//                                         field.onChange(options.map((opt) => opt.id))
//                                     }
//                                     value={field.value?.map((id) => ({
//                                         id,
//                                         name: "",
//                                         surname: "",
//                                         gradeId: "",
//                                     }))}
//                                     placeholder="Select students..."
//                                     classNamePrefix="select"
//                                     styles={{
//                                         control: (base) => ({
//                                             ...base,
//                                             minHeight: "44px",
//                                             borderColor: errors.studentIds ? "#ef4444" : "#d1d5db",
//                                             "&:hover": {
//                                                 borderColor: "#3b82f6",
//                                             },
//                                         }),
//                                     }}
//                                 />
//                             )}
//                         />
//                     </div>
//                 )}

//                 {/* Submit Button */}
//                 <div className="flex justify-end">
//                     <button
//                         type="submit"
//                         className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
//                     >
//                         Create Class
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }
