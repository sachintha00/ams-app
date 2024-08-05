'use client'
import React, { useEffect, useState } from 'react';
import { useRequestTypesQuery, useRequestTypesWorkflowsMutation, useSubmitRequisitionApprovelMutation, useWorkflowAprovelListMutation } from "@/app/_lib/redux/features/requisitionsapproval/requisitionsapproval_api";
import { renderFormData } from "./renderFormData";

export default function Requisitionsapproval  ({ formData, modelData })  {
    const [requestTypes, setRequestTypes] = useState([]);
    const [workflow, setWorkflow] = useState([]);
    const [showWorkflowSelect, setShowWorkflowSelect] = useState(false);
    const [showSubmitButton, setShowSubmitButton] = useState(false);

    const {
        data: Requesttypes,
        isLoading,
        isError,
        error,
        refetch,
        } = useRequestTypesQuery();

    useEffect(() => {
        if (!isLoading && !isError && Requesttypes) {

            const Request_types = Object.values(Requesttypes.data);
            setRequestTypes(Request_types);
        }
    }, [isLoading, isError, Requesttypes, refetch]);

    //select Requisition Type
    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        if (selectedValue === "") {
            setShowWorkflowSelect(false);
            setWorkflow([]);
        } else {
            sendSelectedValueToApi(selectedValue);
        }
    };

    // request Workflows
    const [requestTypesWorkflows] = useRequestTypesWorkflowsMutation();

    const sendSelectedValueToApi = async (value) => {
        try {
            console.log(value);
            requestTypesWorkflows(value)
            .unwrap()
            .then((response) => {
                console.log(response.data);
                setWorkflow(response.data);
                setShowWorkflowSelect(true);
            })
            .catch((error) => {
                console.error("Error adding new node:", error);
                setUserDeleteError(error);
                const timer = setTimeout(() => {
                    setUserDeleteError('');
                }, 5000); // Adjust the duration (in milliseconds) as needed
                return () => clearTimeout(timer);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // select Workflow
    const handleWorkflowChange = (event) => {
        const selectedValue = event.target.value;
        console.log(selectedValue);
        if (selectedValue === "") {
            setShowSubmitButton(false);
        } else {
            sendSelectedWorkflowToApi(selectedValue);
            setShowSubmitButton(true);
        }
    };

    // add role
    const [workflowAprovelList] = useWorkflowAprovelListMutation();

    const sendSelectedWorkflowToApi = async (value) => {
        try {
            const variable = {
                value: 200
            }
            const workflowData = { workflow_id: value, variable_values: variable };
            console.log(workflowData);
            workflowAprovelList(workflowData)
              .unwrap()
              .then((response) => {
                console.log(response.data);
              })
              .catch((error) => {
                console.error("Error adding new node:", error);
              });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    //submit approvel Requisition
    const [submitRequisitionApprovel] = useSubmitRequisitionApprovelMutation();

    return (
        <div>
            <div className="flex items-center mt-[-17px] px-2 pb-2 justify-between border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Assing workflow for your {modelData.modelTopic}
                </h3>
            </div>
            <div className="px-2 pt-2 overflow-y-scroll h-[500px]" style={{ scrollbarWidth: '2px', scrollbarColor:'#888'}}>
                <div className="grid gap-6 mb-6">
                    <div className='p-3 dark:border-[#3c4042]'>
                        <div className="grid gap-6 mb-6 md:grid-cols-2">
                            <div className="p-4 rounded-lg dark:bg-[#1e1e1e]">
                            {renderFormData(formData)}
                            </div>
                            <div>
                                    <div className='mb-6'>
                                        <label
                                            htmlFor="user_name"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Requisition Type
                                        </label>
                                        <select
                                        id="countries"
                                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        onChange={handleSelectChange}
                                        >   
                                                <option value="">Choose a Requisition Type</option>
                                                {requestTypes.map(request => (
                                                    <option key={request.id} value={request.id}>{request.request_type}</option>
                                                ))}
                                        </select>
                                    </div>
                                    {showWorkflowSelect && (
                                        <div>
                                            <div className='mb-6'>
                                                <label
                                                    htmlFor="user_name"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Workflows
                                                </label>
                                                <select
                                                id="countries"
                                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                onChange={handleWorkflowChange}
                                                >   
                                                        <option value="">Choose a workflows</option>
                                                        {workflow.map(workflow => (
                                                            <option key={workflow.workflow_id} value={workflow.workflow_id}>{workflow.workflow_name}</option>
                                                        ))}
                                                </select>
                                            </div>
                                            {showSubmitButton && (
                                                <div>
                                                    <div className="flex space-x-4 p-6 overflow-x-scroll mb-6">
                                                        <div id="userprofile1" className="flex items-center space-x-2">
                                                            <div className="p-4 bg-blue-500 text-white rounded-full">UserProfile 1</div>
                                                            <div className="arrow-right" />
                                                        </div>
                                                        <div id="userprofile2" className="flex items-center space-x-2">
                                                            <div className="p-4 bg-blue-500 text-white rounded-full">UserProfile 2</div>
                                                            <div className="arrow-right" />
                                                        </div>
                                                        <div id="userprofile2" className="flex items-center space-x-2">
                                                            <div className="p-4 bg-blue-500 text-white rounded-full">UserProfile 3</div>
                                                            <div className="arrow-right" />
                                                        </div>
                                                        <div id="userprofile10" className="flex items-center space-x-2">
                                                            <div className="p-4 bg-blue-500 text-white rounded-full">UserProfile 4</div>
                                                        </div>
                                                    </div>
                                                    <div className="grid gap-6 mb-6 md:grid-cols-2 w-[40%]">
                                                        <button
                                                            className="text-white bg-[#213389] hover:bg-[#213389] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-[#213389] dark:hover:bg-[#213389] dark:focus:ring-blue-800"
                                                        >
                                                            Submit
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  };