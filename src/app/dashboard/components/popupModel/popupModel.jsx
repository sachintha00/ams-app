// components/PopupModel.js
import React from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { handleClosePopupModel } from "@/app/_lib/redux/features/popupModel/popupModelSlice";
import { motion, AnimatePresence } from "framer-motion";

function PopupModel({ popupModelTitle, Form, modelPageSize = "w-1/2", showModelTitle = "true" }) {
  const { formStatus } = useSelector((state) => state.popupModel);
  const dispatch = useDispatch();
  console.log(showModelTitle);

  const closeAddFormModal = () => {
    dispatch(handleClosePopupModel());
  };

  const backdropVariants = {
    visible: { opacity: 0.5 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      y: '-100vh',
    },
    visible: {
      opacity: 1,
      y: '0',
      transition: { delay: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {formStatus && (
        <motion.div
          className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full"
          style={{ marginLeft: 0 }}
          initial="hidden"
          animate="visible"
          exit="hidden"
        //   variants={backdropVariants}
        >
          <motion.div
            className="absolute w-full h-full bg-gray-900 dark:bg-[#121212] opacity-50"
            variants={backdropVariants}
          />
          <motion.div
            className={`${modelPageSize} bg-white p-4 rounded-lg z-50 dark:bg-[#1e1e1e]`}
            variants={modalVariants}
          >
            <div className="flex items-center justify-between rounded-t dark:border-gray-600">
              <a
                type="button"
                onClick={closeAddFormModal}
                className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-red-400 hover:bg-red-500 rounded-lg hover:text-white ms-auto dark:bg-red-400 dark:hover:bg-red-500 dark:hover:text-white"
                data-modal-toggle="crud-modal"
              >
                <IoClose className="text-2xl text-white" />
                <span className="sr-only">Close modal</span>
              </a>
            </div>
            {/* model title */}
            {showModelTitle === "true" && 
            <div className="flex items-center mt-[-17px] px-2 pb-2 justify-between border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {popupModelTitle}
              </h3>
            </div>
            }

            {Form}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PopupModel;