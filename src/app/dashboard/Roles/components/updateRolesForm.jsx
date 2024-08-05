'use client'
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { handleClosePopupModel } from '@/app/_lib/redux/features/popupModel/popupModelSlice';
import { useEditeRoleMutation } from '@/app/_lib/redux/features/role/role_api';

function UpdateRolesForm({ }) {
    const dispatch = useDispatch()
    const { value } = useSelector((state) => state.popupModel);
    const roledetails = value;

    const validationSchema = Yup.object({
        name: Yup.string().required('Required'),
        role_description: Yup.string().required('Required'),
    });

    //edite role form data
    const [editeRole] = useEditeRoleMutation();

    //edite Submit Role From
    const onSubmit = (values) => {
        const editeid = roledetails.id;
        console.log(values);
        try {
        const role = {
            id: roledetails.id,
            name: values.name,
            description: values.name,
        };
        editeRole(role)
            .unwrap()
            .then((response) => {
                console.log("New node added:", response);
                // window.location.reload();
                dispatch(handleClosePopupModel());
            })
            .catch((error) => {
            console.error("Error adding new node:", error);
            });
        } catch (error) {
        console.error("Login error:", error);
        }
    };

    return (
        <>
            <Formik
            initialValues={{ name: value.name, role_description: value.description }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                onSubmit(values);
                setSubmitting(false);
            }}
            >
            {({ isSubmitting }) => (
                <Form className="px-2 pt-2">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="col-span-2">
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Role Name
                            </label>
                            <Field
                                type="text"
                                name="name"
                                id="name"
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Type Role name"
                            />
                            <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
                        </div>
                        <div className="col-span-2">
                            <label
                                htmlFor="role_description"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Role Description
                            </label>
                            <Field
                                as="textarea"
                                id="role_description"
                                name="role_description"
                                rows="4"
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Write Role description here..."
                            />
                            <ErrorMessage
                                name="role_description"
                                component="div"
                                className="text-red-600 text-sm mt-1"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="text-white inline-flex items-center bg-[#DBAE58] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#DBAE58] dark:hover:bg-[#DBAE58] dark:focus:ring-blue-800"
                    >
                        Update
                    </button>
                </Form>
            )}
            </Formik>
        </>
    );
}

export default UpdateRolesForm;