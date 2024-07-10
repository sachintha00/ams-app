import React from "react";

function WidgetIconGrid({ children }) {
  return <div className="grid grid-cols-4 gap-6 w-72">{children}</div>;
}

export default WidgetIconGrid;
