import React from "react";

function WidgetDrawerIconComponent({ widgetIcon, onClick }) {
  return (
    <div
      className="w-16 h-16 border border-gray-200 rounded-lg shadow cursor-pointer flex justify-center items-center dark:bg-[#3c4042] dark:hover:bg-[#606368]"
      onClick={onClick}
    >
      {widgetIcon}
    </div>
  );
}

export default WidgetDrawerIconComponent;
