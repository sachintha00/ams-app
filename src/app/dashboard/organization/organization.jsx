"use client";
import React, { useEffect, useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { SiAwsorganizations } from "react-icons/si";
import { FaPlus } from "react-icons/fa";
import { Formik, Form, Field } from "formik";
import Image from "next/image";
import DummyDP from "../../_lib/assets/images/dummy_dp_organization.png";
import {
  useAddNewNodeToOrganizationMutation,
  useGetOrganizationListQuery,
} from "@/app/_lib/redux/features/organization/organizationApi";
import { organizationTableDataToTreeStructure } from "@/app/_lib/helpers/TableDataToTreeStructure";
import { MdOutlineArrowDropDownCircle } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function Organization() {
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

  const onSubmithandler = async (values, actions) => {
    try {
      const nodeData = {
        parent_node_id: newNodeData.id || 0,
        level: newNodeData.level + 1 || 1,
        data: {
          organizationName: values.organizationName,
          organizationDescription: values.organizationDescription,
          telephoneNumber: values.telephoneNumber,
          address: values.address,
          email: values.email,
          website: values.website,
        },
      };
      await addNewNodeToOrganization(nodeData);
      closeAddFormModal();
      await refetch();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const nodeStyle = {
    width: "350px",
    borderRadius: "5px",
    display: "inline-block",
  };

  const renderTree = (node) => {
    const isExpanded = expandedNodes[node.id];
    return (
      <TreeNode
        key={node.id}
        label={
          <div
            style={nodeStyle}
            className="text-gray-700 bg-white border border-[#2563eb] relative z-0"
          >
            <div className="w-full p-2 text-white bg-blue-600 border-b-2 border-blue-600">
              {node.organizationData.organizationName}
            </div>
            <div className="grid grid-cols-3 gap-2 p-2 mb-5">
              <div className="flex flex-row items-start justify-center">
                <Image src={DummyDP} width={55} height={55} alt="image" />
              </div>
              <div className="grid w-full col-span-2 grid-rows-2">
                <p className="flex flex-col items-center justify-center">
                  <span className="mr-2 font-bold">Descript:</span>
                  {node.organizationData.organizationDescription}
                </p>
              </div>
            </div>
            <div className="flex flex-row-reverse items-end m-5 justify-normal">
              <button onClick={() => openAddFormModal(node)} className="ml-3">
                <FaPlus />
              </button>
              <button onClick={() => openAddFormModal(node)} className="ml-3">
                <GrUpdate />
              </button>
              {Object.keys(node.children).length === 0 && (
                <button onClick={() => openAddFormModal(node)} className="ml-3">
                  <RiDeleteBin6Line />
                </button>
              )}
            </div>
            <div className="absolute left-0 right-0 -bottom-[25px] z-10">
              {node.children && Object.keys(node.children).length !== 0 && (
                <button onClick={() => toggleNode(node.id)}>
                  {isExpanded ? (
                    <div className="z-50 bg-white">
                      <MdOutlineArrowDropDownCircle className="text-4xl rotate-180" />
                    </div>
                  ) : (
                    <div className="z-50 bg-white">
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

  const openAddFormModal = (value) => {
    setIsOpenAddFormModel(true);
    setNewNodeData(value);
    console.log(value);
  };

  const closeAddFormModal = () => {
    setIsOpenAddFormModel(false);
  };

  return (
    <div className="p-4 pl-8 border-gray-200 rounded-md subcontent dark:border-gray-700">
      <div className="flex items-center justify-center rounded bg-white dark:bg-[#121212]">
        <div className="w-[-webkit-fill-available]">
          <div className="overflow-hidden bg-white sm:rounded-md dark:bg-[#121212]">
            <div className="flex-row items-center justify-between py-2 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                  <li className="inline-flex items-center">
                    <a
                      href="#"
                      className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                    >
                      <svg
                        className="w-3 h-3 me-2.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                      </svg>
                      Home
                    </a>
                  </li>
                  <li aria-current="page">
                    <div className="flex items-center">
                      <svg
                        className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="m1 9 4-4-4-4"
                        />
                      </svg>
                      <span className="text-sm font-medium text-gray-500 ms-1 md:ms-2 dark:text-gray-400">
                        Organization
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>
            </div>
            <div className="flex-row items-center justify-between py-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
              <div>
                <div className="flex items-center">
                  <SiAwsorganizations className="mr-3 font-semibold text-gray-700 dark:text-white text-[25px]" />
                  <h3 className="mr-3 font-semibold text-gray-700 dark:text-white text-[25px]">
                    Organization
                  </h3>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Manage all your existing users or add a new one
                </p>
              </div>

              {/* Modal */}
              {isOpenAddForm && (
                <div
                  className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full"
                  style={{ marginLeft: 0 }}
                >
                  <div className="absolute w-full h-full bg-gray-900 opacity-50"></div>
                  <div className="z-50 w-1/2 p-6 bg-white rounded-md">
                    {/* Modal header */}
                    <div className="flex items-center justify-between p-4 border-b rounded-md md:p-5 dark:border-gray-600">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Add Organization Entity
                      </h3>
                      <button
                        type="button"
                        onClick={closeAddFormModal}
                        className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-transparent rounded-md hover:bg-gray-200 hover:text-gray-900 ms-auto dark:hover:bg-gray-600 dark:hover:text-white"
                        data-modal-toggle="crud-modal"
                      >
                        <svg
                          className="w-3 h-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 14"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                          />
                        </svg>
                        <span className="sr-only">Close modal</span>
                      </button>
                    </div>
                    {/* Modal body */}
                    <Formik
                      initialValues={{
                        organizationName: "",
                        organizationDescription: "",
                        telephoneNumber: "",
                        address: "",
                        email: "",
                        website: "",
                      }}
                      // validationSchema={SignInSchema}
                      onSubmit={onSubmithandler}
                    >
                      {({ isSubmitting }) => (
                        <Form className="p-4 md:p-5">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="col-span-2">
                              <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Organization Level
                              </label>
                              <Field
                                type="text"
                                name="organizationLevel"
                                disabled
                                id="name"
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md  block w-full p-2.5 "
                                value={newNodeData.level + 1 || 1}
                              />
                            </div>
                            <div className="col-span-2">
                              <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Organization Name
                              </label>
                              <Field
                                type="text"
                                name="organizationName"
                                id="name"
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Organization Name"
                              />
                            </div>
                            <div className="col-span-2">
                              <label
                                htmlFor="description"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Organization Description
                              </label>
                              <Field
                                id="description"
                                rows={4}
                                name="organizationDescription"
                                className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Organization Description"
                              />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                              <label
                                htmlFor="price"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Telephone Number
                              </label>
                              <Field
                                type="number"
                                name="telephoneNumber"
                                id="price"
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Telephone Number"
                              />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                              <label
                                htmlFor="price"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Address
                              </label>
                              <Field
                                type="text"
                                name="address"
                                id="price"
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Address"
                              />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                              <label
                                htmlFor="price"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Email
                              </label>
                              <Field
                                type="text"
                                name="email"
                                id="price"
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Email"
                              />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                              <label
                                htmlFor="price"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Website
                              </label>
                              <Field
                                type="text"
                                name="website"
                                id="price"
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Website"
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          >
                            Save
                          </button>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center my-5 bg-white dark:bg-[#1e1e1e] tablelist">
        <div className="overflow-x-auto w-[-webkit-fill-available]">
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
                    className="text-gray-700 bg-white border border-[#2563eb]"
                  >
                    <div className="w-full p-2 text-white bg-blue-600 border-b-2 border-blue-600">
                      {
                        organizationTreeStructureData?.organizationData
                          .organizationName
                      }
                    </div>
                    <div className="grid grid-cols-3 gap-2 p-2">
                      <div className="flex flex-row items-start justify-center">
                        <Image
                          src={DummyDP}
                          width={55}
                          height={55}
                          alt="image"
                        />
                      </div>
                      <div className="grid w-full col-span-2 grid-rows-2">
                        <p className="flex flex-col items-center justify-center">
                          <span className="mr-2 font-bold">Descript:</span>
                          <span>
                            {
                              organizationTreeStructureData?.organizationData
                                .organizationDescription
                            }
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row-reverse items-end m-5 justify-normal">
                      <button
                        onClick={() =>
                          openAddFormModal(organizationTreeStructureData)
                        }
                      >
                        <FaPlus />
                      </button>
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
                  <div>
                    <button
                      type="button"
                      onClick={openAddFormModal}
                      className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-md bg-[#3b82f6] hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                    >
                      Add new
                    </button>
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
