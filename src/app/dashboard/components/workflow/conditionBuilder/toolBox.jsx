import React from "react";
import { useEditor, Element } from "@craftjs/core";
import ConditionButton from "./conditionButton";
import InputField from "./inputField";

function ToolBox() {
  const { connectors } = useEditor();
  return (
    <div className="">
      <div
        ref={(ref) => connectors.create(ref, <ConditionButton value=">" />)}
        className="inline-flex items-center px-4 py-2 mb-2 mr-2 text-sm font-medium text-black bg-gray-300 border border-transparent rounded-md cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        {">"}
      </div>
      <div
        ref={(ref) => connectors.create(ref, <ConditionButton value="<" />)}
        className="inline-flex items-center px-4 py-2 mb-2 mr-2 text-sm font-medium text-black bg-gray-300 border border-transparent rounded-md cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        {"<"}
      </div>
      <div
        ref={(ref) => connectors.create(ref, <ConditionButton value=">=" />)}
        className="inline-flex items-center px-4 py-2 mb-2 mr-2 text-sm font-medium text-black bg-gray-300 border border-transparent rounded-md cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        {">="}
      </div>
      <div
        ref={(ref) => connectors.create(ref, <ConditionButton value="<=" />)}
        className="inline-flex items-center px-4 py-2 mb-2 mr-2 text-sm font-medium text-black bg-gray-300 border border-transparent rounded-md cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        {"<="}
      </div>
      <div
        ref={(ref) => connectors.create(ref, <ConditionButton value="==" />)}
        className="inline-flex items-center px-4 py-2 mb-2 mr-2 text-sm font-medium text-black bg-gray-300 border border-transparent rounded-md cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        {"=="}
      </div>
      <div
        ref={(ref) => connectors.create(ref, <ConditionButton value="!=" />)}
        className="inline-flex items-center px-4 py-2 mb-2 mr-2 text-sm font-medium text-black bg-gray-300 border border-transparent rounded-md cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        {"!="}
      </div>
      <div
        ref={(ref) => connectors.create(ref, <ConditionButton value="and" />)}
        className="inline-flex items-center px-4 py-2 mb-2 mr-2 text-sm font-medium text-black bg-gray-300 border border-transparent rounded-md cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        {"and"}
      </div>
      <div
        ref={(ref) => connectors.create(ref, <ConditionButton value="or" />)}
        className="inline-flex items-center px-4 py-2 mb-2 mr-2 text-sm font-medium text-black bg-gray-300 border border-transparent rounded-md cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        {"or"}
      </div>
      <div
        ref={(ref) => connectors.create(ref, <InputField value="input here" />)}
        className="inline-flex items-center px-4 py-2 mb-2 mr-2 text-sm font-medium text-black bg-gray-300 border border-transparent rounded-md cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        {"Input Value"}
      </div>
    </div>
  );
}

export default ToolBox;
