"use client";
import React from "react";
import HeaderListView from "../components/pageHeader/HeaderListView";
import HeaderGridView from "../components/pageHeader/HeaderGridView";
import PageHeader from "../components/pageHeader/pageHeader";
import { useGetworkflowsQuery } from "@/app/_lib/redux/features/workflow/workflowApi";
import { TbTruckLoading } from "react-icons/tb";
import AddNewWorkflowForm from "../components/workflow/workflowForms/addNewWorkflowForm";
import { useSelector } from "react-redux";
import RemoveWorkflowForm from "../components/workflow/workflowForms/removeWorkflowForm";
import WorkflowHomeListComponent from "../components/workflow/workflowHomeListComponent";
import AddNewSupplierForm from "./_components/forms/addNewSupplierForm";
import SupplierGridComponent from "./_components/SupplierGridComponent";
import { useGetAllSupplierQuery } from "@/app/_lib/redux/features/supplier/supplier_api";

export default function Roles() {
  const view = useSelector((state) => state.pageHeader.view);
  const { data: workflowsData } = useGetworkflowsQuery();
  const { data: supplierData } = useGetAllSupplierQuery()

  const form = {
    addForm: {
      modelTitle: "Add New Supplier",
      formComponent: <AddNewSupplierForm />,
    },
    updateForm: {
      modelTitle: "Update Existing Workflow",
      formComponent: <AddNewWorkflowForm isUpdateForm={true} />,
    },
    deleteForm: {
      modelTitle: "Remove Workflow",
      formComponent: <RemoveWorkflowForm />,
    },
  };

  const menuPath = [
    { name: "Home", url: "/dashboard" },
    { name: "Procurement Management", url: "/dashboard/config" },
    { name: "Supplier", url: "/dashboard/config/workflow" },
  ];

  return (
    <div className="px-4 pt-2 pl-8 border-gray-200 rounded-lg subcontent dark:border-gray-700">
      <PageHeader
        HeaderIcon={
          <TbTruckLoading className="mr-3 font-semibold text-gray-700 dark:text-white text-[25px]" />
        }
        menuPath={menuPath}
        headerTitle="Supplier"
        headerDescription="Manage all your existing suppliers or register  new suppliers"
        headerButtonText="Add New Supplier"
        form={form}
      />
      {view === "list" ? (
        <HeaderListView
          component={WorkflowHomeListComponent}
          data={workflowsData?.data}
        />
      ) : (
        <HeaderGridView
          component={SupplierGridComponent}
          data={supplierData?.data}
          searchField={'name'}
          icon={
            <TbTruckLoading className="mr-3 font-semibold text-gray-700 dark:text-white text-[40px]" />
          }
        />
      )}
    </div>
  );
}
