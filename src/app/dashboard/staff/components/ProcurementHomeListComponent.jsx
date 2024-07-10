import { FORM_TYPE } from "@/app/_lib/constants/formType";
import { handleOpenPopupModel } from "@/app/_lib/redux/features/popupModel/popupModelSlice";
import { useRouter } from "next/navigation";
import React from "react";
import { FaPenToSquare } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

function ProcurementHomeListComponent({ data, searchField }) {
    const dispatch = useDispatch();

    const searchQuery =
        useSelector((state) => state.pageHeader.searchQuery) || "";

    const filteredData = data?.filter((item) =>
        item[searchField].toLowerCase().includes(searchQuery.toLowerCase())
    );


    const handleDelete = async (id, name) => {
        dispatch(
            handleOpenPopupModel({
                id,
                value: name,
                formType: FORM_TYPE.DELETE,
            })
        );
    };

    const handleUpdate = async (id, name) => {
        dispatch(
            handleOpenPopupModel({
                id,
                value: name,
                formType: FORM_TYPE.UPDATE,
            })
        );
    };
    return (
        <div className="overflow-x-auto border border-gray-200 sm:rounded-lg w-[-webkit-fill-available]">
            <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-[#606368] dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            User Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            User ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Asset Class
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Asset Class ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Created At
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Updated At
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((data) => (
                        <tr className="" key={data.staff_id}>
                            <th
                                scope="row"
                                className="px-6 py-4 font-medium text-gray-900 cursor-pointer whitespace-nowrap dark:text-white"
                                onClick={() => handleClick(data.staff_id)}
                            >
                                {data.name}
                            </th>
                            <td
                                className="px-6 py-4 cursor-pointer"
                                onClick={() => handleClick(data.staff_id)}
                            >
                                {data.user_id}
                            </td>
                            <td
                                className="px-6 py-4 cursor-pointer"
                                onClick={() => handleClick(data.staff_id)}
                            >
                                {data.asset_type_name ? "Active" : "Deactive"}
                            </td>
                            <td
                                className="px-6 py-4 cursor-pointer"
                                onClick={() => handleClick(data.staff_id)}
                            >
                                {data.asset_type_id}
                            </td>
                            <td
                                className="px-6 py-4 cursor-pointer"
                                onClick={() => handleClick(data.staff_id)}
                            >
                                {data.created_at}
                            </td>
                            <td
                                className="px-6 py-4 cursor-pointer"
                                onClick={() => handleClick(data.staff_id)}
                            >
                                {data.updated_at}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex w-[35%] justify-between">
                                    <a
                                        className="cursor-pointer"
                                        onClick={() =>
                                            handleUpdate(data.staff_id, data.name)
                                        }
                                    >
                                        <FaPenToSquare className="text-[#DBAE58] text-2xl" />
                                    </a>
                                    <a
                                        className="cursor-pointer"
                                        onClick={() =>
                                            handleDelete(data.staff_id, data.name)
                                        }
                                    >
                                        <MdDelete className="text-[#D32D41] text-2xl" />
                                    </a>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProcurementHomeListComponent;
