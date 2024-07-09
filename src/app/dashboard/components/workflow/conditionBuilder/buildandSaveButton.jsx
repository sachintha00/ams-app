import React, { useState } from "react";
import { getDataObjects } from "../helpers/getDataObjects";
import { useEditor } from "@craftjs/core";
import { useDispatch, useSelector } from "react-redux";
import { addCondition } from "@/app/_lib/redux/features/workflow/condtionsSlice";
import { isValidCondition } from "../helpers/isValidCondition";
import {
  useAddWorkflowOrConditionNodeMutation,
  useGetworkflowDetailsListQuery,
} from "@/app/_lib/redux/features/workflow/workflowApi";
import { isWorkflowDetailNodeAvailable } from "../helpers/isWorkflowDetailNodeAvailable";

function BuildAndSaveButton({ node, workflowId }) {
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const conditions = useSelector((state) => state.conditions);
  const { data: workflowDetailData, refetch } =
    useGetworkflowDetailsListQuery(workflowId);
  const [addWorkflowOrConditionNode] = useAddWorkflowOrConditionNodeMutation();

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
      dispatch(addCondition(newCondition));
      setTimeout(() => {
        clearCanvas();
      }, 0);
    } else {
      setError("Condtion is invalid! please check again...");
    }
  };

  const handleSave = async () => {
    try {
      if (node === undefined) {
        const result = await addWorkflowOrConditionNode({
          workflow_id: workflowId,
          workflow_detail_parent_id: 0,
          workflow_detail_type_id: 2,
          workflow_detail_behavior_type_id: 5,
          workflow_detail_order: 1,
          workflow_detail_level: 0,
          workflow_detail_data_object: [{ conditions }],
        });

        if (result.error) {
          console.error("Error adding condition node:", result.error);
        } else {
          console.log("Condition node added successfully:", result.data);
          refetch();
        }
      } else {
        if (
          !isWorkflowDetailNodeAvailable(workflowDetailData, {
            workflowTypeId: 2,
            behaviorTypeId: 5,
            orderId: node?.workflow_detail_order + 1,
          })
        ) {
          if (!error) {
            const result = await addWorkflowOrConditionNode({
              workflow_id: node?.workflow_id,
              workflow_detail_parent_id: node?.workflow_detail_id,
              workflow_detail_type_id: 2,
              workflow_detail_behavior_type_id: 5,
              workflow_detail_order: node?.workflow_detail_order + 1,
              workflow_detail_level: 0,
              workflow_detail_data_object: [{ conditions }],
            });

            if (result.error) {
              console.error("Error adding condition node:", result.error);
            } else {
              console.log("Condition node added successfully:", result.data);
              refetch();
            }
          } else {
            console.log(error);
          }
        } else {
          console.log("Condition node already build");
        }
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
            className="px-6 py-2 mr-2 text-white bg-blue-800 rounded-md"
          >
            Build Condition
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 mr-2 text-white bg-blue-800 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuildAndSaveButton;
