import React from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { handleClosePopupModel } from "@/app/_lib/redux/features/popupModel/popupModelSlice";

function PopupModel({ popupModelTitle, Form, modelPageSize = "w-1/2 auto", showModelTitle = true }) {
  const { formStatus } = useSelector((state) => state.popupModel);
  const dispatch = useDispatch();

  const closeAddFormModal = () => {
    dispatch(handleClosePopupModel());
  };

  return (
    formStatus && (
      <div
        className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full"
        style={{ marginLeft: 0 }}
      >
        <div className="absolute w-full h-full bg-gray-900 dark:bg-[#121212] opacity-50"></div>
        <div className={`${modelPageSize} bg-white p-4 rounded-lg z-50 dark:bg-[#1e1e1e]`}>
          <div className="flex items-center justify-between rounded-t dark:border-gray-600">
            <button
              type="button"
              onClick={closeAddFormModal}
              className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-transparent rounded-lg hover:bg-red-400 hover:text-white ms-auto dark:hover:bg-red-400 dark:hover:text-white"
              data-modal-toggle="crud-modal"
            >
              <IoClose className="text-2xl hover:text-white" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* model title */}
          {showModelTitle && 
          <div className="flex items-center mt-[-17px] px-2 pb-2 justify-between border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {popupModelTitle}
            </h3>
          </div>
          }

          {Form}
        </div>
      </div>
    )
  );
}

export default PopupModel;
