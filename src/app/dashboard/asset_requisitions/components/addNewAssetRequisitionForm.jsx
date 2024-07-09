'use client'
import React, { useEffect, useState, useContext, useRef } from 'react';
import { IoGrid } from "react-icons/io5";
import { FaList } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaPenToSquare } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { RiLockPasswordLine } from "react-icons/ri";
import { VscServerProcess } from "react-icons/vsc";
import { IoAddOutline } from "react-icons/io5";
import { FaFilePdf } from "react-icons/fa6";
import { redirect, useRouter } from 'next/navigation';
import { useAddNewUserMutation, useDeleteUserMutation, useEditeUserMutation, useUsersListQuery, useStatuschangeUserMutation, useUserpasswordresetMutation } from '@/app/_lib/redux/features/user/user_api';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useAuthpermissionsQuery } from '@/app/_lib/redux/features/authpermission/auth_permission_api';
import dynamic from "next/dynamic";
import { useAddNewAssestRequisitionMutation, useAssestrequisitionListQuery } from '@/app/_lib/redux/features/assestrequisition/assest_requisition_api';
import { getorganizationid } from '@/app/_lib/redux/features/assestrequisition/organization_slice';
import Requisitionsapproval from '../../components/requisitionsapproval/requisitionsapproval';
import { formatKeys } from '@/app/_lib/utils/formatKeys';

const OrganizationComponent = dynamic(() => import("./organization"), {
    ssr: false,
  });

function AddNewAssetRequisitionForm({ }) {

        const usedispatch = useDispatch();
        
        const [view, setView] = useState('grid');
        const [expandedResetpasswordModel, setExpandedResetpasswordModel] = useState(false);
        const [expandedEditeRoleModel, setExpandedEditeRoleModel] = useState(false);
        const [expandedDeleteRoleModel, setExpandedDeleteRoleModel] = useState(false);
        const [isOpenAddForm, setIsOpenAddFormModel] = useState(false);
        const [passwordreseterror, setPasswordResetError] = useState('');
        const [usercreateerror, setUserCreateError] = useState('');
        const [userediteerror, setUserEditeError] = useState('');
        const [userdeleteerror, setUserDeleteError] = useState('');
        const [formemessage, setmessage] = useState('');
        const [isOpenRoleList, setIsOpenRoleList] = useState(false); 
        const [isOpenSupplierList, setIsOpenSupplierList] = useState(false);

        // set page layout
        const [status, setStatus] = useState('new'); // 'new', 'saved', or 'submitted'
        const [currentStep, setCurrentStep] = useState(1); // 1: Asset Requisition, 2: Assign Organization
        const [assetrequisitionserror, setAssetRequisitionsError] = useState('');
        const [isOpenOrganizationStructure, setIsOpenOrganizationStructure] = useState(false);

        const refOrganizationStructure = useRef(null);

        useEffect(() => {
            const handleClickOutside = (event) => {
              if (refOrganizationStructure.current && !refOrganizationStructure.current.contains(event.target)) {
                setIsOpenOrganizationStructure(false);
              }
            };
        
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
              document.removeEventListener('mousedown', handleClickOutside);
            };
          }, []);
    
        const toggleOrganizationStructureHandler = () =>{
            setIsOpenOrganizationStructure((prev) => !prev);
        };
    
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
    
        // set list
        const [assestTypeArray, setAssestTypeArray] = useState([]);
        const [periodTypeArray, setPeriodTypeArray] = useState([]);
        const [availabiityTypeArray, setAvailabiityTypeArray] = useState([]);
        const [priorityTypeArray, setPriorityTypeArray] = useState([]);
        const [filteredSupplares, setFilteredSupplares] = useState([]);
        const [searchInput, setSearchInput] = useState('');
    
        const handleSearchInputChange = (event) => {
            setSearchInput(event.target.value);
        };
    
        const {
            data: Assestrequisition,
            isLoading,
            isError,
            error,
            refetch,
          } = useAssestrequisitionListQuery();
    
        useEffect(() => {
            if (!isLoading && !isError && Assestrequisition) {
    
                const allassesttype = Object.values(Assestrequisition.allassesttype);
                setAssestTypeArray(allassesttype);
    
                const allperiodtype = Object.values(Assestrequisition.allPeriodtype);
                setPeriodTypeArray(allperiodtype);
    
                const allavailabilitytype = Object.values(Assestrequisition.allavailabilitytype);
                setAvailabiityTypeArray(allavailabilitytype);
    
                const allprioritytype = Object.values(Assestrequisition.allprioritytype);
                setPriorityTypeArray(allprioritytype);
    
                const allsupplair = Object.values(Assestrequisition.allsupplair);
                const filtered = allsupplair.filter(supplair => supplair.name.toLowerCase().includes(searchInput.toLowerCase()));
                setFilteredSupplares(filtered);
    
                const timer = setTimeout(() => {
                    setmessage('');
                    setPasswordResetError('');
                    setUserEditeError('');
                    setUserDeleteError('');
                }, 5000); // Adjust the duration (in milliseconds) as needed
            
                return () => clearTimeout(timer);
            }
        }, [isLoading, isError, Assestrequisition, searchInput, refetch]);
    
        const [RequisitionId, setAssetReqId] = useState('');
    
        const generateUniqueAssetReqId = () => {
            return Math.random().toString(36).substr(2, 8);
        };

        useEffect(() => {
            const generatedId = generateUniqueAssetReqId();
            setAssetReqId(generatedId);
          }, []);
    
        // get organization id
        const [organization, setOrganization] = useState('');
        //get organization id
        const organizationid = useSelector((state) => state.organization);
        // Update local state whenever organizationid changes
        useEffect(() => {
            setOrganization(organizationid);
        }, [organizationid]);
    
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().substr(0, 10);
    
        // create form item and details function
        const [assetRequisitionDate, setReqDate] = useState(today);
    
        const [items, setItems] = useState([]);
        const [itemName, setItemName] = useState('');
        const [assestType, setAssestType] = useState('');
        const [quantity, setQuantity] = useState('');
        const [budget, setBudget] = useState('');
        const [businessPerpose, setBusinessPerpose] = useState('');
        const [upgradeOrNew, setUpgradeorNew] = useState('');
        const [periodStatus, setPeriodStatus] = useState('');
        const [periodFrom, setPeriodFrom] = useState('');
        const [periodTo, setPeriodTo] = useState('');
        const [period, setPeriod] = useState('');
        const [availabiityType, setAvailabiityType] = useState('');
        const [priority, setPriority] = useState('');
        const [requiredDate, setRequiredDate] = useState('');
        const [reason, setReason] = useState('');
        const [businessImpact, setBusinessImpact] = useState('');
        const [suppliers, setSuppliers] = useState([]);
        const [files, setFiles] = useState([]);
        const [itemDetails, setItemDetails] = useState([{ type: '', details: '' }]);
        const [maintenanceKpi, setMaintenanceKpi] = useState([{ details: '' }]);
        const [serviceSupportKpi, setServiceSupportKpi ] = useState([{ details: '' }]);
        const [consumablesKPI, setConsumablesKPI ] = useState([{ details: '' }]);
        const [editIndex, setEditIndex] = useState(null); // Track index of item being edited
    
        // Load form data from localStorage when the component mounts
        useEffect(() => {
            const savedFormData = JSON.parse(localStorage.getItem('assetRequisitionFormData'));
            if (savedFormData) {
                setReqDate(savedFormData.assetRequisitionDate || '');
                setItemName(savedFormData.itemName || '');
                setAssestType(savedFormData.assestType || '');
                setQuantity(savedFormData.quantity || '');
                setBudget(savedFormData.budget || '');
                setBusinessPerpose(savedFormData.businessPerpose || '');
                setUpgradeorNew(savedFormData.upgradeOrNew || '');
                setPeriodStatus(savedFormData.periodStatus || '');
                setPeriodFrom(savedFormData.periodFrom || '');
                setPeriodTo(savedFormData.periodTo || '');
                setPeriod(savedFormData.period || '');
                setAvailabiityType(savedFormData.availabiityType || '');
                setPriority(savedFormData.priority || '');
                setRequiredDate(savedFormData.requiredDate || '');
                setOrganization(savedFormData.organization || '');
                setReason(savedFormData.reason || '');
                setBusinessImpact(savedFormData.businessImpact || '');
                setItemDetails(savedFormData.itemDetails || []);
                setMaintenanceKpi(savedFormData.maintenanceKpi || [{ details: '' }]);
                setServiceSupportKpi(savedFormData.serviceSupportKpi || [{ details: '' }]);
                setConsumablesKPI(savedFormData.consumablesKPI || [{ details: '' }]);
            }
        }, []);
    
        // Save form data to localStorage whenever it changes
        const saveFormDataToLocalStorage = (data) => {
            localStorage.setItem('assetRequisitionFormData', JSON.stringify(data));
        };
    
        const updateFormData = (newState) => {
            saveFormDataToLocalStorage(newState);
        };
    
        const handleChange = (setter) => (e) => {
            const newValue = e.target.value;
            setter(newValue);
            updateFormData({
            assetRequisitionDate: setter === setReqDate ? newValue : assetRequisitionDate,
            itemName: setter === setItemName ? newValue : itemName,
            assestType: setter === setAssestType ? newValue : assestType,
            quantity: setter === setQuantity ? newValue : quantity,
            budget: setter === setBudget ? newValue : budget,
            businessPerpose: setter === setBusinessPerpose ? newValue : businessPerpose,
            upgradeOrNew: setter === setUpgradeorNew ? newValue : upgradeOrNew,
            periodStatus: setter === setPeriodStatus ? newValue : periodStatus,
            periodFrom: setter === setPeriodFrom ? newValue : periodFrom,
            periodTo: setter === setPeriodTo ? newValue : periodTo,
            period: setter === setPeriod ? newValue : period,
            availabiityType: setter === setAvailabiityType ? newValue : availabiityType,
            priority: setter === setPriority ? newValue : priority,
            requiredDate: setter === setRequiredDate ? newValue : requiredDate,
            organization: setter === setOrganization ? newValue : organization,
            reason: setter === setReason ? newValue : reason,
            businessImpact: setter === setBusinessImpact ? newValue : businessImpact,
            itemDetails,
            maintenanceKpi,
            serviceSupportKpi,
            consumablesKPI,
            });
        };
    
        const handleChangeItemDetails = (index, field, value) => {
            const updatedItemDetails = [...itemDetails];
            updatedItemDetails[index] = { ...updatedItemDetails[index], [field]: value };
            setItemDetails(updatedItemDetails);
            updateFormData({ itemName, assestType, quantity, budget, businessPerpose, upgradeOrNew, periodStatus, periodFrom, periodTo, period, availabiityType, priority, requiredDate,  reason,  businessImpact, itemDetails: updatedItemDetails });
          };
    
        const handleChangeMaintenanceKpi = (index, value) => {
            const updatedMaintenanceKpi = [...maintenanceKpi];
            updatedMaintenanceKpi[index] = { ...updatedMaintenanceKpi[index], details: value };
            setMaintenanceKpi(updatedMaintenanceKpi);
            updateFormData({ itemName, assestType, quantity, budget, businessPerpose, upgradeOrNew, periodStatus, periodFrom, periodTo, period, availabiityType, priority, requiredDate,  reason,  businessImpact, itemDetails, maintenanceKpi: updatedMaintenanceKpi });
          };
    
        const handleChangeserviceSupportKpi = (index, value) => {
            const updatedServiceSupportKpi = [...serviceSupportKpi];
            updatedServiceSupportKpi[index] = { ...updatedServiceSupportKpi[index], details: value };
            setServiceSupportKpi(updatedServiceSupportKpi);
            updateFormData({ itemName, assestType, quantity, budget, businessPerpose, upgradeOrNew, periodStatus, periodFrom, periodTo, period, availabiityType, priority, requiredDate,  reason,  businessImpact, itemDetails, maintenanceKpi, serviceSupportKpi: updatedServiceSupportKpi });
          };
    
        const handleChangeConsumablesKPI = (index, value) => {
            const updatedConsumablesKPI = [...consumablesKPI];
            updatedConsumablesKPI[index] = { ...updatedConsumablesKPI[index], details: value };
            setConsumablesKPI(updatedConsumablesKPI);
            updateFormData({ itemName, assestType, quantity, budget, businessPerpose, upgradeOrNew, periodStatus, periodFrom, periodTo, period, availabiityType, priority, requiredDate, organization, reason,  businessImpact, itemDetails, maintenanceKpi, serviceSupportKpi, consumablesKPI: updatedConsumablesKPI  });
          };
        
        // radio button option
        const handleRadioBtnOptionChange = (e) => {
            setUpgradeorNew(e.target.value);
        };
        
        // supplier list
        const handleCheckboxChange = (event, removedValue) => {
            const { value, checked } = event.target;
            if (checked) {
                setSuppliers([...suppliers, value]);
            } else {
                setSuppliers(suppliers.filter((item) => item !== value));
            }
            // Remove the specific value from suppliers when the close button is clicked
            if (removedValue) {
                setSuppliers(suppliers.filter((item) => item !== removedValue));
            }
        };
      
        const handleAddItem = () => {
            console.log(organization);
            // Check if Item Name and Priority are not empty
            if (!itemName.trim()) {
                // Display an alert or some feedback to the user
                setAssetRequisitionsError('Item Name are required fields.');
                const timer = setTimeout(() => {
                    setAssetRequisitionsError('');
                }, 5000); // Adjust the duration (in milliseconds) as needed
                return () => clearTimeout(timer);
            }
    
            if (!assestType.trim()) {
                // Display an alert or some feedback to the user
                setAssetRequisitionsError('Assest type are required fields.');
                const timer = setTimeout(() => {
                    setAssetRequisitionsError('');
                }, 5000); // Adjust the duration (in milliseconds) as needed
                return () => clearTimeout(timer);
            }
    
            if (editIndex !== null) {
                // If editIndex is set, update the item at that index
                const updatedItems = [...items];
                updatedItems[editIndex] = { itemName, assestType, quantity, budget, businessPerpose, upgradeOrNew, periodStatus, periodFrom, periodTo, period, availabiityType, priority, requiredDate, organization, reason, businessImpact, suppliers, files, itemDetails, maintenanceKpi, serviceSupportKpi, consumablesKPI };
                setItems(updatedItems);
                // Reset editIndex
                setEditIndex(null);
            } else {
                // Add new item to the list
                const newItem = { itemName, assestType, quantity, budget, businessPerpose, upgradeOrNew, periodStatus, periodFrom, periodTo, period, availabiityType, priority, requiredDate, organization, reason, businessImpact, suppliers, files, itemDetails, maintenanceKpi, serviceSupportKpi, consumablesKPI };
                setItems([...items, newItem]);
            }
          // Reset form fields
          setItemName('');
          setAssestType('');
          setQuantity('');
          setBudget('');
          setBusinessPerpose('');
          setUpgradeorNew('');
          setPeriodStatus('');
          setPeriodFrom('');
          setPeriodTo('');
          setPeriod('');
          setAvailabiityType('');
          setPriority('');
          setRequiredDate('');
          setOrganization('');
          usedispatch(getorganizationid(null));
          setReason('');
          setBusinessImpact('');
          setSuppliers([]);
          setFiles('');
          setItemDetails([{ type: '', details: '' }]);
          setMaintenanceKpi([{ details: '' }]);
          setServiceSupportKpi([{ details: '' }]);
          setConsumablesKPI([{ details: '' }]);
          localStorage.removeItem('assetRequisitionFormData');
        };
      
        const handleEditItem = (index) => {
          // Populate form fields with data from the item being edited
          const itemToEdit = items[index];
          setItemName(itemToEdit.itemName);
          setAssestType(itemToEdit.assestType);
          setQuantity(itemToEdit.quantity);
          setBudget(itemToEdit.budget);
          setBusinessPerpose(itemToEdit.businessPerpose);
          setUpgradeorNew(itemToEdit.upgradeOrNew);
          setPeriodStatus(itemToEdit.periodStatus);
          setPeriodFrom(itemToEdit.periodFrom);
          setPeriodTo(itemToEdit.periodTo);
          setPeriod(itemToEdit.period);
          setAvailabiityType(itemToEdit.availabiityType);
          setPriority(itemToEdit.priority);
          setRequiredDate(itemToEdit.requiredDate);
          setOrganization(itemToEdit.organization);
          usedispatch(getorganizationid(organization));
          setReason(itemToEdit.reason);
          setBusinessImpact(itemToEdit.businessImpact);
          setSuppliers(itemToEdit.suppliers);
          setFiles(itemToEdit.files);
          setItemDetails(itemToEdit.itemDetails);
          setMaintenanceKpi(itemToEdit.maintenanceKpi);
          setServiceSupportKpi(itemToEdit.serviceSupportKpi);
          setConsumablesKPI(itemToEdit.consumablesKPI);
          // Set editIndex to track the item being edited
          setEditIndex(index);
        };
      
        const handleRemoveItem = (index) => {
          const updatedItems = [...items];
          updatedItems.splice(index, 1);
          setItems(updatedItems);
        };
      
        const handleAddItemDetail = () => {
          setItemDetails([...itemDetails, { type: '', details: '' }]);
        };
      
        const handleRemoveItemDetail = (index) => {
          const updatedItemDetails = [...itemDetails];
          updatedItemDetails.splice(index, 1);
          setItemDetails(updatedItemDetails);
        };
    
        // Maintains KPI
        const handleAddMaintenanceKpi = () => {
            setMaintenanceKpi([...maintenanceKpi, { details: '' }]);
          };
        
        const handleRemoveMaintenanceKpi = (index) => {
            const updatedMaintenanceKpi = [...maintenanceKpi];
            updatedMaintenanceKpi.splice(index, 1);
            setMaintenanceKpi(updatedMaintenanceKpi);
          };
    
        // service and Support Kpi
        const handleAddServiceSupportKpi = () => {
            setServiceSupportKpi([...serviceSupportKpi, { details: '' }]);
          };
        
          const handleRemoveServiceSupportKpi = (index) => {
            const updatedServiceSupportKpi = [...serviceSupportKpi];
            updatedServiceSupportKpi.splice(index, 1);
            setServiceSupportKpi(updatedServiceSupportKpi);
          };
    
        // Consumables KPI
        const handleAddConsumablesKpi = () => {
            setConsumablesKPI([...consumablesKPI, { details: '' }]);
          };
        
          const handleRemoveConsumablesKpi = (index) => {
            const updatedConsumablesKPI = [...consumablesKPI];
            updatedConsumablesKPI.splice(index, 1);
            setConsumablesKPI(updatedConsumablesKPI);
          };
    
        // multiple file uplording
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
            const fileType = file.type.split('/')[0]; // Get the file type (e.g., 'image', 'application')
        
            if (fileType === 'image') {
              return (
                <div key={index}>
                  <img src={URL.createObjectURL(file)} alt={`Image ${index}`} className='w-28'/>
                  <span className='text-gray-700 '>{file.name}</span>
                  <button type="button" onClick={() => handleRemoveFile(index)} className="text-gray-400 bg-transparent hover:bg-red-400 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-red-400 dark:hover:text-white" data-modal-toggle="crud-modal">
                    <IoClose className='text-2xl hover:text-white'/>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
              );
            } else {
              // Render file name with corresponding icon for non-image files
              let icon;
              if (file.type.includes('pdf')) {
                icon = <FaFilePdf className='text-6xl'/>; // Example PDF icon
              } else {
                icon = <i className="fa fa-file-o" aria-hidden="true"></i>; // Default file icon
              }
              return (
                <div key={index} >
                  {icon}
                  <span className='text-gray-700 '>{file.name}</span>
                  <button type="button" onClick={() => handleRemoveFile(index)} className="text-gray-400 bg-transparent hover:bg-red-400 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-red-400 dark:hover:text-white" data-modal-toggle="crud-modal">
                    <IoClose className='text-2xl hover:text-white'/>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
              );
            }
          };
    
        console.log(items);
    
        // add user
        const [addAssestRequisition] = useAddNewAssestRequisitionMutation();
        const [addUpdateAssestRequisitionStatus] = useAddNewAssestRequisitionMutation();
    
        // save From
        const saveForm = async e => {
            const requisitionStatus = "saved";
            e.preventDefault();
            try {
                const assestrequisition = {requisition_id: RequisitionId, requisition_date: assetRequisitionDate, requisition_status: requisitionStatus, items: items}
                addAssestRequisition(assestrequisition)
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
                    setUserCreateError(error);
                    const timer = setTimeout(() => {
                        setUserCreateError('');
                    }, 5000); // Adjust the duration (in milliseconds) as needed
                    return () => clearTimeout(timer);
                });
            } catch (error) {
                console.error("Login error:", error);
            }
        }
    
        // Submit From
        const submitForm = async e => {
            const status = "submitted";
            e.preventDefault();
            try {
                if (status === 'saved') {
                    const assestrequisitionupdatedata = {requisition_id: RequisitionId, requisition_status: status}
                    addUpdateAssestRequisitionStatus(assestrequisitionupdatedata)
                    .unwrap()
                    .then((response) => {
                        console.log("New node added:", response);
                        // router.push("/dashboard/usergroups");
                        setStatus('submitted');
                        setCurrentStep(2); // Move to the next step
                        setmessage(response.message);
                        refetch();
                    })
                    .catch((error) => {
                        console.error("Error adding new node:", error);
                        setUserCreateError(error);
                        const timer = setTimeout(() => {
                            setUserCreateError('');
                        }, 5000); // Adjust the duration (in milliseconds) as needed
                        return () => clearTimeout(timer);
                    });
                } else {
                    const assestrequisition = {requisition_id: RequisitionId, requisition_date: assetRequisitionDate, requisition_status: status, items: items}
                    addAssestRequisition(assestrequisition)
                    .unwrap()
                    .then((response) => {
                        console.log("New node added:", response);
                        // router.push("/dashboard/usergroups");
                        setStatus('submitted');
                        setCurrentStep(2); // Move to the next step
                        setmessage(response.message);
                        refetch();
                    })
                    .catch((error) => {
                        console.error("Error adding new node:", error);
                        setUserCreateError(error);
                        const timer = setTimeout(() => {
                            setUserCreateError('');
                        }, 5000); // Adjust the duration (in milliseconds) as needed
                        return () => clearTimeout(timer);
                    });
                }
            } catch (error) {
                console.error("Login error:", error);
            }
        }
    
        const modelTopic = 'Asset Requisition';
        const requestType = 1;
    
        const formattedFormData = formatKeys({ RequisitionId, assetRequisitionDate, items: formatKeys(items) });
        console.log(formattedFormData);

    return (
            <>
                                    {/* Modal header */}
                                    {currentStep === 1 && (
                                        <div>
                                            <div className="flex items-center mt-[-17px] px-2 pb-2 justify-between border-b rounded-t dark:border-gray-600">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    Asset Requisition Form
                                                </h3>
                                            </div>
                                            <form className="px-2 pt-2 overflow-y-scroll h-[500px]" style={{ scrollbarWidth: '2px', scrollbarColor:'#888'}} encType="multipart/form-data">
                                                {assetrequisitionserror &&
                                                    <div className="bg-red-100 border mb-2 border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                                        {/* <strong className="font-bold">Holy smokes!</strong> */}
                                                            <span className="block sm:inline">{assetrequisitionserror}</span>
                                                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={handleErrorClose}>
                                                                                    <svg
                                                                                        className="fill-current h-6 w-6 text-red-500"
                                                                                        role="button"
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                        viewBox="0 0 20 20"
                                                                                    >
                                                                                        <title>Close</title>
                                                                                        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                                                                                    </svg>
                                                            </span>
                                                    </div>
                                                } 
                                                {/* {showNotification && (
                                                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                                                    <strong className="font-bold">Notification:</strong>
                                                    <span className="block sm:inline">Previous form data is available.</span>
                                                    <button onClick={loadFormData} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded ml-4">Load Data</button>
                                                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                                        <IoClose className="fill-current h-6 w-6 text-green-500" onClick={() => setShowNotification(false)} />
                                                    </span>
                                                    </div>
                                                )} */}
                                                <div className="grid gap-6 mb-6 md:grid-cols-2">
                                                    <div className='flex items-center'>
                                                        <label
                                                            htmlFor="user_name"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Asset Requisition No :
                                                        </label>
                                                        <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                            {RequisitionId}
                                                            <input type="hidden" value={RequisitionId} />
                                                        </span>
                                                    </div>
                                                    <div className='flex justify-end items-center'>
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
                                                                onChange={handleChange(setReqDate)}
                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                placeholder="Enter user user name"
                                                                required
                                                            />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="grid gap-6 mb-6">
                                                    <div className='border border-black-800 p-3 rounded-lg dark:border-[#3c4042]'>
                                                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Items List</h2>
                                                    {/* Display added items */}
                                                    {items && items.length > 0 && (
                                                    <div className="overflow-x-auto border border-gray-200 dark:border-[#3c4042] sm:rounded-lg w-[-webkit-fill-available] mb-6">
                                                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                            <thead className='text-xs text-gray-700 uppercase bg-gray-200 dark:bg-[#606368] dark:text-gray-400'>
                                                            <tr>
                                                                <th scope="col" className="px-6 py-3">Item Name</th>
                                                                <th scope="col" className="px-6 py-3">Assest Type</th>
                                                                <th scope="col" className="px-6 py-3">Business Perpose</th>
                                                                <th scope="col" className="px-6 py-3">Upgrade or new</th>
                                                                <th scope="col" className="px-6 py-3">Period/term</th>
                                                                <th scope="col" className="px-6 py-3">Priority</th>
                                                                <th scope="col" className="px-6 py-3">Details</th>
                                                                <th scope="col" className="px-6 py-3">Actions</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {items.map((item, index) => (
                                                                <tr key={index} className='odd:bg-white odd:dark:bg-[#1e1e1e] even:bg-gray-50 even:dark:bg-[#3c4042] border-b dark:border-gray-700'>
                                                                    <td className="px-6 py-4">{item.itemName}</td>
                                                                    <td className="px-6 py-4">{item.assestType}</td>
                                                                    <td className="px-6 py-4">{item.businessPerpose}</td>
                                                                    <td className="px-6 py-4">{item.upgradeOrNew}</td>
                                                                    <td className="px-6 py-4">{item.periodStatus}</td>
                                                                    <td className="px-6 py-4">{item.priority}</td>
                                                                    <td className="px-6 py-4">
                                                                        {item.itemDetails.map((detail, detailIndex) => (
                                                                        <div className='text-black' key={detailIndex}>
                                                                            <strong>{detail.type}:</strong> {detail.details}
                                                                        </div>
                                                                        ))}
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <div className='flex justify-evenly'>
                                                                            <a onClick={() => handleEditItem(index)}  className="text-gray-400 bg-yellow-500 hover:bg-yellow-600 hover:text-white rounded-lg text-sm w-8 h-8 ml-0 inline-flex justify-center items-center dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                                                                <FaPenToSquare className='text-2xl text-white'/>
                                                                                <span className="sr-only">Close modal</span>
                                                                            </a>
                                                                            <a type="button" onClick={() => handleRemoveItem(index)}  className="text-gray-400 bg-red-400 hover:bg-red-500 hover:text-white rounded-lg text-sm w-8 h-8 ml-0 inline-flex justify-center items-center dark:bg-red-400 dark:hover:bg-red-500 dark:hover:text-white" data-modal-toggle="crud-modal">
                                                                                <IoClose className='text-2xl text-white'/>
                                                                                <span className="sr-only">Close modal</span>
                                                                            </a>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    )}
                                                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                                                        <div>
                                                            <label
                                                                htmlFor="user_name"
                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Item Name
                                                            </label>
                                                            <input 
                                                            type="text"
                                                            value={itemName}
                                                            onChange={handleChange(setItemName)}
                                                            placeholder="Item Name" 
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label
                                                                htmlFor="user_name"
                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Assest Type
                                                            </label>
                                                            <select
                                                            id="countries"
                                                            value={assestType} 
                                                            onChange={handleChange(setAssestType)}
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                            >   
                                                                    <option selected="">Choose a Assest Type</option>
                                                                {assestTypeArray.map(assest => (
                                                                    <option selected={assest.name}>{assest.name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label
                                                                htmlFor="user_name"
                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Quantity
                                                            </label>
                                                            <input 
                                                            type="text" 
                                                            value={quantity} 
                                                            onChange={handleChange(setQuantity)}
                                                            placeholder="Item Name" 
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label
                                                                htmlFor="user_name"
                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Budget
                                                            </label>
                                                            <input 
                                                            type="text" 
                                                            value={budget} 
                                                            onChange={handleChange(setBudget)}
                                                            placeholder="Item Name" 
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label
                                                                htmlFor="user_name"
                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Business Perpose
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="user_name"
                                                                name="user_name"
                                                                value={businessPerpose}
                                                                onChange={handleChange(setBusinessPerpose)}
                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                placeholder="Enter user user name"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label
                                                                htmlFor="last_name"
                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Whether to upgrade the existing one or purchase a new
                                                            </label>
                                                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-[#3c4042] dark:border-gray-500 dark:text-white">
                                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                                <div className="flex items-center ps-3">
                                                                    <input
                                                                    id="horizontal-list-radio-license"
                                                                    type="radio"
                                                                    value="upgrade the existing one" 
                                                                    checked={upgradeOrNew === 'upgrade the existing one'} 
                                                                    onChange={handleChange(setUpgradeorNew)}
                                                                    name="list-radio"
                                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                                    />
                                                                    <label
                                                                    htmlFor="horizontal-list-radio-license"
                                                                    className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                                    >
                                                                    upgrade the existing one
                                                                    </label>
                                                                </div>
                                                                </li>
                                                                <li className="w-full dark:border-gray-600">
                                                                <div className="flex items-center ps-3">
                                                                    <input
                                                                    id="horizontal-list-radio-passport"
                                                                    type="radio"
                                                                    value="purchase a new" 
                                                                    checked={upgradeOrNew === 'purchase a new'} 
                                                                    onChange={handleChange(setUpgradeorNew)}
                                                                    name="list-radio"
                                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                                    />
                                                                    <label
                                                                    htmlFor="horizontal-list-radio-passport"
                                                                    className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                                    >
                                                                    purchase a new
                                                                    </label>
                                                                </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                                                        <div>
                                                            <label
                                                                htmlFor="user_name"
                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Period/term
                                                            </label>
                                                            <select
                                                            id="countries"
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                            value={periodStatus} 
                                                            onChange={handleChange(setPeriodStatus)}
                                                            >
                                                                <option selected="">Choose a Period/term Type</option>

                                                                {periodTypeArray.map(period => (
                                                                    <option selected={period.name}>{period.name}</option>
                                                                ))}

                                                                {/* <option value="long">Long period/terms</option>
                                                                <option value="short">Short period/terms</option>
                                                                <option value="temporary">Temporary</option>
                                                                <option value="permanent">Permanent</option> */}
                                                            </select>
                                                        </div>
                                                        {periodStatus === 'Long period/terms' || periodStatus === 'Short period/terms' ? (
                                                        <div className="flex justify-between mb-6">
                                                            <div className='w-[49%]'>
                                                                <label
                                                                    htmlFor="user_name"
                                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                                >
                                                                    From
                                                                </label>
                                                                <input
                                                                    type="date"
                                                                    id="user_name"
                                                                    name="user_name"
                                                                    value={periodFrom} 
                                                                    onChange={handleChange(setPeriodFrom)}
                                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                    placeholder="Enter user user name"
                                                                />
                                                            </div>
                                                            <div className='w-[49%]'>
                                                                <label
                                                                    htmlFor="user_name"
                                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                                >
                                                                    TO
                                                                </label>
                                                                <input
                                                                    type="date"
                                                                    id="user_name"
                                                                    name="user_name"
                                                                    value={periodTo}
                                                                    onChange={handleChange(setPeriodTo)}
                                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                    placeholder="Enter user user name"
                                                                />
                                                            </div>
                                                        </div>
                                                        ) 
                                                        : 
                                                        periodStatus === 'Temporary' ? (
                                                            <div>
                                                            <label
                                                                htmlFor="user_name"
                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Enter your period
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="user_name"
                                                                name="user_name"
                                                                value={period}
                                                                onChange={handleChange(setPeriod)}
                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                placeholder="Enter user user name"
                                                            />
                                                        </div>
                                                        ) : null}
                                                    </div>
                                                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                                                        <div>
                                                            <label
                                                                htmlFor="user_name"
                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Availabiity Type
                                                            </label>
                                                            <select
                                                            id="countries"
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                            value={availabiityType} 
                                                            onChange={handleChange(setAvailabiityType)}
                                                            >
                                                                <option selected="">Choose a Availabiity Type</option>
                                                                {availabiityTypeArray.map(availabiity => (
                                                                    <option selected={availabiity.name}>{availabiity.name}</option>
                                                                ))}
                                                                {/* <option value="hire">Hire</option>
                                                                <option value="rent">Rent</option>
                                                                <option value="purchase">Purchase</option>
                                                                <option value="lease">Lease</option> */}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label
                                                                htmlFor="user_name"
                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Priority
                                                            </label>
                                                            <select
                                                            id="countries"
                                                            value={priority} 
                                                            onChange={handleChange(setPriority)}
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                            >
                                                                <option selected="">Choose a Priority Type</option>
                                                                {priorityTypeArray.map(priority => (
                                                                    <option selected={priority.name}>{priority.name}</option>
                                                                ))}
                                                                {/* <option value="normal">Normal</option>
                                                                <option value="moderate">Moderate</option>
                                                                <option value="high">High</option>
                                                                <option value="highest">Highest</option> */}
                                                            </select>
                                                        </div>
                                                        <div>
                                                                <label
                                                                    htmlFor="user_name"
                                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                                >
                                                                    Mention the required date *Optional
                                                                </label>
                                                                <input
                                                                    type="date"
                                                                    id="user_name"
                                                                    name="user_name"
                                                                    value={requiredDate} 
                                                                    onChange={handleChange(setRequiredDate)}
                                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                    placeholder="Enter user user name"
                                                                />
                                                        </div>
                                                        <div>
                                                            <label
                                                                htmlFor="user_name"
                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Organization structure - where to place? 
                                                            </label>
                                                            <a
                                                                id="dropdownSearchButton"
                                                                data-dropdown-toggle="dropdownSearch"
                                                                className="flex justify-between items-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                type="button"
                                                                onClick={toggleOrganizationStructureHandler}
                                                            >
                                                                Select Organization structure
                                                                <IoAddOutline className=" dark:text-white"/>
                                                            </a>
                                                            {/* Dropdown menu */}
                                                            <div data-collapse={isOpenOrganizationStructure} ref={refOrganizationStructure} className='relative'>
                                                                <div
                                                                    id="dropdownSearch"
                                                                    className="z-10 hidden absolute bg-white border border-gray-200 rounded-lg shadow dark:bg-[#1e1e1e] rolelist w-[100%] mr-2"
                                                                >
                                                                    <div className="container mx-auto p-4 relative overflow-y-scroll h-[335px] overflow-x-scroll w-[99%]" style={{ scrollbarWidth: 'thin'}}>
                                                                        <OrganizationComponent />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label
                                                                htmlFor="last_name"
                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Reason for the Asset Requisition
                                                            </label>
                                                            <textarea id="user_description" rows="4" 
                                                            name="user_description"
                                                            value={reason}
                                                            onChange={handleChange(setReason)}
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Write short description about this user"></textarea>
                                                        </div>
                                                        <div>
                                                            <label
                                                                htmlFor="last_name"
                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Business impact, gain, or specific project
                                                            </label>
                                                            <textarea id="user_description" rows="4" 
                                                            name="user_description"
                                                            value={businessImpact}
                                                            onChange={handleChange(setBusinessImpact)}
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Write short description about this user"></textarea>
                                                        </div>
                                                        <div>
                                                            <label
                                                                htmlFor="user_name"
                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Attachment
                                                            </label>
                                                            <input
                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                id="multiple_files"
                                                                type="file"
                                                                multiple
                                                                onChange={handleFileChange}
                                                            />
                                                            {files.length > 0 && (
                                                            <div className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'>
                                                                {files.map(renderFile)}
                                                            </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label
                                                                htmlFor="last_name"
                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Select supplares for this item
                                                            </label>
                                                            <button
                                                                id="dropdownSearchButton"
                                                                data-dropdown-toggle="dropdownSearch"
                                                                className="flex justify-between items-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                type="button"
                                                                onClick={toggleRoleListHandler}
                                                            >
                                                                Select supplares for this item
                                                                <svg
                                                                className="w-2.5 h-2.5 ms-2.5"
                                                                aria-hidden="true"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 10 6"
                                                                >
                                                                <path
                                                                    stroke="currentColor"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="m1 1 4 4 4-4"
                                                                />
                                                                </svg>
                                                            </button>
                                                            <div className="flex mt-1 flex-wrap gap-2">
                                                                {suppliers.map(Role => (
                                                                    <span className='flex px-3 py-1 bg-gray-400 rounded-md'>
                                                                        {Role}
                                                                        <a
                                                                            className="ml-2"
                                                                            onClick={(event) => handleCheckboxChange(event, Role)}
                                                                        >
                                                                            <IoClose className='text-2xl text-white hover:text-red-400'/>
                                                                        </a>
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            {/* Dropdown menu */}
                                                            <div data-collapse={isOpenRoleList} ref={refRoleList} className='relative'>
                                                                <div
                                                                    id="dropdownSearch"
                                                                    className="z-10 hidden absolute bg-white rounded-lg shadow w-60 dark:bg-gray-700 rolelist"
                                                                >
                                                                    <div className="p-3">
                                                                    <label htmlFor="input-group-search" className="sr-only">
                                                                        Search
                                                                    </label>
                                                                    <div className="relative">
                                                                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                                                        <svg
                                                                            className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                                                            aria-hidden="true"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 20 20"
                                                                        >
                                                                            <path
                                                                            stroke="currentColor"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                                                            />
                                                                        </svg>
                                                                        </div>
                                                                        <input
                                                                        type="text" id="input-group-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search role name"
                                                                        value={searchInput}
                                                                        onChange={handleSearchInputChange}
                                                                        />
                                                                    </div>
                                                                    </div>
                                                                    <ul
                                                                    className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
                                                                    aria-labelledby="dropdownSearchButton"
                                                                    style={{ scrollbarWidth: '2px', scrollbarColor: '#888'}}
                                                                    >
                                                                    {filteredSupplares.map(Role => (
                                                                        <li>
                                                                            <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                                                            <input
                                                                                id="checkbox-item-11"
                                                                                type="checkbox"
                                                                                value={Role.name}
                                                                                onChange={handleCheckboxChange} 
                                                                                checked={suppliers.includes(Role.name)}
                                                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                                            />
                                                                            <label
                                                                                htmlFor="checkbox-item-11"
                                                                                className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                                                                            >
                                                                                {Role.name}
                                                                            </label>
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="grid gap-6 mb-6 w-[fit-content]">
                                                        <div>
                                                            <label
                                                                htmlFor="last_name"
                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Item details
                                                            </label>
                                                            {itemDetails.map((itemDetail, index) => (
                                                                <div key={index} className="grid gap-6 mb-4 md:grid-cols-3">
                                                                    <input 
                                                                        type="text" 
                                                                        value={itemDetail.type} 
                                                                        onChange={(e) => handleChangeItemDetails(index, 'type', e.target.value)}
                                                                        placeholder="Detail Type" 
                                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                    />
                                                                    <input 
                                                                        type="text" 
                                                                        value={itemDetail.details}
                                                                        onChange={(e) => handleChangeItemDetails(index, 'details', e.target.value)}
                                                                        placeholder="Details" 
                                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                    />
                                                                    <div className='flex justify-start items-center'>
                                                                        <a type="button" onClick={() => handleRemoveItemDetail(index)}  className="text-gray-400 bg-red-400 hover:bg-red-500 hover:text-white rounded-lg text-sm w-8 h-8 ml-0 inline-flex justify-center items-center dark:bg-red-400 dark:hover:bg-red-500 dark:hover:text-white" data-modal-toggle="crud-modal">
                                                                            <IoClose className='text-2xl text-white'/>
                                                                            <span className="sr-only">Close modal</span>
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <a 
                                                                onClick={handleAddItemDetail} 
                                                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                                                                >
                                                                More
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="grid gap-6 mb-6 w-[fit-content]">
                                                        <div>
                                                            <label
                                                                htmlFor="last_name"
                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Maintenance KPI
                                                            </label>
                                                            {maintenanceKpi.map((maintenancekpi, index) => (
                                                                <div key={index} className="grid gap-6 mb-4 md:grid-cols-3">
                                                                    <input 
                                                                        type="text" 
                                                                        value={maintenancekpi.details} 
                                                                        onChange={(e) => handleChangeMaintenanceKpi(index, e.target.value)}
                                                                        placeholder="Details" 
                                                                        className="bg-gray-50 col-span-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                    />
                                                                    <div className='flex justify-start items-center'>
                                                                        <a type="button" onClick={() => handleRemoveMaintenanceKpi(index)}  className="text-gray-400 bg-red-400 hover:bg-red-500 hover:text-white rounded-lg text-sm w-8 h-8 ml-0 inline-flex justify-center items-center dark:bg-red-400 dark:hover:bg-red-500 dark:hover:text-white" data-modal-toggle="crud-modal">
                                                                            <IoClose className='text-2xl text-white'/>
                                                                            <span className="sr-only">Close modal</span>
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <a 
                                                                onClick={handleAddMaintenanceKpi} 
                                                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                                                                >
                                                                More
                                                            </a>
                                                        </div>
                                                    </div>

                                                    <div className="grid gap-6 mb-6 w-[fit-content]">
                                                        <div>
                                                            <label
                                                                htmlFor="last_name"
                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Service & Support KPI
                                                            </label>
                                                            {serviceSupportKpi.map((servicesupportkpi, index) => (
                                                                <div key={index} className="grid gap-6 mb-4 md:grid-cols-2">
                                                                    <input 
                                                                        type="text" 
                                                                        value={servicesupportkpi.details} 
                                                                        onChange={(e) => handleChangeserviceSupportKpi(index, e.target.value)}
                                                                        placeholder="Details" 
                                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                    />
                                                                    <div className='flex justify-start items-center'>
                                                                        <a type="button" onClick={() => handleRemoveServiceSupportKpi(index)}  className="text-gray-400 bg-red-400 hover:bg-red-500 hover:text-white rounded-lg text-sm w-8 h-8 ml-0 inline-flex justify-center items-center dark:bg-red-400 dark:hover:bg-red-500 dark:hover:text-white" data-modal-toggle="crud-modal">
                                                                            <IoClose className='text-2xl text-white'/>
                                                                            <span className="sr-only">Close modal</span>
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <a 
                                                                onClick={handleAddServiceSupportKpi} 
                                                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                                                                >
                                                                More
                                                            </a>
                                                        </div>
                                                    </div>

                                                    <div className="grid gap-6 mb-6 w-[fit-content]">
                                                        <div>
                                                            <label
                                                                htmlFor="last_name"
                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Consumables KPI
                                                            </label>
                                                            {consumablesKPI.map((consumableskpi, index) => (
                                                                <div key={index} className="grid gap-6 mb-4 md:grid-cols-2">
                                                                    <input 
                                                                        type="text" 
                                                                        value={consumableskpi.details} 
                                                                        onChange={(e) => handleChangeConsumablesKPI(index, e.target.value)}
                                                                        placeholder="Details" 
                                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                    />
                                                                    <div className='flex justify-start items-center'>
                                                                        <a type="button" onClick={() => handleRemoveConsumablesKpi(index)}  className="text-gray-400 bg-red-400 hover:bg-red-500 hover:text-white rounded-lg text-sm w-8 h-8 ml-0 inline-flex justify-center items-center dark:bg-red-400 dark:hover:bg-red-500 dark:hover:text-white" data-modal-toggle="crud-modal">
                                                                            <IoClose className='text-2xl text-white'/>
                                                                            <span className="sr-only">Close modal</span>
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <a 
                                                                onClick={handleAddConsumablesKpi} 
                                                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                                                                >
                                                                More
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className='grid gap-6 mb-6 md:grid-cols-2 w-[40%]'>
                                                        <a
                                                        onClick={handleAddItem}
                                                        className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-green-500 hover:bg-green-600 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                                                        >
                                                            <IoAddOutline className="h-3.5 w-3.5 mr-2 -ml-1 text-white"/>
                                                            {editIndex !== null ? 'Save Changes' : 'Add Item'}
                                                        </a>
                                                    </div>
                                                    </div>
                                                </div>

                                                <div className="grid gap-6 mb-6 md:grid-cols-2 w-[40%]">
                                                    <button
                                                        type="submit"
                                                        disabled={status === 'saved'}
                                                        onClick={saveForm}
                                                        className={`${status === 'saved' ? 'bg-[#415ada]' : 'bg-[#213389]'} text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800`}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={submitForm}
                                                        className="text-white bg-[#213389] hover:bg-[#213389] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-[#213389] dark:hover:bg-[#213389] dark:focus:ring-blue-800"
                                                    >
                                                        Submit
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    {currentStep === 2 && (
                                        <Requisitionsapproval formData={formattedFormData} modelData={modelTopic} requestType={requestType} RequisitionId={RequisitionId}/>
                                    )}
            </>
    );
}

export default AddNewAssetRequisitionForm;