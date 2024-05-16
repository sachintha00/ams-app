import React from "react";
import { Editor, Frame, Element } from "@craftjs/core";
import ConditionButton from "../conditionBuilder/conditionButton";
import ToolBox from "../conditionBuilder/toolBox";
import Container from "../conditionBuilder/container";
import VariableBox from "../conditionBuilder/variableBox";
import InputField from "../conditionBuilder/inputField";
import BuildAndSaveButton from "../conditionBuilder/buildandSaveButton";
import RecentConditionBox from "../conditionBuilder/recentConditionBox";
import { useSelector } from "react-redux";

function ConditionBuilder({ node, workflowId }) {
  const conditions = useSelector((state) => state.conditions);
  return (
    <div className="mt-5">
      <Editor resolver={{ Container, ConditionButton, InputField }}>
        <div className="">
          <div className="flex flex-col">
            <h1 className="mb-4 text-2xl font-semibold text-black">
              Build Conditions
            </h1>
            <div className="mb-6">
              {conditions.length < 1 ? (
                <div className="italic font-normal text-gray-400">
                  Add your build conditions here...
                </div>
              ) : (
                <RecentConditionBox />
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
              <BuildAndSaveButton node={node} workflowId={workflowId} />
            </div>
          </div>
        </div>
      </Editor>
    </div>
  );
}

export default ConditionBuilder;
