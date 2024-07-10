"use client";
import React, { useEffect, useState } from "react";
import {
    addItem,
    updateLayout,
  } from "@/app/_lib/redux/features/dashboard/dragableSurfaceSlice";
import { convertArrayToHtml } from "@/app/_lib/utils/convertArrayToHtml";
  
  import RGL, { WidthProvider } from "react-grid-layout";
  import "react-grid-layout/css/styles.css";
  import { useDispatch, useSelector } from "react-redux";
  import "react-resizable/css/styles.css";
  import DOMPurify from 'dompurify';
import Modal from "./model/Modal";
import { useApprovelAlertQuery } from "@/app/_lib/redux/features/workflowapprovelalert/workflowapprovelalert_api";
import { formatDate } from "@/app/_lib/utils/dateFormatter";
import { redirect, useRouter } from 'next/navigation';
import { VscServerProcess } from "react-icons/vsc";
import { FaCheckCircle } from 'react-icons/fa';
import { handleRequestType } from "@/app/_lib/redux/features/requisitionsapproval/requestTypeSlice";
  
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
    const router = useRouter();
  
    const handleLayoutChange = (newLayout) => {
      dispatch(updateLayout(newLayout));
    };

    const { data: approveAlertData, isLoading } = useApprovelAlertQuery(); // Fetch the approveAlertData
    
    // const userdata = [
    //   { name: 'Neil Sims', email: 'email@windster.com', status: 'pending', date: '2024-06-18' },
    //   { name: 'Bonnie Green', email: 'email@windster.com', status: 'approved', date: '2024-06-17' },
    //   { name: 'Michael Gough', email: 'email@windster.com', status: 'pending', date: '2024-06-16' },
    //   { name: 'Lana Byrd', email: 'email@windster.com', status: 'approved', date: '2024-06-15' },
    //   { name: 'Thomes Lean', email: 'email@windster.com', status: 'pending', date: '2024-06-14' },
    // ];

    // Function to populate the HTML template with user details
    const populateHtmlWithUserDetails = (template, data) => {
      if (!data) return template;

      const groupedData = data.reduce((acc, item) => {
        const type = item.workflow_request_type;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(item);
        return acc;
      }, {});
  
      const userDetailsHtml = Object.entries(groupedData).map(([type, items]) => {
        const userNames = items.slice(0, 2).map(item => item.requested_user.name).join(', ');
        return `
          <div class="card" data-type="${type}">
            <div class="w-full p-4 mb-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-[#3c4042] dark:border-gray-600">
              <div class="flex justify-between items-center">
                <div class="flex flex-col min-w-0">
                  <h5 class="text-sm font-bold leading-none text-gray-900 dark:text-white mb-1">${type}</h5>
                  <p class="text-sm text-gray-500 truncate dark:text-gray-400">${userNames}</p>
                </div>
                <div class="flex min-w-0">
                  <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">${items.length}</div>
                </div>
              </div>
            </div>
          </div>`;
      }).join('');
  
      return template.replace('<div id="user-list">', `<div id="user-list">${userDetailsHtml}`);
    };

    const populatedHtmlContent = !isLoading && approveAlertData ? populateHtmlWithUserDetails(design, approveAlertData.data) : design;
    const sanitizedHtmlContent = DOMPurify.sanitize(populatedHtmlContent);

    // console.log(sanitizedHtmlContent);
    const handleCardClick = (workflowRequestType) => {
      dispatch(
        handleRequestType({
          value: workflowRequestType,
        })
      );
      router.push(`/dashboard/users_requisitions_list`);
      // router.push("dashboard/users_requisitions_list");
    };

    useEffect(() => {
      const cards = document.querySelectorAll('.card');
      cards.forEach(card => {
        card.addEventListener('click', () => handleCardClick(card.getAttribute('data-type')));
      });
      return () => {
        cards.forEach(card => {
          card.removeEventListener('click', () => handleCardClick(card.getAttribute('data-type')));
        });
      };
    }, [handleCardClick]);

    // const [isModalOpen, setIsModalOpen] = useState(false);

    // const handleButtonClick = () => {
    //   // setIsModalOpen(true);
    //   console.log('test');
    //   router.push("dashboard/users_requisitions_list");
    // };
  
    // const closeModal = () => {
    //   setIsModalOpen(false);
    // };

    // useEffect(() => {
    //   const button = document.getElementById('open-modal');
    //   if (button) {
    //     button.addEventListener('click', handleButtonClick);
    //   }
    //   return () => {
    //     if (button) {
    //       button.removeEventListener('click', handleButtonClick);
    //     }
    //   };
    // }, [handleButtonClick]);

    const createMarkup = (html) => {
      return { __html: html };
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
              <div dangerouslySetInnerHTML={createMarkup(sanitizedHtmlContent)} className="w-[100%] h-[100%]"/>
            </div>
          ))}
        </ReactGridLayout>
        {/* {isModalOpen && <Modal onClose={closeModal}>This is the modal content.</Modal>} */}
      </>
    );
  }
  
  export default DragableSurface;
