"use client";
import React, { useState } from "react";

import WidgetMenuGrid from './widgetMenuGrid'
import WidgetMenuItem from './widgetMenuItem'
import WidgetDrawerIconComponent from './widgetDrawerIconComponent'
import WidgetIconGrid from './widgetIconGrid'

import { widgets } from "../constants/widget";
import { useDispatch } from "react-redux";
import { addItem } from "@/app/_lib/redux/features/dashboard/dragableSurfaceSlice";
// import { useGetDashboardWidgetMutation } from "../../../../_lib/redux/features/dashboard/dashboard_item_api";

function WidgetComponent() {
  const dispatch = useDispatch();
  const [selectedMenu, setSelectedMenu] = useState(
    widgets.length > 0 ? widgets[0].widget_menu_name : null
  );
  // const [getDashboardWidget, { isSuccess, error }] =
  //   useGetDashboardWidgetMutation();

  const handleMenuClick = (menuName) => {
    setSelectedMenu(menuName);
  };

  const handleDrawerIconClick = async (index) => {
    // const test = await getDashboardWidget();
    // console.log(test);
    const newItem = {
      x: 0,
      y: 0,
      w: 2.5,
      h: 6,
      i: index,
      style: '<div class="text-red-500 h-full bg-yellow-400">test</div>',
    };
    dispatch(addItem(newItem));
  };

  return (
    <div className="flex flex-1">
      <div className="mt-10 mr-4 w-52">
        <WidgetMenuGrid>
          {widgets.map((widget, index) => (
            <WidgetMenuItem
              key={index}
              menuName={widget.widget_menu_name}
              onClick={() => handleMenuClick(widget.widget_menu_name)}
            />
          ))}
        </WidgetMenuGrid>
      </div>
      <div className="h-[700px] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-25 mt-6" />
      <div className="mx-8 my-10">
        <WidgetIconGrid>
          {widgets.map((widget) =>
            selectedMenu === widget.widget_menu_name
              ? widget.widget_list.map((widgetComponent, index) => (
                  <WidgetDrawerIconComponent
                    key={index}
                    widgetIcon={widgetComponent}
                    onClick={() => handleDrawerIconClick(index)}
                  />
                ))
              : null
          )}
        </WidgetIconGrid>
      </div>
    </div>
  );
}

export default WidgetComponent;
