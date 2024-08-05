import React, { useEffect, useState } from 'react';
import { formatDate } from "@/app/_lib/utils/dateFormatter";
import { useSelector } from "react-redux";
import Requisitionsapproval from "../../components/requisitionsapproval/requisitionsapproval";
import { formatKeys } from "@/app/_lib/utils/formatKeys";
import { useAssestRequisitionStatusUpdateMutation } from "@/app/_lib/redux/features/assestrequisition/assest_requisition_api";

function ViewQuotationDetails({  }) {
    const [procuremenSelectedItems, setProcuremenSelectedItems] = useState([]);
    const [SupplierQuotation, setSupplierQuotation] = useState([]);
    const { value } = useSelector((state) => state.popupModel);
    console.log(value.quotation);
    const quotation = value.quotation;

    // useEffect(() => {
    //     if (value) {
    //         setProcuremenSelectedItems(value.selected_items);
    //         setSupplierQuotation(value.quotation_feedbacks);
    //     }
    // }, []);
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
                {/* <div className="grid gap-6 mb-6 md:grid-cols-1">
                    <div>
                        <label
                        htmlFor="last_name"
                        className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                        >
                        Selected Items
                        </label>
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
                                <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    Request Date
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
                                        {item.quantity}
                                    </td>
                                    <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {item.budget}
                                    </td>
                                    <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {formatDate(item.request.requisition_date)}
                                    </td>
                                    </tr>
                                </>
                                ))}
                            </tbody>
                            </table>
                        </div>
                        </div>
                    </div>
                </div> */}

                <div className="grid gap-6 mb-6 md:grid-cols-1">
                    <div className='border border-gray-200 rounded-lg shadow dark:border-gray-700 p-4'> 
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
                                        {quotation.selected_items.map((item) => (
                                        <>
                                            <tr
                                            className={`odd:bg-white odd:dark:bg-[#1e1e1e] even:bg-gray-50 even:dark:bg-[#3c4042] border-b dark:border-gray-700`}
                                            >
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {item.item_name}
                                            </td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {item.quantity}
                                            </td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {item.budget}
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
            </div>
        </>
    );
}

export default ViewQuotationDetails; 