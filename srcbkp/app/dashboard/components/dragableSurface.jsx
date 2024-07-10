'use client'
import {
    addItem,
    updateLayout,
  } from "@/app/_lib/redux/features/dashboard/dragableSurfaceSlice";
  import React, { useState } from "react";
  
  import RGL, { WidthProvider } from "react-grid-layout";
  import "react-grid-layout/css/styles.css";
  import { useDispatch, useSelector } from "react-redux";
  import "react-resizable/css/styles.css";
  
  const ReactGridLayout = WidthProvider(RGL);
  function DragableSurface({
    isDraggable = true,
    isResizable = true,
    rowHeight = 30,
    preventCollision = false,
    cols = 12,
  }) {
    const layout = useSelector((state) => state.dragableSurface.layout);
    const design = useSelector((state) => state.dragableSurface.design); 
    const dispatch = useDispatch();
  
    const handleLayoutChange = (newLayout) => {
      dispatch(updateLayout(newLayout));
    };
  
    return (
      <>
        <ReactGridLayout
          isDraggable={isDraggable}
          isResizable={isResizable}
          rowHeight={rowHeight}
          preventCollision={preventCollision}
          cols={cols}
          onLayoutChange={handleLayoutChange}
        >
          {layout.map((item) => (
            <div
              key={item.i}
              data-grid={item}
              className="border-gray-300 border-[0.1px] flex justify-center items-center bg-white rounded-lg dark:bg-[#3c4042]"
            >
              {/* <div dangerouslySetInnerHTML={{ __html: item.content }} /> */}
              <div dangerouslySetInnerHTML={{ __html: design }} />
            </div>
          ))}
        </ReactGridLayout>
      </>
    );
  }
  
  export default DragableSurface;
  