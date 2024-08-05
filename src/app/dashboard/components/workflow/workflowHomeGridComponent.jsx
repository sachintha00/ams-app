import React from "react";
import { MdDelete } from "react-icons/md";
import { FaPenToSquare } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { handleOpenPopupModel } from "@/app/_lib/redux/features/popupModel/popupModelSlice";
import { FORM_TYPE } from "@/app/_lib/constants/formType";
import { BiEdit } from "react-icons/bi";

function WorkflowHomeGridComponent({
  id,
  icon,
  workflow_name,
  workflow_description,
}) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/workflow/${id}`);
  };

  const handleDelete = async () => {
    dispatch(
      handleOpenPopupModel({
        id,
        value: workflow_name,
        formType: FORM_TYPE.DELETE,
      })
    );
  };

  const handleUpdate = async () => {
    dispatch(
      handleOpenPopupModel({
        id,
        value: workflow_name,
        formType: FORM_TYPE.UPDATE,
      })
    );
  };

  return (
    <div className="w-full p-5  mt-2 max-w-sm bg-white border border-gray-300 rounded-md  dark:bg-[#1e1e1e] dark:border-gray-700 cursor-default">
      <div className="flex cursor-pointer" onClick={handleClick}>
        {icon}
        <div>
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            {workflow_name}
          </h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {workflow_description}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-end mt-4 md:mt-6">
        <div className="flex w-[35%] justify-between">
          <a className="cursor-pointer" onClick={handleUpdate}>
            <BiEdit className="text-yellow-400 hover:text-yellow-500 text-3xl" />
          </a>
          <a className="cursor-pointer" onClick={handleDelete}>
            <MdDelete className="text-red-400 hover:text-red-500 text-3xl" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default WorkflowHomeGridComponent;
