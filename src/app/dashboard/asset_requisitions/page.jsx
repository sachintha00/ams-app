"use client";
import React, { useEffect, useState, useContext, useRef } from "react";
import PageHeader from "../components/pageHeader/pageHeader";
import AddNewWorkflowForm from "../components/workflow/workflowForms/addNewWorkflowForm";
import { useSelector } from "react-redux";
import RemoveWorkflowForm from "../components/workflow/workflowForms/removeWorkflowForm";
import { redirect, useRouter } from 'next/navigation';
import PageListView from "../components/pageContent/PageListView";
import PageGridView from "../components/pageContent/PageGridView";
import { VscServerProcess } from "react-icons/vsc";
import AddNewAssetRequisitionForm from "./components/addNewAssetRequisitionForm";
import AssetRequisitionsListTable from "./components/assetRequisitionsListTable";
import { useAssestrequisitionListQuery } from "@/app/_lib/redux/features/assestrequisition/assest_requisition_api";
import AssestRequisitionsGridComponent from "./components/assestRequisitionsGridComponent";
import ViewOrUpdateAssetRequisitions from "./components/viewOrUpdateAssetRequisition";

export default function Page() {

  const router = useRouter();
  const [workflowRequestType, setWorkflowRequestType] = useState('');

  useEffect(() => {
    if (router.isReady) {
      const { workflow_request_type } = router.query;
      setWorkflowRequestType(workflow_request_type || '');
    }
  }, [router.isReady, router.query]);

  console.log(workflowRequestType);


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
    data: Assestrequisition,
    isLoading,
    isError,
    error,
    refetch,
  } = useAssestrequisitionListQuery();

  // search bar
  const searchQuery =
  useSelector((state) => state.pageHeader.searchQuery) || "";

  const filteredData = Assestrequisition?.allUserAssetRequisition?.filter((item) =>
      item.requisition_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // console.log(filteredData);

  const form = {
    addForm: {
      modelTitle: "Add New Asset Requisition",
      formComponent: <AddNewAssetRequisitionForm />,
      modelPageSize: "w-4/5",
    },
    updateForm: {
      modelTitle: "Update Existing Workflow",
      formComponent: <ViewOrUpdateAssetRequisitions/>,
      modelPageSize: "w-4/5",
    },
    deleteForm: {
      modelTitle: "Remove Workflow",
      formComponent: <RemoveWorkflowForm />,
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
          headerTitle="Asset Requisition "
          headerDescription="Manage all your existing Asset Requisition or add  new Asset Requisition "
          headerButtonText="Add new Asset Requisition "
          form={form}
          // You can hide the component related to that option in the page header by uncommenting the option below
          // showHeaderLineA={showHeaderLineA}
          // showHeaderLineB={showHeaderLineB}
          // showHeaderLineC={showHeaderLineC}
          // showAddButton={showAddButton}
          // showSearchBar={showSearchBar} 
          // showGridListButton={showGridListButton}
          showModelTitle={showModelTitle}
          Searchplaceholder="search requisition id"
        />
        {view === "list" ? (
          <PageListView 
            component={AssetRequisitionsListTable}
            data={filteredData}
          />
        ) : (
          <PageGridView
            component={AssestRequisitionsGridComponent}
            gridcolume={gridviewColume}
            data={filteredData}
            icon={
              <VscServerProcess className="font-semibold text-white dark:text-white text-[42px]" />
            }
          />
        )}
    </div>
  );
}