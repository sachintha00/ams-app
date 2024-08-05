'use client'
import React, { useEffect, useState, useContext, useRef } from 'react';
import { formatDate } from '@/app/_lib/utils/dateFormatter';
import SupplierListDrodwon from './SupplierListDrodwon';
import { useDispatch, useSelector } from 'react-redux';
import { useAddNewSupplierQuotationMutation } from '@/app/_lib/redux/features/supplierquotation/supplierquotation_api';

function AddNewSupplierQuotationForm({ }) {
        const [procuremenSelectedItems, setProcuremenSelectedItems] = useState([]);

        const usedispatch = useDispatch();
        const { value } = useSelector((state) => state.popupModel);
        const procuremenSelectedSuppliers = value.selected_suppliers;
        const procuremenId = value.id;
        console.log(procuremenSelectedSuppliers);

        useEffect(() => {
            if (value) {
                setProcuremenSelectedItems(value.selected_items);
            }
        }, []);
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().substr(0, 10);
        const [assetRequisitionDate, setReqDate] = useState(today);

        // update qty and price
        const updateSelectedItem = (itemId, field, value) => {
            setProcuremenSelectedItems((prevItems) =>
              prevItems.map((item) =>
                item.id === itemId ? { ...item, [field]: value } : item
              )
            );
          };
  
        const handleInputChange = (itemId, field, value) => {
            updateSelectedItem(itemId, field, value);
        };

        // add suppliers
        const [selectedSupplier, setSelectedSupplier] = useState(null);
        const [isOpenRoleList, setIsOpenRoleList] = useState(false); 
    
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
            setSelectedSupplier(null);
        };

        const handleSupplierSelect = (supplier) => {
            setSelectedSupplier(supplier);
            setSearchInput(supplier.name);
            setIsOpenRoleList(false);
        };

        const [AvailableDate, setAvailableDate] = useState("");
        const [addNewSupplierQuotation] = useAddNewSupplierQuotationMutation();

        // save From
        const submit = async e => {
            e.preventDefault();
            try {
                const quotation = {date: assetRequisitionDate, procurement_id: procuremenId, selected_supplier_id: selectedSupplier.id, selected_items: procuremenSelectedItems, AvailableDate: AvailableDate}
                console.log(quotation); 
                addNewSupplierQuotation(quotation)
                .unwrap()
                .then((response) => {
                    console.log("New node added:", response);
                    // router.push("/dashboard/usergroups");
                    setSelectedSupplier(null);
                    setSearchInput('');
                    setProcuremenSelectedItems(value.selected_items);
                    setAvailableDate('');
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
                    <form
                        className="px-2 pt-2 overflow-y-scroll h-auto max-h-[600px] min-h-[450px]"
                        style={{ scrollbarWidth: "2px", scrollbarColor: "#888" }}
                        encType="multipart/form-data"
                    >
                        <div className="grid gap-6 md:grid-cols-1">
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
                        <div className="grid gap-6 mb-6 md:grid-cols-2">
                            {/* <div>
                                <label
                                    htmlFor="last_name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Select Procurement
                                </label>
                                <input
                                    type="text"
                                    value={selectedProcurement ? selectedProcurement.request_id : searchProcurementInput}
                                    onChange={handleSearchProcurementInputChange}
                                    onClick={toggleProcurementListHandler}
                                    className="flex justify-between items-center bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Search and Select supplare"
                                /> */}
                                {/* Dropdown menu */}
                                {/* <div data-collapse={isOpenProcurementList} ref={refProcurementList} className="relative">
                                    <ProcurementListDrodwon
                                        handleProcurementSelect={handleProcurementSelect}
                                        searchProcurementInput={searchProcurementInput}
                                        selectedProcurement={selectedProcurement}
                                    />
                                </div>
                            </div> */}
                            {procuremenSelectedSuppliers.length > 0 &&  (
                                <div>
                                    <label
                                        htmlFor="last_name"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Select supplare
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedSupplier ? selectedSupplier.name : searchInput}
                                        onChange={handleSearchInputChange}
                                        onClick={toggleRoleListHandler}
                                        className="flex justify-between items-center bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Search and Select supplare"
                                    />
                                    {/* Dropdown menu */}
                                    <div data-collapse={isOpenRoleList} ref={refRoleList} className="relative">
                                        <SupplierListDrodwon
                                            handleSupplierSelect={handleSupplierSelect}
                                            searchInput={searchInput}
                                            selectedSuppliers={selectedSupplier}
                                            procuremenSelectedSuppliers = {procuremenSelectedSuppliers}
                                        />
                                    </div>
                                </div>
                            )}
                            {procuremenSelectedItems.length > 0 &&  (
                                <div>
                                    <label
                                        htmlFor="user_name"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Available Date
                                    </label>
                                    <input
                                    type="date"
                                    id="user_name"
                                    name="user_name"
                                    onChange={(e) => setAvailableDate(e.target.value)}
                                    value={AvailableDate}
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter user user name"/>
                                </div>
                            )}
                        </div>
                        {procuremenSelectedItems.length > 0 &&  (
                            <>
                                <div className="grid gap-6 mb-6 md:grid-cols-1">
                                    <div>
                                        <label
                                            htmlFor="last_name"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Selected Items
                                        </label>
                                        <div className='flex flex-col rounded bg-white dark:bg-[#1e1e1e] tablelist h-auto'>
                                                    <div className="overflow-x-auto border border-gray-200 sm:rounded-lg">
                                                        <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                                                            <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-[#606368] dark:text-gray-400">
                                                                <tr>
                                                                    <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                                    Item name
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
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                            {procuremenSelectedItems.map((item) => (
                                                                <>
                                                                <tr className={`odd:bg-white odd:dark:bg-[#1e1e1e] even:bg-gray-50 even:dark:bg-[#3c4042] border-b dark:border-gray-700`}>
                                                                    <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                                        {item.item_name}
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
                                                                </tr>
                                                                </>
                                                            ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                    </div>
                                </div>
                            </>
                        )}


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
                            onClick={submit}
                            disabled={selectedSupplier === null}
                            className={`${selectedSupplier === null ? 'bg-[#4c6aff]' : 'bg-[#213389]'} text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800`}
                        >
                            Submit
                        </button>
                        </div>
                    </form>
            </>
    );
}

export default AddNewSupplierQuotationForm;