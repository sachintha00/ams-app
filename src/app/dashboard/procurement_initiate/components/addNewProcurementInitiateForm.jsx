'use client'
import React, { useEffect, useState, useContext, useRef } from 'react';
import { IoClose } from "react-icons/io5";
import { useAddNewAssestRequisitionMutation, useAssestrequisitionListQuery } from '@/app/_lib/redux/features/assestrequisition/assest_requisition_api';
import Requisitionsapproval from '../../components/requisitionsapproval/requisitionsapproval';
import { formatKeys } from '@/app/_lib/utils/formatKeys';
import Drawer from './Drawer';
import { formatDate } from '@/app/_lib/utils/dateFormatter';
import { CSSTransition } from 'react-transition-group';
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import SupplierListDrodwon from './SupplierListDrodwon';
import { FaFilePdf } from "react-icons/fa6";
import { FaFileCsv } from "react-icons/fa6";
import { FaFileAlt } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { useAllApprovedRequisitionDataQuery, useSubmitProcurementFormMutation } from '@/app/_lib/redux/features/procurement/procurement_api';

function AddNewProcurementInitiateForm({ }) {

        const usedispatch = useDispatch();

        const {
            data: AllApprovedRequisition,
            isLoading,
            isError,
            error,
            refetch,
          } = useAllApprovedRequisitionDataQuery();

        console.log(AllApprovedRequisition?.requisition_data);
        

        // set page layout
        const [currentStep, setCurrentStep] = useState(1); // 1: Asset Requisition, 2: Assign Organization
    
        //Requisition ID
        const [RequisitionId, setAssetReqId] = useState('');
    
        const generateUniqueAssetReqId = () => {
            return Math.random().toString(36).substr(2, 8);
        };

        useEffect(() => {
            const generatedId = generateUniqueAssetReqId();
            setAssetReqId(generatedId);
          }, []);
    
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().substr(0, 10);
        const [assetRequisitionDate, setReqDate] = useState(today);
    
        // add user
        const [addAssestRequisition] = useAddNewAssestRequisitionMutation();
        const [addUpdateAssestRequisitionStatus] = useAddNewAssestRequisitionMutation();
    
        // // save From
        // const saveForm = async e => {
        //     const requisitionStatus = "saved";
        //     e.preventDefault();
        //     try {
        //         const assestrequisition = {requisition_id: RequisitionId, requisition_date: assetRequisitionDate, requisition_status: requisitionStatus, items: items}
        //         addAssestRequisition(assestrequisition)
        //         .unwrap()
        //         .then((response) => {
        //             console.log("New node added:", response);
        //             // router.push("/dashboard/usergroups");
        //             setStatus('saved');
        //             setmessage(response.message);
        //             refetch();
        //         })
        //         .catch((error) => {
        //             console.error("Error adding new node:", error);
        //             setUserCreateError(error);
        //             const timer = setTimeout(() => {
        //                 setUserCreateError('');
        //             }, 5000); // Adjust the duration (in milliseconds) as needed
        //             return () => clearTimeout(timer);
        //         });
        //     } catch (error) {
        //         console.error("Login error:", error);
        //     }
        // }
    
        // // Submit From
        // const submitForm = async e => {
        //     const status = "submitted";
        //     e.preventDefault();
        //     try {
        //         if (status === 'saved') {
        //             const assestrequisitionupdatedata = {requisition_id: RequisitionId, requisition_status: status}
        //             addUpdateAssestRequisitionStatus(assestrequisitionupdatedata)
        //             .unwrap()
        //             .then((response) => {
        //                 console.log("New node added:", response);
        //                 // router.push("/dashboard/usergroups");
        //                 setStatus('submitted');
        //                 setCurrentStep(2); // Move to the next step
        //                 setmessage(response.message);
        //                 refetch();
        //             })
        //             .catch((error) => {
        //                 console.error("Error adding new node:", error);
        //                 setUserCreateError(error);
        //                 const timer = setTimeout(() => {
        //                     setUserCreateError('');
        //                 }, 5000); // Adjust the duration (in milliseconds) as needed
        //                 return () => clearTimeout(timer);
        //             });
        //         } else {
        //             const assestrequisition = {requisition_id: RequisitionId, requisition_date: assetRequisitionDate, requisition_status: status, items: items}
        //             addAssestRequisition(assestrequisition)
        //             .unwrap()
        //             .then((response) => {
        //                 console.log("New node added:", response);
        //                 // router.push("/dashboard/usergroups");
        //                 setStatus('submitted');
        //                 setCurrentStep(2); // Move to the next step
        //                 setmessage(response.message);
        //                 refetch();
        //             })
        //             .catch((error) => {
        //                 console.error("Error adding new node:", error);
        //                 setUserCreateError(error);
        //                 const timer = setTimeout(() => {
        //                     setUserCreateError('');
        //                 }, 5000); // Adjust the duration (in milliseconds) as needed
        //                 return () => clearTimeout(timer);
        //             });
        //         }
        //     } catch (error) {
        //         console.error("Login error:", error);
        //     }
        // }
    
        // const modelTopic = 'Asset Requisition';
        // const requestType = 1;
    
        // const formattedFormData = formatKeys({ RequisitionId, assetRequisitionDate, items: formatKeys(items) });
        // console.log(formattedFormData);

        const [selectedItems, setSelectedItems] = useState([]);

        const removeSelectedItem = (itemId) => {
          setSelectedItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
        };
      
        const updateSelectedItem = (itemId, field, value) => {
          setSelectedItems((prevItems) =>
            prevItems.map((item) =>
              item.id === itemId ? { ...item, [field]: value } : item
            )
          );
        };

        const handleInputChange = (itemId, field, value) => {
            updateSelectedItem(itemId, field, value);
        };

        const [expandedRow, setExpandedRow] = useState(null);

        const handleToggle = (id) => {
            setExpandedRow((prevExpandedRow) => (prevExpandedRow === id ? null : id));
        };

        // add suppliers
        const [supplierInput, setSupplierInput] = useState('');
        const [supplierSuggestions, setSupplierSuggestions] = useState([]);
        const [selectedSuppliers, setSelectedSuppliers] = useState([]);
        const [isOpenRoleList, setIsOpenRoleList] = useState(false); 
        const [isOpenSupplierList, setIsOpenSupplierList] = useState(false);

        const toggleSupplierListHandler = () =>{
            setIsOpenSupplierList((prev) => !prev);
        };
    
        // supplier list handaer
        const refRoleList = useRef(null);
    
        useEffect(() => {
            const handleClickOutside = (event) => {
              if (refRoleList.current && !refRoleList.current.contains(event.target)) {
                setIsOpenRoleList(false);
              }
            };
        
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
              document.removeEventListener('mousedown', handleClickOutside);
            };
          }, []);
    
        const toggleRoleListHandler = () =>{
            setIsOpenRoleList((prev) => !prev);
        };

        const [searchInput, setSearchInput] = useState('');

        const handleSearchInputChange = (event) => {
            setSearchInput(event.target.value);
        };

        const handleSupplierSelect = (supplier) => {
            console.log(supplier);
            if (!selectedSuppliers.some((sup) => sup.id === supplier.id)) {
            setSelectedSuppliers([...selectedSuppliers, supplier]);
            }
            setSupplierInput('');
            setSupplierSuggestions([]);
        };

        const handleSupplierRemove = (supplierId) => {
            setSelectedSuppliers(selectedSuppliers.filter((sup) => sup.id !== supplierId));
        };

        // multiple file uplording
        const [files, setFiles] = useState([]);
        const handleFileChange = (event) => {
            const fileList = event.target.files;
            const newFiles = Array.from(fileList);
            setFiles([...files, ...newFiles]);
        };
        
        const handleRemoveFile = (index) => {
            const updatedFiles = files.filter((_, i) => i !== index);
            setFiles(updatedFiles);
        };
        
        const renderFile = (file, index) => {
            const fileType = file.type.split("/")[0]; // Get the file type (e.g., 'image', 'application')
        
            if (fileType === "image") {
            return (
                <div key={index}>
                <img
                    src={URL.createObjectURL(file)}
                    alt={`Image ${index}`}
                    className="w-28"
                />
                <span className="text-gray-700 flex w-[10px]">{file.name}</span>
                <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-gray-400 bg-transparent hover:bg-red-400 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-red-400 dark:hover:text-white"
                    data-modal-toggle="crud-modal"
                >
                    <IoClose className="text-2xl hover:text-white" />
                    <span className="sr-only">Close modal</span>
                </button>
                </div>
            );
            } else {
            // Render file name with corresponding icon for non-image files
            let icon;
            if (file.type.includes("pdf")) {
                icon = <FaFilePdf className="text-6xl" />; // Example PDF icon
            } else {
                icon = <i className="fa fa-file-o" aria-hidden="true"></i>; // Default file icon
            }
            return (
                <div key={index}>
                {icon}
                <span className="text-gray-700 ">{file.name}</span>
                <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-gray-400 bg-transparent hover:bg-red-400 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-red-400 dark:hover:text-white"
                    data-modal-toggle="crud-modal"
                >
                    <IoClose className="text-2xl hover:text-white" />
                    <span className="sr-only">Close modal</span>
                </button>
                </div>
            );
            }
        }; 

        const [rpfUploadedFiles, setRpfUploadedFiles] = useState([]);
        const [uploadedFiles, setUploadedFiles] = useState([]);

        const handleFileUpload = (e, setFileState) => {
            console.log(setFileState);
            const files = Array.from(e.target.files);
            setFileState(prevFiles => [...prevFiles, ...files]);
        };
        
        const handleDrop = (e, setFileState) => {
            e.preventDefault();
            const files = Array.from(e.dataTransfer.files);
            setFileState(prevFiles => [...prevFiles, ...files]);
        };
        
        const removeFile = (index, setFileState, fileState) => {
            setFileState(fileState.filter((_, i) => i !== index));
        };

        const getFileIcon = (file) => {
            const fileType = file.type.split('/')[1];
            switch (fileType) {
              case 'jpeg':
              case 'jpg':
              case 'png':
              case 'gif':
                return <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />;
              case 'pdf':
                return <FaFilePdf className='text-red-500 text-[100px]'/>;
              case 'csv':
                return <FaFileCsv className='text-green-500 text-[100px]'/>;
              default:
                return <FaFileAlt className='text-gray-500 text-[100px]'/>;
            }
          };

        const [requiredDate, setRequiredDate] = useState("");
        const [comment, setComment] = useState("");

        const [submitProcurementForm] = useSubmitProcurementFormMutation();

        // save From
        const reqquotation = async e => {
            const requisitionStatus = "save";
            e.preventDefault();
            try {
                const ProcurementForm = {requwetsid: RequisitionId, date: assetRequisitionDate, selected_items: selectedItems, selected_suppliers: selectedSuppliers, rpf_document: rpfUploadedFiles, attachment: uploadedFiles, requered_date: requiredDate, comment: comment, status: requisitionStatus}
                submitProcurementForm(ProcurementForm)
                .unwrap()
                .then((response) => {
                    console.log("New node added:", response);
                    // router.push("/dashboard/usergroups");
                    setStatus('saved');
                    setmessage(response.message);
                    refetch();
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
                {/* Modal header */}
                {currentStep === 1 && (
                    <div>
                    <form
                        className="px-2 pt-2 overflow-y-scroll h-[600px]"
                        style={{ scrollbarWidth: "2px", scrollbarColor: "#888" }}
                        encType="multipart/form-data"
                    >
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="flex items-center">
                                <label
                                htmlFor="user_name"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                Procurement Initiate No :
                                </label>
                                <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                {RequisitionId}
                                <input type="hidden" value={RequisitionId} />
                                </span>
                            </div>
                            <div className="flex justify-end items-center">
                                <label
                                htmlFor="user_name"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mr-1"
                                >
                                Date :
                                </label>
                                <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                <input
                                    type="date"
                                    id="user_name"
                                    name="user_name"
                                    value={assetRequisitionDate}
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter user user name"
                                    required
                                />
                                </span>
                            </div>
                        </div>
                        <div className="grid gap-6 mb-6">
                            <div>
                                <label
                                htmlFor="user_name"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                assign items to Procurement Initiate
                                </label>
                                <div className="flex">
                                <Drawer
                                    selectedItems={selectedItems}
                                    setSelectedItems={setSelectedItems}
                                />
                                <div className="flex-1 p-4 pt-0 w-[80%]">
                                        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Selected items
                                        </h1>
                                        <div className='flex flex-col rounded bg-white dark:bg-[#1e1e1e] tablelist h-auto'>
                                            <div className="overflow-x-auto border border-gray-200 sm:rounded-lg">
                                                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                                                    <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-[#606368] dark:text-gray-400">
                                                        <tr>
                                                            <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                            
                                                            </th>
                                                            <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                            Item name
                                                            </th>
                                                            <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                            Request ID
                                                            </th>
                                                            <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                            Requested user
                                                            </th>
                                                            <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                            Requeste for
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
                                                            <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                            
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {selectedItems.map((item) => (
                                                        <>
                                                        <tr className={`${expandedRow === item.id ? 'hidden' : ''} odd:bg-white odd:dark:bg-[#1e1e1e] even:bg-gray-50 even:dark:bg-[#3c4042] border-b dark:border-gray-700`}>
                                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                                <a onClick={() => handleToggle(item.id)} className="flex justify-center items-center w-[24px] h-[24px] dark:border-[#606368] row-enter-done">
                                                                    {expandedRow === item.id ? <IoIosArrowUp/> : <IoIosArrowDown/>}
                                                                </a>
                                                            </td>
                                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                                {item.item_name}
                                                            </td>
                                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                                {item.request.requisition_id}
                                                            </td>
                                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                                {item.request.user.name}
                                                            </td>
                                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                                {item.organization}
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
                                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                                {formatDate(item.request.requisition_date)}
                                                            </td>
                                                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                                <a
                                                                className="text-gray-400 bg-red-400 hover:bg-red-500 hover:text-white rounded-lg text-sm w-6 h-6 ml-0 inline-flex justify-center items-center dark:bg-red-400 dark:hover:bg-red-500 dark:hover:text-white"
                                                                onClick={() => removeSelectedItem(item.id)}
                                                                >
                                                                <IoClose className="text-xl text-white" />
                                                                <span className="sr-only">Close modal</span>
                                                                </a>
                                                            </td>
                                                        </tr>
                                                        <CSSTransition
                                                            in={expandedRow === item.id}
                                                            timeout={200}
                                                            classNames="row"
                                                            unmountOnExit
                                                        >
                                                            <tr className="odd:bg-white odd:dark:bg-[#1e1e1e] even:bg-gray-50 even:dark:bg-[#3c4042] border-b dark:border-gray-700">
                                                                <td colSpan={8}>
                                                                    <div className='flex justify-between mt-3'>
                                                                        <div className='w-[6.5%] flex justify-center'>
                                                                            <a onClick={() => handleToggle(item.id)} className="flex justify-center items-center w-[24px] h-[24px] dark:border-[#606368] row-enter-done">
                                                                                {expandedRow === item.id ? <IoIosArrowUp/> : <IoIosArrowDown/>}
                                                                            </a>
                                                                        </div>
                                                                        <div className='w-[87%] p-3'>
                                                                            <div className='flex justify-between'>
                                                                                <div className="flex items-center">
                                                                                    <label
                                                                                    htmlFor="user_name"
                                                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                                                    >
                                                                                    Asset Requisition No :
                                                                                    </label>
                                                                                    <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                                                    {item.request.requisition_id}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="flex items-center">
                                                                                    <label
                                                                                    htmlFor="user_name"
                                                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                                                    >
                                                                                    Requisition Date :
                                                                                    </label>
                                                                                    <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                                                        {formatDate(item.request.requisition_date)}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            <div className='flex justify-between p-5'>
                                                                                <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
                                                                                    <li className="flex items-center">
                                                                                        <svg
                                                                                            className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                                                                            aria-hidden="true"
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            fill="currentColor"
                                                                                            viewBox="0 0 20 20"
                                                                                        >
                                                                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                                                                        </svg>
                                                                                        Item Name : {item.item_name}
                                                                                    </li>
                                                                                    <li className="flex items-center">
                                                                                        <svg
                                                                                            className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                                                                            aria-hidden="true"
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            fill="currentColor"
                                                                                            viewBox="0 0 20 20"
                                                                                        >
                                                                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                                                                        </svg>
                                                                                        Assest Type : {item.assesttype}
                                                                                    </li>
                                                                                    <li className="flex items-center">
                                                                                        <svg
                                                                                            className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                                                                            aria-hidden="true"
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            fill="currentColor"
                                                                                            viewBox="0 0 20 20"
                                                                                        >
                                                                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                                                                        </svg>
                                                                                        Reason : {item.reason}
                                                                                    </li>
                                                                                    <li className="flex items-center">
                                                                                        <svg
                                                                                            className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                                                                            aria-hidden="true"
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            fill="currentColor"
                                                                                            viewBox="0 0 20 20"
                                                                                        >
                                                                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                                                                        </svg>
                                                                                        Priority : {item.priority}
                                                                                    </li>
                                                                                    <li className="flex items-center">
                                                                                        <svg
                                                                                            className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                                                                            aria-hidden="true"
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            fill="currentColor"
                                                                                            viewBox="0 0 20 20"
                                                                                        >
                                                                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                                                                        </svg>
                                                                                        period : {item.period_from} To {item.period_to} 
                                                                                    </li>
                                                                                    <li className="flex items-center">
                                                                                        <svg
                                                                                            className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                                                                            aria-hidden="true"
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            fill="currentColor"
                                                                                            viewBox="0 0 20 20"
                                                                                        >
                                                                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                                                                        </svg>
                                                                                        Business Perpose : {item.business_perpose}
                                                                                    </li>
                                                                                    <li className="flex items-center">
                                                                                        <svg
                                                                                            className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                                                                            aria-hidden="true"
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            fill="currentColor"
                                                                                            viewBox="0 0 20 20"
                                                                                        >
                                                                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                                                                        </svg>
                                                                                        Availabiity Type : {item.availabiity_type}
                                                                                    </li>
                                                                                    <li className="flex items-center">
                                                                                        <svg
                                                                                            className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                                                                            aria-hidden="true"
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            fill="currentColor"
                                                                                            viewBox="0 0 20 20"
                                                                                        >
                                                                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                                                                        </svg>
                                                                                        Upgrade or New : {item.upgrade_or_new}
                                                                                    </li>
                                                                                    <li className="flex items-center">
                                                                                        <svg
                                                                                            className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                                                                            aria-hidden="true"
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            fill="currentColor"
                                                                                            viewBox="0 0 20 20"
                                                                                        >
                                                                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                                                                        </svg>
                                                                                        Required Date : {formatDate(item.required_date)}
                                                                                    </li>
                                                                                    <li className="flex items-center">
                                                                                        <svg
                                                                                            className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                                                                            aria-hidden="true"
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            fill="currentColor"
                                                                                            viewBox="0 0 20 20"
                                                                                        >
                                                                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                                                                        </svg>
                                                                                        Period Status : {item.period_status}
                                                                                    </li>
                                                                                </ul>
                                                                                <div>
                                                                                    <div className='mb-4'>
                                                                                        <span className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Item details</span>
                                                                                        {item.item_details.map((itemdetails) => (
                                                                                            <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
                                                                                                <li className="flex items-center">
                                                                                                    <svg
                                                                                                        className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                                                                                        aria-hidden="true"
                                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                                        fill="currentColor"
                                                                                                        viewBox="0 0 20 20"
                                                                                                    >
                                                                                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                                                                                    </svg>
                                                                                                    {itemdetails.type} : {itemdetails.details}
                                                                                                </li>
                                                                                            </ul>
                                                                                        ))}
                                                                                    </div>

                                                                                    <div className='mb-4'>
                                                                                        <span className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Consumables KPI</span>
                                                                                        {item.consumables_kpi.map((consumableskpi) => (
                                                                                            <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
                                                                                                <li className="flex items-center">
                                                                                                    <svg
                                                                                                        className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                                                                                        aria-hidden="true"
                                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                                        fill="currentColor"
                                                                                                        viewBox="0 0 20 20"
                                                                                                    >
                                                                                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                                                                                    </svg>
                                                                                                    Details : {consumableskpi.details}
                                                                                                </li>
                                                                                            </ul>
                                                                                        ))}
                                                                                    </div>

                                                                                    <div className='mb-4'>
                                                                                        <span className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Consumables KPI</span>
                                                                                        {item.maintenance_kpi.map((maintenancekpi) => (
                                                                                            <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
                                                                                                <li className="flex items-center">
                                                                                                    <svg
                                                                                                        className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                                                                                        aria-hidden="true"
                                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                                        fill="currentColor"
                                                                                                        viewBox="0 0 20 20"
                                                                                                    >
                                                                                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                                                                                    </svg>
                                                                                                    Details : {maintenancekpi.details}
                                                                                                </li>
                                                                                            </ul>
                                                                                        ))}
                                                                                    </div>

                                                                                    <div className='mb-4'>
                                                                                        <span className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Service Support KPI</span>
                                                                                        {item.service_support_kpi.map((servicesupportkpi) => (
                                                                                            <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
                                                                                                <li className="flex items-center">
                                                                                                    <svg
                                                                                                        className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                                                                                        aria-hidden="true"
                                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                                        fill="currentColor"
                                                                                                        viewBox="0 0 20 20"
                                                                                                    >
                                                                                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                                                                                    </svg>
                                                                                                    Details : {servicesupportkpi.details}
                                                                                                </li>
                                                                                            </ul>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    <div className='mb-4'>
                                                                                        <span className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Item details</span>
                                                                                        <input
                                                                                            type="number"
                                                                                            value={item.quantity}
                                                                                            onChange={(e) => handleInputChange(item.id, 'quantity', e.target.value)}
                                                                                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                                        />
                                                                                    </div>
                                                                                    <div className='mb-4'>
                                                                                        <span className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Item details</span>
                                                                                        <input
                                                                                            type="text"
                                                                                            value={item.budget}
                                                                                            onChange={(e) => handleInputChange(item.id, 'budget', e.target.value)}
                                                                                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className='w-[6.2%] flex justify-center'>
                                                                            <a
                                                                            className="text-gray-400 bg-red-400 hover:bg-red-500 hover:text-white rounded-lg text-sm w-6 h-6 ml-0 inline-flex justify-center items-center dark:bg-red-400 dark:hover:bg-red-500 dark:hover:text-white"
                                                                            onClick={() => removeSelectedItem(item.id)}
                                                                            >
                                                                                <IoClose className="text-xl text-white" />
                                                                            <span className="sr-only">Close modal</span>
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </CSSTransition>
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
                        <div className="grid gap-6 mb-6 md:grid-cols-2">
                            <div>
                            <label
                                htmlFor="last_name"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Select supplares for this item
                            </label>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={handleSearchInputChange}
                                onClick={toggleRoleListHandler}
                                className="flex justify-between items-center bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Search and Select supplares for this item..."
                            />
                            <div className="flex flex-wrap gap-2 mt-1">
                                {selectedSuppliers.map((supplier) => (
                                    <span className="flex px-3 py-1 bg-gray-400 rounded-md">
                                        {supplier.name}
                                        {supplier.address}
                                        <a
                                        className="ml-2"
                                        onClick={() => handleSupplierRemove(supplier.id)}
                                        >
                                        <IoClose className="text-2xl text-white hover:text-red-400" />
                                        </a>
                                    </span>
                                ))}
                            </div>
                            {/* Dropdown menu */}
                            <div data-collapse={isOpenRoleList} ref={refRoleList} className="relative">
                                <SupplierListDrodwon
                                    handleSupplierSelect={handleSupplierSelect}
                                    searchInput={searchInput}
                                    selectedSuppliers={selectedSuppliers}
                                />
                            </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="last_name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Upload Files
                                </label>
                                <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-auto border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white dark:hover:bg-[#3c4042] dark:bg-[#3c4042] hover:bg-gray-100 dark:border-gray-600 dark:hover:border-grays-500"
                                onDrop={(e) => handleDrop(e, setUploadedFiles)}
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg
                                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 16"
                                        >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                        />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                        SVG, PNG, JPG, GIF, PDF, DOC, DOCX, or CSV (MAX. 800x400px)
                                        </p>
                                    </div>
                                    {uploadedFiles.length > 0 &&
                                        <div className="mt-2 flex flex-wrap justify-between">
                                            {uploadedFiles.map((file, index) => (
                                                <div key={index} className="p-2 relative">
                                                    <div className="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center">
                                                        {getFileIcon(file)}
                                                    </div>
                                                    <a
                                                        className="absolute top-0 right-0 text-gray-400 bg-red-400 hover:bg-red-500 hover:text-white rounded-lg text-sm w-6 h-6 ml-0 inline-flex justify-center items-center dark:bg-red-400 dark:hover:bg-red-500 dark:hover:text-white"
                                                        onClick={() => removeFile(index, setUploadedFiles, uploadedFiles)}
                                                    >
                                                        <IoClose className="text-xl text-white" />
                                                    </a>
                                                    <p className="text-xs text-center mt-1 text-gray-500 dark:text-gray-400">{file.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    }
                                    <input
                                        id="dropzone-file"
                                        type="file"
                                        className="hidden"
                                        multiple
                                        onChange={(e) => handleFileUpload(e, setUploadedFiles)}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="grid gap-6 mb-6 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="last_name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    RPF Document Attachment
                                </label>
                                <label
                                htmlFor="rpf-dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-auto border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white dark:hover:bg-[#3c4042] dark:bg-[#3c4042] hover:bg-gray-100 dark:border-gray-600 dark:hover:border-grays-500"
                                onDrop={(e) => handleDrop(e, setRpfUploadedFiles)}
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg
                                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 16"
                                        >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                        />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                        SVG, PNG, JPG, GIF, PDF, DOC, DOCX, or CSV (MAX. 800x400px)
                                        </p>
                                    </div>
                                    {rpfUploadedFiles.length > 0 &&
                                        <div className="mt-2 flex flex-wrap justify-between">
                                            {rpfUploadedFiles.map((file, index) => (
                                                <div key={index} className="p-2 relative">
                                                    <div className="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center">
                                                        {getFileIcon(file)}
                                                    </div>
                                                    <a
                                                        className="absolute top-0 right-0 text-gray-400 bg-red-400 hover:bg-red-500 hover:text-white rounded-lg text-sm w-6 h-6 ml-0 inline-flex justify-center items-center dark:bg-red-400 dark:hover:bg-red-500 dark:hover:text-white"
                                                        onClick={() => removeFile(index, setRpfUploadedFiles, rpfUploadedFiles)}
                                                    >
                                                        <IoClose className="text-xl text-white" />
                                                    </a>
                                                    <p className="text-xs text-center mt-1 text-gray-500 dark:text-gray-400">{file.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    }
                                    <input
                                        id="rpf-dropzone-file"
                                        type="file"
                                        className="hidden"
                                        multiple
                                        onChange={(e) => handleFileUpload(e, setRpfUploadedFiles)}
                                    />
                                </label>
                            </div>
                            <div>
                                <label
                                    htmlFor="user_name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Comment
                                </label>
                                <textarea id="user_description" rows="6" 
                                name="type your comment"
                                onChange={(e) => setComment(e.target.value)}
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Write your comment">{comment}</textarea>
                            </div>
                        </div>

                        <div className="grid gap-6 mb-6 md:grid-cols-2">
                            <div className='w-[50%]'>
                                <label
                                    htmlFor="user_name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Required Date
                                </label>
                                <input
                                type="date"
                                id="user_name"
                                name="user_name"
                                onChange={(e) => setRequiredDate(e.target.value)}
                                value={requiredDate}
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Enter user user name"/>
                            </div>
                        </div>

                        <div className="grid gap-6 mb-6 md:grid-cols-2 w-[40%]">
                        {/* <button
                            type="submit"
                            disabled={status === "saved"}
                            // onClick={saveForm}
                            className={`${
                            status === "saved" ? "bg-[#415ada]" : "bg-[#213389]"
                            } text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800`}
                        >
                            Save
                        </button> */}
                        <button
                            onClick={reqquotation}
                            className="text-white bg-[#213389] hover:bg-[#213389] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-[#213389] dark:hover:bg-[#213389] dark:focus:ring-blue-800"
                        >
                            Request Quotation
                        </button>
                        </div>
                    </form>
                    </div>
                )
                }

                {currentStep === 2 && (
                    <Requisitionsapproval
                    formData={formattedFormData}
                    modelData={modelTopic}
                    requestType={requestType}
                    RequisitionId={RequisitionId}
                    />
                )
                }

            </>
    );
}

export default AddNewProcurementInitiateForm;