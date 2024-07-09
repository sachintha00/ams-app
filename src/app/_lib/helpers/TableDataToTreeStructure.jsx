function buildTree(data, parentId = 0) {
  const children = data.filter((node) => node.parent_node_id === parentId);

  return children.map((child) => ({
    id: child.id,
    organizationData: child.data,
    parentNode: parentId,
    level: child.level,
    relation: child.relationship,
    children: buildTree(data, child.id),
  }));
}

export const organizationTableDataToTreeStructure = (organizationData) => {
  const transformedData = buildTree(organizationData);
  return transformedData[0];
};
