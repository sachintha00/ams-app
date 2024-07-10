function buildTree(data, { parentIdKey, idKey, parentId = 0 }) {
  const children = data.filter((node) => node[parentIdKey] === parentId);

  return children.map((child) => ({
    ...child,
    children: buildTree(data, { parentIdKey, idKey, parentId: child[idKey] }),
  }));
}

export const tableDataToTreeStructure = (
  organizationData,
  parentIdKey,
  idKey
) => {
  const params = { parentIdKey, idKey };
  const transformedData = buildTree(organizationData, params);
  return transformedData[0];
};

// const data = [
//   {
//     workflow_id: 12,
//     workflow_name: "Sample Workflow",
//     workflow_description: "Description for Sample Workflow",
//     workflow_detail_id: 12,
//     workflow_detail_parent_id: 11,
//     detail_workflow_id: 12,
//     workflow_detail_type_id: 1,
//     workflow_detail_behavior_type_id: 1,
//     workflow_detail_order: 1,
//     workflow_detail_level: 1,
//     workflow_detail_data_object: [
//       {
//         user_id: 1,
//         user_name: "hello",
//       },
//     ],
//     workflow_request_type: "Asset Requisition",
//     workflow_detail_type: "Workflow",
//     workflow_detail_behavior_type: "Employee",
//   },
//   {
//     workflow_id: 13,
//     workflow_name: "Sample Workflow",
//     workflow_description: "Description for Sample Workflow",
//     workflow_detail_id: 13,
//     workflow_detail_parent_id: 11,
//     detail_workflow_id: 13,
//     workflow_detail_type_id: 1,
//     workflow_detail_behavior_type_id: 1,
//     workflow_detail_order: 1,
//     workflow_detail_level: 1,
//     workflow_detail_data_object: [
//       {
//         user_id: 1,
//         user_name: "hello",
//       },
//     ],
//     workflow_request_type: "Asset Requisition",
//     workflow_detail_type: "Workflow",
//     workflow_detail_behavior_type: "Employee",
//   },
//   {
//     workflow_id: 11,
//     workflow_name: "Sample Workflow",
//     workflow_description: "Description for Sample Workflow",
//     workflow_detail_id: 11,
//     workflow_detail_parent_id: 0,
//     detail_workflow_id: 11,
//     workflow_detail_type_id: 1,
//     workflow_detail_behavior_type_id: 1,
//     workflow_detail_order: 1,
//     workflow_detail_level: 1,
//     workflow_detail_data_object: [
//       {
//         user_id: 1,
//         user_name: "hello",
//       },
//     ],
//     workflow_request_type: "Asset Requisition",
//     workflow_detail_type: "Workflow",
//     workflow_detail_behavior_type: "Employee",
//   },
// ];

// console.log(
//   organizationTableDataToTreeStructure(
//     data,
    // "workflow_detail_parent_id",
    // "workflow_detail_id"
//   )
// );
