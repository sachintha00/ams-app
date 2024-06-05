import React from "react";

function WidgetMenuItem({ menuName, onClick }) {
  return (
    <p
      onClick={onClick}
      className="w-full p-2 rounded-sm cursor-pointer hover:bg-slate-200"
    >
      {menuName}
    </p>
  );
}

export default WidgetMenuItem;
