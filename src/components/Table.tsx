// import React from "react";

import React from "react";

// const Table = ({
//     columns,
//     renderRow,
//     data,
// }: {
//     columns: { header: string; accessor: string; className?: string }[];
//     renderRow: (item: any) => React.ReactNode;
//     data: any[];
// }) => {
//     return (
//         <table className="w-full mt-4">
//             <thead>
//                 <tr className="text-left text-gray-500 text-sm">
//                     {columns.map((col) => (
//                         <th key={col.accessor} className={col.className}>
//                             {col.header}
//                         </th>
//                     ))}
//                 </tr>
//             </thead>
//             <tbody>
//                 {data.map((item) => (
//                     <React.Fragment key={item.id}>{renderRow(item)}</React.Fragment>
//                 ))}
//             </tbody>
//         </table>
//     );
// };

// export default Table;

type TableProps<T> = {
    columns: { header: string; accessor: keyof T | string; className?: string }[];
    renderRow: (item: T) => React.ReactNode;
    data: T[];
};

const Table = <T,>({ columns, renderRow, data }: TableProps<T>) => {
    return (
        <table className="w-full mt-4">
            <thead>
                <tr className="text-left text-gray-500 text-sm">
                    {columns.map((col) => (
                        <th key={col.accessor.toString()} className={col.className}>
                            {col.header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>{data.map((item) => renderRow(item))}</tbody>
        </table>
    );
};

export default Table;
