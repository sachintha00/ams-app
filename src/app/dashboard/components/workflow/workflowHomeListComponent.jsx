import { FORM_TYPE } from "@/app/_lib/constants/formType";
import { handleOpenPopupModel } from "@/app/_lib/redux/features/popupModel/popupModelSlice";
import { useRouter } from "next/navigation";
import React from "react";
import { FaPenToSquare } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

function WorkflowHomeListComponent({ data }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const searchQuery =
    useSelector((state) => state.pageHeader.searchQuery) || "";

  const filteredData = data?.filter((item) =>
    item.workflow_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClick = (id) => {
    router.push(`/dashboard/workflow/${id}`);
  };

  const handleDelete = async (id, workflow_name) => {
    dispatch(
      handleOpenPopupModel({
        id,
        value: workflow_name,
        formType: FORM_TYPE.DELETE,
      })
    );
  };

  const handleUpdate = async (id, workflow_name) => {
    dispatch(
      handleOpenPopupModel({
        id,
        value: workflow_name,
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
              Workflow Name
            </th>
            <th scope="col" className="px-6 py-3">
              Workflow Description
            </th>
            <th scope="col" className="px-6 py-3">
              Workflow Status
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
          {filteredData.map((workflow) => (
            <tr className="" key={workflow.id}>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 cursor-pointer whitespace-nowrap dark:text-white"
                onClick={() => handleClick(workflow.id)}
              >
                {workflow.workflow_name}
              </th>
              <td
                className="px-6 py-4 cursor-pointer"
                onClick={() => handleClick(workflow.id)}
              >
                {workflow.workflow_description}
              </td>
              <td
                className="px-6 py-4 cursor-pointer"
                onClick={() => handleClick(workflow.id)}
              >
                {workflow.workflow_status ? "Active" : "Deactive"}
              </td>
              <td
                className="px-6 py-4 cursor-pointer"
                onClick={() => handleClick(workflow.id)}
              >
                {workflow.created_at}
              </td>
              <td
                className="px-6 py-4 cursor-pointer"
                onClick={() => handleClick(workflow.id)}
              >
                {workflow.updated_at}
              </td>
              <td className="px-6 py-4">
                <div className="flex w-[35%] justify-between">
                  <a
                    className="cursor-pointer"
                    onClick={() =>
                      handleUpdate(workflow.id, workflow.workflow_name)
                    }
                  >
                    <FaPenToSquare className="text-[#DBAE58] text-2xl" />
                  </a>
                  <a
                    className="cursor-pointer"
                    onClick={() =>
                      handleDelete(workflow.id, workflow.workflow_name)
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

export default WorkflowHomeListComponent;
