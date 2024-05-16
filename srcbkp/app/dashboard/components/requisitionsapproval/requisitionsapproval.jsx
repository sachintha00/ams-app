'use client'
import React, { useEffect, useState } from 'react';
import { useRequestTypesQuery, useRequestTypesWorkflowsMutation, useSubmitRequisitionApprovelMutation, useWorkflowAprovelListMutation } from "@/app/_lib/redux/features/requisitionsapproval/requisitionsapproval_api";
import { renderFormData } from "./renderFormData";
import { Requtionworkflow } from "./requtionworkflow";
import Select from 'react-select';
import CustomOption from './components/customOption';

export default function Requisitionsapproval  ({ formData, modelData, requestType })  {
    const [workflow, setWorkflow] = useState([]);
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
            } catch (error) {
                console.error("Error adding new node:", error);
            }
        };

        fetchData();
    }, [requestType, requestTypesWorkflows]);

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

    // get workflow Aprovel List
    const [workflowAprovelList] = useWorkflowAprovelListMutation();

    const sendSelectedWorkflowToApi = async (value) => {
        try {
            const variable = {
                value: 200
            }
            setWorkflowId(value);
            const workflowData = { workflow_id: value, variable_values: variable };
            console.log(workflowData);
            workflowAprovelList(workflowData)
              .unwrap()
              .then((response) => {
                const workflowlist = organizationTableDataToTreeStructure(response.data);
                setworkflowllist(workflowlist);
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

    const [options, setOptions] = useState([]);

    useEffect(() => {
      const data = {
        "data": [
          {
            "status": "success",
            "id": 37,
            "parent_id": 0,
            "type": "WORKFLOW",
            "data": {
              "type": "SINGLE",
              "designation": "HR Manager",
              "users": [
                {
                  "id": 22,
                  "name": "sachintha new",
                  "profile_image": null
                },
                {
                  "id": 20,
                  "name": "supun",
                  "profile_image": null
                }
              ],
              "condition": false,
              "behaviourType": "DESIGNATION",
              "isConditionResult": false
            }
          }
        ]
      };
  
      const users = data.data[0].data.users;
      const transformedOptions = users.map(user => ({
        value: user.id,
        label: user.name,
        image: user.profile_image || '/avater.png'
      }));
  
      setOptions(transformedOptions);
    }, []);

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
                                    <select
                                    id="countries"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    onChange={handleWorkflowChange}
                                    >   
                                            <option value="">Choose a workflows</option>
                                            {workflow.map(workflow => (
                                                <option key={workflow.workflow_id} value={workflow.workflow_id}>{workflow.workflow_name}</option>
                                            ))}
                                    </select>
                                </div>
                                <div className='mb-6'>
                                    <label
                                        htmlFor="user_name"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        user for designation
                                    </label>
                                    <Select
                                        options={options}
                                        getOptionLabel={(option) => option.label}
                                        getOptionValue={(option) => option.value}
                                        components={{ Option: CustomOption }}
                                    />
                                </div>
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