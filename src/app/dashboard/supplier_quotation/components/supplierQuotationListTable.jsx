import { FORM_TYPE } from "@/app/_lib/constants/formType";
import { handleOpenPopupModel } from "@/app/_lib/redux/features/popupModel/popupModelSlice";
import { formatDate } from "@/app/_lib/utils/dateFormatter";
import { FaSave } from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";
import { useDispatch } from "react-redux";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { FcApprove } from "react-icons/fc";
import { useQuotationCompleteMutation } from "@/app/_lib/redux/features/supplierquotation/supplierquotation_api";

function SupplierQuotationListTable({ data }) {
    const dispatch = useDispatch();
    console.log(data);
    const addQuotation = async (id, procurement) => {
        console.log(id);
        dispatch(
          handleOpenPopupModel({
            id,
            value: procurement,
            formType: FORM_TYPE.SUBMIT,
          })
        );
    };
    const handleQuotationView = async (id, modelvalue) => {
        console.log(id);
        dispatch(
          handleOpenPopupModel({
            id,
            value: modelvalue,
            formType: FORM_TYPE.VIEW,
          })
        );
      };
    const handleUpdate = async (id, modelvalue) => {
        console.log(id);
        dispatch(
          handleOpenPopupModel({
            id,
            value: modelvalue,
            formType: FORM_TYPE.UPDATE,
          })
        );
      };
    const handleDelete = async (id, modelvalue) => {
        console.log(id);
        dispatch(
          handleOpenPopupModel({
            id,
            value: modelvalue,
            formType: FORM_TYPE.DELETE,
          })
        );
      };

    const [QuotationComplete] = useQuotationCompleteMutation(); 

    // save From
    const submit = async (id) => {
        console.log(id);
        try {
            const Procurement = { ID: id };
            console.log(Procurement); 
            QuotationComplete(Procurement)
            .unwrap()
            .then((response) => {
                console.log("New node added:", response);
                // router.push("/dashboard/usergroups");
            })
            .catch((error) => {
                console.error("Error adding new node:", error);
            });
        } catch (error) {
            console.error("Login error:", error);
        }
    }
    return (
            <div className="overflow-x-auto border border-gray-200 sm:rounded-lg w-[-webkit-fill-available]">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-[#606368] dark:text-gray-400">
                    <tr>
                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Procurement ID 
                        </th>
                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Procurement Date
                        </th>
                        <th>
                            Quotation By
                        </th>
                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            
                        </th>
                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((procurement) => {
                        const quotation_feedbacks = procurement.quotation_feedbacks.slice(0, 2);
                        return(
                        <tr className="odd:bg-white odd:dark:bg-[#1e1e1e] even:bg-gray-50 even:dark:bg-[#3c4042] border-b dark:border-gray-700">
                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{procurement.request_id}</td>
                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{formatDate(procurement.date)}</td>
                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {procurement.quotation_feedbacks.map((quotation) => {
                                    const modelvalue = {quotation, procurement}
                                    return(
                                    <div className="my-2 text-black flex justify-between">
                                        <div className="flex">
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
                                            {quotation.selected_supplier_name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between w-[25%]">
                                            <a
                                            onClick={() =>
                                                handleQuotationView(quotation.id, modelvalue)
                                            }>
                                                <FaEye className="text-green-500 hover:text-green-600 text-2xl" />
                                            </a>
                                            {procurement.procurement_status === 'save' && (
                                                <>
                                                    <a
                                                    onClick={() =>
                                                        handleUpdate(quotation.id, modelvalue)
                                                    }>
                                                        <BiEdit className="text-yellow-400 hover:text-yellow-500 text-2xl" />
                                                    </a>
                                                    <a
                                                    onClick={() =>
                                                        handleDelete(quotation.id, modelvalue)
                                                    }>
                                                        <MdDelete className="text-red-400 hover:text-red-500 text-2xl" />
                                                    </a>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    )
                                })}
                            </td>
                            {procurement.procurement_status === 'save' && (
                                <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <a
                                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-[#213389] hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                                    onClick={() =>
                                        addQuotation(procurement.request_id, procurement)
                                    }
                                    >
                                        <FaFileInvoiceDollar className="text-white text-sm font-medium mr-1"/>
                                        Add Quotation
                                    </a>
                                </td>
                            )}
                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {procurement.procurement_status === 'save' ? (
                                    <a
                                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                                    onClick={() =>
                                        submit(procurement.id)
                                    }
                                    >
                                    Complete
                                    </a>
                                )
                                :
                                procurement.procurement_status === 'COMPLETE' ? (
                                    <p className="flex items-center text-green-500 mb-4"><FcApprove className="text-green-500 text-[20px] mr-1"/>Completed</p>
                                ) :null}
                            </td>
                        </tr>
                        )
                    })}
                </tbody>
                </table>
            </div>
    );
}

export default SupplierQuotationListTable;