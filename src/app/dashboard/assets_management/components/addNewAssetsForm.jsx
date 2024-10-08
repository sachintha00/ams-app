'use client'
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useAssestListQuery, useSubmitAssestRegisterFormMutation } from '@/app/_lib/redux/features/assetsmanagement/assets_management_api';
import SelectInput from '../../components/inputs/SelectInput';
import renderAssetTypeItem from './menulist/renderAssetTypeItem';
import renderAssetSubCategories from './menulist/renderAssetSubCategories';
import { useGetSupplierlistQuery } from '@/app/_lib/redux/features/supplier/supplier_api';
import renderSupplier from './menulist/renderSupplier';
import { IoClose } from "react-icons/io5";
import { IoAddOutline } from "react-icons/io5";
import { useUsersListQuery } from '@/app/_lib/redux/features/user/user_api';
import renderResponsiblePerson from './menulist/renderResponsiblePerson';
import { BiEdit } from "react-icons/bi";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from 'react-redux';
import { getorganizationid } from '@/app/_lib/redux/features/assestrequisition/organization_slice';
import { FaFileAlt } from "react-icons/fa";
import { useDropzone } from 'react-dropzone';
import { FaFilePdf, FaFileCsv } from 'react-icons/fa';
import { handleClosePopupModel } from '@/app/_lib/redux/features/popupModel/popupModelSlice';

const OrganizationComponent = dynamic(() => import("./menulist/organization"), {
    ssr: false,
  });

function AddNewAssetsForm({ }) {
        const usedispatch = useDispatch();
        const { data: assestList } = useAssestListQuery();


        const [files1, setFiles1] = useState([]);
        const [files2, setFiles2] = useState([]);
        const [files3, setFiles3] = useState([]);
        const [image, setImage] = useState([]);

        const getPreview = (file) => {
            if (file.type.startsWith('image/')) {
              return <img src={URL.createObjectURL(file)} alt={file.name} style={{ width: '50px', height: '50px' }} />;
            } else if (file.type === 'application/pdf') {
              return <FaFilePdf size={32} color="red" />;
            } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
              return <FaFileCsv size={32} color="green" />;
            } else {
              return <span>Unsupported file type</span>;
            }
        };

        // Assets Related Document
        const { getRootProps: getRootProps1, getInputProps: getInputProps1 } = useDropzone({
            multiple: true,
            accept: {
              'image/*': ['.jpeg', '.png', '.jpg', '.gif', '.bmp', '.tiff'],
              'application/pdf': ['.pdf'],
              'text/csv': ['.csv']
            },
            onDrop: (acceptedFiles) => {
                if (files1.length + acceptedFiles.length > 5) {
                  alert('You can only upload up to 5 files.');
                  return;
                }
                setFiles1((prevFiles) => [...prevFiles, ...acceptedFiles]);
            }
          });

        // Purchase Document
        const { getRootProps: getRootProps2, getInputProps: getInputProps2 } = useDropzone({
            multiple: true,
            accept: {
            'image/*': ['.jpeg', '.png', '.jpg', '.gif', '.bmp', '.tiff'],
            'application/pdf': ['.pdf'],
            'text/csv': ['.csv']
            },
            onDrop: (acceptedFiles) => {
                if (files2.length + acceptedFiles.length > 5) {
                    alert('You can only upload up to 5 files.');
                    return;
                }
                setFiles2((prevFiles) => [...prevFiles, ...acceptedFiles]);
            }
        });

        // Insurance related Documents
        const { getRootProps: getRootProps3, getInputProps: getInputProps3 } = useDropzone({
            multiple: true,
            accept: {
            'image/*': ['.jpeg', '.png', '.jpg', '.gif', '.bmp', '.tiff'],
            'application/pdf': ['.pdf'],
            'text/csv': ['.csv']
            },
            onDrop: (acceptedFiles) => {
                if (files3.length + acceptedFiles.length > 5) {
                    alert('You can only upload up to 5 files.');
                    return;
                }
                setFiles3((prevFiles) => [...prevFiles, ...acceptedFiles]);
            }
        });

        // Thumbnail image
        const { getRootProps: getRootPropsImage, getInputProps: getInputPropsImage } = useDropzone({
            multiple: true,
            accept: {
            'image/*': ['.jpeg', '.png', '.jpg', '.gif', '.bmp', '.tiff']
            },
            onDrop: (acceptedFiles) => {
                setImage((prevFiles) => [...prevFiles, ...acceptedFiles]);
            }
        });

        // Function to remove a file by index from a given file list
        const removeFile = (index, setFiles) => {
            setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        };

        // assests type
        const [assetsTypeArray, setAssetsTypeArray] = useState([]);
        const [selectedAssetsType, setSelectedAssetsType] = useState(null);
        const [assetsTypeSearchInput, setAssetsTypeSearchInput] = useState('');
      
        useEffect(() => {
          if (assestList) {
            const Allassesttype = Object.values(assestList.allassesttype);
            const filteredassesttype = Allassesttype.filter(item => item.name.toLowerCase().includes(assetsTypeSearchInput.toLowerCase()));
            setAssetsTypeArray(filteredassesttype);
          }
        }, [assestList, assetsTypeSearchInput]);

        // Assets Categories
        const [assetCategories, setAssetCategories] = useState([]);
        const [selectedAssetCategories, setSelectedAssetCategories] = useState(null);
        const [assetCategoriesSearchInput, setAssetCategoriesSearchInput] = useState('');
        useEffect(() => {
            if (assestList) {
              const Allassetcategories = Object.values(assestList.Allassetcategories);
              const filteredassetcategories = Allassetcategories.filter(item => item.name.toLowerCase().includes(assetCategoriesSearchInput.toLowerCase()));
              setAssetCategories(filteredassetcategories);
            }
        }, [assestList, assetCategoriesSearchInput]);

        const handleSelectCategory = (category) => {
            setSelectedAssetCategories(category);
        };
        
        // Assets Sub Categories
        const [subCategories, setSubCategories] = useState([]);
        const [selectedSubAssetCategories, setSelectedAssetSubCategories] = useState(null);
        const [assetSubCategoriesSearchInput, setAssetSubCategoriesSearchInput] = useState('');

        useEffect(() => {
            if (selectedAssetCategories && selectedAssetCategories.sub_categories) {
                const Allassetsubcategories = Object.values(selectedAssetCategories.sub_categories);
                setSubCategories(Allassetsubcategories);
            } else {
                setSubCategories([]);
            }
        }, [selectedAssetCategories, assetSubCategoriesSearchInput]);
        console.log(selectedSubAssetCategories);

        // select Supplier
        const {data: Supplier} = useGetSupplierlistQuery();

        const [supplierList, setSupplierList] = useState([]);
        const [selectedSupplier, setSelectedSupplier] = useState(null);
        const [supplierSearchInput, setSupplierSearchInput] = useState('');

        useEffect(() => {
            if (Supplier) {
                const allsupplair = Object.values(Supplier.data);
                const filteredsupplair = allsupplair.filter(supplair => supplair.name.toLowerCase().includes(supplierSearchInput.toLowerCase()));
                setSupplierList(filteredsupplair);
            }
          }, [Supplier, supplierSearchInput]);

        
        // Purchase Type
        const [purchaseType, setPurchaseType] = useState([]);
        const [selectedPurchaseType, setSelectedPurchaseType] = useState(null);
        const [purchaseTypeSearchInput, setPurchaseTypeSearchInput] = useState('');

        useEffect(() => {
            if (assestList) {
              const Allpurchasetype = Object.values(assestList.allavailabilitytype);
              const filteredpurchasetype = Allpurchasetype.filter(item => item.name.toLowerCase().includes(purchaseTypeSearchInput.toLowerCase()));
              setPurchaseType(filteredpurchasetype);
            }
        }, [assestList, purchaseTypeSearchInput]);

        // Responsible Person select
        const { data: userList } = useUsersListQuery();
        const [usersList, setUsersList] = useState([]);
        const [selectedUser, setSelectedUser] = useState(null);
        const [selectedUserAllDetails, setSelectedUserAllDetails] = useState(null);
        const [usersListSearchInput, setUsersListSearchInput] = useState('');

        useEffect(() => {
            if (userList) {
              const Allusers = Object.values(userList.Users);
              const filteredusers = Allusers.filter(item => item.name.toLowerCase().includes(usersListSearchInput.toLowerCase()));
              setUsersList(filteredusers);
            }
        }, [userList, usersListSearchInput]);

        //file uploading

        // const [files, setFiles] = useState([]);
        // const handleFileChange = (event) => {
        //     const fileList = event.target.files;
        //     const newFiles = Array.from(fileList);
        //     setFiles([...files, ...newFiles]);
        // };
        
        // const handleRemoveFile = (index) => {
        //     const updatedFiles = files.filter((_, i) => i !== index);
        //     setFiles(updatedFiles);
        // };

        // const renderFile = (file, index) => {
        //     const fileType = file.type.split("/")[0]; // Get the file type (e.g., 'image', 'application')
        
        //     if (fileType === "image") {
        //     return (
        //         <div key={index}>
        //         <img
        //             src={URL.createObjectURL(file)}
        //             alt={`Image ${index}`}
        //             className="w-28"
        //         />
        //         <span className="text-gray-700 flex w-[10px]">{file.name}</span>
        //         <button
        //             type="button"
        //             onClick={() => handleRemoveFile(index)}
        //             className="text-gray-400 bg-transparent hover:bg-red-400 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-red-400 dark:hover:text-white"
        //             data-modal-toggle="crud-modal"
        //         >
        //             <IoClose className="text-2xl hover:text-white" />
        //             <span className="sr-only">Close modal</span>
        //         </button>
        //         </div>
        //     );
        //     } else {
        //     // Render file name with corresponding icon for non-image files
        //     let icon;
        //     if (file.type.includes("pdf")) {
        //         icon = <FaFilePdf className="text-6xl" />; // Example PDF icon
        //     } else {
        //         icon = <i className="fa fa-file-o" aria-hidden="true"></i>; // Default file icon
        //     }
        //     return (
        //         <div key={index}>
        //         {icon}
        //         <span className="text-gray-700 ">{file.name}</span>
        //         <button
        //             type="button"
        //             onClick={() => handleRemoveFile(index)}
        //             className="text-gray-400 bg-transparent hover:bg-red-400 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-red-400 dark:hover:text-white"
        //             data-modal-toggle="crud-modal"
        //         >
        //             <IoClose className="text-2xl hover:text-white" />
        //             <span className="sr-only">Close modal</span>
        //         </button>
        //         </div>
        //     );
        //     }
        // }; 

        //assetsDocument uploading
        // const [assetsDocument, setAssetsDocument] = useState([]);

        // const handleFileDrop = (e) => {
        //   e.preventDefault();
        //   const files = Array.from(e.dataTransfer.files);
        //   setAssetsDocument((prevFiles) => [...prevFiles, ...files]);
        // };
      
        // const handleAssetFileUpload = (e) => {
        //   const files = Array.from(e.target.files);
        //   setAssetsDocument((prevFiles) => [...prevFiles, ...files]);
        // };
      
        // const removeAssetFile = (indexToRemove) => {
        //   setAssetsDocument((prevFiles) =>
        //     prevFiles.filter((_, index) => index !== indexToRemove)
        //   );
        // };

        // purchasingFiles and insuranceDocument uploard
        // const [assetsDocument, setAssetsDocument] = useState([]);
        // const [purchasingFiles, setPurchasingFiles] = useState([]);
        // const [insuranceDocument, setInsuranceDocument] = useState([]);

        // const handleFileUpload = (e, setFileState) => {
        //     console.log(setFileState);
        //     const files = Array.from(e.target.files);
        //     setFileState(prevFiles => [...prevFiles, ...files]);
        // };
        
        // const handleDrop = (e, setFileState) => {
        //     e.preventDefault();
        //     const files = Array.from(e.dataTransfer.files);
        //     setFileState(prevFiles => [...prevFiles, ...files]);
        // };
        
        // const removeFile = (index, setFileState, fileState) => {
        //     setFileState(fileState.filter((_, i) => i !== index));
        // };

        // const getFileIcon = (file) => {
        //     const fileType = file.type.split('/')[1];
        //     switch (fileType) {
        //       case 'jpeg':
        //       case 'jpg':
        //       case 'png':
        //       case 'gif':
        //         return <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />;
        //       case 'pdf':
        //         return <FaFilePdf className='text-red-500 text-[100px]'/>;
        //       case 'csv':
        //         return <FaFileCsv className='text-green-500 text-[100px]'/>;
        //       default:
        //         return <FaFileAlt className='text-gray-500 text-[100px]'/>;
        //     }
        //   };

        //organization
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

        // get organization id
        const [organization, setOrganization] = useState('');
        //get organization id
        const organizationid = useSelector((state) => state.organization);
        // Update local state whenever organizationid changes
        useEffect(() => {
            setOrganization(organizationid);
        }, [organizationid]);

        //add assest details
        const [assestValue, setAssestValue] = useState('');
        const [purchaseOrderNumbe, setPurchaseOrderNumbe] = useState('');
        const [purchaseCost, setPurchaseCost] = useState('');
        const [warranty, setWarranty] = useState('');
        const [otherPurchaseDetails, setOtherPurchaseDetails] = useState('');
        const [insuranceNumber, setInsuranceNumber] = useState('');
        const [expectedLifeTime, setExpectedLifeTime] = useState('');
        const [estimatedDepreciationValue, setEstimatedDepreciationValue] = useState('');
        const [receivedCondition, setReceivedCondition] = useState('');
        const [assestDetails, setAssestDetails] = useState([]);
        const [modelNumber, setModelNumber] = useState('');
        const [serialNumber, setSerialNumber] = useState('');
        const [storedLocation, setStoredLocation] = useState('');
        const [editIndex, setEditIndex] = useState(null); // Track index of item being edited
        const [items, setItems] = useState([]);

        // Load form data from localStorage when the component mounts
        useEffect(() => {
            const savedFormData = JSON.parse(localStorage.getItem('assetRegister'));
            if (savedFormData) {
                setModelNumber(savedFormData.modelNumber || '');
                setSerialNumber(savedFormData.serialNumber || '');
                setSelectedUser(savedFormData.selectedUser || '');
                setStoredLocation(savedFormData.storedLocation || '');
                setOrganization(savedFormData.organization || '');
            }
        }, []);

        // Save form data to localStorage whenever it changes
        const saveFormDataToLocalStorage = (data) => {
            localStorage.setItem('assetRegister', JSON.stringify(data));
        };
    
        const updateFormData = (newState) => {
            saveFormDataToLocalStorage(newState);
        };

        const handleChange = (setter) => (e) => {
            const newValue = e.target.value;
            setter(newValue);
            updateFormData({
                modelNumber: setter === setModelNumber ? newValue : modelNumber,
                serialNumber: setter === setSerialNumber ? newValue : serialNumber,
                selectedUser,
                storedLocation: setter === setStoredLocation ? newValue : storedLocation,
                organization: setter === setOrganization ? newValue : organization,
            });
        };

        const handleSelectedUser = (user) => {
            setSelectedUser(user);
            setSelectedUserAllDetails(user)
            updateFormData({ selectedUser: user });
        };

        const handleAddAssest = () => {
    
            if (editIndex !== null) {
                // If editIndex is set, update the item at that index
                const updatedAssest = [...assestDetails];
                updatedAssest[editIndex] = { modelNumber, serialNumber, selectedUser, storedLocation, organization };
                setAssestDetails(updatedAssest);
                // Reset editIndex
                setEditIndex(null);
            } else {
                // Add new item to the list
                const newAssest = { modelNumber, serialNumber, selectedUser, storedLocation, organization };
                setAssestDetails([...assestDetails, newAssest]);
            }
          // Reset form fields
          setModelNumber('');
          setSerialNumber('');
          setSelectedUser('');
          setStoredLocation('');
          usedispatch(getorganizationid(null));
          localStorage.removeItem('assetRegister');
        };

        const handleEditAssest = (index) => {
          // Populate form fields with data from the item being edited
          const itemToEdit = assestDetails[index];
          setModelNumber(itemToEdit.modelNumber);
          setSerialNumber(itemToEdit.serialNumber);
          setSelectedUser(itemToEdit.selectedUser);
          setStoredLocation(itemToEdit.storedLocation);
          usedispatch(getorganizationid(organization));
          // Set editIndex to track the item being edited
          setEditIndex(index);
        };

        const handleRemoveAssest = (index) => {
          const updatedAssest = [...assestDetails];
          updatedAssest.splice(index, 1);
          setAssestDetails(updatedAssest);
        };

        const [submitAssestRegisterForm] = useSubmitAssestRegisterFormMutation();

        // save From
        const submitassetsdetails = async e => {
            e.preventDefault();
            try {
                const assetsDetails = {p_thumbnail_image: image, p_assets_type: selectedAssetsType.assest_type_id, p_category: selectedAssetCategories.ac_id, p_sub_category: selectedSubAssetCategories.assc_id, p_assets_value: assestValue, p_assets_document: files1, p_supplier: selectedSupplier.id, p_purchase_order_number: purchaseOrderNumbe, p_purchase_cost: purchaseCost, p_purchase_type: selectedPurchaseType.availability_type_id, p_received_condition: receivedCondition, p_warranty: warranty, p_other_purchase_details: otherPurchaseDetails, p_purchase_document: files2, p_insurance_number: insuranceNumber, p_insurance_document: files3, p_expected_life_time: expectedLifeTime, p_depreciation_value: estimatedDepreciationValue, asset_details: assestDetails}

                console.log(assetsDetails);
                submitAssestRegisterForm(assetsDetails)
                .unwrap()
                .then((response) => {
                    console.log("New node added:", response);
                    // router.push("/dashboard/usergroups");
                    usedispatch(handleClosePopupModel());
                })
                .catch((error) => {
                    console.error("Error adding new node:", error);
                });
            } catch (error) {
                console.error("Login error:", error);
            }
        }

        console.log(selectedUserAllDetails);
    return (
            <>
                {/* Modal header */}
                    <form
                        className="px-2 pt-6 overflow-y-scroll h-auto max-h-[600px] min-h-[450px]"
                        style={{ scrollbarWidth: "2px", scrollbarColor: "#888" }}
                        encType="multipart/form-data"
                    >
                        <div className="grid gap-6 md:grid-cols-4">
                            <div className='col-span-3 grid gap-6 md:grid-cols-2'>
                                <div>
                                    <label
                                        htmlFor="last_name"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Asset Type
                                    </label>
                                    <SelectInput
                                        placeholder="Search and Select Assets Type"
                                        data={assetsTypeArray}
                                        onSelect={setSelectedAssetsType}
                                        selected={selectedAssetsType}
                                        searchInput={assetsTypeSearchInput}
                                        setSearchInput={setAssetsTypeSearchInput}
                                        renderItem={renderAssetTypeItem}
                                        name={'name'}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="last_name"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Assest Value
                                    </label>
                                    <input 
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        onChange={(e) => setAssestValue(e.target.value)}
                                        name="estimatedDepreciationValue"
                                        value={assestValue} 
                                        placeholder="Enter Assest Value" 
                                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="last_name"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Asset Category
                                    </label>
                                    <SelectInput
                                        placeholder="Search and Select Asset Category"
                                        data={assetCategories}
                                        onSelect={handleSelectCategory}
                                        selected={selectedAssetCategories}
                                        searchInput={assetCategoriesSearchInput}
                                        setSearchInput={setAssetCategoriesSearchInput}
                                        renderItem={renderAssetTypeItem}
                                        name={'name'}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="last_name"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Asset Sub Category
                                    </label>
                                    <SelectInput
                                        placeholder="Search and Select Asset Sub Category"
                                        data={subCategories}
                                        onSelect={setSelectedAssetSubCategories}
                                        selected={selectedSubAssetCategories}
                                        searchInput={assetSubCategoriesSearchInput}
                                        setSearchInput={setAssetSubCategoriesSearchInput}
                                        renderItem={renderAssetSubCategories}
                                        name={"assc_name"}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="last_name"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Supplier
                                    </label>
                                    <SelectInput
                                        placeholder="Search and Select Supplier"
                                        data={supplierList}
                                        onSelect={setSelectedSupplier}
                                        selected={selectedSupplier}
                                        searchInput={supplierSearchInput}
                                        setSearchInput={setSupplierSearchInput}
                                        renderItem={renderSupplier}
                                        name={'name'}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="last_name"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Purchase Order Number
                                    </label>
                                    <input 
                                        type="text" 
                                        onChange={(e) => setPurchaseOrderNumbe(e.target.value)}
                                        name="purchaseOrderNumbe"
                                        value={purchaseOrderNumbe}
                                        placeholder="Enter Purchase Order Number" 
                                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    />
                                </div>
                            </div>
                            <div className='row-span-3'>
                                <label
                                    htmlFor="last_name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Attach Assests Images
                                </label>
                                {/* <label
                                {...getRootPropsImage()}
                                htmlFor="rpf-dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-[230px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white dark:hover:bg-[#3c4042] dark:bg-[#3c4042] hover:bg-gray-100 dark:border-gray-600 dark:hover:border-grays-500 p-2"
                                >
                                    <div className="flex flex-col items-center justify-center py-2">
                                        {image.length > 0 ? (
                                            <div>
                                                {image.map((file, index) => (
                                                    <div key={index} className="mt-[10px] relative flex flex-col items-end">
                                                        <a type="button" className='absolute inline-flex items-center justify-center w-6 h-6 text-sm text-gray-400 bg-red-400 hover:bg-red-500 rounded-lg hover:text-white ms-auto dark:bg-red-400 dark:hover:bg-red-500 dark:hover:text-white mt-[-7px] mr-[-7px]' onClick={() => setImage([])}>
                                                            <IoClose className="text-sm text-white" />
                                                        </a>
                                                        <img className="h-[195px] w-[250px] rounded-lg shadow-xl dark:shadow-gray-800"
                                                        src={URL.createObjectURL(file)} alt={file.name}/>
                                                        <div className='flex justify-center w-[100%]'>
                                                            <span className='text-gray-900 dark:text-white'>{file.name}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) 
                                        : 
                                        (
                                            <>
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
                                                <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                                                SVG, PNG, JPG, GIF, PDF, DOC, DOCX, or CSV (MAX. 800x400px)
                                                </p>
                                            </>
                                        )
                                        }
                                    </div>
                                    <input {...getInputPropsImage()} />
                                </label> */}
                                <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-[230px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white dark:hover:bg-[#3c4042] dark:bg-[#3c4042] hover:bg-gray-100 dark:border-gray-600 dark:hover:border-grays-500 p-2"
                                {...getRootPropsImage()}
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
                                        SVG, PNG, JPEG, JPG, GIF
                                        </p>
                                    </div>
                                    {image.length > 0 &&
                                        <div className="mt-2 flex flex-col w-[100%] overflow-y-scroll h-auto">
                                            {image.map((file, index) => (
                                                <div key={index} className="p-1 flex justify-between items-center border border-gray-200 rounded-lg shadow dark:bg-[#1e1e1e] dark:border-gray-700">
                                                    <div className='flex justify-start w-[75%] items-center'>
                                                        <div className="w-10 h-10 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center mr-1">
                                                            {getPreview(file)}
                                                        </div>
                                                        <p className="text-xs text-center mt-1 text-gray-500 dark:text-gray-400">{file.name}</p>
                                                    </div>
                                                    <a
                                                        className="top-0 right-0 text-gray-400 bg-red-400 hover:bg-red-500 hover:text-white rounded-lg text-sm w-6 h-6 ml-0 inline-flex justify-center items-center dark:bg-red-400 dark:hover:bg-red-500 dark:hover:text-white"
                                                        onClick={() => removeFile(index, setFiles3)}
                                                    >
                                                        <IoClose className="text-xl text-white" />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    }
                                    <input {...getInputPropsImage()}/>
                                </label>
                            </div>
                        </div>
                        <div className="grid gap-6 mb-6 md:grid-flow-col mb-grid-rows-3">
                            <div className='row-span-3'>
                                <label
                                    htmlFor="last_name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Attach Assets Related Document
                                </label>
                                <label
                                htmlFor="rpf-dropzone-file"
                                {...getRootProps1()}
                                className="flex flex-col items-center justify-center w-full h-[255px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white dark:hover:bg-[#3c4042] dark:bg-[#3c4042] hover:bg-gray-100 dark:border-gray-600 dark:hover:border-grays-500 p-2"
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
                                    {files1.length > 0 &&
                                        <div className="mt-2 flex flex-col w-[100%] overflow-y-scroll h-auto">
                                            {files1.map((file, index) => (
                                                <div key={index} className="p-1 flex justify-between items-center border border-gray-200 rounded-lg shadow dark:bg-[#1e1e1e] dark:border-gray-700">
                                                    <div className='flex justify-start w-[75%] items-center'>
                                                        <div className="w-10 h-10 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center mr-1">
                                                            {getPreview(file)}
                                                        </div>
                                                        <p className="text-xs text-center mt-1 text-gray-500 dark:text-gray-400">{file.name}</p>
                                                    </div>
                                                    <a
                                                        className="top-0 right-0 text-gray-400 bg-red-400 hover:bg-red-500 hover:text-white rounded-lg text-sm w-6 h-6 ml-0 inline-flex justify-center items-center dark:bg-red-400 dark:hover:bg-red-500 dark:hover:text-white"
                                                        onClick={() => removeFile(index, setFiles1)}
                                                    >
                                                        <IoClose className="text-xl text-white" />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    }
                                    <input {...getInputProps1()}/>
                                </label>
                            </div>
                            <div className='col-span-2'>
                                <label
                                    htmlFor="last_name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Purchase Cost
                                </label>
                                <input 
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    onChange={(e) => setPurchaseCost(e.target.value)}
                                    name="purchaseCost"
                                    value={purchaseCost} 
                                    placeholder="Enter Purchase Cost" 
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                />
                            </div>
                            <div className='col-span-2'>
                                <label
                                    htmlFor="last_name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Purchase Type
                                </label>
                                <SelectInput
                                    placeholder="Search and Select Supplier"
                                    data={purchaseType}
                                    onSelect={setSelectedPurchaseType}
                                    selected={selectedPurchaseType}
                                    searchInput={purchaseTypeSearchInput}
                                    setSearchInput={setPurchaseTypeSearchInput}
                                    renderItem={renderSupplier}
                                    name={'name'}
                                />
                            </div>
                            <div className='col-span-2'>
                                <label
                                    htmlFor="last_name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Recived Condition
                                </label>
                                <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-[#3c4042] dark:border-gray-500 dark:text-white">
                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                    <div className="flex items-center ps-3">
                                        <input
                                        id="horizontal-list-radio-license"
                                        type="radio"
                                        value="Brand New"
                                        name="list-radio"
                                        checked={receivedCondition === "Brand New"}
                                        onChange={(e) => setReceivedCondition(e.target.value)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                        />
                                        <label
                                        htmlFor="horizontal-list-radio-license"
                                        className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                        >
                                        Brand New
                                        </label>
                                    </div>
                                    </li>
                                    <li className="w-full dark:border-gray-600">
                                    <div className="flex items-center ps-3">
                                        <input
                                        id="horizontal-list-radio-passport"
                                        type="radio"
                                        value="Used"
                                        name="list-radio"
                                        checked={receivedCondition === "Used"}
                                        onChange={(e) => setReceivedCondition(e.target.value)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                        />
                                        <label
                                        htmlFor="horizontal-list-radio-passport"
                                        className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                        >
                                        Used
                                        </label>
                                    </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="grid gap-6 mb-6 md:grid-flow-col mb-grid-rows-3">
                            <div className='col-span-2'>
                                <label
                                    htmlFor="last_name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Warranty
                                </label>
                                <input 
                                    type="text" 
                                    onChange={(e) => setWarranty(e.target.value)}
                                    name="warranty"
                                    value={warranty} 
                                    placeholder="Enter warranty (if have)" 
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                />
                            </div>
                            <div className='col-span-2'>
                                <label
                                    htmlFor="last_name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Other Purchase Details
                                </label>
                                <textarea
                                    id="user_description"
                                    rows="7"
                                    onChange={(e) => setOtherPurchaseDetails(e.target.value)}
                                    name="otherPurchaseDetails"
                                    value={otherPurchaseDetails}
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter Other Purchase Details"
                                ></textarea>
                            </div>
                            <div className='row-span-3'>
                                <label
                                    htmlFor="last_name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Attach Purchase Document
                                </label>
                                <label
                                htmlFor="rpf-dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-[255px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white dark:hover:bg-[#3c4042] dark:bg-[#3c4042] hover:bg-gray-100 dark:border-gray-600 dark:hover:border-grays-500 p-2"
                                {...getRootProps2()}
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
                                    {files2.length > 0 &&
                                        <div className="mt-2 flex flex-col w-[100%] overflow-y-scroll h-auto">
                                            {files2.map((file, index) => (
                                                <div key={index} className="p-1 flex justify-between items-center border border-gray-200 rounded-lg shadow dark:bg-[#1e1e1e] dark:border-gray-700">
                                                    <div className='flex justify-start w-[75%] items-center'>
                                                        <div className="w-10 h-10 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center mr-1">
                                                            {getPreview(file)}
                                                        </div>
                                                        <p className="text-xs text-center mt-1 text-gray-500 dark:text-gray-400">{file.name}</p>
                                                    </div>
                                                    <a
                                                        className="top-0 right-0 text-gray-400 bg-red-400 hover:bg-red-500 hover:text-white rounded-lg text-sm w-6 h-6 ml-0 inline-flex justify-center items-center dark:bg-red-400 dark:hover:bg-red-500 dark:hover:text-white"
                                                        onClick={() => removeFile(index, setFiles2)}
                                                    >
                                                        <IoClose className="text-xl text-white" />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    }
                                    <input {...getInputProps2()}/>
                                </label>
                            </div>
                        </div>
                        <div className="grid gap-6 mb-6 md:grid-flow-col mb-grid-rows-3">
                            <div className='col-span-2'>
                                <label
                                    htmlFor="last_name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Insurance Number
                                </label>
                                <input 
                                    type="text" 
                                    onChange={(e) => setInsuranceNumber(e.target.value)}
                                    name="insuranceNumber"
                                    value={insuranceNumber}
                                    placeholder="Enter Insurance Number" 
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                />
                            </div>
                            <div className='col-span-2'>
                                <label
                                    htmlFor="last_name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Expected Life Time
                                </label>
                                <input 
                                    type="text"
                                    onChange={(e) => setExpectedLifeTime(e.target.value)}
                                    name="expectedLifeTime"
                                    value={expectedLifeTime} 
                                    placeholder="Enter Purchase Order Number" 
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                />
                            </div>
                            <div className='col-span-2'>
                                <label
                                    htmlFor="last_name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Estimated Depreciation Value
                                </label>
                                <input 
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    onChange={(e) => setEstimatedDepreciationValue(e.target.value)}
                                    name="estimatedDepreciationValue"
                                    value={estimatedDepreciationValue} 
                                    placeholder="Enter Estimated Depreciation Value ex:50%" 
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                />
                            </div>
                            <div className='row-span-3'>
                                <label
                                    htmlFor="last_name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Attach Insurance related Documents
                                </label>
                                <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-[230px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white dark:hover:bg-[#3c4042] dark:bg-[#3c4042] hover:bg-gray-100 dark:border-gray-600 dark:hover:border-grays-500 p-2"
                                {...getRootProps3()}
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
                                    {files3.length > 0 &&
                                        <div className="mt-2 flex flex-col w-[100%] overflow-y-scroll h-auto">
                                            {files3.map((file, index) => (
                                                <div key={index} className="p-1 flex justify-between items-center border border-gray-200 rounded-lg shadow dark:bg-[#1e1e1e] dark:border-gray-700">
                                                    <div className='flex justify-start w-[75%] items-center'>
                                                        <div className="w-10 h-10 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center mr-1">
                                                            {getPreview(file)}
                                                        </div>
                                                        <p className="text-xs text-center mt-1 text-gray-500 dark:text-gray-400">{file.name}</p>
                                                    </div>
                                                    <a
                                                        className="top-0 right-0 text-gray-400 bg-red-400 hover:bg-red-500 hover:text-white rounded-lg text-sm w-6 h-6 ml-0 inline-flex justify-center items-center dark:bg-red-400 dark:hover:bg-red-500 dark:hover:text-white"
                                                        onClick={() => removeFile(index, setFiles3)}
                                                    >
                                                        <IoClose className="text-xl text-white" />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    }
                                    <input {...getInputProps3()}/>
                                </label>
                            </div>
                        </div>
                        <div className="grid gap-6 mb-6">
                            <div className='border border-black-800 p-3 rounded-lg dark:border-[#3c4042]'>
                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Assest Details
                            </h2>
                                {/* Display added items */}
                                {assestDetails && assestDetails.length > 0 && (
                                    <div className="overflow-x-auto border border-gray-200 dark:border-[#3c4042] sm:rounded-lg w-[-webkit-fill-available] mb-6">
                                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-[#606368] dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">
                                            Model Number
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                            Serial Number
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                            Responsible person
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                            Stored Location
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                            Actions
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {assestDetails.map((item, index) => (
                                            <tr
                                            key={index}
                                            className="odd:bg-white odd:dark:bg-[#1e1e1e] even:bg-gray-50 even:dark:bg-[#3c4042] border-b dark:border-gray-700"
                                            >
                                            <td className="px-6 py-4">{item.modelNumber}</td>
                                            <td className="px-6 py-4">{item.serialNumber}</td>
                                            <td className="px-6 py-4">{item.storedLocation}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-evenly">
                                                <a
                                                    onClick={() => handleEditAssest(index)}
                                                    className="text-gray-400 bg-yellow-500 hover:bg-yellow-600 hover:text-white rounded-lg text-sm w-8 h-8 ml-0 inline-flex justify-center items-center dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:hover:text-white"
                                                    data-modal-toggle="crud-modal"
                                                >
                                                    <BiEdit className="text-2xl text-white" />
                                                    <span className="sr-only">Close modal</span>
                                                </a>
                                                <a
                                                    type="button"
                                                    onClick={() => handleRemoveAssest(index)}
                                                    className="text-gray-400 bg-red-400 hover:bg-red-500 hover:text-white rounded-lg text-sm w-8 h-8 ml-0 inline-flex justify-center items-center dark:bg-red-400 dark:hover:bg-red-500 dark:hover:text-white"
                                                    data-modal-toggle="crud-modal"
                                                >
                                                    <IoClose className="text-2xl text-white" />
                                                    <span className="sr-only">Close modal</span>
                                                </a>
                                                </div>
                                            </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                    </div>
                                )
                                }
                                <div className="grid gap-6 mb-6 md:grid-cols-3">
                                    <div>
                                        <label
                                            htmlFor="last_name"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Assest Model Number
                                        </label>
                                        <input 
                                            type="text" 
                                            value={modelNumber}
                                            onChange={handleChange(setModelNumber)}
                                            placeholder="Enter Model Number" 
                                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="last_name"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Serial Number
                                        </label>
                                        <input 
                                            type="text" 
                                            value={serialNumber}
                                            onChange={handleChange(setSerialNumber)}
                                            placeholder="Enter Serial Number" 
                                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="last_name"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Responsible Person
                                        </label>
                                        <SelectInput
                                            placeholder="Search and Select Responsible Person"
                                            data={usersList}
                                            onSelect={handleSelectedUser}
                                            selected={selectedUserAllDetails}
                                            searchInput={usersListSearchInput}
                                            setSearchInput={setUsersListSearchInput}
                                            renderItem={renderResponsiblePerson}
                                            name={'name'}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-6 mb-6 md:grid-cols-3">
                                    <div>
                                        <label
                                            htmlFor="last_name"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Stored Location
                                        </label>
                                        <input 
                                            type="text" 
                                            value={storedLocation}
                                            onChange={handleChange(setStoredLocation)}
                                            placeholder="Enter Stored Location" 
                                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        />
                                    </div>
                                    <div className='col-span-2'>
                                        <label
                                            htmlFor="user_name"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Department
                                        </label>
                                        <a
                                            id="dropdownSearchButton"
                                            data-dropdown-toggle="dropdownSearch"
                                            className="flex justify-between items-center bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            type="button"
                                            onClick={toggleOrganizationStructureHandler}
                                        >
                                            Select Organization structure
                                            <IoAddOutline className=" dark:text-white" />
                                        </a>
                                        {/* Dropdown menu */}
                                        <div
                                            data-collapse={isOpenOrganizationStructure}
                                            ref={refOrganizationStructure}
                                            className="relative"
                                        >
                                            <div
                                            id="dropdownSearch"
                                            className="z-10 hidden absolute bg-white border border-gray-200 rounded-lg shadow dark:bg-[#1e1e1e] rolelist w-[100%] mr-2"
                                            >
                                            <div
                                                className="container mx-auto p-4 relative overflow-y-scroll h-[335px] overflow-x-scroll w-[99%]"
                                                style={{ scrollbarWidth: "thin" }}
                                            >
                                                <OrganizationComponent />
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid gap-6 mb-6 md:grid-cols-2 w-[40%]">
                                    <a
                                        onClick={handleAddAssest}
                                        className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-green-500 hover:bg-green-600 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                                    >
                                        <IoAddOutline className="h-3.5 w-3.5 mr-2 -ml-1 text-white" />
                                        {editIndex !== null ? "Save Changes" : "Add Assest"}
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-6 mb-6 md:grid-cols-2 w-[40%]">
                            <a
                                onClick={submitassetsdetails}
                                className="text-white bg-[#213389] hover:bg-[#213389] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-[#213389] dark:hover:bg-[#213389] dark:focus:ring-blue-800"
                            >
                                Submit
                            </a>
                        </div>
                    </form>
            </>
    );
}

export default AddNewAssetsForm;