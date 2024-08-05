'use client'
import React, { useEffect, useState, useContext, useRef } from 'react';
import { formatDate } from '@/app/_lib/utils/dateFormatter';
import SupplierListDrodwon from './SupplierListDrodwon';
import { useDispatch, useSelector } from 'react-redux';
import { useAddNewSupplierQuotationMutation, useUpdateSupplierQuotationMutation } from '@/app/_lib/redux/features/supplierquotation/supplierquotation_api';
import { handleClosePopupModel } from '@/app/_lib/redux/features/popupModel/popupModelSlice';

function UpdateSupplierQuotationForm({ }) {
    const dispatch = useDispatch()
    const { value } = useSelector((state) => state.popupModel);
    console.log(value.quotation);
    const quotation =  value.quotation;
    const procurement =  value.procurement;
    const [procuremenSelectedItems, setProcuremenSelectedItems] = useState([]);
    const quotation_id = quotation.id;
    const date = quotation.date;
    const procurement_id = procurement.id;
    const selected_supplier_id = quotation.selected_supplier_id;
    const AvailableDate = quotation.available_date;

    useEffect(() => {
        if (value) {
            setProcuremenSelectedItems(value.quotation.selected_items);
        }
    }, []);

    // update qty and price
    const updateSelectedItem = (itemId, field, value) => {
        setProcuremenSelectedItems((prevItems) =>
            prevItems.map((item) =>
            item.id === itemId ? { ...item, [field]: value } : item
            )
        );
        };
  
    const handleInputChange = (itemId, field, value) => {
        updateSelectedItem(itemId, field, value);
    };

    const [UpdateSupplierQuotation] = useUpdateSupplierQuotationMutation(); 

    // save From
    const submit = async e => {
        e.preventDefault();
        try {
            const quotationdata = {quotation_id:quotation_id, date: date, procurement_id: procurement_id, selected_supplier_id: selected_supplier_id, selected_items: procuremenSelectedItems, AvailableDate: AvailableDate}
            console.log(quotationdata); 
            UpdateSupplierQuotation(quotationdata) 
            .unwrap()
            .then((response) => {
                console.log("New node added:", response);
                // router.push("/dashboard/usergroups");
                dispatch(handleClosePopupModel());
            })
            .catch((error) => {
                console.error("Error adding new node:", error);
            });
        } catch (error) {
            console.error("Login error:", error);
        }
    }

    return (
        <>
            <div 
                className="px-2 pt-2 overflow-y-scroll h-auto max-h-[600px]"
                style={{ scrollbarWidth: "2px", scrollbarColor: "#888" }}
            >
                <div className="grid gap-6 mb-1 md:grid-cols-3">
                    <div>
                        <div className="my-2 text-black flex">
                        <strong className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            <svg
                            className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            >
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                            </svg>
                            Received Date:
                        </strong>
                        <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                            {formatDate(quotation.date)}
                        </span>
                        </div>
                    </div>
                    <div>
                        <div className="my-2 text-black flex">
                        <strong className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            <svg
                            className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            >
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                            </svg>
                            Quotation By:
                        </strong>
                        <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                            {quotation.selected_supplier_name}
                        </span>
                        </div>
                    </div>
                    <div>
                        <div className="my-2 text-black flex">
                        <strong className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            <svg
                            className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            >
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                            </svg>
                            Available Date:
                        </strong>
                        <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                            {formatDate(quotation.available_date)}
                        </span>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 mb-6 md:grid-cols-1">
                    <div> 
                        <label
                        htmlFor="last_name"
                        className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                        >
                        Supplier Quotation
                        </label>
                            <div className='mb-3'>
                                <div className="flex flex-col rounded bg-white dark:bg-[#1e1e1e] tablelist h-auto">
                                <div className="overflow-x-auto border border-gray-200 sm:rounded-lg">
                                    <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-[#606368] dark:text-gray-400">
                                        <tr>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Item name
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Qty
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            budget
                                        </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {procuremenSelectedItems.map((item) => (
                                        <>
                                            <tr
                                            className={`odd:bg-white odd:dark:bg-[#1e1e1e] even:bg-gray-50 even:dark:bg-[#3c4042] border-b dark:border-gray-700`}
                                            >
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {item.item_name}
                                            </td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleInputChange(item.id, 'quantity', e.target.value)}
                                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                />
                                            </td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                <input
                                                    type="text"
                                                    value={item.budget}
                                                    onChange={(e) => handleInputChange(item.id, 'budget', e.target.value)}
                                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                />
                                            </td>
                                            </tr>
                                        </>
                                        ))}
                                    </tbody>
                                    </table>
                                </div>
                                </div>
                            </div>
                    </div>
                </div>

                <div className="grid gap-6 mb-6 md:grid-cols-2 w-[40%]">
                    <button
                        onClick={submit}
                        className={`bg-[#213389] text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800`}
                    >
                        Submit
                    </button>
                </div>

            </div>
        </>
    );
}

export default UpdateSupplierQuotationForm;