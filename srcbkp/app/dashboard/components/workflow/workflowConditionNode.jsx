import { COLORS } from "@/app/_lib/constants/colors";
import { FORM_TYPE } from "@/app/_lib/constants/formType";
import { handleOpenPopupModel } from "@/app/_lib/redux/features/popupModel/popupModelSlice";
import { useDeleteWorkflowDetailNodeMutation } from "@/app/_lib/redux/features/workflow/workflowApi";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch } from "react-redux";

export default function WorkflowConditionNode({
  openAddFormModal,
  setFormType,
  node,
}) {
  const dispatch = useDispatch();
  const [deleteWorkflowDetailNode, { isLoading, error }] =
    useDeleteWorkflowDetailNodeMutation();

  const togglePopup = () => {
    openAddFormModal();
  };

  const setType = (type) => {
    setFormType(type);
    togglePopup();
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
        value: "WORKFLOW_CONDITION_NODE",
        formType: FORM_TYPE.UPDATE,
      })
    );
  };

  return (
    <div
      className="text-gray-700 relative z-0 w-[350px] inline-block rounded-md"
      style={{ backgroundColor: `${COLORS.WORKFLOW_CONDITION_NODE}` }}
    >
      <div className="grid grid-rows-2">
        <div className="mt-2 text-xl font-bold">Condition</div>

        <div className="flex flex-row-reverse mx-5">
          <button onClick={() => setType("Condition")} className="">
            <FaPlus className="text-xl" />
          </button>
          <button className="mr-3">
            <GrUpdate onClick={() => handleUpdate()} />
          </button>
          {Object.keys(node.children).length === 0 && (
            <button className="mr-3">
              <RiDeleteBin6Line
                className="text-xl"
                onClick={() => handleDelete()}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
