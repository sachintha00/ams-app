import {
  useAddWorkflowOrConditionNodeMutation,
  useDeleteWorkflowDetailNodeMutation,
  useGetworkflowDetailsListQuery,
} from "@/app/_lib/redux/features/workflow/workflowApi";
import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { isWorkflowDetailNodeAvailable } from "./helpers/isWorkflowDetailNodeAvailable";
import { COLORS } from "@/app/_lib/constants/colors";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrUpdate } from "react-icons/gr";
import { FORM_TYPE } from "@/app/_lib/constants/formType";
import { handleOpenPopupModel } from "@/app/_lib/redux/features/popupModel/popupModelSlice";
import { useDispatch } from "react-redux";

export default function WorkflowNode({
  openAddFormModal,
  node,
  setFormType,
  workflowId,
}) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { data: workflowDetailData, refetch } =
    useGetworkflowDetailsListQuery(workflowId);
  const [addWorkflowOrConditionNode] = useAddWorkflowOrConditionNodeMutation();
  const [deleteWorkflowDetailNode, { isLoading, error }] =
    useDeleteWorkflowDetailNodeMutation();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const togglePopup = () => {
    openAddFormModal();
  };

  const setType = (type) => {
    setFormType(type);
    togglePopup();
  };

  const handleApproved = async () => {
    try {
      if (
        !isWorkflowDetailNodeAvailable(workflowDetailData, {
          workflowTypeId: 3,
          behaviorTypeId: 4,
          orderId: node?.workflow_detail_order + 1,
        })
      ) {
        const result = await addWorkflowOrConditionNode({
          workflow_id: node?.workflow_id,
          workflow_detail_parent_id: node?.workflow_detail_id,
          workflow_detail_type_id: 3,
          workflow_detail_behavior_type_id: 4,
          workflow_detail_order: node?.workflow_detail_order + 1,
          workflow_detail_level: 0,
          workflow_detail_data_object: [{}],
        });

        if (result.error) {
          console.error("Error adding workflow node:", result.error);
        } else {
          console.log("Workflow node added successfully:", result.data);
          refetch();
        }
      } else {
        console.log("Already Approved");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteWorkflowDetailNode(node?.workflow_detail_id).unwrap();
    } catch (error) {
      console.error("Error deleting workflow detail node:", error);
    }
  };

  const handleUpdate = async () => {
    dispatch(
      handleOpenPopupModel({
        id: node?.workflow_detail_id,
        value: "WORKFLOW_NODE",
        formType: FORM_TYPE.UPDATE,
      })
    );
  };

  return (
    <div className="relative">
      <div
        className={`text-gray-700 border z-0 w-[350px] inline-block rounded-md`}
        style={{ backgroundColor: `${COLORS.WORKFLOW_NODE}` }}
      >
        <div className="grid grid-rows-2">
          <div className="mt-2 text-xl font-bold">Workflow </div>
          <div className="flex flex-row-reverse mx-5">
            <button className="" onClick={toggleDropdown}>
              {isOpen ? (
                <FaMinus className="text-xl" />
              ) : (
                <FaPlus className="text-xl" />
              )}
            </button>
            <button className="mr-3" onClick={() => handleUpdate()}>
              <GrUpdate />
            </button>
            {Object.keys(node.children).length === 0 && (
              <button className="mr-3 " onClick={() => handleDelete()}>
                <RiDeleteBin6Line className="text-xl" />
              </button>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
          style={{
            top: "calc(40% + 10px)",
            left: "50%",
            transform: "translateX(100%)",
          }}
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownRightEndButton"
          >
            <li>
              <a
                onClick={() => setType("Workflow")}
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Workflow
              </a>
            </li>
            <li>
              <a
                onClick={() => setType("ConditionBuilder")}
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Condition
              </a>
            </li>
            <li>
              <a
                onClick={handleApproved}
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Approved
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
