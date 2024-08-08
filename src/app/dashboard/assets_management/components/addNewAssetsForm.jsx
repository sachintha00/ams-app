'use client'
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useAssestListQuery } from '@/app/_lib/redux/features/assetsmanagement/assets_management_api';
import SelectInput from '../../components/inputs/SelectInput';
import renderAssetTypeItem from './menulist/renderAssetTypeItem';
import renderAssetSubCategories from './menulist/renderAssetSubCategories';
import { CSSTransition } from 'react-transition-group';
import { useGetSupplierlistQuery } from '@/app/_lib/redux/features/supplier/supplier_api';
import renderSupplier from './menulist/renderSupplier';

function AddNewAssetsForm({ }) {

        const { data: assestList } = useAssestListQuery();

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
    return (
            <>
                {/* Modal header */}
                    <form
                        className="px-2 pt-2 overflow-y-scroll h-auto max-h-[600px] min-h-[450px]"
                        style={{ scrollbarWidth: "2px", scrollbarColor: "#888" }}
                        encType="multipart/form-data"
                    >
                        <div className="grid gap-6 mb-6 md:grid-cols-3">
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
                            <CSSTransition
                                    in={selectedAssetCategories}
                                    timeout={200}
                                    unmountOnExit
                                >
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
                                        name={'assc_name'}
                                    />
                                </div>
                            </CSSTransition>
                        </div>
                        <div className="grid gap-6 mb-6 md:grid-cols-3">
                            <div>
                                <label
                                    htmlFor="last_name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Assest Value
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Enter Assest Value" 
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                />
                            </div>
                        </div>
                        <div className="grid gap-6 mb-6 md:grid-cols-3">
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
                                    placeholder="Enter Purchase Order Number" 
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="last_name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Purchase Cost
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Enter Purchase Cost" 
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                />
                            </div>
                        </div>
                        <div className="grid gap-6 mb-6 md:grid-cols-3">
                            <div>
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
                        </div>
                    </form>
            </>
    );
}

export default AddNewAssetsForm;