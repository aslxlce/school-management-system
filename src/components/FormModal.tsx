// "use client";

// import dynamic from "next/dynamic";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { JSX, useState } from "react";

// // Dynamically import forms
// const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
//     loading: () => <h1>Loading...</h1>,
// });
// const StudentForm = dynamic(() => import("./forms/StudentForm"), {
//     loading: () => <h1>Loading...</h1>,
// });
// const ParentForm = dynamic(() => import("./forms/ParentForm"), {
//     loading: () => <h1>Loading...</h1>,
// });
// const ClassForm = dynamic(() => import("./forms/ClassForm"), {
//     loading: () => <h1>Loading...</h1>,
// });

// // Form type and table type definitions
// type FormType = "create" | "update" | "delete";
// type TableType =
//     | "teacher"
//     | "student"
//     | "parent"
//     | "subject"
//     | "class"
//     | "lesson"
//     | "exam"
//     | "result"
//     | "attendance"
//     | "event"
//     | "announcement";

// // Props for FormModal component
// interface FormModalProps {
//     table: TableType;
//     type: FormType;
//     data?: Record<string, unknown>;
//     id?: number;
// }

// // Props passed to each form component
// interface FormComponentProps {
//     type: "create" | "update";
//     data?: Record<string, unknown>;
//     onSuccess?: () => void;
// }

// // Map table names to components (excluding unimplemented ones)
// const forms: {
//     [key in Exclude<
//         FormModalProps["table"],
//         "subject" | "lesson" | "exam" | "result" | "attendance" | "event" | "announcement"
//     >]: (props: FormComponentProps) => JSX.Element;
// } = {
//     teacher: (props) => <TeacherForm {...props} />,
//     student: (props) => <StudentForm {...props} />,
//     parent: (props) => <ParentForm {...props} />,
//     class: (props) => <ClassForm {...props} />,
// };

// const FormModal = ({ table, type, data, id }: FormModalProps) => {
//     const size = type === "create" ? "w-9 h-8" : "w-7 h-7";
//     const bgColor =
//         type === "create"
//             ? "bg-[var(--yelloww-color)]"
//             : type === "update"
//             ? "bg-[var(--sky-color)]"
//             : "bg-[var(--purplee-color)]";

//     const [open, setOpen] = useState(false);
//     const router = useRouter();

//     const handleSuccess = () => {
//         router.refresh();
//         setOpen(false);
//     };

//     const Form = () => {
//         if (type === "delete" && id !== undefined) {
//             return (
//                 <form
//                     className="flex flex-col gap-4"
//                     action={async () => {
//                         // Replace with your delete logic
//                         // await deleteTeacher(id);
//                         router.refresh();
//                         setOpen(false);
//                     }}
//                 >
//                     <span className="text-center font-medium">
//                         All data will be lost. Are you sure you want to delete this {table}?
//                     </span>
//                     <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
//                         Delete
//                     </button>
//                 </form>
//             );
//         } else if ((type === "create" || type === "update") && table in forms) {
//             const FormComponent = forms[table as keyof typeof forms];
//             return <FormComponent type={type} data={data} onSuccess={handleSuccess} />;
//         } else {
//             return <p>Form not found</p>;
//         }
//     };

//     return (
//         <>
//             <button
//                 className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
//                 onClick={() => setOpen(true)}
//             >
//                 <Image src={`/${type}.png`} alt="" width={16} height={16} />
//             </button>
//             {open && (
//                 <div className="w-screen h-screen absolute left-0 top-0 bg-black/60 z-50 flex items-center justify-center">
//                     <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
//                         <Form />
//                         <div
//                             className="absolute top-4 right-4 cursor-pointer"
//                             onClick={() => setOpen(false)}
//                         >
//                             <Image src="/close.png" alt="Close" width={14} height={14} />
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default FormModal;

// components/FormModal.tsx
"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";

// Dynamically import forms
const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
    loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
    loading: () => <h1>Loading...</h1>,
});
const ParentForm = dynamic(() => import("./forms/ParentForm"), {
    loading: () => <h1>Loading...</h1>,
});
const ClassForm = dynamic(() => import("./forms/ClassForm"), {
    loading: () => <h1>Loading...</h1>,
});

// Types
type FormType = "create" | "update" | "delete";
type TableType =
    | "teacher"
    | "student"
    | "parent"
    | "class"
    | "subject"
    | "lesson"
    | "exam"
    | "result"
    | "attendance"
    | "event"
    | "announcement";

interface FormModalProps {
    table: TableType;
    type: FormType;
    data?: Record<string, unknown>;
    id?: number;
}

interface FormComponentProps {
    type: "create" | "update";
    data?: Record<string, unknown>;
    onSuccess?: () => void;
}

const forms: {
    [K in Exclude<
        FormModalProps["table"],
        "subject" | "lesson" | "exam" | "result" | "attendance" | "event" | "announcement"
    >]: (props: FormComponentProps) => JSX.Element;
} = {
    teacher: (props) => <TeacherForm {...props} />,
    student: (props) => <StudentForm {...props} />,
    parent: (props) => <ParentForm {...props} />,
    class: (props) => <ClassForm {...props} />,
};

export default function FormModal({ table, type, data, id }: FormModalProps) {
    const size = type === "create" ? "w-9 h-8" : "w-7 h-7";
    const bgColor =
        type === "create"
            ? "bg-[var(--yelloww-color)]"
            : type === "update"
            ? "bg-[var(--sky-color)]"
            : "bg-[var(--purplee-color)]";

    const [open, setOpen] = useState(false);
    const router = useRouter();

    function handleSuccess() {
        router.refresh();
        setOpen(false);
    }

    const Form = () => {
        if (type === "delete" && id !== undefined) {
            return (
                <form
                    className="flex flex-col gap-4"
                    action={async () => {
                        /* your delete logic */
                        router.refresh();
                        setOpen(false);
                    }}
                >
                    <span className="text-center">
                        Are you sure you want to delete this {table}? This is permanent.
                    </span>
                    <button className="bg-red-700 text-white py-2 px-4 rounded self-center">
                        Delete
                    </button>
                </form>
            );
        }

        if ((type === "create" || type === "update") && table in forms) {
            const C = forms[table as keyof typeof forms];
            return <C type={type} data={data} onSuccess={handleSuccess} />;
        }

        return <p>Form not found</p>;
    };

    return (
        <>
            <button
                className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
                onClick={() => setOpen(true)}
            >
                <Image src={`/${type}.png`} alt="" width={16} height={16} />
            </button>

            {open && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="relative bg-white p-6 rounded-lg w-[90%] md:w-3/4 lg:w-1/2">
                        <Form />
                        <button className="absolute top-4 right-4" onClick={() => setOpen(false)}>
                            <Image src="/close.png" alt="Close" width={16} height={16} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
