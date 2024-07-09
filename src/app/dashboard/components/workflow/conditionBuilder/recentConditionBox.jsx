import React from "react";
import { useEditor } from "@craftjs/core";
import { useDispatch, useSelector } from "react-redux";
import ConditionButton from "./conditionButton";
import { removeCondition } from "@/app/_lib/redux/features/workflow/condtionsSlice";

function RecentConditionBox() {
  const { connectors } = useEditor();
  const conditions = useSelector((state) => state.conditions);
  const dispatch = useDispatch();

  const colors = [
    "bg-blue-100",
    "bg-purple-100",
    "bg-green-100",
  ];

  const handleRemove = (index) => {
    dispatch(removeCondition(index));
  };

  return (
    <div className="">
      {conditions.map((value, index) => {
        // const randomColor = colors[Math.floor(Math.random() * colors.length)];
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

export default RecentConditionBox;
