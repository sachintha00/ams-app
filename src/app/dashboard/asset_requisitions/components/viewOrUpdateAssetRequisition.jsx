import { useState } from "react";
import { formatDate } from "@/app/_lib/utils/dateFormatter";
import { useSelector } from "react-redux";
import Requisitionsapproval from "../../components/requisitionsapproval/requisitionsapproval";
import { formatKeys } from "@/app/_lib/utils/formatKeys";
import { useAssestRequisitionStatusUpdateMutation } from "@/app/_lib/redux/features/assestrequisition/assest_requisition_api";

function ViewOrUpdateAssetRequisitions({ }) {
    const { value } = useSelector((state) => state.popupModel);
    const RequisitionId = value.requisition_id;
    console.log(RequisitionId);
    const assetRequisitionDate = value.requisition_date;
    const items = value.items;
    const formattedFormData = formatKeys({ RequisitionId, assetRequisitionDate, items: formatKeys(items) });

    const modelTopic = 'Asset Requisition';
    const requestType = 1;

    const [addUpdateAssestRequisitionStatus] = useAssestRequisitionStatusUpdateMutation();

    const [currentStep, setCurrentStep] = useState(value.requisition_status);
    console.log(currentStep);

    // Submit From
    const submitForm = async e => {
        const status = "submitted";
        e.preventDefault();
        try {
            const assestrequisitionupdatedata = { requisition_id: RequisitionId, requisition_status: status }
            addUpdateAssestRequisitionStatus(assestrequisitionupdatedata)
                .unwrap()
                .then((response) => {
                    console.log("New node added:", response);
                    // router.push("/dashboard/usergroups");
                    setCurrentStep('submitted');
                    refetch();
                })
                .catch((error) => {
                    console.error("Error adding new node:", error);
                    // const timer = setTimeout(() => {
                    //     setUserCreateError('');
                    // }, 5000); // Adjust the duration (in milliseconds) as needed
                    // return () => clearTimeout(timer);
                });
        } catch (error) {
            console.error("Login error:", error);
        }
    }
    return (
        <>
            {currentStep === 'saved' && (
                <div className="">
                    <div className="flex justify-between">
                        <div className="flex my-2 text-black">
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
                                Request ID :
                            </strong>
                            <span className="ml-5 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {value.requisition_id}
                            </span>
                        </div>
                        <div className="flex my-2 text-black">
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
                                Request Date :
                            </strong>
                            <span className="ml-5 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {formatDate(value.requisition_date)}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center my-5 rounded bg-white dark:bg-[#1e1e1e] tablelist">
                        <div className="w-full overflow-x-auto border border-gray-200 sm:rounded-lg">
                            <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-[#606368] dark:text-gray-400">
                                    <tr>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Item Name
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Assest Type
                                        </th>
                                        <th>
                                            Quantity
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Budget
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Business Perpose
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Upgrade Or New
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Period Status
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Period From
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Period To
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Period
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Availabiity Type
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Priority
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Required Date
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Reason
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Business Impact
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Suppliers
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Item Details
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Expected Conditions
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Maintenance KPI
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Service Support KPI
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Maintenance KPI
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Consumables Kpi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {value.items.map((item) => (
                                        <tr className="odd:bg-white odd:dark:bg-[#1e1e1e] even:bg-gray-50 even:dark:bg-[#3c4042] border-b dark:border-gray-700">
                                            <td
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {item.item_name}
                                            </td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.assesttype}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.quantity}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.budget}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.business_perpose}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.upgrade_or_new}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.period_status}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.period_from}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.period_to}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.period}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.availabiity_type}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.priority}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.required_date}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.organization}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.reason}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.business_impact}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.suppliers}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {item.item_details.map((itemdata) => (
                                                    <div className="flex my-2 text-black">
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
                                                            {itemdata.type} :
                                                        </strong>
                                                        <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                            {itemdata.details}
                                                        </span>
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.expected_conditions}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {item.maintenance_kpi.map((maintainKpi) => (
                                                    <div className="flex my-2 text-black">
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
                                                        </strong>
                                                        <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                            {maintainKpi.details}
                                                        </span>
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {item.service_support_kpi.map((serviceKpi) => (
                                                    <div className="flex my-2 text-black">
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
                                                        </strong>
                                                        <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                            {serviceKpi.details}
                                                        </span>
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {item.consumables_kpi.map((consumablesKpi) => (
                                                    <div className="flex my-2 text-black">
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
                                                        </strong>
                                                        <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                            {consumablesKpi.details}
                                                        </span>
                                                    </div>
                                                ))}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="grid gap-6 mb-6 md:grid-cols-2 w-[40%]">
                        <button
                            onClick={submitForm}
                            className="text-white bg-[#213389] hover:bg-[#213389] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-[#213389] dark:hover:bg-[#213389] dark:focus:ring-blue-800"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            )}
            {currentStep === 'PENDING' && (
                <div>
                    <div className="flex justify-between">
                        <div className="flex my-2 text-black">
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
                                Request ID :
                            </strong>
                            <span className="ml-5 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {value.requisition_id}
                            </span>
                        </div>
                        <div className="flex my-2 text-black">
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
                                Request Date :
                            </strong>
                            <span className="ml-5 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {formatDate(value.requisition_date)}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center my-5 rounded bg-white dark:bg-[#1e1e1e] tablelist">
                        <div className="overflow-x-auto border border-gray-200 sm:rounded-lg w-[-webkit-fill-available]">
                            <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-[#606368] dark:text-gray-400">
                                    <tr>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Item Name
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Assest Type
                                        </th>
                                        <th>
                                            Quantity
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Budget
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Business Perpose
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Upgrade Or New
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Period Status
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Period From
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Period To
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Period
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Availabiity Type
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Priority
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Required Date
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Reason
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Business Impact
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Suppliers
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Item Details
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Expected Conditions
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Maintenance KPI
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Service Support KPI
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Maintenance KPI
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Consumables Kpi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {value.items.map((item) => (
                                        <tr className="odd:bg-white odd:dark:bg-[#1e1e1e] even:bg-gray-50 even:dark:bg-[#3c4042] border-b dark:border-gray-700">
                                            <td
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {item.item_name}
                                            </td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.assesttype}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.quantity}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.budget}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.business_perpose}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.upgrade_or_new}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.period_status}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.period_from}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.period_to}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.period}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.availabiity_type}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.priority}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.required_date}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.organization}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.reason}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.business_impact}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.suppliers}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {item.item_details.map((itemdata) => (
                                                    <div className="flex my-2 text-black">
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
                                                            {itemdata.type} :
                                                        </strong>
                                                        <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                            {itemdata.details}
                                                        </span>
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.expected_conditions}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {item.maintenance_kpi.map((maintainKpi) => (
                                                    <div className="flex my-2 text-black">
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
                                                        </strong>
                                                        <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                            {maintainKpi.details}
                                                        </span>
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {item.service_support_kpi.map((serviceKpi) => (
                                                    <div className="flex my-2 text-black">
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
                                                        </strong>
                                                        <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                            {serviceKpi.details}
                                                        </span>
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {item.consumables_kpi.map((consumablesKpi) => (
                                                    <div className="flex my-2 text-black">
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
                                                        </strong>
                                                        <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                            {consumablesKpi.details}
                                                        </span>
                                                    </div>
                                                ))}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
            {currentStep === 'REJECTED' && (
                <div>
                    <div className="flex justify-between">
                        <div className="flex my-2 text-black">
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
                                Request ID :
                            </strong>
                            <span className="ml-5 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {value.requisition_id}
                            </span>
                        </div>
                        <div className="flex my-2 text-black">
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
                                Request Date :
                            </strong>
                            <span className="ml-5 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {formatDate(value.requisition_date)}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center my-5 rounded bg-white dark:bg-[#1e1e1e] tablelist">
                        <div className="overflow-x-auto border border-gray-200 sm:rounded-lg w-[-webkit-fill-available]">
                            <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-[#606368] dark:text-gray-400">
                                    <tr>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Item Name
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Assest Type
                                        </th>
                                        <th>
                                            Quantity
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Budget
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Business Perpose
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Upgrade Or New
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Period Status
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Period From
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Period To
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Period
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Availabiity Type
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Priority
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Required Date
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Reason
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Business Impact
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Suppliers
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Item Details
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Expected Conditions
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Maintenance KPI
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Service Support KPI
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Maintenance KPI
                                        </th>
                                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Consumables Kpi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {value.items.map((item) => (
                                        <tr className="odd:bg-white odd:dark:bg-[#1e1e1e] even:bg-gray-50 even:dark:bg-[#3c4042] border-b dark:border-gray-700">
                                            <td
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {item.item_name}
                                            </td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.assesttype}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.quantity}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.budget}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.business_perpose}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.upgrade_or_new}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.period_status}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.period_from}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.period_to}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.period}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.availabiity_type}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.priority}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.required_date}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.organization}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.reason}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.business_impact}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.suppliers}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {item.item_details.map((itemdata) => (
                                                    <div className="flex my-2 text-black">
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
                                                            {itemdata.type} :
                                                        </strong>
                                                        <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                            {itemdata.details}
                                                        </span>
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.expected_conditions}</td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {item.maintenance_kpi.map((maintainKpi) => (
                                                    <div className="flex my-2 text-black">
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
                                                        </strong>
                                                        <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                            {maintainKpi.details}
                                                        </span>
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {item.service_support_kpi.map((serviceKpi) => (
                                                    <div className="flex my-2 text-black">
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
                                                        </strong>
                                                        <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                            {serviceKpi.details}
                                                        </span>
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {item.consumables_kpi.map((consumablesKpi) => (
                                                    <div className="flex my-2 text-black">
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
                                                        </strong>
                                                        <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                            {consumablesKpi.details}
                                                        </span>
                                                    </div>
                                                ))}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
            {currentStep === 'submitted' && (
                <Requisitionsapproval formData={formattedFormData} modelData={modelTopic} requestType={requestType} RequisitionId={value.requisition_id} />
            )}
        </>
    );
}

export default ViewOrUpdateAssetRequisitions; 