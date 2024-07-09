'use client'
import React, { useEffect, useState } from 'react';
import { useGetFirstApruvelMutation, useRequestTypesQuery, useRequestTypesWorkflowsMutation, useSubmitRequisitionApprovelMutation, useWorkflowAprovelListMutation } from "@/app/_lib/redux/features/requisitionsapproval/requisitionsapproval_api";
import { renderFormData } from "./renderFormData";
import { Requtionworkflow } from "./requtionworkflow";
import Select from 'react-select';
import CustomOption from './components/customOption';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { FaUserTie, FaUsers } from "react-icons/fa6";
import CustomWorkflowOption from './components/customWorkflowOption';

export default function Requisitionsapproval  ({ formData, modelData, requestType })  {
    const [workflow, setWorkflow] = useState([]);
    const [mapWorkflow, setMapWorkflow] = useState([]);
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [workflowId, setWorkflowId] = useState('');
    const userId = 11;

    // request Workflows
    const [requestTypesWorkflows] = useRequestTypesWorkflowsMutation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(requestType);
                const response = await requestTypesWorkflows(requestType).unwrap();
                console.log(response.data);
                setWorkflow(response.data);
                const workflow = response.data;
                const mappedworkflow = workflow.map(workflow => ({
                    value: workflow.workflow_id,
                    label: workflow.workflow_name
                }));
                console.log(mappedworkflow);
                setMapWorkflow(mappedworkflow);
            } catch (error) {
                console.error("Error adding new node:", error);
            }
        };

        fetchData();
    }, [requestType, requestTypesWorkflows]);

    // select Workflow
    const handleWorkflowChange = (selectedOption) => {
        const selectedValue = selectedOption ? selectedOption.value : "";
        console.log(selectedValue);
        if (selectedValue === "") {
            setShowSubmitButton(false);
        } else {
            sendSelectedWorkflowToApi(selectedValue);
            setShowSubmitButton(true);
        }
    };


    // worlflow three
    const [workflowllist, setworkflowllist] = useState([]);

    function buildTree(data, parentId = 0) {
        const children = data.filter((node) => node.parent_id === parentId);
      
        return children.map((child) => ({
          id: child.id,
          status: child.status,
          parentNode: parentId,
          type: child.type,
          data: child.data,
          children: buildTree(data, child.id), 
        }));
      }
      
    const organizationTableDataToTreeStructure = (organizationData) => {
        const transformedData = buildTree(organizationData);
        return transformedData.length > 0 ? transformedData[0] : null;
    };

    // get workflow first Aprovel
    const [workflowlFirstApruvel, setworkflowlFirstApruvel] = useState([]);
    const [getFirstApruvel] = useGetFirstApruvelMutation();

    const sendSelectedWorkflowToApi = async (value) => {
        try {
            const variable = {
                value: 160
            }
            setWorkflowId(value);
            const workflowData = { workflow_id: value, variable_values: variable };
            console.log(workflowData);
            getFirstApruvel(workflowData)
              .unwrap()
              .then((response) => {
                setworkflowlFirstApruvel(response.data[0]);
                const workflowlist = organizationTableDataToTreeStructure(response.workflow_data);
                setworkflowllist(workflowlist);
              })
              .catch((error) => {
                console.error("Error adding new node:", error);
              });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    console.log(workflowllist);
    //if have singale designation
    const [mappedUsersArray, setMappedUsersArray] = useState([]);

    useEffect(() => {
        if (workflowlFirstApruvel && workflowlFirstApruvel.data) {
            const users = workflowlFirstApruvel.data.users || [];
            const mappedUsers = users.map(user => ({
                value: user.id,
                label: user.name,
                image: user.profile_image || '/avater.png'
            }));
            setMappedUsersArray(mappedUsers);
        }
    }, [workflowlFirstApruvel]);

    console.log(workflowlFirstApruvel.data);

    //submit approvel Requisition
    const [submitRequisitionApprovel] = useSubmitRequisitionApprovelMutation();

    // Submit From
    const submitRequisitionApprovelForm = async (e) => {
        e.preventDefault();

        try {
        const requisitionApprovelData = { user_id: userId, workflow_request_type_id: requestType, workflow_id: workflowId, requisition_data_object: formData };
        console.log(requisitionApprovelData);
        submitRequisitionApprovel(requisitionApprovelData)
            .unwrap()
            .then((response) => {
            console.log("New node added:", response);
            // router.push("/dashboard/usergroups");
            })
            .catch((error) => {
            console.error("Error adding new node:", error);
            });
        } catch (error) {
        console.error("Login error:", error);
        }
    };

    const handleselectWorkflowChange = (selectedOption) => {
        const selectedValue = selectedOption ? selectedOption.value : "";
        console.log(selectedValue);
      };

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
                                        Workflows
                                    </label>
                                    <Select
                                        options={mapWorkflow}
                                        getOptionLabel={(option) => option.label}
                                        getOptionValue={(option) => option.value}
                                        components={{ Option: CustomWorkflowOption }}
                                        onChange={handleWorkflowChange}
                                    />
                                </div>
                                {workflowlFirstApruvel && workflowlFirstApruvel.data && (
                                    <TransitionGroup>
                                        {workflowlFirstApruvel.behaviourtype === 'DESIGNATION' && workflowlFirstApruvel.type === 'SINGLE' && (
                                            <CSSTransition key="designation" timeout={300} classNames={{
                                                enter: 'transition-opacity duration-300 ease-in-out opacity-0 transform translate-y-4',
                                                enterActive: 'opacity-100 transform translate-y-0',
                                                exit: 'transition-opacity duration-300 ease-in-out opacity-100 transform translate-y-0',
                                                exitActive: 'opacity-0 transform translate-y-4'
                                            }}>
                                                <div className='mb-6'>
                                                    <label
                                                        htmlFor="user_name"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        User for designation
                                                    </label>
                                                    <Select
                                                        options={mappedUsersArray}
                                                        getOptionLabel={(option) => option.label}
                                                        getOptionValue={(option) => option.value}
                                                        components={{ Option: CustomOption }}
                                                        onChange={handleselectWorkflowChange}
                                                    />
                                                </div>
                                            </CSSTransition>
                                        )}
                                        {workflowlFirstApruvel.behaviourtype === 'DESIGNATION' && workflowlFirstApruvel.type === 'POOL' && (
                                            <>
                                                <CSSTransition timeout={300} classNames={{
                                                    enter: 'transition-opacity duration-300 ease-in-out opacity-0 transform translate-y-4',
                                                    enterActive: 'opacity-100 transform translate-y-0',
                                                    exit: 'transition-opacity duration-300 ease-in-out opacity-100 transform translate-y-0',
                                                    exitActive: 'opacity-0 transform translate-y-4'
                                                }}>
                                                    <div className='mb-6'>
                                                        <label
                                                            htmlFor="user_name"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Workflow First Approver
                                                        </label>
                                                        <div className="max-w-sm mx-auto bg-white dark:bg-[#3c4042] rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                                                            <div className="md:flex">
                                                                <div className="flex items-center justify-center m-3">
                                                                    <div className="flex justify-center items-center w-12 h-12 rounded-full shadow-lg dark:bg-[#606368]">
                                                                        <FaUserTie className='text-[20px] dark:text-white'/>
                                                                    </div>
                                                                </div>
                                                                <div className="flex item-center p-3">
                                                                    <div className="flex items-center tracking-wide text-sm text-black dark:text-white font-semibold">
                                                                     Designation Pool
                                                                    </div>
                                                                    {/* <p className="mt-2 text-gray-500">
                                                                        This is a brief description or any additional information about the user. You can customize this text as needed.
                                                                    </p> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CSSTransition>
                                            </>
                                        )}
                                        {workflowlFirstApruvel.behaviourtype === 'EMPLOYEE' && workflowlFirstApruvel.type === 'SINGLE' && (
                                            <>
                                            {workflowlFirstApruvel.data.map(Users => (
                                                <CSSTransition key={Users.id} timeout={300} classNames={{
                                                    enter: 'transition-opacity duration-300 ease-in-out opacity-0 transform translate-y-4',
                                                    enterActive: 'opacity-100 transform translate-y-0',
                                                    exit: 'transition-opacity duration-300 ease-in-out opacity-100 transform translate-y-0',
                                                    exitActive: 'opacity-0 transform translate-y-4'
                                                }}>
                                                    <div className='mb-6'>
                                                        <label
                                                            htmlFor="user_name"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Workflow First Approver
                                                        </label>
                                                        <div className="max-w-sm mx-auto bg-white dark:bg-[#3c4042] rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                                                            <div className="md:flex">
                                                                <div className="flex items-center justify-center m-3">
                                                                    <img
                                                                        className="w-12 h-12 rounded-full shadow-lg"
                                                                        src="/avater.png"
                                                                        alt="Bonnie image"
                                                                    />
                                                                </div>
                                                                <div className="flex item-center p-3">
                                                                    <div className="flex items-center tracking-wide text-sm text-black dark:text-white font-semibold">
                                                                        {Users.name}
                                                                    </div>
                                                                    {/* <p className="mt-2 text-gray-500">
                                                                        This is a brief description or any additional information about the user. You can customize this text as needed.
                                                                    </p> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CSSTransition>
                                            ))}
                                            </>
                                        )}
                                        {workflowlFirstApruvel.behaviourtype === 'EMPLOYEE' && workflowlFirstApruvel.type === 'POOL' && (
                                            <>
                                                <CSSTransition timeout={300} classNames={{
                                                    enter: 'transition-opacity duration-300 ease-in-out opacity-0 transform translate-y-4',
                                                    enterActive: 'opacity-100 transform translate-y-0',
                                                    exit: 'transition-opacity duration-300 ease-in-out opacity-100 transform translate-y-0',
                                                    exitActive: 'opacity-0 transform translate-y-4'
                                                }}>
                                                    <div className='mb-6'>
                                                        <label
                                                            htmlFor="user_name"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Workflow First Approver
                                                        </label>
                                                        <div className="max-w-sm mx-auto bg-white dark:bg-[#3c4042] rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                                                            <div className="md:flex">
                                                                <div className="flex items-center justify-center m-3">
                                                                    <div className="flex justify-center items-center w-12 h-12 rounded-full shadow-lg dark:bg-[#606368]">
                                                                        <FaUsers className='text-[20px] dark:text-white'/>
                                                                    </div>
                                                                </div>
                                                                <div className="flex item-center p-3">
                                                                    <div className="flex items-center tracking-wide text-sm text-black dark:text-white font-semibold">
                                                                        Employee Pool
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CSSTransition>
                                            </>
                                        )}
                                    </TransitionGroup>
                                )}
                                {showSubmitButton && (
                                    <div>
                                        <div className="flex space-x-4 p-6 overflow-x-scroll mb-6">
                                            {workflowllist ? <Requtionworkflow node={workflowllist} /> : <p>Loading...</p>}
                                        </div>
                                        <div className="grid gap-6 mb-6 md:grid-cols-2 w-[40%]">
                                            <button
                                                className="text-white bg-[#213389] hover:bg-[#213389] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-[#213389] dark:hover:bg-[#213389] dark:focus:ring-blue-800"
                                                onClick={submitRequisitionApprovelForm}
                                             >
                                                Submit
                                            </button>
                                        </div>
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