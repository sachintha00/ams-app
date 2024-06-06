import React from "react";
import Image from "next/image";

function WidgetDrawerIconComponent({ widgetIcon, onClick }) {
  return (
    <div
      className="w-16 h-16 border-[.1px] border-gray-300 rounded-sm cursor-pointer flex justify-center items-center"
      onClick={onClick}
    >
      {/* {widgetIcon} */}
      <Image src={widgetIcon} width={35} height={35} alt="icon" />
    </div>
  );
}

export default WidgetDrawerIconComponent;
