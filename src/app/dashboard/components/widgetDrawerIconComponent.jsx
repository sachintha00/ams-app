import React from "react";

function WidgetDrawerIconComponent({ widgetIcon, onClick }) {
  return (
    <div
      className="w-16 h-16 border-[.1px] border-gray-300 rounded-sm cursor-pointer flex justify-center items-center"
      onClick={onClick}
    >
      {widgetIcon}
    </div>
  );
}

export default WidgetDrawerIconComponent;
