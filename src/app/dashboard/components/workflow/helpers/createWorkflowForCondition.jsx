export const createWorkflowForCondition = (value, selectedData, node) => {
  const isApproved = value === "APPROVED";
  return {
    workflow_id: node?.workflow_id,
    workflow_detail_parent_id: node?.workflow_detail_id,
    workflow_detail_type_id: isApproved ? 3 : 1,
    workflow_detail_behavior_type_id: isApproved ? 4 : 1,
    workflow_detail_order: node?.workflow_detail_order + 1,
    workflow_detail_level: isApproved ? 0 : node?.workflow_detail_level + 1,
    workflow_detail_data_object: isApproved ? [{}] : selectedData,
  };
};
