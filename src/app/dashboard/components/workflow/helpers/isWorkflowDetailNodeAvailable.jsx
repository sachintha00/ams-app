const isWorkflowDetailNodeAvailable = (
  workflowDetailsData,
  { workflowTypeId, behaviorTypeId, orderId }
) => {
  return workflowDetailsData?.data.some(
    (item) =>
      item.workflow_detail_type_id === workflowTypeId &&
      item.workflow_detail_behavior_type_id === behaviorTypeId &&
      item.workflow_detail_order === orderId
  );
};

export { isWorkflowDetailNodeAvailable };
