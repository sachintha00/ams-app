"use client";
import React, { useEffect, useState, useContext, useRef } from "react";
import PageHeader from "../components/pageHeader/pageHeader";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import AddNewWorkflowForm from "../components/workflow/workflowForms/addNewWorkflowForm";
import { useSelector } from "react-redux";
import RemoveWorkflowForm from "../components/workflow/workflowForms/removeWorkflowForm";
import UsersRequisitionsListTable from "../users_requisitions_list/components/usersRequisitionsListTable"
import { useApprovelAlertQuery } from "@/app/_lib/redux/features/workflowapprovelalert/workflowapprovelalert_api";
import PageListView from "../components/pageContent/PageListView";
import UsersRequisitionsGridComponent from "./components/usersRequisitionsGridComponent";
import PageGridView from "../components/pageContent/PageGridView";
import { useSearchParams } from 'next/navigation';

export default function Page() {

  // const searchParams = useSearchParams();
  // const [workflowRequestType, setWorkflowRequestType] = useState(null);

  // useEffect(() => {
  //   const workflowRequestTypeParam = searchParams.get('workflow_request_type');
  //   setWorkflowRequestType(workflowRequestTypeParam);
  // }, [searchParams]);
  const { value } = useSelector((state) => state.requestType);

  const [showHeaderLineA, setShowHeaderLineA] = useState(false);
  const [showHeaderLineB, setShowHeaderLineB] = useState(false);
  const [showHeaderLineC, setShowHeaderLineC] = useState(false);
  const [showAddButton, setShowAddButton] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showGridListButton, setShowGridListButton] = useState(false);
  const gridviewColume = "gap-2 2xl:grid-cols-3 min-[1200px]:grid-cols-2 min-[768px]:grid-cols-2 min-[640px]:grid-cols-1";

  const view = useSelector((state) => state.pageHeader.view);
  const { data: approvelAlertData } = useApprovelAlertQuery();

  const filtered = approvelAlertData.data.filter(item => item.workflow_request_type === value);
  console.log(filtered);

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
    { name: "Users Requisitions List", url: "/dashboard/users_requisitions_list" },
  ];

  return (
    <div className="p-4 pl-8 border-gray-200 rounded-lg subcontent dark:border-gray-700 mt-10">
        <PageHeader 
          HeaderIcon={
            <VscGitPullRequestGoToChanges className="mr-3 font-semibold text-gray-700 dark:text-white text-[25px]" />
          }
          menuPath={menuPath}
          headerTitle={value}
          headerDescription="Manage all your existing workflows or add  new workflows"
          headerButtonText="Add new workflow"
          form={form}
          // You can hide the component related to that option in the page header by uncommenting the option below
          showHeaderLineA={showHeaderLineA}
          // showHeaderLineB={showHeaderLineB}
          // showHeaderLineC={showHeaderLineC}
          showAddButton={showAddButton}
          // showSearchBar={showSearchBar} 
          // showGridListButton={showGridListButton}
          Searchplaceholder="search requested user name"
        />
        {view === "list" ? (
          <PageListView 
            component={UsersRequisitionsListTable}
            data={filtered}
          />
        ) : (
          <PageGridView
            component={UsersRequisitionsGridComponent}
            gridcolume={gridviewColume}
            data={filtered}
            icon={
              <VscGitPullRequestGoToChanges className="mr-3 font-semibold text-gray-700 dark:text-white text-[40px]" />
            }
          />
        )}
    </div>
  );
}