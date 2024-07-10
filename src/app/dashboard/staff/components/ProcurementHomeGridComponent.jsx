import React, { useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { FaPenToSquare } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { handleOpenPopupModel } from "@/app/_lib/redux/features/popupModel/popupModelSlice";
import { FORM_TYPE } from "@/app/_lib/constants/formType";

function ProcurementHomeGridComponent({
    staff_id,
    icon,
    name,
    asset_type_name,
}) {
    const dispatch = useDispatch();

    const handleDelete = async () => {
        dispatch(
            handleOpenPopupModel({
                id: staff_id,
                value: name,
                formType: FORM_TYPE.DELETE,
            })
        );
    };

    const handleUpdate = async () => {
        dispatch(
            handleOpenPopupModel({
                id: staff_id,
                value: name,
                formType: FORM_TYPE.UPDATE,
            })
        );
    };

    return (
        <div className="w-full p-5  mt-2 max-w-sm bg-white border border-gray-300 rounded-md  dark:bg-[#1e1e1e] dark:border-gray-700 cursor-default">
            <div className="flex cursor-pointer" >
                {icon}
                <div>
                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                        {name}
                    </h5>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {asset_type_name}
                    </span>
                </div>
            </div>
            <div className="flex items-center justify-end mt-4 md:mt-6">
                <div className="flex w-[20%] justify-between">
                    <a className="cursor-pointer" onClick={handleUpdate}>
                        <FaPenToSquare className="text-[#DBAE58] text-2xl" />
                    </a>
                    <a className="cursor-pointer" onClick={handleDelete}>
                        <MdDelete className="text-[#D32D41] text-2xl" />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ProcurementHomeGridComponent;
