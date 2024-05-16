import { FORM_TYPE } from "@/app/_lib/constants/formType";
import { handleOpenPopupModel } from "@/app/_lib/redux/features/popupModel/popupModelSlice";
import { formatDate } from "@/app/_lib/utils/dateFormatter";
import { FaSave } from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";
import { useDispatch } from "react-redux";
import { MdOutlineSmsFailed } from "react-icons/md";

function AssestRequisitionsGridComponent({
    gridcolume = "gap-2 2xl:grid-cols-5 min-[1200px]:grid-cols-4 min-[768px]:grid-cols-3 min-[640px]:grid-cols-2",
    data,
    icon
  }) {
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
        <div className={`grid ${gridcolume} mb-1 rounded bg-gray-50 dark:bg-[#121212]`}>
            {/* {data.map((item) => (
                <div className="w-full p-5 my-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-[#1e1e1e] dark:border-gray-700">
                    {icon}
                    {item.requisition_id}
                </div>
            ))} */}
                {data.map((request) => {
                    const requestItems = request.items.slice(0, 2);
                    return(
                    <div className="w-full my-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-[#1e1e1e] dark:border-gray-700">
                        <div className="flex justify-between items-center border-b-2 border-neutral-100 px-6 py-3 text-xl font-medium leading-tight dark:border-white/10">
                            <div className="bg-[#213389] w-[75px] h-[75px] rounded-full shadow-lg flex justify-center items-center">
                                {icon}
                            </div>
                            <div className="flex flex-col items-start justify-center">
                                {/* <h5 className="text-[17px] font-medium text-gray-900 dark:text-white">
                                    Featured
                                </h5> */}
                                <div className="text-black flex">
                                    <strong className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                                    Request ID : 
                                    </strong>
                                    <span className="ml-5 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {request.requisition_id}
                                    </span>
                                </div>
                                <div className="text-black flex">
                                    <strong className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                                    Request Date : 
                                    </strong>
                                    <span className="ml-5 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {formatDate(request.requisition_date)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <h5 className="mb-4 text-black text-xl font-medium leading-tight">
                            You are requested
                            </h5>
                            <div className="h-[90px]">
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
                            </div>
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
                            )
                            : 
                            request.requisition_status === 'REJECTED' ? (
                                <p className="flex items-center text-red-500 mb-4"><MdOutlineSmsFailed className="text-red-500 text-[20px] mr-1"/>  Approvel Rejected</p>
                            ) : null}
                            <div className="flex justify-end">
                                <a
                                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-[#213389] hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                                onClick={() =>
                                    handleUpdate(request.asset_requisitions_id, request)
                                }
                                >
                                More details
                                </a>
                            </div>
                        </div>
                    </div>
                    )
                })}
            </div>
    );
}

export default AssestRequisitionsGridComponent;