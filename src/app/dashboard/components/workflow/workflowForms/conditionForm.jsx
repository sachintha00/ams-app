import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { useUserRetrieveFromQuerySearchMutation } from "@/app/_lib/redux/features/user/user_api";
import SelectedUsers from "./components/selectedUsers";
import SelectField from "./components/selectField";
import {
  useAddWorkflowOrConditionNodeMutation,
  useGetworkflowDetailsListQuery,
} from "@/app/_lib/redux/features/workflow/workflowApi";
import { createWorkflowForCondition } from "../helpers/createWorkflowForCondition";

export default function ConditionForm({ node, workflowId }) {
  const [isWorkflowAddedFalse, setIsWorkflowAddedFalse] = useState(false);
  const { refetch } = useGetworkflowDetailsListQuery(workflowId);
  const [
    isWorkflowBehaviourTypeAddedFalse,
    setIsWorkflowBehaviourTypeAddedFalse,
  ] = useState(false);
  const [isWorkflowAddedTrue, setIsWorkflowAddedTrue] = useState(false);
  const [addWorkflowOrConditionNode] = useAddWorkflowOrConditionNodeMutation();

  const [
    isWorkflowBehaviourTypeAddedTrue,
    setIsWorkflowBehaviourTypeAddedTrue,
  ] = useState(false);

  const [
    userRetrieveFromQuerySearch,
    { data: userData, isLoading, isSuccess },
  ] = useUserRetrieveFromQuerySearchMutation();
  const [users, setUsers] = useState([]);
  const [trueSelected, setTrueSetSelected] = useState({
    behaviourType: "",
    condition: true,
    isConditionResult: true,
    type: "",
    users: [],
  });
  const [falseSelected, setFalseSetSelected] = useState({
    behaviourType: "",
    condition: false,
    isConditionResult: true,
    type: "",
    users: [],
  });

  const [falseQuery, setFalseQuery] = useState("");
  const [trueQuery, setTrueQuery] = useState("");

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
    if (e.target.name === "falseSelectSearch") {
      setFalseQuery(e.target.value);
      userRetrieveFromQuerySearch({ query: e.target.value, page: 1 });
    } else if (e.target.name === "trueSelectSearch") {
      setTrueQuery(e.target.value);
      userRetrieveFromQuerySearch({ query: e.target.value, page: 1 });
    }
  };

  return (
    <Formik
      initialValues={{
        falseSelect: "",
        falseSelectBehaviourType: "",
        falseSelectSearch: "",
        trueSelect: "",
        trueSelectBehaviourType: "",
        trueSelectSearch: "",
      }}
      onSubmit={async (values, actions) => {
        const newTrueSelected = {
          ...trueSelected,
          behaviourType: values.trueSelectBehaviourType,
        };

        const newFalseSelected = {
          ...falseSelected,
          behaviourType: values.falseSelectBehaviourType,
        };

        setTrueSetSelected(newTrueSelected);
        setFalseSetSelected(newFalseSelected);

        const trueSide = createWorkflowForCondition(
          values.trueSelect,
          newTrueSelected,
          node
        );
        const falseSide = createWorkflowForCondition(
          values.falseSelect,
          newFalseSelected,
          node
        );

        const workflowNodeArray = [falseSide, trueSide];
        for (const obj of workflowNodeArray) {
          await addWorkflowOrConditionNode(obj);
        }
        refetch();
      }}
    >
      {({ values, setFieldValue }) => (
        <Form className="p-4 md:p-5">
          <div className="grid grid-cols-2 gap-10 mb-4 text-black">
            <div className="">
              <h1 className="mb-5 text-xl">When Conditions are false?</h1>
              <SelectField
                label="Select"
                name="falseSelect"
                value={values.falseSelect}
                options={[
                  { label: "Create Workflow", value: "CREATE_WORKFLOW" },
                  { label: "Approved", value: "APPROVED" },
                ]}
                onChange={handleSelectChange(setIsWorkflowAddedFalse, (value) =>
                  setFieldValue("falseSelect", value)
                )}
              />
              {isWorkflowAddedFalse && (
                <SelectField
                  label="Select"
                  name="falseSelectBehaviourType"
                  value={values.falseSelectBehaviourType}
                  options={[
                    { label: "Employee", value: "EMPLOYEE" },
                    { label: "Designation", value: "DESIGNATION" },
                  ]}
                  onChange={handleSelectChange(
                    setIsWorkflowBehaviourTypeAddedFalse,
                    (value) => setFieldValue("falseSelectBehaviourType", value)
                  )}
                />
              )}
              {isWorkflowAddedFalse && isWorkflowBehaviourTypeAddedFalse && (
                <SelectedUsers
                  selected={falseSelected}
                  setSelected={setFalseSetSelected}
                  setFieldValue={setFieldValue}
                  handleSearchInput={handleSearchInput}
                  query={falseQuery}
                  users={users}
                  inputTagName="falseSelectSearch"
                />
              )}
            </div>
            <div className="">
              <h1 className="mb-5 text-xl">When Conditions are true?</h1>
              <SelectField
                label="Select"
                name="trueSelect"
                value={values.trueSelect}
                options={[
                  { label: "Create Workflow", value: "CREATE_WORKFLOW" },
                  { label: "Approved", value: "APPROVED" },
                ]}
                onChange={handleSelectChange(setIsWorkflowAddedTrue, (value) =>
                  setFieldValue("trueSelect", value)
                )}
              />
              {isWorkflowAddedTrue && (
                <SelectField
                  label="Select"
                  name="trueSelectBehaviourType"
                  value={values.trueSelectBehaviourType}
                  options={[
                    { label: "Employee", value: "EMPLOYEE" },
                    { label: "Designation", value: "DESIGNATION" },
                  ]}
                  onChange={handleSelectChange(
                    setIsWorkflowBehaviourTypeAddedTrue,
                    (value) => setFieldValue("trueSelectBehaviourType", value)
                  )}
                />
              )}
              {isWorkflowAddedTrue && isWorkflowBehaviourTypeAddedTrue && (
                <SelectedUsers
                  selected={trueSelected}
                  setSelected={setTrueSetSelected}
                  setFieldValue={setFieldValue}
                  handleSearchInput={handleSearchInput}
                  query={trueQuery}
                  users={users}
                  inputTagName="trueSelectSearch"
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
