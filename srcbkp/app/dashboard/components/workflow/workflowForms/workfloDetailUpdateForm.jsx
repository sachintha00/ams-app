import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import SelectField from "./components/selectField";
import { useUserRetrieveFromQuerySearchMutation } from "@/app/_lib/redux/features/user/user_api";
import { COLORS } from "@/app/_lib/constants/colors";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetworkflowDetailNodesQuery,
  useUpdateWorkflowOrConditionNodeMutation,
} from "@/app/_lib/redux/features/workflow/workflowApi";
import SelectedUsers from "./components/selectedUsers";
import { handleClosePopupModel } from "@/app/_lib/redux/features/popupModel/popupModelSlice";

function WorkfloDetailUpdateForm() {
  const dispatch = useDispatch();
  const { id: workflowDetailId } = useSelector((state) => state.popupModel);
  const [updateWorkflowOrConditionNode] =
    useUpdateWorkflowOrConditionNodeMutation();
  const { data: workflowDetailNode, isSuccess: isSuccessWorkflowDetailNode } =
    useGetworkflowDetailNodesQuery(workflowDetailId);

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
      setUsers(userData?.data || []);
    }
    if (isSuccessWorkflowDetailNode && workflowDetailNode?.data?.length > 0) {
      const workflowDetail = workflowDetailNode.data[0];
      let workflowDetailData = workflowDetail.workflow_detail_data_object;

      if (Array.isArray(workflowDetailData)) {
        workflowDetailData = workflowDetailData[0];
      }

      const { behaviourType, condition, isConditionResult, type, users } =
        workflowDetailData;
      setSetSelected({
        behaviourType,
        condition,
        isConditionResult,
        type,
        users: users || [],
      });
      setIsWorkflowBehaviourTypeAdded(true);
    }
  }, [isSuccess, userData, isSuccessWorkflowDetailNode, workflowDetailNode]);

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
        selectBehaviourType: selected.behaviourType || "",
        selectSearch: "",
      }}
      onSubmit={async (values, actions) => {
        const workflowDetail = workflowDetailNode.data[0];

        const result = await updateWorkflowOrConditionNode({
          ...workflowDetail,
          workflow_detail_data_object: [
            {
              behaviourType: values.selectBehaviourType,
              condition: selected.condition,
              type: selected.type,
              users: selected.users,
              isConditionResult: selected.isConditionResult,
            },
          ],
          workflow_detailI_id: workflowDetail.id,
        });

        if (result.error) {
          console.error("Error updating workflow node:", result.error);
        } else {
          console.log("Workflow node updated successfully:", result.data);
          dispatch(handleClosePopupModel());
        }
      }}
    >
      {({ values, setFieldValue, setValues }) => {
        useEffect(() => {
          if (
            isSuccessWorkflowDetailNode &&
            workflowDetailNode?.data?.length > 0
          ) {
            const workflowDetail = workflowDetailNode.data[0];
            let workflowDetailData = workflowDetail.workflow_detail_data_object;

            if (Array.isArray(workflowDetailData)) {
              workflowDetailData = workflowDetailData[0];
            }

            const { behaviourType, condition, type, users } =
              workflowDetailData;
            setValues({
              selectBehaviourType: behaviourType,
              selectSearch: "",
            });
            setSetSelected({
              behaviourType,
              condition,
              type,
              users: users || [],
            });
            setIsWorkflowBehaviourTypeAdded(true);
          }
        }, [isSuccessWorkflowDetailNode, workflowDetailNode, setValues]);

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
              className={`text-white inline-flex items-center bg-[${COLORS.FORM_UPDATE_BUTTON}] hover:bg-[${COLORS.FORM_UPDATE_BUTTON}] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-20 py-2.5 text-center dark:bg-[${COLORS.FORM_UPDATE_BUTTON}] dark:hover:bg-[${COLORS.FORM_UPDATE_BUTTON}] dark:focus:ring-blue-800`}
            >
              Update
            </button>
          </Form>
        );
      }}
    </Formik>
  );
}

export default WorkfloDetailUpdateForm;
