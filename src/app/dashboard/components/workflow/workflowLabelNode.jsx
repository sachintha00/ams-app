import React from "react";
import WorkflowConditionNode from "./workflowConditionNode";
import WorkflowNode from "./workflowNode";
import WorkflowApprovedNode from "./workflowApprovedNode";

export default function WorkflowLabelNode(props) {
  if (props.nodeType === "Workflow") {
    return (
      <WorkflowNode
        openAddFormModal={props.openAddFormModal}
        node={props.node}
        setFormType={props.setFormType}
        workflowId={props.workflowId}
      />
    );
  } else if (props.nodeType === "Condition") {
    return (
      <WorkflowConditionNode
        openAddFormModal={props.openAddFormModal}
        setFormType={props.setFormType}
        workflowId={props.workflowId}
        node={props.node}
      />
    );
  } else {
    return <WorkflowApprovedNode node={props.node} />;
  }
}
