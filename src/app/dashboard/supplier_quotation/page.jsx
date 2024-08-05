"use client";
import React, { useEffect, useState, useContext, useRef } from "react";
import PageHeader from "../components/pageHeader/pageHeader";
import { useSelector } from "react-redux";
import RemoveWorkflowForm from "../components/workflow/workflowForms/removeWorkflowForm";
import { redirect, useRouter } from 'next/navigation';
import PageListView from "../components/pageContent/PageListView";
import PageGridView from "../components/pageContent/PageGridView";
import AddNewSupplierQuotationForm from "./components/addNewSupplierQuotationForm";
import { FaClipboardList } from "react-icons/fa";
import { useAllProcurementDetailsListQuery } from "@/app/_lib/redux/features/procurement/procurement_api";
import SupplierQuotationListTable from "./components/supplierQuotationListTable";
import SupplierQuotationGridComponent from "./components/supplierQuotationGridComponent";
import ViewQuotationDetails from "./components/viewQuotationDetails";
import UpdateSupplierQuotationForm from "./components/updateNewSupplierQuotationForm";
import DeleteSupplierQuotationForm from "./components/deleteSupplierQuotationForm";
import { VscServerProcess } from "react-icons/vsc";

export default function Page() {

  const router = useRouter();

  const [showHeaderLineA, setShowHeaderLineA] = useState(false);
  const [showHeaderLineB, setShowHeaderLineB] = useState(false);
  const [showHeaderLineC, setShowHeaderLineC] = useState(false);
  const [showAddButton, setShowAddButton] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showGridListButton, setShowGridListButton] = useState(false);
  const [showModelTitle, setshowModelTitle] = useState(false);
  const gridviewColume = "gap-4 2xl:grid-cols-3 min-[1200px]:grid-cols-2 min-[768px]:grid-cols-2 min-[640px]:grid-cols-1";

  const view = useSelector((state) => state.pageHeader.view);

  const { data: allProcurementDetailsList } = useAllProcurementDetailsListQuery();

  // search bar
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const searchQuery = useSelector((state) => state.pageHeader.searchQuery) || "";

  const procurementData = allProcurementDetailsList?.data || [];
  const reversedData = [...procurementData].reverse();
  const filteredData = reversedData.filter((procurement) =>
                          procurement.request_id.toLowerCase().includes(searchQuery.toLowerCase())
                        );

  // console.log(filteredData);

  const form = {
    addForm: {
      modelTitle: "Supplier Quotation Form",
      formComponent: <AddNewSupplierQuotationForm />,
      modelPageSize: "w-4/5",
    },
    updateForm: {
      modelTitle: "Update Supplier Quotation",
      formComponent: <UpdateSupplierQuotationForm/>,
      modelPageSize: "w-4/5",
    },
    viewForm: {
      modelTitle: "Supplier Quotation Details",
      formComponent: <ViewQuotationDetails/>,
      modelPageSize: "w-4/5",
    },
    deleteForm: {
      modelTitle: "Remove Supplier Quotation",
      formComponent: <DeleteSupplierQuotationForm />,
      showModelTitle:{showModelTitle},
    },
  };

  const menuPath = [
    { name: "Home", url: "/dashboard" },
    { name: "Procurement Management", url: "" },
    { name: "Supplier Quotation", url: "/dashboard/supplier_quotation" },
  ];

  return (
    <div className="p-4 pl-8 border-gray-200 rounded-lg subcontent dark:border-gray-700 mt-10">
        <PageHeader 
          HeaderIcon={
            <FaClipboardList className="mr-3 font-semibold text-gray-700 dark:text-white text-[25px]" />
          }
          menuPath={menuPath}
          headerTitle="Supplier Quotation"
          headerDescription="Manage all your existing Procurement Initiate or add  new Procurement Initiate"
          headerButtonText=""
          form={form}
          // You can hide the component related to that option in the page header by uncommenting the option below
          // showHeaderLineA={showHeaderLineA}
          // showHeaderLineB={showHeaderLineB}
          // showHeaderLineC={showHeaderLineC}
          showAddButton={showAddButton}
          // showSearchBar={showSearchBar} 
          // showGridListButton={showGridListButton}
          // showModelTitle={showModelTitle}
          Searchplaceholder="search procurement id"
        />
        {view === "list" ? (
          <PageListView 
            component={SupplierQuotationListTable}
            data={filteredData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentPage}
          />
        ) : (
          <PageGridView
            component={SupplierQuotationGridComponent}
            gridcolume={gridviewColume}
            data={filteredData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentPage}
            icon={
              <VscServerProcess className="font-semibold text-white dark:text-white text-[42px]" />
            }
          />
        )}
    </div>
  );
}