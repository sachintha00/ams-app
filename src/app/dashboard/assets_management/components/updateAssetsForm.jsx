'use client'
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAddNewSupplierQuotationMutation, useUpdateSupplierQuotationMutation } from '@/app/_lib/redux/features/supplierquotation/supplierquotation_api';
import { handleClosePopupModel } from '@/app/_lib/redux/features/popupModel/popupModelSlice';
import { useUsersListQuery } from '@/app/_lib/redux/features/user/user_api';
import SelectInput from '../../components/inputs/SelectInput';
import renderResponsiblePerson from './menulist/renderResponsiblePerson';
import { useAssestListQuery, useSubmitAssestUpdateFormMutation } from '@/app/_lib/redux/features/assetsmanagement/assets_management_api';
import { useDropzone } from 'react-dropzone';
import { FaFilePdf, FaFileCsv } from 'react-icons/fa';
import renderAssetTypeItem from './menulist/renderAssetTypeItem';
import renderAssetCategories from './menulist/renderAssetCategories';
import renderAssetSubCategories from './menulist/renderAssetSubCategories';
import { useGetSupplierlistQuery } from '@/app/_lib/redux/features/supplier/supplier_api';
import renderSupplier from './menulist/renderSupplier';
import renderPurchaseType from './menulist/renderPurchaseType';
import dynamic from "next/dynamic";
import { IoAddOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

const OrganizationComponent = dynamic(() => import("./menulist/organization"), {
    ssr: false,
  });

function UpdateAssetsForm({ }) {
    const dispatch = useDispatch()
    const { value } = useSelector((state) => state.popupModel);

    const savedAssestId = value.id;
    const savedModelNumber = value.model_number;
    const savedSerialNumber = value.serial_number;
    const savedThumbnailImage = value.thumbnail_image;
    const savedlocation = value.location;
    const savedAssetsType = value.assets_type_id;
    const savedCategoryId = value.category_id;
    const savedsubCategoryId = value.sub_category_id;
    const savedSupplierId = value.supplier_id;
    const savedPurchaseTypeId = value.purchase_type_id;
    const savedassetsValue = value.assets_value;
    const savedPurchaseOrderNumber = value.purchase_order_number;
    const savedpurchaseCost = value.purchase_cost;
    const savedwarranty = value.warranty;
    const savedOtherPurchaseDetails = value.other_purchase_details;
    const savedOtherInsuranceNumber = value.insurance_number;
    const savedexpectedLifeTime = value.expected_life_time;
    const savedDepreciationValue = value.depreciation_value;
    const savedReceivedCondition = value.received_condition;
    const responsiblePersonID = value.responsible_person_id;


    const [files1, setFiles1] = useState([]);
    const [files2, setFiles2] = useState([]);
    const [files3, setFiles3] = useState([]);
    const [image, setImage] = useState([]);
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]);

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
            if (images.length + acceptedFiles.length > 5) {
                alert('You can only upload up to 5 images.');
                return;
            }
            setImages((prevFiles) => [...prevFiles, ...acceptedFiles]);
        },
    });

    useEffect(() => {
        // Initialize with existing data
        if (savedThumbnailImage) {
            setExistingImages(savedThumbnailImage || []);
        }
    }, [savedThumbnailImage]);

    // Function to remove a file by index from a given file list
    // const removeFile = (index, setFiles) => {
    //     setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    // };
    const removeFile = (index, type, setFiles) => {
        if (type === 'existing') {
            const removedImage = existingImages[index];
            setDeletedImages((prevDeleted) => [...prevDeleted, removedImage]);
            setExistingImages((prevFiles) => prevFiles.filter((_, i) => i !== index));
        } else if (type === 'new') {
            setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        }
    };

    // asset type
    const { data: assestList } = useAssestListQuery();
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

    useEffect(() => {
        if (savedAssetsType && assestList) {
            // Find and set the current selected asset type based on the existing asset data
            const currentAssetType = assestList.allassesttype.find(
                item => item.assest_type_id === savedAssetsType
            );
            setSelectedAssetsType(currentAssetType);
            setAssetsTypeSearchInput(currentAssetType ? currentAssetType.name : '');
        }
    }, [savedAssetsType, assestList]);

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

    useEffect(() => {
        if (savedCategoryId && assestList) {
            // Find and set the current selected asset type based on the existing asset data
            const currentCategory = assestList.Allassetcategories.find(
                item => item.ac_id === savedCategoryId
            );
            setSelectedAssetCategories(currentCategory);
            setAssetCategoriesSearchInput(currentCategory ? currentCategory.name : '');
        }
    }, [savedCategoryId, assestList]);

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

    useEffect(() => {
        if (savedsubCategoryId && selectedAssetCategories) {
            // Find and set the current selected asset type based on the existing asset data
            if (selectedAssetCategories && selectedAssetCategories.sub_categories) {
                const currentSubCategoryId = selectedAssetCategories.sub_categories.find(
                    item => item.assc_id === savedsubCategoryId
                );
                setSelectedAssetSubCategories(currentSubCategoryId);
                setAssetSubCategoriesSearchInput(currentSubCategoryId ? currentSubCategoryId.assc_name : '');
            }
        }
    }, [savedsubCategoryId, selectedAssetCategories]);

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

    useEffect(() => {
        if (savedSupplierId && Supplier) {
            // Find and set the current selected asset type based on the existing asset data
            const currentSupplier = Supplier.data.find(
                item => item.id === savedSupplierId
            );
            setSelectedSupplier(currentSupplier);
            setSupplierSearchInput(currentSupplier ? currentSupplier.name : '');
        }
    }, [savedSupplierId, Supplier]);


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

    useEffect(() => {
        if (savedPurchaseTypeId && assestList) {
            // Find and set the current selected asset type based on the existing asset data
            const currentallavailabilitytype = assestList.allavailabilitytype.find(
                item => item.availability_type_id === savedPurchaseTypeId
            );
            setSelectedPurchaseType(currentallavailabilitytype);
            setPurchaseTypeSearchInput(currentallavailabilitytype ? currentallavailabilitytype.name : '');
        }
    }, [savedPurchaseTypeId, assestList]);

    // received condition
    const [receivedCondition, setReceivedCondition] = useState(savedReceivedCondition);

    // responsible persone
    const { data: userList } = useUsersListQuery();
    const [usersList, setUsersList] = useState([]);
    const [selectedUserAllDetails, setSelectedUserAllDetails] = useState(null);
    const [usersListSearchInput, setUsersListSearchInput] = useState('');

    useEffect(() => {
        if (userList) {
          const Allusers = Object.values(userList.Users);
          const filteredusers = Allusers.filter(item => item.name.toLowerCase().includes(usersListSearchInput.toLowerCase()));
          setUsersList(filteredusers);
        }
    }, [userList, usersListSearchInput]);

    useEffect(() => {
        if (responsiblePersonID && userList) {
            // Find and set the current selected asset type based on the existing asset data
            const currentresponsiblePerson = userList.Users.find(
                item => item.id === responsiblePersonID
            );
            setSelectedUserAllDetails(currentresponsiblePerson);
            setUsersListSearchInput(currentresponsiblePerson ? currentresponsiblePerson.name : '');
        }
    }, [responsiblePersonID, userList]);

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

    const [storedLocation, setStoredLocation] = useState(savedlocation);
    const [assestValue, setAssestValue] = useState(savedassetsValue);
    const [purchaseOrderNumbe, setPurchaseOrderNumbe] = useState(savedPurchaseOrderNumber);
    const [purchaseCost, setPurchaseCost] = useState(savedpurchaseCost);
    const [warranty, setWarranty] = useState(savedwarranty);
    const [otherPurchaseDetails, setOtherPurchaseDetails] = useState(savedOtherPurchaseDetails);
    const [insuranceNumber, setInsuranceNumber] = useState(savedOtherInsuranceNumber);
    const [expectedLifeTime, setExpectedLifeTime] = useState(savedexpectedLifeTime);
    const [estimatedDepreciationValue, setEstimatedDepreciationValue] = useState(savedDepreciationValue);

    // console.log(value.quotation);
    // const quotation =  value.quotation;
    // const procurement =  value.procurement;
    // const [procuremenSelectedItems, setProcuremenSelectedItems] = useState([]);
    // const quotation_id = quotation.id;
    // const date = quotation.date;
    // const procurement_id = procurement.id;
    // const selected_supplier_id = quotation.selected_supplier_id;
    // const AvailableDate = quotation.available_date;

    // useEffect(() => {
    //     if (value) {
    //         setProcuremenSelectedItems(value.quotation.selected_items);
    //     }
    // }, []);

    // // update qty and price
    // const updateSelectedItem = (itemId, field, value) => {
    //     setProcuremenSelectedItems((prevItems) =>
    //         prevItems.map((item) =>
    //         item.id === itemId ? { ...item, [field]: value } : item
    //         )
    //     );
    //     };
  
    // const handleInputChange = (itemId, field, value) => {
    //     updateSelectedItem(itemId, field, value);
    // };

    const [submitAssestUpdateForm] = useSubmitAssestUpdateFormMutation(); 

    // save From
    const updateassetsdetails = async e => {
        e.preventDefault();
        try {
            const assetsDetails = { ID: savedAssestId, p_model_number: savedModelNumber, p_serial_number: savedSerialNumber, p_responsible_person: selectedUserAllDetails.id, p_location: storedLocation, p_department: organizationid, p_thumbnail_image: image, deletedImages: deletedImages, p_assets_type: selectedAssetsType.assest_type_id, p_category: selectedAssetCategories.ac_id, p_sub_category: selectedSubAssetCategories.assc_id, p_assets_value: assestValue, p_assets_document: files1, p_supplier: selectedSupplier.id, p_purchase_order_number: purchaseOrderNumbe, p_purchase_cost: purchaseCost, p_purchase_type: selectedPurchaseType.availability_type_id, p_received_condition: receivedCondition, p_warranty: warranty, p_other_purchase_details: otherPurchaseDetails, p_purchase_document: files2, p_insurance_number: insuranceNumber, p_insurance_document: files3, p_expected_life_time: expectedLifeTime, p_depreciation_value: estimatedDepreciationValue}
            console.log(assetsDetails); 
            // submitAssestUpdateForm(assetsDetails) 
            // .unwrap()
            // .then((response) => {
            //     console.log("New node added:", response);
            //     // router.push("/dashboard/usergroups");
            //     dispatch(handleClosePopupModel());
            // })
            // .catch((error) => {
            //     console.error("Error adding new node:", error);
            // });
        } catch (error) {
            console.error("Login error:", error);
        }
    }

    return (
        <>
            <div 
                className="px-2 pt-2 overflow-y-scroll h-auto max-h-[600px]"
                style={{ scrollbarWidth: "2px", scrollbarColor: "#888" }}
            >
                        <div className="grid mb-6 gap-6 md:grid-cols-3">
                                <div>
                                    <label
                                        htmlFor="last_name"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Assest Model Number
                                    </label>
                                    <input 
                                        type="text"
                                        disabled
                                        name="ModelNumber"
                                        value={savedModelNumber} 
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
                                        disabled
                                        name="SerialNumber"
                                        value={savedSerialNumber} 
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
                                        onSelect={setSelectedUserAllDetails}
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
                                    onChange={(e) => setStoredLocation(e.target.value)}
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
                                        renderItem={renderAssetCategories}
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
                                {/* <label
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
                                </label> */}
                                <label
                                    htmlFor="image-dropzone-file"
                                    {...getRootPropsImage()}
                                    className="flex flex-col items-center justify-center w-full h-[230px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white dark:hover:bg-[#3c4042] dark:bg-[#3c4042] hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 p-2"
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
                                            SVG, PNG, JPG, GIF (MAX. 800x400px)
                                        </p>
                                    </div>
                                    {existingImages.length > 0 && (
                                        <div className="mt-2 flex flex-col w-[100%] overflow-y-scroll h-auto">
                                            {existingImages.map((img, index) => (
                                                <div
                                                    className="p-1 flex justify-between items-center border border-gray-200 rounded-lg shadow dark:bg-[#1e1e1e] dark:border-gray-700"
                                                >
                                                    <div className="flex justify-start w-[75%] items-center">
                                                        <div className="w-10 h-10 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center mr-1">
                                                            <img
                                                            src={`${process.env.NEXT_PUBLIC_API_URL}${img || defaultAvatar}`}
                                                            alt="Existing" className="w-full h-full object-cover" />
                                                        </div>
                                                    </div>
                                                    <a
                                                        className="top-0 right-0 text-gray-400 bg-red-400 hover:bg-red-500 hover:text-white rounded-lg text-sm w-6 h-6 ml-0 inline-flex justify-center items-center dark:bg-red-400 dark:hover:bg-red-500 dark:hover:text-white"
                                                        onClick={() => removeFile(index, 'existing')}
                                                    >
                                                        <IoClose className="text-xl text-white" />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {images.length > 0 && (
                                        <div className="mt-2 flex flex-col w-[100%] overflow-y-scroll h-auto">
                                            {images.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="p-1 flex justify-between items-center border border-gray-200 rounded-lg shadow dark:bg-[#1e1e1e] dark:border-gray-700"
                                                >
                                                    <div className="flex justify-start w-[75%] items-center">
                                                        <div className="w-10 h-10 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center mr-1">
                                                            {getPreview(file)}
                                                        </div>
                                                        <p className="text-xs text-center mt-1 text-gray-500 dark:text-gray-400">
                                                            {file.name}
                                                        </p>
                                                    </div>
                                                    <a
                                                        className="top-0 right-0 text-gray-400 bg-red-400 hover:bg-red-500 hover:text-white rounded-lg text-sm w-6 h-6 ml-0 inline-flex justify-center items-center dark:bg-red-400 dark:hover:bg-red-500 dark:hover:text-white"
                                                        onClick={() => removeFile(index, 'new', setImages)}
                                                    >
                                                        <IoClose className="text-xl text-white" />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <input {...getInputPropsImage()} />
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
                                    renderItem={renderPurchaseType}
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

                        <div className="grid gap-6 mb-6 md:grid-cols-2 w-[40%]">
                            <a
                                onClick={updateassetsdetails}
                                className="text-white bg-[#213389] hover:bg-[#213389] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-[#213389] dark:hover:bg-[#213389] dark:focus:ring-blue-800"
                            >
                                Update
                            </a>
                        </div>
            </div>
        </>
    );
}

export default UpdateAssetsForm;