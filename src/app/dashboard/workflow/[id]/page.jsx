"use client";
import React, { useEffect, useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { SiAwsorganizations } from "react-icons/si";
import {
  useAddWorkflowOrConditionNodeMutation,
  useGetworkflowDetailsListQuery,
} from "@/app/_lib/redux/features/workflow/workflowApi";
import { tableDataToTreeStructure } from "@/app/_lib/helpers/WorkflowDataToTreeStructure";
import WorkflowLabelNode from "../../components/workflow/workflowLabelNode";
import WorkflowPopup from "../../components/workflow/workflowPopup";
import { FaPlus } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";
import { COLORS } from "@/app/_lib/constants/colors";
import PopupModel from "../../components/popupModel/popupModel";
import { useSelector } from "react-redux";
import { FORM_TYPE } from "@/app/_lib/constants/formType";
import WorkfloDetailUpdateForm from "../../components/workflow/workflowForms/workfloDetailUpdateForm";
import ConditionUpdateForm from "../../components/workflow/workflowForms/conditionUpdateForm";

export default function Organization({ params }) {
  const { value: workflowPopupFormValue, formType: workflowPopupFormType } =
    useSelector((state) => state.popupModel);
  const {
    data: workflowDataList,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetworkflowDetailsListQuery(params.id);
  const [isOpenAddForm, setIsOpenAddFormModel] = useState(false);
  const [workflowNodeData, setWorkflowNodeData] = useState({});
  const [expandedNodes, setExpandedNodes] = useState({});
  const [workflowTreeStructureData, setWorkflowTreeStructureData] = useState();
  const [formType, setFormType] = useState("");

  const [addWorkflowOrConditionNode] = useAddWorkflowOrConditionNodeMutation();

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const togglePopup = () => {
    openAddFormModal();
  };

  const setType = (type) => {
    setFormType(type);
    togglePopup();
  };

  const organizationHandler = () => {
    if (isError) {
      console.log(`Error: ${error}`);
    }

    if (workflowDataList?.data) {
      setWorkflowTreeStructureData(
        tableDataToTreeStructure(
          workflowDataList.data,
          "workflow_detail_parent_id",
          "workflow_detail_id"
        )
      );
    } else {
      console.log("workflowDataList or its data property is undefined");
    }
  };

  useEffect(() => {
    organizationHandler();
  }, [workflowDataList, isLoading, isError, error]);

  const toggleNode = (nodeId) => {
    setExpandedNodes((prevState) => ({
      ...prevState,
      [nodeId]: !prevState[nodeId],
    }));
    // console.log(expandedNodes);
  };

  const openAddFormModal = (node) => {
    setWorkflowNodeData(node);
    setIsOpenAddFormModel(true);
  };

  const closeAddFormModal = () => {
    setIsOpenAddFormModel(false);
  };

  const renderTree = (node) => {
    // const isExpanded = expandedNodes[node.workflow_detail_id];
    return (
      <TreeNode
        key={node?.workflow_detail_id}
        label={
          <WorkflowLabelNode
            nodeType={node?.workflow_detail_type}
            openAddFormModal={() => openAddFormModal(node)}
            node={node}
            setFormType={setFormType}
            workflowId={params.id}
          />
        }
      >
        {/* {isExpanded &&
          node.children &&
          node.children.map((child) => renderTree(child))
          } */}
        {node.children && node.children.map((child) => renderTree(child))}
      </TreeNode>
    );
  };

  return (
    <div className="p-4 pl-8 border-gray-200 rounded-md subcontent dark:border-gray-700">
      <div className="flex items-center justify-center rounded bg-gray-50 dark:bg-[#121212]">
        <div className="w-[-webkit-fill-available]">
          <div className="overflow-hidden bg-white sm:rounded-md dark:bg-[#121212]">
            <div className="flex-row items-center justify-between py-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
              {/* Modal */}
              {isOpenAddForm && (
                <WorkflowPopup
                  onClose={closeAddFormModal}
                  node={workflowNodeData}
                  type={formType}
                  workflowId={params.id}
                />
              )}
              <PopupModel popupModelTitle="" Form={<div>form</div>} />
              {workflowPopupFormType === FORM_TYPE.UPDATE &&
              workflowPopupFormValue === "WORKFLOW_NODE" ? (
                <PopupModel
                  popupModelTitle="Workflow Update"
                  Form={<WorkfloDetailUpdateForm />}
                />
              ) : (
                workflowPopupFormType === FORM_TYPE.UPDATE &&
                workflowPopupFormValue === "WORKFLOW_CONDITION_NODE" && (
                  <PopupModel
                    popupModelTitle="Workflow Condition Update"
                    Form={<ConditionUpdateForm />}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center my-5 bg-gray-50 dark:bg-[#1e1e1e] tablelist">
        <div className="overflow-x-auto h-[70vh] w-full">
          <div className="p-8">
            {workflowTreeStructureData ? (
              <Tree
                key={workflowTreeStructureData?.workflow_detail_id}
                lineWidth={"1px"}
                lineHeight={"50px"}
                lineColor={COLORS.WORKFLOW_TREE_LINE_COLOR}
                lineBorderRadius={"2px"}
                label={
                  <WorkflowLabelNode
                    nodeType={workflowTreeStructureData?.workflow_detail_type}
                    openAddFormModal={() =>
                      openAddFormModal(workflowTreeStructureData)
                    }
                    node={workflowTreeStructureData}
                    setFormType={setFormType}
                    workflowId={params.id}
                  />
                }
              >
                {workflowTreeStructureData?.children.map((child) =>
                  renderTree(child)
                )}
              </Tree>
            ) : (
              <div className="flex justify-center">
                <div className="flex flex-col items-center justify-center text-black">
                  <div className="flex items-center justify-center w-20 h-20 bg-blue-200 rounded-full">
                    <SiAwsorganizations width={60} height={60} />
                  </div>
                  <div className="flex flex-col items-center m-4 w-[380px]">
                    <p className="text-lg text-center">
                      No workflow view found
                    </p>
                    <p className="text-center text-gray-600 text-md">
                      No workflow are currently available. You can add a new
                      workflow to get started.
                    </p>
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={toggleDropdown}
                      className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-md bg-[#3b82f6] hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                    >
                      Add new
                    </button>
                    {isOpen && (
                      <div
                        className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                        style={{
                          top: "0",
                          left: "-70%",
                          transform: "translateX(100%)",
                        }}
                      >
                        <ul
                          className="py-2 text-sm text-gray-700 dark:text-gray-200"
                          aria-labelledby="dropdownRightEndButton"
                        >
                          <li>
                            <a
                              onClick={() => setType("Workflow")}
                              href="#"
                              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Workflow
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() => setType("ConditionBuilder")}
                              href="#"
                              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Condition
                            </a>
                          </li>
                          <li>
                            <a
                              // onClick={handleApproved}
                              href="#"
                              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Approved
                            </a>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
