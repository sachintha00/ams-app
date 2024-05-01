import React from "react";
import { useEditor, Element } from "@craftjs/core";
import ConditionButton from "./conditionButton";

function VariableBox() {
  const { connectors } = useEditor();
  return (
    <div className="flex flex-col">
      <div
        ref={(ref) => connectors.create(ref, <ConditionButton value=">" />)}
        className="items-center px-4 py-2 mb-2 mr-2 text-sm font-medium text-black bg-gray-300 border border-transparent rounded-md cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        {"variable"}
      </div>
      <div
        ref={(ref) => connectors.create(ref, <ConditionButton value="<" />)}
        className="items-center px-4 py-2 mb-2 mr-2 text-sm font-medium text-black bg-gray-300 border border-transparent rounded-md cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        {"variable"}
      </div>
    </div>
  );
}

export default VariableBox;
