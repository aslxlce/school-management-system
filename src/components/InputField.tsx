// import { FieldError } from "react-hook-form";

// type InputFieldProps = {
//     label: string;
//     type?: string;
//     register: any;
//     name: string;
//     defaultValue?: string;
//     error?: FieldError;
//     inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
// };

// const InputField = ({
//     label,
//     type = "text",
//     register,
//     name,
//     defaultValue,
//     error,
//     inputProps,
// }: InputFieldProps) => {
//     return (
//         <div className="flex flex-col gap-2 w-full md:w-1/4">
//             <label className="text-xs text-gray-500">{label}</label>
//             <input
//                 type={type}
//                 {...register(name)}
//                 className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
//                 {...inputProps}
//                 defaultValue={defaultValue}
//             />
//             {error?.message && <p className="text-xs text-red-400">{error.message.toString()}</p>}
//         </div>
//     );
// };

// export default InputField;

import { FieldError, FieldValues, Path, UseFormRegister } from "react-hook-form";

export type InputFieldProps<TFieldValues extends FieldValues> = {
    label: string;
    /** Name of the field in your form schema */
    name: Path<TFieldValues>;
    /** register from useForm() */
    register: UseFormRegister<TFieldValues>;
    type?: string;
    defaultValue?: string | number;
    error?: FieldError;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

function InputField<TFieldValues extends FieldValues>({
    label,
    name,
    register,
    type = "text",
    defaultValue,
    error,
    inputProps,
}: InputFieldProps<TFieldValues>) {
    return (
        <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">{label}</label>

            <input
                type={type}
                {...register(name)}
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                defaultValue={defaultValue}
                {...inputProps}
            />

            {error?.message && <p className="text-xs text-red-400">{error.message.toString()}</p>}
        </div>
    );
}

export default InputField;
