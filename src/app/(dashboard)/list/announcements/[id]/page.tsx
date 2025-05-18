// const columns = [
//     {
//         header: "Title",
//         accessor: "title",
//     },
//     {
//         header: "Class",
//         accessor: "class",
//         className: "hidden md:table-cell",
//     },
//     {
//         header: "Date",
//         accessor: "date",
//         className: "hidden md:table-cell",
//     },
// ];

const SingleAnnouncementPage = () => {
    // const renderRow = (item: Announcement) => (
    //     <tr
    //         key={item.id}
    //         className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[var(--purpleeLight-color)]"
    //     >
    //         <td className="flex items-center gap-4 p-4">
    //             <h3 className="font-semibold">{item.id}</h3>
    //         </td>
    //         <td className="hidden md:table-cell">{item.teacherId}</td>
    //         <td className="hidden md:table-cell">{item.subjects.join(",")}</td>

    //         <td>
    //             <div className="flex items-center gap-2"></div>
    //         </td>
    //     </tr>
    // );

    return (
        <>
            <div className="text-center font-semibold text-xl">Announcement</div>
            {/* <div className="flex-1 p-4  flex flex-col gap-4 xl:flex-row">
                <thead>
                    <tr className="text-left text-gray-500 text-sm">
                        <th>Title</th>
                    </tr>
                </thead>
            </div> */}
            {/* <Table columns={columns} renderRow={renderRow} data={teachersData} /> */}
            <div className="border border-gray-200 rounded-md p-4 bg-white mt-8">
                <table className=" text-left flex flex-col gap-4">
                    <tr className=" flex gap-4">
                        <th>Title: </th>
                        <td>No Class</td>
                    </tr>
                    <tr className=" flex gap-4">
                        <th>Class:</th>
                        <td>A1</td>
                    </tr>
                    <tr className=" flex gap-4">
                        <th>Date:</th>
                        <td>25-12-2025</td>
                    </tr>
                    <tr className=" flex gap-4">
                        <th>Description:</th>
                        <td>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil
                            accusantium inventore, similique nemo harum alias perspiciatis deleniti
                            et, aspernatur, sequi dicta. Natus porro quod rerum mollitia! Quibusdam,
                            soluta eaque. Officia?
                        </td>
                    </tr>
                </table>
            </div>
        </>
    );
};

export default SingleAnnouncementPage;
