import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {
    useRemoveMemberFromProcurementStaffMutation,
} from "@/app/_lib/redux/features/procurementProcess/procurementApi";
import { handleClosePopupModel } from "@/app/_lib/redux/features/popupModel/popupModelSlice";

const RemoveWorkflowSchema = Yup.object().shape({
    name: Yup.string()
        .required("Please enter the procurement member name")
        .test("match-name", "Value does not match", function (value) {
            return value === this.resolve(Yup.ref("deleterowname"));
        }),
});

function StaffRemoveForm() {
    const dispatch = useDispatch();
    const [removeMemberFromProcurementStaff] =
        useRemoveMemberFromProcurementStaffMutation();
    const { id, value } = useSelector((state) => state.popupModel);

    useEffect(() => {
        console.log(id)
    }, [])

    return (
        <div>
            <Formik
                initialValues={{
                    name: "",
                    deleterowname: value,
                }}
                validationSchema={RemoveWorkflowSchema}
                onSubmit={async (values, { resetForm }) => {

                    try {
                        await removeMemberFromProcurementStaff(id).unwrap();
                        dispatch(handleClosePopupModel());
                        console.log("Workflow node deleted successfully");
                    } catch (error) {
                        console.error("Failed to delete the workflow node", error);
                    }
                }}
            >
                {({ touched, errors }) => (
                    <Form className="px-2 pt-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white w-[80%] mb-2 mt-2">
                            If you want to delete {value}, please enter "{value}" below
                        </h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="col-span-2">
                                <Field
                                    type="text"
                                    name="name"
                                    id="name"
                                    className={`bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 ${touched.name && errors.name ? "border-red-500" : ""
                                        }`}
                                    required
                                />
                                <ErrorMessage
                                    name="name"
                                    component="div"
                                    className="text-sm text-red-500"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="text-white inline-flex items-center bg-[#D32D41] hover:bg-[#D32D41] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#D32D41] dark:hover:bg-[#D32D41] dark:focus:ring-blue-800"
                        >
                            Delete
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default StaffRemoveForm;
