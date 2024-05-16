"use client";
import React, { useEffect, useState } from "react";
import HeaderListView from "../components/pageHeader/HeaderListView";
import HeaderGridView from "../components/pageHeader/HeaderGridView";
import WorkflowHomeGridComponent from "../components/workflow/workflowHomeGridComponent";
import PageHeader from "../components/pageHeader/pageHeader";
import { useGetworkflowsQuery } from "@/app/_lib/redux/features/workflow/workflowApi";
import { LuWorkflow } from "react-icons/lu";
import AddNewWorkflowForm from "../components/workflow/workflowForms/addNewWorkflowForm";
import { useSelector } from "react-redux";
import RemoveWorkflowForm from "../components/workflow/workflowForms/removeWorkflowForm";
import WorkflowHomeListComponent from "../components/workflow/workflowHomeListComponent";

export default function Roles() {
  const view = useSelector((state) => state.pageHeader.view);
  const { data: workflowsData, isSuccess } = useGetworkflowsQuery();
  const [workflowDataArray, setWorkflowDataArray] = useState()

  useEffect(() => {
    if (isSuccess) {
      setWorkflowDataArray(workflowsData.data)
    }
  }, [workflowsData])

  console.log("hello ", workflowsData?.data)

  const form = {
    addForm: {
      modelTitle: "Add New Workflow",
      formComponent: <AddNewWorkflowForm />,
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
    { name: "Config", url: "/dashboard/config" },
    { name: "Workflow", url: "/dashboard/config/workflow" },
  ];

  return (
    <div className="px-4 pt-2 pl-8 border-gray-200 rounded-lg subcontent dark:border-gray-700">
      <PageHeader
        HeaderIcon={
          <LuWorkflow className="mr-3 font-semibold text-gray-700 dark:text-white text-[25px]" />
        }
        menuPath={menuPath}
        headerTitle="Workflow"
        headerDescription="Manage all your existing workflows or add  new workflows"
        headerButtonText="Add new workflow"
        form={form}
      />
      {view === "list" ? (
        <HeaderListView
          component={WorkflowHomeListComponent}
          data={workflowsData?.data}
        />
      ) : (
        <HeaderGridView
          component={WorkflowHomeGridComponent}
          data={workflowsData?.data}
          searchField={'workflow_name'}
          icon={
            <LuWorkflow className="mr-3 font-semibold text-gray-700 dark:text-white text-[40px]" />
          }
        />
      )}
    </div>
  );
}
