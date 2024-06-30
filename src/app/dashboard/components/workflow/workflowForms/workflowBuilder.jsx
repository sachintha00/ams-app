import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { useUserRetrieveFromQuerySearchMutation } from "@/app/_lib/redux/features/user/user_api";
import SelectedUsers from "./components/selectedUsers";
import SelectField from "./components/selectField";
import {
  useAddWorkflowOrConditionNodeMutation,
  useDesignationsRetrieveFromQuerySearchMutation,
  useGetworkflowDetailsListQuery,
} from "@/app/_lib/redux/features/workflow/workflowApi";
import SelectDesignations from "./components/selectDesignations";

function WorkflowBuilder({ node, workflowId }) {
  const { refetch } = useGetworkflowDetailsListQuery(workflowId);
  const [addWorkflowOrConditionNode] = useAddWorkflowOrConditionNodeMutation();
  const [isWorkflowBehaviourTypeAdded, setIsWorkflowBehaviourTypeAdded] = useState(false);

  const [userRetrieveFromQuerySearch, { data: userData, isLoading, isSuccess }] = useUserRetrieveFromQuerySearchMutation();
  const [designationsRetrieveFromQuerySearch, { data: designationData, isLoading: designationIsLoading, isSuccess: designationIsSuccess }] = useDesignationsRetrieveFromQuerySearchMutation();

  const [users, setUsers] = useState([]);
  const [designations, setDesignations] = useState([]);

  const [selectedEmployees, setSelectedEmployees] = useState({
    behaviourType: "",
    condition: false,
    isConditionResult: false,
    type: "",
    users: [],
  });

  const [selectedDesignation, setSelectedDesignation] = useState({
    behaviourType: "",
    condition: false,
    isConditionResult: false,
    type: "",
    designations: [],
  });

  const [Query, setQuery] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setUsers(userData?.data);
    }

    if (designationIsSuccess) {
      setDesignations(designationData?.data);
    }
  }, [isSuccess, userData, designationData, designationIsSuccess]);

  const handleSelectChange = (setState, setValue) => (e) => {
    const selectedValue = e.target.value;
    setState(
      selectedValue === "CREATE_WORKFLOW" ||
      selectedValue === "EMPLOYEE" ||
      selectedValue === "DESIGNATION"
    );
    setValue(selectedValue);
  };

  return (
    <Formik
      initialValues={{
        selectBehaviourType: "",
        selectSearch: "",
      }}
      onSubmit={async (values, actions) => {
        const { selectBehaviourType } = values;

        const nodeData = {
          workflow_id: node?.workflow_id || workflowId,
          workflow_detail_parent_id: node?.workflow_detail_id || 0,
          workflow_detail_type_id: 1,
          workflow_detail_behavior_type_id: 1,
          workflow_detail_order: (node?.workflow_detail_order || 0) + 1,
          workflow_detail_level: (node?.workflow_detail_level || 0) + 1,
          workflow_detail_data_object: [
            {
              behaviourType: selectBehaviourType,
              condition: false,
              type: selectBehaviourType === "EMPLOYEE" ? selectedEmployees.type : selectedDesignation.type,
              ...(selectBehaviourType === "EMPLOYEE"
                ? { users: selectedEmployees.users }
                : selectBehaviourType === "DESIGNATION"
                && { designation: selectedDesignation.designations }
              ),
              isConditionResult: false,
            },
          ],
        };

        const result = await addWorkflowOrConditionNode(nodeData);

        if (result.error) {
          console.error("Error adding workflow node:", result.error);
        } else {
          console.log("Workflow node added successfully:", result.data);
          refetch();
        }
      }}
    >
      {({ values, setFieldValue }) => {
        const handleSearchInput = (e) => {
          setQuery(e.target.value);
          if (e.target.name === "selectSearch") {
            if (values.selectBehaviourType === "EMPLOYEE") {
              userRetrieveFromQuerySearch({ query: e.target.value, page: 1 });
            } else if (values.selectBehaviourType === "DESIGNATION") {
              designationsRetrieveFromQuerySearch({ query: e.target.value });
            }
          }
        };

        return (
          <Form className="p-4 md:p-5">
            <div className="grid grid-cols-1 gap-10 mb-4 text-black">
              <div className="">
                <h1 className="mb-5 text-xl">When Conditions are ?</h1>

                <SelectField
                  label="Select"
                  name="selectBehaviourType"
                  value={values.selectBehaviourType}
                  options={[
                    { label: "Employee", value: "EMPLOYEE" },
                    { label: "Designation", value: "DESIGNATION" },
                  ]}
                  onChange={handleSelectChange(
                    setIsWorkflowBehaviourTypeAdded,
                    (value) => setFieldValue("selectBehaviourType", value)
                  )}
                />
                {isWorkflowBehaviourTypeAdded && values.selectBehaviourType === 'EMPLOYEE' ? (
                  <SelectedUsers
                    selected={selectedEmployees}
                    setSelected={setSelectedEmployees}
                    setFieldValue={setFieldValue}
                    handleSearchInput={handleSearchInput}
                    query={Query}
                    users={users}
                    inputTagName="selectSearch"
                    gridCols={4}
                  />
                ) : isWorkflowBehaviourTypeAdded && values.selectBehaviourType === 'DESIGNATION' && (
                  <SelectDesignations
                    selected={selectedDesignation}
                    setSelected={setSelectedDesignation}
                    setFieldValue={setFieldValue}
                    handleSearchInput={handleSearchInput}
                    query={Query}
                    designations={designations}
                    inputTagName="selectSearch"
                    gridCols={4}
                  />
                )}
              </div>
            </div>
            <button
              type="submit"
              className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-20 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Save
            </button>
          </Form>
        );
      }}
    </Formik>
  );
}

export default WorkflowBuilder;
