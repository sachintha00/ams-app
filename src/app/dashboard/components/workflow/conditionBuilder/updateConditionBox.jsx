import React from "react";
import { useEditor } from "@craftjs/core";
import { useDispatch, useSelector } from "react-redux";
import ConditionButton from "./conditionButton";
import { removeUpdateCondition } from "@/app/_lib/redux/features/workflow/updateConditionSlice";

function UpdateConditionBox({ nodeId }) {
  const { connectors } = useEditor();
  const updateConditions = useSelector(
    (state) => state.updateConditions[nodeId] || []
  );
  const dispatch = useDispatch();

  const colors = ["bg-blue-100", "bg-purple-100", "bg-green-100"];

  const handleRemove = (index) => {
    dispatch(removeUpdateCondition({ nodeId, index }));
  };

  return (
    <div className="">
      {updateConditions.map((value, index) => {
        const colorIndex = index % colors.length;
        const randomColor = colors[colorIndex];

        return (
          <div
            key={index}
            ref={(ref) =>
              connectors.create(ref, <ConditionButton value={value} />)
            }
            className={`relative inline-flex items-center px-4 py-2 mb-2 mr-2 text-sm font-medium text-black ${randomColor} border border-transparent rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
          >
            <span className="flex-grow px-2 text-center">{value}</span>
            <button
              onClick={() => handleRemove(index)}
              className="absolute px-1 text-white bg-gray-500 rounded-full -right-1 -top-1"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default UpdateConditionBox;
