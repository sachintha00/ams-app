import React, { useEffect, useState } from 'react';
import { formatDate } from "@/app/_lib/utils/dateFormatter";
import { useSelector } from "react-redux";
import Requisitionsapproval from "../../components/requisitionsapproval/requisitionsapproval";
import { formatKeys } from "@/app/_lib/utils/formatKeys";
import { useAssestRequisitionStatusUpdateMutation } from "@/app/_lib/redux/features/assestrequisition/assest_requisition_api";
import { extractData } from '@/app/_lib/utils/extractData';
import Comparison from './Comparison';
import ItemsPage from './ItemsPage';
import { useSubmitProcurementMutation, useSubmitProcurementToWorkflowMutation } from '@/app/_lib/redux/features/procurement/procurement_api';

function ProceedProcurementDetails({  }) {
    const [procuremenSelectedItems, setProcuremenSelectedItems] = useState([]);
    const [SupplierQuotation, setSupplierQuotation] = useState([]);
    const { value } = useSelector((state) => state.popupModel);
    const procurement = value;
    console.log(procurement);
    const procurementID = value.id;
    const procurementrequestid = value.request_id;
    const procurementDate = value.date;
    const itemsWithQuotations = extractData(procurement);
    console.log(itemsWithQuotations);

    const [status, setStatus] = useState('new'); // 'new', 'saved', or 'submitted'
    const [currentStep, setCurrentStep] = useState(value.procurement_status);

    useEffect(() => {
        if (value) {
            setProcuremenSelectedItems(value.selected_items);
            setSupplierQuotation(value.quotation_feedbacks);
        }
    }, []);

        // Submit From
        const submitForm = async e => {
            const status = "submitted";
            e.preventDefault();
            setCurrentStep(2); // Move to the next step
        }

    const [selectedSuppliers, setSelectedSuppliers] = useState(
        procurement.selected_items.map(item => ({
        itemId: item.id,
        supplierId: null,
        quotationDetails: null,
        }))
    );

    const handleSupplierChange = (itemId, supplierId, quotationDetails) => {
        setSelectedSuppliers(prev => 
        prev.map(supplier => 
            supplier.itemId === itemId ? { ...supplier, supplierId, quotationDetails } : supplier
        )
        );
    };

    const handleHeaderClick = (supplierId) => {
        const newSelectedSuppliers = procurement.selected_items.map(item => {
        const feedback = procurement.quotation_feedbacks.find(fb => fb.selected_supplier_id === supplierId && fb.selected_items.some(si => si.id === item.id));
        if (feedback) {
            const itemDetails = feedback.selected_items.find(si => si.id === item.id);
            return {
            itemId: item.id,
            supplierId: supplierId,
            quotationDetails: {
                supplier_name: feedback.selected_supplier_name,
                budget: itemDetails.budget,
            }
            };
        }
        return {
            itemId: item.id,
            supplierId: null,
            quotationDetails: null,
        };
        });

        setSelectedSuppliers(newSelectedSuppliers);
    };

    const [updatedItems, setUpdatedItems] = useState([]);
    const [SubmitProcurementToWorkflow] = useSubmitProcurementToWorkflowMutation(); 
    const handleSubmit = async (event) => {
        event.preventDefault();

        const updatedItems = procurement.selected_items.map(item => {
        const supplier = selectedSuppliers.find(s => s.itemId === item.id);
        return {
            ...item,
            selected_supplier_id: supplier ? supplier.supplierId : null,
            quotation_details: supplier ? supplier.quotationDetails : null,
        };
        });

        console.log(updatedItems);
        setUpdatedItems(updatedItems);
        try {
            const procurementdata = {procurement_id:procurementID, date: procurementDate, selected_items: updatedItems}
            console.log(procurementdata); 
            SubmitProcurementToWorkflow(procurementdata) 
            .unwrap()
            .then((response) => {
                console.log("New node added:", response);
                // router.push("/dashboard/usergroups");
                setCurrentStep('SUBMIT');
            })
            .catch((error) => {
                console.error("Error adding new node:", error);
            });
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    console.log(updatedItems);

    const getQuotationBudget = (itemId, supplierId) => {
        const feedback = procurement.quotation_feedbacks.find(fb => fb.selected_supplier_id === supplierId);
        const item = feedback ? feedback.selected_items.find(si => si.id === itemId) : null;
        return item ? item.budget : null;
    };

    const modelTopic = 'Procurement Initiate';
    const requestType = 3;
    const formattedFormData = formatKeys({ ProcurementID: procurementrequestid, ProcurementDate: value.date, ProcurementRequiredDate: value.required_date, SelectedItems: formatKeys(updatedItems) });

    return (
        <>
            {/* Modal header */}
            {currentStep === 'COMPLETE' && ( 
                <div>
                    <div className="flex items-center mt-[-17px] px-2 pb-2 justify-between border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Proceed Procurement
                        </h3>
                    </div>
                    <div 
                        className="px-2 pt-2 overflow-y-scroll h-auto max-h-[600px] min-h-[450px]"
                        style={{ scrollbarWidth: "2px", scrollbarColor: "#888" }}
                    >
                        <div className="grid gap-6 mb-2 md:grid-cols-3">
                            <div>
                                <div className="my-2 text-black flex">
                                    <label
                                    htmlFor="last_name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                    Procurement ID:
                                    </label>
                                    <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {value.request_id}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className="my-2 text-black flex">
                                    <label
                                    htmlFor="last_name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                    Procurement date:
                                    </label>
                                    <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {formatDate(value.date)}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className="my-2 text-black flex">
                                    <label
                                    htmlFor="last_name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                    Required Date:
                                    </label>
                                    <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {formatDate(value.required_date)}
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
                                Selected Items
                                </label>
                                <div className="flex flex-col rounded bg-white dark:bg-[#1e1e1e] tablelist h-auto">
                                <div className="overflow-x-auto border border-gray-200 sm:rounded-lg">
                                    <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-[#606368] dark:text-gray-400">
                                        <tr>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Item Name
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Required Quantity
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Estimate Price(each)
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Request Date
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Best Supplier
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Price(each)
                                        </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itemsWithQuotations.map((item) => (
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
                                                Rs.{item.budget}
                                            </td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {formatDate(item.request.requisition_date)}
                                            </td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                <div className="relative px-4 py-3 mb-2 text-green-700 bg-green-100 border border-green-400 rounded">
                                                    <span className="block sm:inline">
                                                        {item.lowestBudgetQuotation?.supplier || "N/A"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                <div className="relative px-4 py-3 mb-2 text-green-700 bg-green-100 border border-green-400 rounded">
                                                    <span className="block sm:inline">
                                                        Rs.{item.lowestBudgetQuotation?.budget || "N/A"}
                                                    </span>
                                                </div>
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

                        <div className="grid gap-6 mb-6 md:grid-cols-1">
                            <div>
                                <label
                                    htmlFor="last_name"
                                    className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                                    >
                                    Assign Supplier Quotation To Selected Items
                                </label>
                                <div className="flex flex-col rounded bg-white dark:bg-[#1e1e1e] tablelist h-auto">
                                    <div className="overflow-x-auto border border-gray-200 sm:rounded-lg">
                                        <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-[#606368] dark:text-gray-400">
                                            <tr>
                                            <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">Item Name</th>
                                            <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">Quantity</th>
                                            <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">Priority</th>
                                            <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">Asset Type</th>
                                            <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">Budget</th>
                                            {procurement.selected_suppliers.map(supplier => (
                                                <th key={supplier.id} className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={() => handleHeaderClick(supplier.id)}>
                                                {supplier.name}
                                                </th>
                                            ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {procurement.selected_items.map(item => (
                                            <tr key={item.id} className={`odd:bg-white odd:dark:bg-[#1e1e1e] even:bg-gray-50 even:dark:bg-[#3c4042] border-b dark:border-gray-700`}>
                                                <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.item_name}</td>
                                                <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.quantity}</td>
                                                <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.priority}</td>
                                                <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.asset_type}</td>
                                                <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">Rs.{item.budget}</td>
                                                {procurement.selected_suppliers.map(supplier => {
                                                const budget = getQuotationBudget(item.id, supplier.id);
                                                return (
                                                    <td key={supplier.id} className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {budget && (
                                                        <label className="inline-flex items-center">
                                                        <input
                                                            type="radio"
                                                            name={`supplier-${item.id}`}
                                                            value={supplier.id}
                                                            checked={selectedSuppliers.find(s => s.itemId === item.id)?.supplierId === supplier.id}
                                                            onChange={() => handleSupplierChange(item.id, supplier.id, {
                                                            supplier_name: supplier.name,
                                                            budget,
                                                            })}
                                                            className="form-radio"
                                                        />
                                                        <span className="ml-2">Rs.{budget}</span>
                                                        </label>
                                                    )}
                                                    </td>
                                                );
                                                })}
                                            </tr>
                                            ))}
                                        </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 mb-6 md:grid-cols-2 w-[40%]">
                            <button
                                onClick={handleSubmit}
                                className="text-white bg-[#213389] hover:bg-[#213389] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-[#213389] dark:hover:bg-[#213389] dark:focus:ring-blue-800"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {currentStep === 'SUBMIT' && (
                <Requisitionsapproval formData={formattedFormData} modelData={modelTopic} requestType={requestType} RequisitionId={procurementrequestid}/>
            )}
        </>
    );
}

export default ProceedProcurementDetails; 