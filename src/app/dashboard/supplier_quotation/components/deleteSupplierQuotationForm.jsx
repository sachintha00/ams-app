'use client'
import React, { useEffect, useState, useContext, useRef } from 'react';
import { formatDate } from '@/app/_lib/utils/dateFormatter';
import SupplierListDrodwon from './SupplierListDrodwon';
import { useDispatch, useSelector } from 'react-redux';
import { useDeleteSupplierQuotationMutation } from '@/app/_lib/redux/features/supplierquotation/supplierquotation_api';
import { IoClose } from "react-icons/io5";
import { handleClosePopupModel } from '@/app/_lib/redux/features/popupModel/popupModelSlice';
import { useAllProcurementDetailsListQuery } from '@/app/_lib/redux/features/procurement/procurement_api';

function DeleteSupplierQuotationForm({ }) {
    const dispatch = useDispatch()
    const { refetch } = useAllProcurementDetailsListQuery();
    const { id } = useSelector((state) => state.popupModel);
    const { value } = useSelector((state) => state.popupModel);
    console.log(id);
    const quotation =  value.quotation;
    const procurement = value.procurement;
    const quotationId =  quotation.id;
    const [procurementDeleteError, setProcurementDeleteError] = useState("");
    const [procuremenSelectedItems, setProcuremenSelectedItems] = useState([]);

    const [deleteQuotation, setDeleteQuotation] = useState("");
    const handleErrorClose = () => {
        setProcurementDeleteError("");;
      };

    const [DeleteSupplierQuotation] = useDeleteSupplierQuotationMutation();

    //delete Submit Role From
    const submitDeleteForm = async (e) => {
      e.preventDefault();
  
      try {
        if (deleteQuotation === quotation.selected_supplier_name) {
          const Quotation = { ID: quotationId };
          console.log(Quotation);
          DeleteSupplierQuotation(Quotation)
            .unwrap()
            .then((response) => {
              console.log("New node added:", response);
              dispatch(handleClosePopupModel());
              refetch();
            })
            .catch((error) => {
              console.error("Error adding new node:", error);
              setProcurementDeleteError(error);
              const timer = setTimeout(() => {
                setProcurementDeleteError("");
              }, 5000); // Adjust the duration (in milliseconds) as needed
              return () => clearTimeout(timer);
            });
        } else {
            setProcurementDeleteError("Input does not match the name of the Role Name");
          const timer = setTimeout(() => {
            setProcurementDeleteError("");
          }, 5000); // Adjust the duration (in milliseconds) as needed
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error("Login error:", error);
      }
    };

    return (
        <>
            {/* Modal header */}
            <div className="flex items-center mt-[-17px] px-2 pb-2 justify-between border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold w-[90%] text-gray-900 dark:text-white">
                If you want Delete {quotation.selected_supplier_name}'s quotation on "{procurement.request_id}" procurement, please enter "{quotation.selected_supplier_name}" on below feild
            </h3>
            </div>;
            {/* Modal body */}
            <form className="px-2 pt-2" onSubmit={submitDeleteForm}>
            {procurementDeleteError && (
                <div
                className="relative px-4 py-3 mb-2 text-red-700 bg-red-100 border border-red-400 rounded"
                role="alert"
                >
                {/* <strong className="font-bold">Holy smokes!</strong> */}
                <span className="block sm:inline">{procurementDeleteError}</span>
                <span
                    className="absolute top-0 bottom-0 right-0 px-4 py-3"
                    onClick={handleErrorClose}
                >
                    <IoClose className="text-2xl text-red-700" />
                </span>
                </div>
            )}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-2">
                <input
                    onChange={(e) => setDeleteQuotation(e.target.value)}
                    type="text"
                    name="name"
                    id="name"
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    required=""
                />
                </div>
            </div>
            <button
                type="submit"
                className="text-white inline-flex items-center bg-red-400 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-blue-800"
            >
                Delete
            </button>
            </form>
        </>
    );
}

export default DeleteSupplierQuotationForm;