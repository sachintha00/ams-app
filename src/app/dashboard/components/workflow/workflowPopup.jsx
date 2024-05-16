import React from "react";
import ConditionForm from "./workflowForms/conditionForm";
import ConditionBuilder from "./workflowForms/conditionBuilder";
import WorkflowBuilder from "./workflowForms/workflowBuilder";

export default function WorkflowPopup({ onClose, node, type, workflowId }) {
  return (
    <div
      className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full"
      style={{ marginLeft: 0 }}
    >
      <div className="absolute w-full h-full bg-gray-900 opacity-50"></div>
      <div className="z-50 w-1/2 p-6 bg-white rounded-md">
        <div className="flex items-center justify-between p-4 border-b rounded-md md:p-5 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {type === "ConditionBuilder"
              ? "Condition Builder"
              : type === "Workflow"
              ? "Workflow Builder"
              : "Condition"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-transparent rounded-md hover:bg-gray-200 hover:text-gray-900 ms-auto dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-toggle="crud-modal"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        {type === "ConditionBuilder" ? (
          <ConditionBuilder node={node} workflowId={workflowId} />
        ) : type === "Workflow" ? (
          <WorkflowBuilder node={node} workflowId={workflowId} />
        ) : (
          <ConditionForm node={node} workflowId={workflowId} />
        )}
      </div>
    </div>
  );
}
