import React, { useState } from "react";
import { getDataObjects } from "../helpers/getDataObjects";
import { useEditor } from "@craftjs/core";
import { useDispatch, useSelector } from "react-redux";
import { isValidCondition } from "../helpers/isValidCondition";
import { COLORS } from "@/app/_lib/constants/colors";
import {
  updateCondition,
  setConditionsForNode,
} from "@/app/_lib/redux/features/workflow/updateConditionSlice";
import { useUpdateWorkflowOrConditionNodeMutation } from "@/app/_lib/redux/features/workflow/workflowApi";
import { handleClosePopupModel } from "@/app/_lib/redux/features/popupModel/popupModelSlice";

function BuildAndUpdateButtonButton({ conditionNodeData }) {
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const nodeId = conditionNodeData.id;
  const updateConditions = useSelector(
    (state) => state.updateConditions[nodeId] || []
  );
  const [updateWorkflowOrConditionNode] =
    useUpdateWorkflowOrConditionNodeMutation();

  const { actions, query, enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const clearCanvas = () => {
    const nodes = query.getNodes();
    Object.keys(nodes).forEach((nodeId) => {
      if (nodeId !== "ROOT") {
        actions.delete(nodeId);
      }
    });
  };

  const handleSetCondition = () => {
    const newCondition = getDataObjects(query.serialize());
    if (isValidCondition(newCondition)) {
      setError("");
      dispatch(updateCondition({ nodeId, condition: newCondition }));
      setTimeout(() => {
        clearCanvas();
      }, 0);
    } else {
      setError("Condition is invalid! please check again...");
    }
  };

  const handleSave = async () => {
    try {
      const result = await updateWorkflowOrConditionNode({
        ...conditionNodeData,
        workflow_detail_data_object: [{ conditions: updateConditions }],
        workflow_detailI_id: conditionNodeData.id,
      });
      if (result.error) {
        console.error("Error updating workflow node:", result.error);
      } else {
        console.log("Workflow node updated successfully:", result.data);
        dispatch(handleClosePopupModel());
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <div className="mt-3 mb-1 ">
      {error && <p className="mb-4 font-semibold text-red-600">{error}</p>}

      <div className="flex items-center">
        <div>
          <button
            onClick={handleSetCondition}
            className={`px-6 py-2 mr-2 text-white bg-[${COLORS.FORM_UPDATE_BUTTON}] rounded-md`}
          >
            Build Condition
          </button>
          <button
            onClick={handleSave}
            className={`px-6 py-2 mr-2 text-white bg-[${COLORS.FORM_UPDATE_BUTTON}] rounded-md`}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuildAndUpdateButtonButton;
