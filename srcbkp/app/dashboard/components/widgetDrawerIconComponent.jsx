import React from "react";
import Image from "next/image";

function WidgetDrawerIconComponent({ widgetIcon, onClick }) {
  return (
    <div
      className="w-16 h-16 border border-gray-200 rounded-lg shadow cursor-pointer flex justify-center items-center dark:bg-[#3c4042] dark:hover:bg-[#606368]"
      onClick={onClick}
    >
      {/* {widgetIcon} */}
      <Image src={widgetIcon} width={35} height={35} alt="icon" />
    </div>
  );
}

export default WidgetDrawerIconComponent;
