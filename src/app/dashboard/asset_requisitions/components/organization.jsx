"use client";
import React, { useEffect, useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { SiAwsorganizations } from "react-icons/si";
import { FaPlus } from "react-icons/fa";
import { Formik, Form, Field } from "formik";
import Image from "next/image";
import {
  useAddNewNodeToOrganizationMutation,
  useGetOrganizationListQuery,
} from "@/app/_lib/redux/features/organization/organizationApi";
import { organizationTableDataToTreeStructure } from "@/app/_lib/helpers/TableDataToTreeStructure";
import { MdOutlineArrowDropDownCircle } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getorganizationid } from "@/app/_lib/redux/features/assestrequisition/organization_slice";

export default function Organization() {

  const usedispatch = useDispatch();

  const [addNewNodeToOrganization] = useAddNewNodeToOrganizationMutation();
  const {
    data: organizationDataList,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetOrganizationListQuery();
  const [isOpenAddForm, setIsOpenAddFormModel] = useState(false);
  const [newNodeData, setNewNodeData] = useState({});
  const [expandedNodes, setExpandedNodes] = useState({});
  const [organizationTreeStructureData, setOrganizationTreeStructureData] =
    useState();

  const organizationHandler = () => {
    if (isError) {
      console.log(`Error: ${error}`);
    }

    if (organizationDataList?.data) {
      setOrganizationTreeStructureData(
        organizationTableDataToTreeStructure(organizationDataList.data)
      );
    } else {
      console.log("organizationDataList or its data property is undefined");
    }
  };

  useEffect(() => {
    organizationHandler();
  }, [organizationDataList, isLoading, isError, error]);

  const toggleNode = (nodeId) => {
    setExpandedNodes((prevState) => ({
      ...prevState,
      [nodeId]: !prevState[nodeId],
    }));
    console.log(expandedNodes);
  };

  const nodeStyle = {
    width: "90px",
    borderRadius: "5px",
    display: "inline-block",
  };

  const handleToggle = (nodeid) => {
      usedispatch(getorganizationid(nodeid));
      // Call the onToggleStatus function passed from the parent component
  };

  const organizationid = useSelector((state) => state.organization);

  const renderTree = (node) => {
    const isExpanded = expandedNodes[node.id];
    return (
      <TreeNode
        key={node.id}
        label={
          <div
            style={nodeStyle}
            className="text-gray-700 bg-white border border-[#2563eb] relative z-0 dark:bg-[#3c4042]"
          >
            <div className="flex gap-2 p-2 justify-center items-center">
              <div className="dark:text-white">
                {node.organizationData.organizationName}
              </div>
              <input
                id="checked-checkbox"
                type="checkbox"
                checked={organizationid === node.id}
                onChange={() => handleToggle(node.id)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
              />
            </div>
            <div className="absolute left-0 right-0 -bottom-[35px] z-10">
              {node.children && Object.keys(node.children).length !== 0 && (
                <button onClick={() => toggleNode(node.id)} className="z-50">
                  {isExpanded ? (
                    <div className="z-50 bg-white rounded-3xl">
                      <MdOutlineArrowDropDownCircle className="text-4xl rotate-180" />
                    </div>
                  ) : (
                    <div className="z-50 bg-white rounded-3xl">
                      <MdOutlineArrowDropDownCircle className="text-4xl" />
                    </div>
                  )}
                </button>
              )}
            </div>
          </div>
        }
      >
        {isExpanded &&
          node.children &&
          node.children.map((child) => renderTree(child))}
      </TreeNode>
    );
  };

  return (
    <div className="border-gray-200 rounded-md dark:border-gray-700">
      <div className="flex items-center justify-center bg-gray-50 dark:bg-[#1e1e1e] tablelist">
        <div className="w-[-webkit-fill-available]">
          <div className="p-8">
            {organizationTreeStructureData ? (
              <Tree
                lineWidth={"1px"}
                lineHeight={"50px"}
                lineColor={"#2563eb"}
                lineBorderRadius={"2px"}
                label={
                  <div
                    style={nodeStyle}
                    className="text-gray-700 bg-white border border-[#2563eb] dark:bg-[#3c4042]"
                  >
                    <div className="flex gap-2 p-2 justify-center items-center">
                      <div className="dark:text-white">
                        {
                          organizationTreeStructureData?.organizationData
                            .organizationName
                        }
                      </div>
                      <input
                        id="checked-checkbox"
                        type="checkbox"
                        checked={organizationid === organizationTreeStructureData?.id}
                        onChange={() => handleToggle(organizationTreeStructureData?.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                    </div>
                  </div>
                }
              >
                {organizationTreeStructureData?.children.map((child) =>
                  renderTree(child)
                )}
              </Tree>
            ) : (
              <div class="flex justify-center">
                <div class="flex flex-col items-center justify-center text-black">
                  <div class="flex items-center justify-center w-20 h-20 rounded-full bg-blue-200">
                    <SiAwsorganizations width={60} height={60} />
                  </div>
                  <div className="flex flex-col items-center m-4 w-[380px]">
                    <p className="text-lg text-center">
                      No origanization view found
                    </p>
                    <p className="text-center text-gray-600 text-md">
                      No organizations are currently available. You can add a
                      new organization to get started.
                    </p>
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
