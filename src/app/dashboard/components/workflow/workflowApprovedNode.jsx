import { COLORS } from "@/app/_lib/constants/colors";
import { useDeleteWorkflowDetailNodeMutation } from "@/app/_lib/redux/features/workflow/workflowApi";
import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function WorkflowApprovedNode({ node }) {
  const [deleteWorkflowDetailNode, { isLoading, error }] =
    useDeleteWorkflowDetailNodeMutation();

  const handleDelete = async () => {
    try {
      await deleteWorkflowDetailNode(node?.workflow_detail_id).unwrap();
    } catch (error) {
      console.error("Error deleting workflow detail node:", error);
    }
  };

  return (
    <div
      className="text-gray-700   relative z-0 w-[350px] inline-block rounded-md"
      style={{ backgroundColor: `${COLORS.WORKFLOW_APPROVED_NODE}` }}
    >
      Approved
      <div className="flex flex-row-reverse mx-5">
        {Object.keys(node.children).length === 0 && (
          <button className="mb-2" onClick={() => handleDelete()}>
            <RiDeleteBin6Line className="text-xl" />
          </button>
        )}
      </div>
    </div>
  );
}
