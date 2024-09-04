'use client'
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleClosePopupModel } from '@/app/_lib/redux/features/popupModel/popupModelSlice';
import { useDropzone } from 'react-dropzone';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import renderDesignationsItem from './menulist/renderDesignationsItem';
import SelectInput from '../../components/inputs/SelectInput';
import { useAddNewUserMutation, useUsersListQuery } from '@/app/_lib/redux/features/user/user_api';
import { IoClose } from "react-icons/io5";

function UpdateUserForm({ }) {
    const dispatch = useDispatch()
    const { value } = useSelector((state) => state.popupModel);
    const roledetails = value;

    const savedUserId = value.id;
    const savedUserName = value.user_name;
    const savedEmail = value.email;
    const savedName = value.name;
    const savedContactNo = value.contact_no;
    const savedAddress = value.address;
    const savedUserDescription = value.user_description;
    const savedUserContactPersonMobile = value.contact_person;
    // const savedUserRoles = value.roles;
    const savedUserDesignationId = value.designation_id;
    // console.log(savedUserRoles);

    const [editeselectedValues, setEditeSelectedValues] = useState([]);

    useEffect(() => {
        setEditeSelectedValues(value.roles.map(role => role.name));
    }, [value]);

    const [filteredRoles, setFilteredRoles] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [usercreateerror, setUserCreateError] = useState('');
    const [formemessage, setmessage] = useState('');
    const [isOpenRoleList, setIsOpenRoleList] = useState(false);

    const refRoleList = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (refRoleList.current && !refRoleList.current.contains(event.target)) {
                setIsOpenRoleList(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleRoleListHandler = () => {
        setIsOpenRoleList((prev) => !prev);
    };

    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
    };

    const {
        data: UserList,
        isLoading,
        isError,
        error,
        refetch,
    } = useUsersListQuery();

    useEffect(() => {
        if (!isLoading && !isError && UserList) {
            const roles = Object.values(UserList.Role);
            const filtered = roles.filter(role => role.name.toLowerCase().includes(searchInput.toLowerCase()));
            setFilteredRoles(filtered);
        }
    }, [isLoading, isError, UserList, searchInput, refetch]);

    const handleediteCheckboxChange = (event, removedValue) => {
        const { value, checked } = event.target;
        if (checked) {
            setEditeSelectedValues([...editeselectedValues, value]);
        } else {
            setEditeSelectedValues(editeselectedValues.filter((item) => item !== value));
        }
        // Remove the specific value from selectedValues when the close button is clicked
        if (removedValue) {
            setEditeSelectedValues(editeselectedValues.filter((item) => item !== removedValue));
        }
    };

    // designations
    const [designationsArray, setDesignationsArray] = useState([]);
    const [selectedDesignations, setSelectedDesignations] = useState(null);
    const [designationsSearchInput, setDesignationsSearchInput] = useState('');

    useEffect(() => {
        if (UserList) {
            const Alldesignations = Object.values(UserList.AllDesignations);
            const filtereddesignations = Alldesignations.filter(item => item.designation.toLowerCase().includes(designationsSearchInput.toLowerCase()));
            setDesignationsArray(filtereddesignations);
        }
    }, [UserList, designationsSearchInput]);

    useEffect(() => {
        if (savedUserDesignationId && UserList) {
            // Find and set the current selected asset type based on the existing asset data
            const currentDesignations = UserList.AllDesignations.find(
                item => item.id === savedUserDesignationId
            );
            setSelectedDesignations(currentDesignations);
            setDesignationsSearchInput(currentDesignations ? currentDesignations.designation : '');
        }
    }, [savedUserDesignationId, UserList]);

    const [addNewUser] = useAddNewUserMutation();

    const [profileImage, setProfileImage] = useState(null);

    const { getRootProps, getInputProps } = useDropzone({
        multiple: false,
        accept: {
            'image/*': ['.jpeg', '.png', '.jpg', '.gif', '.bmp', '.tiff']
        },
        onDrop: (acceptedFiles) => {
            setProfileImage(acceptedFiles[0]);
        }
    });

    const removeImage = () => {
        setProfileImage(null);
    };

    const getPreview = (file) => {
        const imageUrl = URL.createObjectURL(file);
        return (
            <img
                src={imageUrl}
                alt={file.name}
                className="object-cover w-52 h-52 rounded-[100px]"
                onLoad={() => URL.revokeObjectURL(imageUrl)}
            />
        );
    };

    const [selectedValues, setSelectedValues] = useState([]);
    const handleCheckboxChange = (event, removedValue) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedValues([...selectedValues, value]);
        } else {
            setSelectedValues(selectedValues.filter((item) => item !== value));
        }
        // Remove the specific value from selectedValues when the close button is clicked
        if (removedValue) {
            setSelectedValues(selectedValues.filter((item) => item !== removedValue));
        }
    };

    const validationSchema = Yup.object().shape({
        user_name: Yup.string().required('User Name is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        name: Yup.string().required('Name is required'),
        contact_no: Yup.string().required('Phone number is required'),
        address: Yup.string().required('Address is required'),
        user_description: Yup.string().required('Description is required'),
        contactPersonMobile: Yup.string().required('Contact Person Mobile Number is required'),
    });

    const initialValues = {
        user_name: savedUserName,
        email: savedEmail,
        name: savedName,
        contact_no: savedContactNo,
        address: savedAddress,
        user_description: savedUserDescription,
        contactPersonMobile: savedUserContactPersonMobile,
    };

    const submitForm = async (values, { setSubmitting, resetForm }) => {
        try {
            const user = {
                ...values,
                profile_image: profileImage,
                roles: selectedValues,
                designation_id: selectedDesignations.id,
            };
            console.log(user);
            addNewUser(user)
                .unwrap()
                .then((response) => {
                    console.log("New user added:", response);
                    resetForm();
                    setProfileImage(null);
                    setmessage(response.message);
                    dispatch(handleClosePopupModel());
                })
                .catch((error) => {
                    console.error("Error adding new user:", error);
                    setUserCreateError(error);
                    setTimeout(() => {
                        setUserCreateError('');
                    }, 5000);
                });
        } catch (error) {
            console.error("Submission error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submitForm}
        >
            {({ isSubmitting, setFieldValue, values }) => (
                <Form className="px-2 pt-2 overflow-y-scroll h-[500px]" encType="multipart/form-data">
                    {usercreateerror && (
                        <div
                            className="relative px-4 py-3 mb-2 text-red-700 bg-red-100 border border-red-400 rounded"
                            role="alert"
                        >
                            <span className="block sm:inline">{usercreateerror}</span>
                            <span
                                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                                onClick={() => setUserCreateError('')}
                            >
                                <IoClose className="w-6 h-6 text-red-500" />
                            </span>
                        </div>
                    )}

                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <div className="mb-6">
                                <label
                                    htmlFor="user_name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    User Name
                                </label>
                                <Field
                                    type="text"
                                    id="user_name"
                                    name="user_name"
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter user name"
                                />
                                <ErrorMessage name="user_name" component="div" className="text-red-600 text-sm mt-1" />
                            </div>
                            <div className="mb-6">
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Email
                                </label>
                                <Field
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter user email address"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
                            </div>
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Name
                                </label>
                                <Field
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter user full name"
                                />
                                <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="dropzone-file"
                                    className="flex flex-col items-center justify-center w-52 h-52 text-center border-2 border-gray-300 border-dashed rounded-[105px] cursor-pointer bg-white dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                    {...getRootProps()}
                                >
                                    {!profileImage ? (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg
                                                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 20 16"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                />
                                            </svg>
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                SVG, PNG, JPG or GIF (MAX. 800x400px)
                                            </p>
                                        </div>
                                    ) : (
                                        <div className='w-[100%] h-[100%] relative'>
                                            {getPreview(profileImage)}
                                            <a
                                                className="top-0 right-0 text-gray-400 bg-red-400 hover:bg-red-500 hover:text-white rounded-lg text-sm w-6 h-6 ml-0 inline-flex justify-center items-center dark:bg-red-400 dark:hover:bg-red-500 dark:hover:text-white absolute"
                                                onClick={removeImage}
                                            >
                                                <IoClose className="text-xl text-white" />
                                            </a>
                                        </div>
                                    )}
                                    <input {...getInputProps()} />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="contact_no"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Phone number
                            </label>
                            <Field
                                type="text"
                                id="contact_no"
                                name="contact_no"
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Enter user mobile number"
                            />
                            <ErrorMessage name="contact_no" component="div" className="text-red-600 text-sm mt-1" />
                        </div>

                        <div>
                            <label
                                htmlFor="address"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Address
                            </label>
                            <Field
                                type="text"
                                id="address"
                                name="address"
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Enter user address"
                            />
                            <ErrorMessage name="address" component="div" className="text-red-600 text-sm mt-1" />
                        </div>

                        <div className='relative'>
                            <label
                                htmlFor="last_name"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Role
                            </label>
                            <button
                            id="dropdownSearchButton"
                            data-dropdown-toggle="dropdownSearch"
                            className="flex justify-between items-center bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            type="button"
                            onClick={toggleRoleListHandler}
                            >
                            Add role to this user
                            <svg
                                className="w-2.5 h-2.5 ms-2.5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6"
                            >
                                <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="m1 1 4 4 4-4"
                                />
                            </svg>
                            </button>
                            <div className="flex flex-wrap gap-2 mt-1">
                            {editeselectedValues.map((Role) => (
                                <span className="flex px-3 py-1 bg-gray-400 rounded-md">
                                {Role}
                                <button
                                    className="ml-2"
                                    onClick={(event) => handleediteCheckboxChange(event, Role)}
                                >
                                    <IoClose className="text-2xl text-white hover:text-red-400" />
                                </button>
                                </span>
                            ))}
                            </div>
                            {/* Dropdown menu */}
                            <div data-collapse={isOpenRoleList} ref={refRoleList} className='absolute w-[100%]'>
                            <div
                                id="dropdownSearch"
                                className="z-10 hidden bg-white rounded-lg shadow w-auto dark:bg-gray-700 rolelist"
                            >
                                <div className="p-3">
                                <label htmlFor="input-group-search" className="sr-only">
                                    Search
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
                                    <svg
                                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                        />
                                    </svg>
                                    </div>
                                    <input
                                    type="text"
                                    id="input-group-search"
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Search role name"
                                    value={searchInput}
                                    onChange={handleSearchInputChange}
                                    />
                                </div>
                                </div>
                                <ul
                                className="h-auto px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
                                aria-labelledby="dropdownSearchButton"
                                >
                                {filteredRoles.map((Role) => (
                                    <li>
                                    <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                        <input
                                        id="checkbox-item-11"
                                        type="checkbox"
                                        value={Role.name}
                                        onChange={handleediteCheckboxChange}
                                        checked={editeselectedValues.includes(Role.name)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                        />
                                        <label
                                        htmlFor="checkbox-item-11"
                                        className="w-full text-sm font-medium text-gray-900 rounded ms-2 dark:text-gray-300"
                                        >
                                        {Role.name}
                                        </label>
                                    </div>
                                    </li>
                                ))}
                                </ul>
                            </div>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="user_description"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Description
                            </label>
                            <Field
                                as="textarea"
                                id="user_description"
                                name="user_description"
                                rows="4"
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Write a short description about this user"
                            />
                            <ErrorMessage name="user_description" component="div" className="text-red-600 text-sm mt-1" />
                        </div>

                        <div>
                            <label
                                htmlFor="contactPersonMobile"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Contact Person Mobile Number
                            </label>
                            <Field
                                type="text"
                                id="contactPersonMobile"
                                name="contactPersonMobile"
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Enter contact person's mobile number"
                            />
                            <ErrorMessage name="contactPersonMobile" component="div" className="text-red-600 text-sm mt-1" />
                        </div>

                        <div>
                            <label
                                htmlFor="designation"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Designations
                            </label>
                            <SelectInput
                                placeholder="Search and Select Designation"
                                data={designationsArray}
                                onSelect={setSelectedDesignations}
                                selected={selectedDesignations}
                                searchInput={designationsSearchInput}
                                setSearchInput={setDesignationsSearchInput}
                                renderItem={renderDesignationsItem}
                                name={'designation'}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="text-white bg-[#213389] hover:bg-[#213389] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-[#213389] dark:hover:bg-[#213389] dark:focus:ring-blue-800"
                        disabled={isSubmitting}
                    >
                        Save
                    </button>
                </Form>
            )}
        </Formik>
    );
}

export default UpdateUserForm;