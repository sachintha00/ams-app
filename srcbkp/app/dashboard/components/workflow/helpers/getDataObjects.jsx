export function getDataObjects(jsonObj) {
  const obj = JSON.parse(jsonObj);
  const root = obj?.ROOT;

  const nodesArray = root.nodes
    .map((nodeId, index) => {
      const node = obj[nodeId];

      return {
        type: node.type?.resolvedName || "unknown",
        order_id: index + 1,
        props: node.props || {},
      };
    })
    .filter(Boolean);

  const concatenatedProps = nodesArray
    .map((node) => Object.values(node.props).join(""))
    .join("");

  return concatenatedProps;
}
