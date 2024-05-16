import React from "react";
import { useNode } from "@craftjs/core";

function ConditionButton({ value }) {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <div
      ref={(ref) => connect(drag(ref))}
      className="mr-2 text-xl cursor-pointer"
    >
      {value}
    </div>
  );
}

export default ConditionButton;
