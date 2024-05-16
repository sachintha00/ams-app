import { FORM_TYPE } from "@/app/_lib/constants/formType";
import { handleOpenPopupModel } from "@/app/_lib/redux/features/popupModel/popupModelSlice";
import { formatDate } from "@/app/_lib/utils/dateFormatter";
import { FaSave } from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";
import { useDispatch } from "react-redux";

function AssetRequisitionsListTable({ data }) {
    const dispatch = useDispatch();
    console.log(data);
    const handleUpdate = async (id, request) => {
        console.log(id);
        dispatch(
          handleOpenPopupModel({
            id,
            value: request,
            formType: FORM_TYPE.UPDATE,
          })
        );
      };
    return (
            <div className="overflow-x-auto border border-gray-200 sm:rounded-lg w-[-webkit-fill-available]">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-[#606368] dark:text-gray-400">
                    <tr>
                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Request ID 
                        </th>
                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Request Date
                        </th>
                        <th>
                            Details
                        </th>
                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            status
                        </th>
                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((request) => {
                        const requestItems = request.items.slice(0, 2);
                        return(
                        <tr className="odd:bg-white odd:dark:bg-[#1e1e1e] even:bg-gray-50 even:dark:bg-[#3c4042] border-b dark:border-gray-700">
                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{request.requisition_id}</td>
                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{request.requisition_date}</td>
                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {requestItems.map((item) => (
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
                                            </strong>
                                            <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {item.quantity} {item.item_name} for {item.reason}
                                            </span>
                                        </div>
                                    ))}
                                    {request.items.length > 2 && (
                                        <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                            and more items
                                        </span>
                                    )}
                            </td>
                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {request.requisition_status === 'saved' ? (
                                <p className="flex items-center text-red-500 mb-4"><FaSave className="text-red-500 mr-1"/>  this request is only save. not submite for approver</p>
                                ) 
                                : 
                                request.requisition_status === 'submitted' ? (
                                    <p className="flex items-center text-red-500 mb-4"><FaSave className="text-red-500 mr-1"/>  this request is only submitted. not assing for workflow</p>
                                ) 
                                : 
                                request.requisition_status === 'PENDING' ? (
                                    <p className="flex items-center text-yellow-500 mb-4"><MdPendingActions className="text-yellow-500 text-[20px] mr-1"/>  Approvel Pending</p>
                                ) : null}
                            </td>
                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <a
                                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-[#213389] hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                                    onClick={() =>
                                        handleUpdate(request.asset_requisitions_id, request)
                                    }
                                    >
                                    More details
                                </a>
                            </td>
                        </tr>
                        )
                    })}
                </tbody>
                </table>
            </div>
    );
}

export default AssetRequisitionsListTable;