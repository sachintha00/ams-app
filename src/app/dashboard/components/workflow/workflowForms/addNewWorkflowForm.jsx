import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { IoClose } from "react-icons/io5";
import {
  useAddWorkflowMutation,
  useGetworkflowsQuery,
  useUpdateWorkflowMutation,
} from "@/app/_lib/redux/features/workflow/workflowApi";
import { useDispatch, useSelector } from "react-redux";
import { handleClosePopupModel } from "@/app/_lib/redux/features/popupModel/popupModelSlice";
import { COLORS } from "@/app/_lib/constants/colors";

const validationSchema = Yup.object().shape({
  workflowName: Yup.string().required("Workflow Name is required"),
  workflowDescription: Yup.string().required(
    "Workflow Description is required"
  ),
});

function AddNewWorkflowForm({ isUpdateForm = false }) {
  const dispatch = useDispatch();
  const { id } = useSelector((state) => state.popupModel);
  const [workflowStatus, setWorkflowStatus] = useState(false);
  const [addWorkflow] = useAddWorkflowMutation();
  const [updateWorkflow] = useUpdateWorkflowMutation();
  const { data: workflowData, isSuccess } = useGetworkflowsQuery(id);

  useEffect(() => {
    if (isUpdateForm && isSuccess && workflowData) {
      const status = workflowData.data[0]?.workflow_status || false;
      setWorkflowStatus(status);
    }
  }, [isUpdateForm, isSuccess, workflowData]);

  const toggleStatus = () => {
    setWorkflowStatus((prevState) => !prevState);
  };

  const initialValues = {
    workflowName:
      isUpdateForm && isSuccess ? workflowData?.data[0]?.workflow_name : "",
    workflowDescription:
      isUpdateForm && isSuccess
        ? workflowData?.data[0]?.workflow_description
        : "",
    workflowStatus: workflowStatus,
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const newWorkflow = {
          workflow_request_type_id: 1,
          workflow_name: values.workflowName,
          workflow_description: values.workflowDescription,
          workflow_status: values.workflowStatus,
        };

        if (isUpdateForm) {
          try {
            await updateWorkflow({ ...newWorkflow, workflow_id: id }).unwrap();
          } catch (error) {
            console.error("Failed to update workflow:", error);
          }
        } else {
          try {
            await addWorkflow(newWorkflow).unwrap();
          } catch (error) {
            console.error("Failed to add workflow:", error);
          }
        }

        dispatch(handleClosePopupModel());
        setSubmitting(false);
      }}
    >
      {({ errors, touched, isSubmitting, values, handleChange }) => (
        <Form className="px-2 pt-2">
          {Object.keys(errors).length > 0 && (
            <div
              className="relative px-4 py-3 mb-2 text-red-700 bg-red-100 border border-red-400 rounded"
              role="alert"
            >
              <span className="block sm:inline"></span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <IoClose className="text-2xl text-red-700" />
              </span>
              <ul>
                {Object.keys(errors).map((fieldName, index) => {
                  if (touched[fieldName]) {
                    return (
                      <li key={index} className="text-sm">
                        {errors[fieldName]}
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="col-span-2">
              <label
                htmlFor="workflowName"
                className="block mb-2 text-[15px] font-medium text-gray-900 dark:text-white"
              >
                Workflow Name
              </label>
              <Field
                type="text"
                name="workflowName"
                id="workflowName"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-[15px] rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Type Workflow Name"
              />
              <ErrorMessage
                name="workflowName"
                component="div"
                className="text-sm text-red-500"
              />
            </div>
            <div className="col-span-2">
              <label
                htmlFor="workflowDescription"
                className="block mb-2 text-[15px] font-medium text-gray-900 dark:text-white"
              >
                Workflow Description
              </label>
              <Field
                as="textarea"
                id="workflowDescription"
                rows="4"
                name="workflowDescription"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-[15px] rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Type Workflow Description"
              />
              <ErrorMessage
                name="workflowDescription"
                component="div"
                className="text-sm text-red-500"
              />
            </div>
            <div className="col-span-2">
              <label className="inline-flex items-center mb-2 mr-8 font-medium text-gray-900 cursor-pointer text-[15px] dark:text-white">
                <span className="mr-4">Workflow Status</span>
                <label
                  htmlFor="workflowStatus"
                  className="inline-flex items-center"
                >
                  <Field
                    type="checkbox"
                    id="workflowStatus"
                    name="workflowStatus"
                    checked={values.workflowStatus}
                    onChange={(e) => {
                      handleChange(e);
                      toggleStatus();
                    }}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                  <span className="ml-2 text-gray-900 dark:text-white">
                    Active
                  </span>
                </label>
              </label>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
            text-white inline-flex items-center focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md
              ${
                isUpdateForm
                  ? ` bg-[${COLORS.FORM_UPDATE_BUTTON}]  text-sm px-5 py-2.5 text-center dark:bg-[${COLORS.FORM_UPDATE_BUTTON}] dark:hover:bg-[${COLORS.FORM_UPDATE_BUTTON}] dark:focus:ring-blue-800`
                  : ` bg-[${COLORS.PRIMARY}] hover:bg-[${COLORS.PRIMARY}]  text-[15px] px-5 py-2.5 text-center dark:bg-[${COLORS.PRIMARY}] dark:hover:bg-[${COLORS.PRIMARY}] dark:focus:ring-blue-800`
              }
            `}
          >
            {isUpdateForm ? "Update" : "Create"}
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default AddNewWorkflowForm;
