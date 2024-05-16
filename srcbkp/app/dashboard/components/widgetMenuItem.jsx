import React from "react";

function WidgetMenuItem({ menuName, onClick }) {
  return (
    <p
      onClick={onClick}
      className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-[#3c4042] group"
    >
      {menuName}
    </p>
  );
}

export default WidgetMenuItem;