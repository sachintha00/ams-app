import React, { useEffect, useState, useContext, useRef } from "react";
import { FORM_TYPE } from "@/app/_lib/constants/formType";
import { handleOpenPopupModel } from "@/app/_lib/redux/features/popupModel/popupModelSlice";
import { useRouter } from "next/navigation";
import { FaPenToSquare } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { CSSTransition } from 'react-transition-group';
import { renderObjData } from "./renderObjData";
import Select from 'react-select';
import { FaUserTie, FaUsers } from "react-icons/fa6";
import DownloadButtons from "./DownloadButtons";
import CustomOption from "../../components/requisitionsapproval/components/customOption";
import useDarkMode from "@/app/_lib/hooks/useDarkMode";
import { customSelectStyles } from "@/app/_lib/utils/customSelectStyles";
import { useRequestApproveMutation, useRequestRejectMutation } from "@/app/_lib/redux/features/workflowapprovelalert/workflowapprovelalert_api";
import { formatDate } from "@/app/_lib/utils/dateFormatter";

function UsersRequisitionsListTable({ data }) {
    const [expandedRow, setExpandedRow] = useState(null);
    const [selectedUser, setSelectedUser] = useState('');
    const [reasonComment, setReasonComment] = useState('');
  
    const handleToggle = (id) => {
      setExpandedRow((prevExpandedRow) => (prevExpandedRow === id ? null : id));
    };
    
    const isDarkMode = useDarkMode();

    // Handle select change
    const handleSelectUser = (selectedOption) => {
        setSelectedUser(selectedOption.value);
    };

    // Request Approve
    const [requestApprove] = useRequestApproveMutation();

    const submitRequestApprove = async (item) => {
        try {
            const requested_id = item.requested_id;
            const pending_workflow_node_id = item.pending_workflow_node_id;
            const workflow_id = item.workflow_id;
            const RequisitionId = item.requested_data_obj["Requisition Id"];

            const requestApproveData = { request_id: requested_id, workflow_node_id: pending_workflow_node_id, workflow_id: workflow_id, requisition_id: RequisitionId, approver_comment: reasonComment, designaion_user_id: selectedUser};
            console.log(requestApproveData);
            requestApprove(requestApproveData)
                .unwrap()
                .then((response) => {
                console.log("New node added:", response);
                refetch();
                // router.push("/dashboard/usergroups");
                })
                .catch((error) => {
                console.error("Error adding new node:", error);
                });
        } catch (error) {
            console.error("Login error:", error);
        }
    };


    const [requestReject] = useRequestRejectMutation();

    const submitRequestReject = async (item) => {
        try {
            const requested_id = item.requested_id;
            const pending_workflow_node_id = item.pending_workflow_node_id;
            const workflow_id = item.workflow_id;
            const RequisitionId = item.requested_data_obj["Requisition Id"];

            const requestRejectData = { request_id: requested_id, workflow_node_id: pending_workflow_node_id, workflow_id: workflow_id, requisition_id: RequisitionId, approver_comment: reasonComment, designaion_user_id: selectedUser};
            console.log(requestRejectData);
            requestReject(requestRejectData)
                .unwrap()
                .then((response) => {
                console.log("New node added:", response);
                // router.push("/dashboard/usergroups");
                refetch();
                })
                .catch((error) => {
                console.error("Error adding new node:", error);
                });
        } catch (error) {
            console.error("Login error:", error);
        }
    };
  
  return (
    <>
         {data.length > 0 && (
            <div className="border border-gray-200 sm:rounded-lg w-[-webkit-fill-available]">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                {/* <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-[#606368] dark:text-gray-400">
                    <tr>
                    <th className="px-6 py-3">
                        
                    </th>
                    <th className="px-6 py-3">
                        
                    </th>
                    <th className="px-6 py-3">
                        <div className="flex flex-col items-center justify-center">
                            <span>Requested User Details</span>
                        </div>
                    </th>
                    <th className="px-6 py-3">
                        <div className="flex flex-col items-center justify-center">
                            <span>Workflow Request Type</span>
                        </div>
                    </th>
                    <th className="px-6 py-3">
                        <div className="flex flex-col items-center justify-center">
                            <span>Status</span>
                        </div>
                    </th>
                    <th className="px-6 py-3">
                        <div className="flex flex-col items-center justify-center">
                            <span>Next Approver</span>
                        </div>
                    </th>
                    <th className="px-6 py-3">
                        <div className="flex flex-col items-center justify-center">
                            <span>Comment</span>
                        </div>
                    </th>
                    <th className="px-6 py-3">
                        <div className="flex flex-col items-center justify-center">
                            <span>Action</span>
                        </div>
                    </th>
                    </tr>
                </thead> */}
                <tbody>
                    {data.map((item) => {
                        // Extract and format next_approver_details for Select component
                        const options = item.next_approver_details.map(approver => ({
                            value: approver.id,
                            label: approver.name,
                            image: approver.profile_image || '/avater.png' // Provide a default image URL if profile_image is null
                        }));
                        
                        return (
                            <React.Fragment key={item.id}>
                                <tr className={`${expandedRow === item.id ? 'hidden' : ''} odd:bg-white odd:dark:bg-[#1e1e1e] even:bg-gray-50 even:dark:bg-[#3c4042] border-b dark:border-gray-700`}>
                                    <td
                                    className="cursor-pointer"
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            <button onClick={() => handleToggle(item.id)} className="flex justify-center items-center w-[35px] h-[35px] rounded-full shadow">
                                                {expandedRow === item.id ? <IoIosArrowUp className='text-[20px]'/> : <IoIosArrowDown className='text-[20px]'/>}
                                            </button>
                                        </div>
                                    </td>
                                    <td
                                    className="px-6 py-4 cursor-pointer"
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            <img
                                                className="w-12 h-12 rounded-full shadow-lg"
                                                src="/avater.png"
                                                alt="Bonnie image"
                                            />
                                        </div>
                                    </td>
                                    <td
                                    className="px-6 py-4 cursor-pointer"
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            <h5 className="mb-1 text-[20px] font-medium text-gray-900 dark:text-white">
                                                {item.requested_user.name}
                                            </h5>
                                            <span className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                {item.requested_user.email}
                                            </span>
                                            <h6 className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {item.requested_user.designation}
                                            </h6>
                                        </div>
                                    </td>
                                    <td
                                    className="px-6 py-4 cursor-pointer"
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            {item.workflow_request_type}
                                        </div>
                                    </td>
                                    <td
                                    className="px-6 py-4 cursor-pointer"
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            {item.request_status}
                                        </div>
                                    </td>
                                    <td
                                    className="px-6 py-4 cursor-pointer"
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                                            <div className="max-w-2xl mx-auto px-4">
                                                                {item.next_approver_behaviour_type === 'DESIGNATION' && item.next_approver_type === 'SINGLE' && (
                                                                    <div className='mb-6'>
                                                                        <label
                                                                            htmlFor="user_name"
                                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                                        >
                                                                            Select Next Approver
                                                                        </label>
                                                                        <Select
                                                                            options={options}
                                                                            getOptionLabel={(option) => option.label}
                                                                            getOptionValue={(option) => option.value}
                                                                            components={{ Option: CustomOption }}
                                                                            styles={customSelectStyles(isDarkMode)}
                                                                            onChange={handleSelectUser}
                                                                        />
                                                                    </div>
                                                                )}
                                                                {item.next_approver_behaviour_type === 'DESIGNATION' && item.next_approver_type === 'POOL' && (
                                                                    <div className='mb-6'>
                                                                        <div className="max-w-sm mx-auto bg-white dark:bg-[#3c4042] rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                                                                            <div className="md:flex">
                                                                                <div className="flex items-center justify-center m-3">
                                                                                    <div className="flex justify-center items-center w-12 h-12 rounded-full shadow-lg dark:bg-[#606368]">
                                                                                        <FaUserTie className='text-[20px] dark:text-white'/>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex item-center p-3">
                                                                                    <div className="flex items-center tracking-wide text-sm text-black dark:text-white font-semibold">
                                                                                            Designation Pool
                                                                                    </div>
                                                                                    {/* <p className="mt-2 text-gray-500">
                                                                                        This is a brief description or any additional information about the user. You can customize this text as needed.
                                                                                    </p> */}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {item.next_approver_behaviour_type === 'EMPLOYEE' && item.next_approver_type === 'SINGLE' && (
                                                                    <>
                                                                    {item.next_approver_details.map(Users => (
                                                                            <div className='mb-6'>
                                                                                <div className="max-w-sm mx-auto bg-white dark:bg-[#3c4042] rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                                                                                    <div className="md:flex">
                                                                                        <div className="flex items-center justify-center m-3">
                                                                                            <img
                                                                                                className="w-12 h-12 rounded-full shadow-lg"
                                                                                                src="/avater.png"
                                                                                                alt="Bonnie image"
                                                                                            />
                                                                                        </div>
                                                                                        <div className="flex item-center p-3">
                                                                                            <div className="flex items-center tracking-wide text-sm text-black dark:text-white font-semibold">
                                                                                                {Users.name}
                                                                                            </div>
                                                                                            {/* <p className="mt-2 text-gray-500">
                                                                                                This is a brief description or any additional information about the user. You can customize this text as needed.
                                                                                            </p> */}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                    ))}
                                                                    </>
                                                                )}
                                                                {item.next_approver_behaviour_type === 'EMPLOYEE' && item.next_approver_type === 'POOL' && (
                                                                    <>
                                                                        <div className='mb-6'>
                                                                            <div className="max-w-sm mx-auto bg-white dark:bg-[#3c4042] rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                                                                                <div className="md:flex">
                                                                                    <div className="flex items-center justify-center m-3">
                                                                                        <div className="flex justify-center items-center w-12 h-12 rounded-full shadow-lg dark:bg-[#606368]">
                                                                                            <FaUsers className='text-[20px] dark:text-white'/>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex item-center p-3">
                                                                                        <div className="flex items-center tracking-wide text-sm text-black dark:text-white font-semibold">
                                                                                            Employee Pool
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                        </div>
                                    </td>
                                    <td
                                    className="px-6 py-4 cursor-pointer"
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            <textarea
                                                id="comment"
                                                rows={3}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                placeholder="Write a comment..."
                                                required=""
                                                defaultValue={""}
                                                onChange={(e) => setReasonComment(e.target.value)}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="max-w-2xl mx-auto px-4">
                                                <button
                                                    className="text-white bg-red-400 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-400 dark:hover:bg-red-500 dark:focus:ring-blue-800"
                                                    onClick={() => submitRequestReject(item)}
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-blue-800 ml-[15px]"
                                                    onClick={() => submitRequestApprove(item)}
                                                >
                                                    Approve
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <CSSTransition
                                    in={expandedRow === item.id}
                                    timeout={300}
                                    classNames="row"
                                    unmountOnExit
                                >
                                    <tr className="border-b dark:border-gray-700 align-baseline">
                                        <td colSpan="8">
                                            <div className="flex items-center justify-start">
                                                <div className="m-5 mb-0">
                                                    <button onClick={() => handleToggle(item.id)} className="flex justify-center items-center w-[35px] h-[35px] rounded-full shadow">
                                                        {expandedRow === item.id ? <IoIosArrowUp className='text-[20px]'/> : <IoIosArrowDown className='text-[20px]'/>}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex pb-4 lg:pb-8">
                                                <div className="flex w-[50%]">
                                                    <div className="w-[40%]">
                                                        <div className="w-full max-w-sm">
                                                            <div className="flex flex-col items-center justify-center p-5">
                                                                <img
                                                                    className="w-[130px] h-[130px] rounded-full shadow-lg mb-[20px]"
                                                                    src="/avater.png"
                                                                    alt="Bonnie image"
                                                                />
                                                                <h5 className="mb-1 text-[25px] font-medium text-gray-900 dark:text-white">
                                                                {item.requested_user.name}
                                                                </h5>
                                                                <span className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                                {item.requested_user.email}
                                                                </span>
                                                                <h6 className="mb-1 text-[19px] font-medium text-gray-500 dark:text-gray-400">
                                                                {item.requested_user.designation}
                                                                </h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="w-[60%] p-5">
                                                        <div className="flex justify-between items-center mb-[25px]">
                                                            <h3 className="mr-3 font-semibold text-gray-700 dark:text-white text-[20px]">
                                                                {item.workflow_request_type} Details
                                                            </h3>
                                                            <DownloadButtons data={item.requested_data_obj} />
                                                        </div>
                                                        {renderObjData(item.requested_data_obj)}
                                                    </div>
                                                </div>
                                                <div className="flex w-[50%]">
                                                    <div className="w-[100%] flex flex-col">

                                                        <section className="pt-4 lg:pt-8">
                                                            <div className="max-w-2xl mx-auto px-4">
                                                                {item.next_approver_behaviour_type === 'DESIGNATION' && item.next_approver_type === 'SINGLE' && (
                                                                    <div className='mb-6'>
                                                                        <label
                                                                            htmlFor="user_name"
                                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                                        >
                                                                            Select Next Approver
                                                                        </label>
                                                                        <Select
                                                                            options={options}
                                                                            getOptionLabel={(option) => option.label}
                                                                            getOptionValue={(option) => option.value}
                                                                            components={{ Option: (props) => <CustomOption {...props} theme={isDarkMode} /> }}
                                                                            styles={customSelectStyles(isDarkMode)}
                                                                            onChange={handleSelectUser}
                                                                        />
                                                                    </div>
                                                                )}
                                                                {item.next_approver_behaviour_type === 'DESIGNATION' && item.next_approver_type === 'POOL' && (
                                                                    <div className='mb-6'>
                                                                        <label
                                                                            htmlFor="user_name"
                                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                                        >
                                                                            Next Approver
                                                                        </label>
                                                                        <div className="max-w-sm mx-auto bg-white dark:bg-[#3c4042] rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                                                                            <div className="md:flex">
                                                                                <div className="flex items-center justify-center m-3">
                                                                                    <div className="flex justify-center items-center w-12 h-12 rounded-full shadow-lg dark:bg-[#606368]">
                                                                                        <FaUserTie className='text-[20px] dark:text-white'/>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex item-center p-3">
                                                                                    <div className="flex items-center tracking-wide text-sm text-black dark:text-white font-semibold">
                                                                                            Designation Pool
                                                                                    </div>
                                                                                    {/* <p className="mt-2 text-gray-500">
                                                                                        This is a brief description or any additional information about the user. You can customize this text as needed.
                                                                                    </p> */}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {item.next_approver_behaviour_type === 'EMPLOYEE' && item.next_approver_type === 'SINGLE' && (
                                                                    <>
                                                                    {item.next_approver_details.map(Users => (
                                                                            <div className='mb-6'>
                                                                                <label
                                                                                    htmlFor="user_name"
                                                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                                                >
                                                                                    Next Approver
                                                                                </label>
                                                                                <div className="max-w-sm mx-auto bg-white dark:bg-[#3c4042] rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                                                                                    <div className="md:flex">
                                                                                        <div className="flex items-center justify-center m-3">
                                                                                            <img
                                                                                                className="w-12 h-12 rounded-full shadow-lg"
                                                                                                src="/avater.png"
                                                                                                alt="Bonnie image"
                                                                                            />
                                                                                        </div>
                                                                                        <div className="flex item-center p-3">
                                                                                            <div className="flex items-center tracking-wide text-sm text-black dark:text-white font-semibold">
                                                                                                {Users.name}
                                                                                            </div>
                                                                                            {/* <p className="mt-2 text-gray-500">
                                                                                                This is a brief description or any additional information about the user. You can customize this text as needed.
                                                                                            </p> */}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                    ))}
                                                                    </>
                                                                )}
                                                                {item.next_approver_behaviour_type === 'EMPLOYEE' && item.next_approver_type === 'POOL' && (
                                                                    <>
                                                                        <div className='mb-6'>
                                                                            <label
                                                                                htmlFor="user_name"
                                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                                            >
                                                                                Next Approver
                                                                            </label>
                                                                            <div className="max-w-sm mx-auto bg-white dark:bg-[#3c4042] rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                                                                                <div className="md:flex">
                                                                                    <div className="flex items-center justify-center m-3">
                                                                                        <div className="flex justify-center items-center w-12 h-12 rounded-full shadow-lg dark:bg-[#606368]">
                                                                                            <FaUsers className='text-[20px] dark:text-white'/>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex item-center p-3">
                                                                                        <div className="flex items-center tracking-wide text-sm text-black dark:text-white font-semibold">
                                                                                            Employee Pool
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </section>

                                                        <section className="pt-4 lg:pt-8">
                                                            <div className="max-w-2xl mx-auto px-4">
                                                                <div className="mb-6">
                                                                    <div className="py-2 mb-4">
                                                                        <label
                                                                            htmlFor="Reason"
                                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                                        >
                                                                            Your comment (Reason for Approve/Reject)
                                                                        </label>
                                                                        <textarea
                                                                        id="comment"
                                                                        rows={6}
                                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                        placeholder="Write a comment..."
                                                                        required=""
                                                                        defaultValue={""}
                                                                        onChange={(e) => setReasonComment(e.target.value)}
                                                                        value={reasonComment}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </section>

                                                        <section className="pt-4 lg:pt-8">
                                                            <div className="max-w-2xl mx-auto px-4">
                                                                <button
                                                                    className="text-white bg-red-400 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-400 dark:hover:bg-red-500 dark:focus:ring-blue-800"
                                                                    onClick={() => submitRequestReject(item)}
                                                                >
                                                                    Reject
                                                                </button>
                                                                <button
                                                                    className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-blue-800 ml-[15px]"
                                                                    onClick={() => submitRequestApprove(item)}
                                                                >
                                                                    Approve
                                                                </button>
                                                            </div>
                                                        </section>

                                                        {item.previous_user_details && item.previous_user_details.length > 0 && (
                                                            <section className="pt-8 lg:pt-12">
                                                                <div className="max-w-2xl mx-auto px-4">
                                                                    <div className="flex justify-between items-center mb-6">
                                                                    <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                                                                        Previous Comments ({item.previous_user_details.length})
                                                                    </h2>
                                                                    </div>
                                                                        {item.previous_user_details.map(previousUser => (
                                                                        <article className="p-6 mb-3 text-base border-t border-gray-200 dark:border-gray-700">
                                                                            <footer className="flex justify-between items-center mb-2">
                                                                                <div className="flex items-center">
                                                                                <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                                                                                    <img
                                                                                    className="mr-2 w-6 h-6 rounded-full"
                                                                                    src="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
                                                                                    alt="Bonnie Green"
                                                                                    />
                                                                                    {previousUser.name}
                                                                                </p>
                                                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                                    <time pubdate="" dateTime="2022-03-12" title="March 12th, 2022">
                                                                                    {formatDate(previousUser.approved_at)}
                                                                                    </time>
                                                                                </p>
                                                                                </div>
                                                                            </footer>
                                                                            <p className="text-gray-500 dark:text-gray-400">
                                                                                {previousUser.comment_for_action}
                                                                            </p>
                                                                        </article>
                                                                        ))}
                                                                    {/* <article className="p-6 text-base border-t border-gray-200 dark:border-gray-700">
                                                                        <footer className="flex justify-between items-center mb-2">
                                                                            <div className="flex items-center">
                                                                            <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                                                                                <img
                                                                                className="mr-2 w-6 h-6 rounded-full"
                                                                                src="https://flowbite.com/docs/images/people/profile-picture-4.jpg"
                                                                                alt="Helene Engels"
                                                                                />
                                                                                Ishan Thilanka
                                                                            </p>
                                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                                <time pubdate="" dateTime="2022-06-23" title="June 23rd, 2022">
                                                                                Jun. 23, 2024
                                                                                </time>
                                                                            </p>
                                                                            </div>
                                                                        </footer>
                                                                        <p className="text-gray-500 dark:text-gray-400">
                                                                            Thanks for sharing this. I do came from the Backend development and
                                                                            explored some of the tools to design my Side Projects.
                                                                        </p>
                                                                    </article> */}
                                                                </div>
                                                            </section>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </CSSTransition>
                            </React.Fragment>
                        );
                    })}
                </tbody>
                </table>
            </div>
        )}
    </>
  );
}

export default UsersRequisitionsListTable;