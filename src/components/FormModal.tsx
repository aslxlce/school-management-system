// // src/components/FormModal.tsx
// "use client";

// import dynamic from "next/dynamic";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useState, type FC } from "react";

// export interface FormComponentProps {
//     type: "create" | "update";
//     data?: Record<string, unknown>;
//     onSuccess?: () => void;
//     onCancel?: () => void;
// }

// const RawTeacherForm = dynamic(() => import("./forms/TeacherForm"), {
//     ssr: false,
// }) as FC<FormComponentProps>;

// const RawStudentForm = dynamic(() => import("./forms/StudentForm"), {
//     ssr: false,
// }) as FC<FormComponentProps>;

// const RawParentForm = dynamic(() => import("./forms/ParentForm"), {
//     ssr: false,
// }) as FC<FormComponentProps>;

// const RawClassForm = dynamic(() => import("./forms/ClassForm"), {
//     ssr: false,
// }) as FC<FormComponentProps>;

// const RawAnnouncementForm = dynamic(() => import("./forms/AnnouncementForm"), {
//     ssr: false,
// }) as FC<FormComponentProps>;

// const RawEventForm = dynamic(() => import("./forms/EventForm"), {
//     ssr: false,
// }) as FC<FormComponentProps>;

// export type TableType = "teacher" | "student" | "parent" | "class" | "announcement" | "event";

// const forms: Record<TableType, FC<FormComponentProps>> = {
//     teacher: RawTeacherForm,
//     student: RawStudentForm,
//     parent: RawParentForm,
//     class: RawClassForm,
//     announcement: RawAnnouncementForm,
//     event: RawEventForm,
// };

// export type FormType = "create" | "update" | "delete";

// interface FormModalProps {
//     table: TableType;
//     type: FormType;
//     data?: Record<string, unknown>;
//     id?: string | number;
// }

// export default function FormModal({ table, type, data, id }: FormModalProps) {
//     const [open, setOpen] = useState(false);
//     const router = useRouter();

//     function handleSuccess() {
//         router.refresh();
//     }

//     function handleCancel() {
//         setOpen(false);
//     }

//     let body: React.ReactNode;

//     if (type === "delete" && id != null) {
//         body = (
//             <form
//                 onSubmit={async (e) => {
//                     e.preventDefault();
//                     handleSuccess();
//                 }}
//                 className="flex flex-col gap-4"
//             >
//                 <p className="text-center">
//                     Are you sure you want to delete this <strong>{table}</strong>? This cannot be
//                     undone.
//                 </p>
//                 <button className="bg-red-700 text-white py-2 px-4 rounded self-center">
//                     Delete
//                 </button>
//                 <button
//                     type="button"
//                     onClick={handleCancel}
//                     className="mt-2 px-4 py-2 border rounded self-center"
//                 >
//                     Cancel
//                 </button>
//             </form>
//         );
//     } else if ((type === "create" || type === "update") && forms[table]) {
//         const C = forms[table];
//         body = <C type={type} data={data} onSuccess={handleSuccess} onCancel={handleCancel} />;
//     } else {
//         body = <p>Form not implemented for “{table}”.</p>;
//     }

//     const size = type === "create" ? "w-9 h-8" : "w-7 h-7";
//     const bg =
//         type === "create" ? "bg-yellow-400" : type === "update" ? "bg-sky-400" : "bg-purple-400";

//     return (
//         <>
//             <button
//                 className={`${size} ${bg} flex items-center justify-center rounded-full`}
//                 onClick={() => setOpen(true)}
//             >
//                 <Image src={`/${type}.png`} alt={type} width={16} height={16} />
//             </button>

//             {open && (
//                 <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
//                     <div className="relative bg-white p-6 rounded-lg w-[90%] md:w-3/4 lg:w-1/2">
//                         {body}
//                         <button className="absolute top-4 right-4" onClick={handleCancel}>
//                             <Image src="/close.png" alt="Close" width={16} height={16} />
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }

// src/components/FormModal.tsx
"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FC } from "react";

export interface FormComponentProps {
    type: "create" | "update";
    data?: Record<string, unknown>;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const RawTeacherForm = dynamic(() => import("./forms/TeacherForm"), {
    ssr: false,
}) as FC<FormComponentProps>;

const RawStudentForm = dynamic(() => import("./forms/StudentForm"), {
    ssr: false,
}) as FC<FormComponentProps>;

const RawParentForm = dynamic(() => import("./forms/ParentForm"), {
    ssr: false,
}) as FC<FormComponentProps>;

const RawClassForm = dynamic(() => import("./forms/ClassForm"), {
    ssr: false,
}) as FC<FormComponentProps>;

const RawAnnouncementForm = dynamic(() => import("./forms/AnnouncementForm"), {
    ssr: false,
}) as FC<FormComponentProps>;

const RawEventForm = dynamic(() => import("./forms/EventForm"), {
    ssr: false,
}) as FC<FormComponentProps>;

export type TableType = "teacher" | "student" | "parent" | "class" | "announcement" | "event";

const forms: Record<TableType, FC<FormComponentProps>> = {
    teacher: RawTeacherForm,
    student: RawStudentForm,
    parent: RawParentForm,
    class: RawClassForm,
    announcement: RawAnnouncementForm,
    event: RawEventForm,
};

export type FormType = "create" | "update" | "delete";

interface FormModalProps {
    table: TableType;
    type: FormType;
    data?: Record<string, unknown>;
    id?: string | number;
}

export default function FormModal({ table, type, data, id }: FormModalProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    function handleSuccess() {
        router.refresh();
        setOpen(false); // 🔹 auto-close after success
    }

    function handleCancel() {
        setOpen(false);
    }

    let body: React.ReactNode;

    if (type === "delete" && id != null) {
        body = (
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    handleSuccess();
                }}
                className="flex flex-col gap-4"
            >
                <p className="text-center">
                    Are you sure you want to delete this <strong>{table}</strong>? This cannot be
                    undone.
                </p>
                <button className="bg-red-700 text-white py-2 px-4 rounded self-center">
                    Delete
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    className="mt-2 px-4 py-2 border rounded self-center"
                >
                    Cancel
                </button>
            </form>
        );
    } else if ((type === "create" || type === "update") && forms[table]) {
        const C = forms[table];
        body = <C type={type} data={data} onSuccess={handleSuccess} onCancel={handleCancel} />;
    } else {
        body = <p>Form not implemented for “{table}”.</p>;
    }

    const size = type === "create" ? "w-9 h-8" : "w-7 h-7";
    const bg =
        type === "create" ? "bg-yellow-400" : type === "update" ? "bg-sky-400" : "bg-purple-400";

    return (
        <>
            <button
                className={`${size} ${bg} flex items-center justify-center rounded-full`}
                onClick={() => setOpen(true)}
            >
                <Image src={`/${type}.png`} alt={type} width={16} height={16} />
            </button>

            {open && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="relative bg-white p-6 rounded-lg w-[90%] md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto">
                        {body}
                        <button className="absolute top-4 right-4" onClick={handleCancel}>
                            <Image src="/close.png" alt="Close" width={16} height={16} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
