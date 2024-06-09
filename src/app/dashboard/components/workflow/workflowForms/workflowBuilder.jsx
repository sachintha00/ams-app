import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { useUserRetrieveFromQuerySearchMutation } from "@/app/_lib/redux/features/user/user_api";
import SelectedUsers from "./components/selectedUsers";
import SelectField from "./components/selectField";
import {
  useAddWorkflowOrConditionNodeMutation,
  useGetworkflowDetailsListQuery,
} from "@/app/_lib/redux/features/workflow/workflowApi";

function WorkflowBuilder({ node, workflowId }) {
  const { refetch } = useGetworkflowDetailsListQuery(workflowId);
  const [addWorkflowOrConditionNode] = useAddWorkflowOrConditionNodeMutation();
  const [isWorkflowBehaviourTypeAdded, setIsWorkflowBehaviourTypeAdded] =
    useState(false);

  const [
    userRetrieveFromQuerySearch,
    { data: userData, isLoading, isSuccess },
  ] = useUserRetrieveFromQuerySearchMutation();
  const [users, setUsers] = useState([]);
  const [selected, setSetSelected] = useState({
    behaviourType: "",
    condition: false,
    isConditionResult: false,
    type: "",
    users: [],
  });

  const [Query, setQuery] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setUsers(userData?.data);
    }
  }, [isSuccess, userData]);

  const handleSelectChange = (setState, setValue) => (e) => {
    const selectedValue = e.target.value;
    setState(
      selectedValue === "CREATE_WORKFLOW" ||
        selectedValue === "EMPLOYEE" ||
        selectedValue === "DESIGNATION"
    );
    setValue(selectedValue);
  };

  const handleSearchInput = (e) => {
    if (e.target.name === "selectSearch") {
      setQuery(e.target.value);
      userRetrieveFromQuerySearch({ query: e.target.value, page: 1 });
    }
  };
  return (
    <Formik
      initialValues={{
        selectBehaviourType: "",
        selectSearch: "",
      }}
      onSubmit={async (values, actions) => {
        const { selectBehaviourType } = values;

        if (node === undefined) {
          const result = await addWorkflowOrConditionNode({
            workflow_id: workflowId,
            workflow_detail_parent_id: 0,
            workflow_detail_type_id: 1,
            workflow_detail_behavior_type_id: 1,
            workflow_detail_order: 1,
            workflow_detail_level: 1,
            workflow_detail_data_object: [
              {
                behaviourType: selectBehaviourType,
                condition: false,
                type: selected.type,
                users: selected.users,
                isConditionResult: false,
              },
            ],
          });

          if (result.error) {
            console.error("Error adding workflow node:", result.error);
          } else {
            console.log("Workflow node added successfully:", result.data);
            refetch();
          }
        } else {
          const result = await addWorkflowOrConditionNode({
            workflow_id: node?.workflow_id,
            workflow_detail_parent_id: node?.workflow_detail_id,
            workflow_detail_type_id: 1,
            workflow_detail_behavior_type_id: 1,
            workflow_detail_order: node?.workflow_detail_order + 1,
            workflow_detail_level: node?.workflow_detail_level + 1,
            workflow_detail_data_object: [
              {
                behaviourType: selectBehaviourType,
                condition: false,
                type: selected.type,
                users: selected.users,
                isConditionResult: false,
              },
            ],
          });

          if (result.error) {
            console.error("Error adding workflow node:", result.error);
          } else {
            console.log("Workflow node added successfully:", result.data);
            refetch();
          }
        }
      }}
    >
      {({ values, setFieldValue }) => (
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
              {isWorkflowBehaviourTypeAdded && (
                <SelectedUsers
                  selected={selected}
                  setSelected={setSetSelected}
                  setFieldValue={setFieldValue}
                  handleSearchInput={handleSearchInput}
                  query={Query}
                  users={users}
                  inputTagName="selectSearch"
                  gridCols={4}
                />
              )}
            </div>
          </div>
          <button
            type="submit"
            // disabled={isSubmitting}
            className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-20 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Save
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default WorkflowBuilder;
