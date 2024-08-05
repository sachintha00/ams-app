"use client";
import React, { useEffect, useState, useContext, useRef } from "react";
import PageHeader from "../components/pageHeader/pageHeader";
import { useSelector } from "react-redux";
import RemoveWorkflowForm from "../components/workflow/workflowForms/removeWorkflowForm";
import { redirect, useRouter } from 'next/navigation';
import PageListView from "../components/pageContent/PageListView";
import PageGridView from "../components/pageContent/PageGridView";
import { VscServerProcess } from "react-icons/vsc";
import ViewOrUpdateAssetRequisitions from "../asset_requisitions/components/viewOrUpdateAssetRequisition";
import AddNewProcurementInitiateForm from "./components/addNewProcurementInitiateForm";
import { useAllProcurementDetailsListByUserQuery } from "@/app/_lib/redux/features/procurement/procurement_api";
import procurementInitiateListTable from "./components/procurementInitiateListTable";
import ProcurementInitiateGridComponent from "./components/procurementInitiateGridComponent";
import AddNewSupplierQuotationForm from "../supplier_quotation/components/addNewSupplierQuotationForm";
import ProceedProcurementDetails from "./components/proceedProcurementDetails";
import ViewQuotationDetails from "../supplier_quotation/components/viewQuotationDetails";

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
  const {
    data: allProcurementDetailsListByUser,
    isLoading,
    isError,
    error,
    refetch,
  } = useAllProcurementDetailsListByUserQuery();
 
  // search bar
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const searchQuery = useSelector((state) => state.pageHeader.searchQuery) || "";

  const procurementData = allProcurementDetailsListByUser?.data || [];
  const reversedData = [...procurementData].reverse();
  const filteredData = reversedData.filter((procurement) =>
                          procurement.request_id.toLowerCase().includes(searchQuery.toLowerCase())
                        );

  // console.log(filteredData);

  const form = {
    addForm: {
      modelTitle: "Add New Procurement Initiate",
      formComponent: <AddNewProcurementInitiateForm />,
      modelPageSize: "w-[95%]",
      // showModelTitle:{showModelTitle},
    },
    updateForm: {
      modelTitle: "Proceed Procurement",
      formComponent: <ProceedProcurementDetails/>, 
      modelPageSize: "w-4/5",
      showModelTitle:{showModelTitle},
    },
    viewForm: {
      modelTitle: "Supplier Quotation Details",
      formComponent: <ViewQuotationDetails/>,
      modelPageSize: "w-4/5",
    },
    deleteForm: {
      modelTitle: "Remove Workflow",
      formComponent: <RemoveWorkflowForm />,
      // showModelTitle:{showModelTitle},
    },
  };

  const menuPath = [
    { name: "Home", url: "/dashboard" },
    { name: "Procurement Management", url: "" },
    { name: "Users Requisitions List", url: "/dashboard/asset_requisitions" },
  ];

  return (
    <div className="p-4 pl-8 border-gray-200 rounded-lg subcontent dark:border-gray-700 mt-10">
        <PageHeader 
          HeaderIcon={
            <VscServerProcess className="mr-3 font-semibold text-gray-700 dark:text-white text-[25px]" />
          }
          menuPath={menuPath}
          headerTitle="Procurement Initiate"
          headerDescription="Manage all your existing Procurement Initiate or add  new Procurement Initiate"
          headerButtonText="Add new Procurement Initiate"
          form={form}
          // You can hide the component related to that option in the page header by uncommenting the option below
          // showHeaderLineA={showHeaderLineA}
          // showHeaderLineB={showHeaderLineB}
          // showHeaderLineC={showHeaderLineC}
          // showAddButton={showAddButton}
          // showSearchBar={showSearchBar} 
          // showGridListButton={showGridListButton}
          showModelTitle={showModelTitle}
          Searchplaceholder="Search Procurement ID"
        />
        {view === "list" ? (
          <PageListView 
            component={procurementInitiateListTable}
            data={filteredData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentPage}
          />
        ) : (
          <PageGridView
            component={ProcurementInitiateGridComponent}
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