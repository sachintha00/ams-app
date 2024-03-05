'use client'
import React, {useState} from "react";
import DragableSurface from './components/dragableSurface';
import { BiSolidWidget } from "react-icons/bi";
import WidgetDrawer from './components/widgetDrawer'

const dashboard = ({ collapsed }) => {
  const [isOpenWidgetBar, setWidgetBar] = useState(false);
  return (
    <div className="p-4 border-gray-200 rounded-lg subcontent dark:border-gray-700">
      <DragableSurface/>
      <div className="fixed bottom-0 right-0 m-10 text-center">
          <button
            className="text-white bg-[#213395] hover:bg-black-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 mb-2 focus:outline-none w-[78px] h-[78px] flex items-center justify-center"
            type="button"
            data-drawer-target="drawer-right-example"
            data-drawer-show="drawer-right-example"
            data-drawer-placement="right"
            aria-controls="drawer-right-example"
            onClick={(e) => setWidgetBar(!isOpenWidgetBar)}
          >
            <BiSolidWidget size={30} className="text-white" /> 
          </button>
        </div>
        <WidgetDrawer
          isOpenWidgetBar={isOpenWidgetBar}
          setWidgetBar={setWidgetBar}
        />
    </div>
  );
}

export default dashboard;