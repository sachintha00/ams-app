import React, { useEffect, useState } from "react";
import { Editor, Frame, Element } from "@craftjs/core";
import ConditionButton from "../conditionBuilder/conditionButton";
import ToolBox from "../conditionBuilder/toolBox";
import Container from "../conditionBuilder/container";
import VariableBox from "../conditionBuilder/variableBox";
import InputField from "../conditionBuilder/inputField";
import { useDispatch, useSelector } from "react-redux";
import { useGetworkflowDetailNodesQuery } from "@/app/_lib/redux/features/workflow/workflowApi";
import BuildAndUpdateButtonButton from "../conditionBuilder/buildandUpdateButton";
import {
  updateCondition,
  setConditionsForNode,
  clearConditionsForNode,
} from "@/app/_lib/redux/features/workflow/updateConditionSlice";
import UpdateConditionBox from "../conditionBuilder/updateConditionBox";

function ConditionUpdateForm() {
  const dispatch = useDispatch();
  const { id: workflowDetailId } = useSelector((state) => state.popupModel);
  const { data: workflowDetailNode, isSuccess: isSuccessWorkflowDetailNode } =
    useGetworkflowDetailNodesQuery(workflowDetailId);
  const [conditionNodeData, setConditionNodeData] = useState({});

  const updateConditions = useSelector(
    (state) => state.updateConditions[workflowDetailId] || []
  );

  useEffect(() => {
    if (isSuccessWorkflowDetailNode && workflowDetailNode?.data?.length > 0) {
      const nodeData = workflowDetailNode.data[0];
      setConditionNodeData(nodeData);
      const workflowConditions =
        nodeData.workflow_detail_data_object[0]?.conditions || [];
      dispatch(
        setConditionsForNode({
          nodeId: workflowDetailId,
          conditions: workflowConditions,
        })
      );
    }

    return () => {
      dispatch(clearConditionsForNode({ nodeId: workflowDetailId }));
    };
  }, [
    isSuccessWorkflowDetailNode,
    workflowDetailNode,
    workflowDetailId,
    dispatch,
  ]);

  return (
    <div className="mt-5">
      <Editor resolver={{ Container, ConditionButton, InputField }}>
        <div className="">
          <div className="flex flex-col">
            <h1 className="mb-4 text-2xl font-semibold text-black">
              Build Conditions
            </h1>
            <div className="mb-6">
              {updateConditions.length < 1 ? (
                <div className="italic font-normal text-gray-400">
                  Add your build conditions here...
                </div>
              ) : (
                <UpdateConditionBox nodeId={workflowDetailId} />
              )}
            </div>
            <div className="flex">
              <ToolBox />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="grid grid-cols-3">
              <div className="col-span-2">
                <Frame>
                  <Element is={Container} canvas></Element>
                </Frame>
              </div>
              <div className="col-span-1 mx-4">
                <VariableBox />
              </div>
            </div>
            <div className="self-start text-black">
              <BuildAndUpdateButtonButton
                conditionNodeData={conditionNodeData}
              />
            </div>
          </div>
        </div>
      </Editor>
    </div>
  );
}

export default ConditionUpdateForm;
