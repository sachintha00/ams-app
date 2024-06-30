import React from "react";
import { useNode } from "@craftjs/core";

function Container({ children }) {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <div
      ref={(ref) => connect(drag(ref))}
      className="flex flex-wrap w-full h-auto p-5 pb-10 overflow-auto text-black bg-gray-100 min-h-[200px]"
    >
      {children}
    </div>
  );
}

export default Container;
