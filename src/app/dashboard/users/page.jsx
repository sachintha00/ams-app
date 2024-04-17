'use client'
import React, { useEffect, useState, useContext, useRef } from 'react';
import { IoGrid } from "react-icons/io5";
import { FaList } from "react-icons/fa";
import { FaUserCog } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaPenToSquare } from "react-icons/fa6";
import { FaUserLock } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { RiLockPasswordLine } from "react-icons/ri";
import { redirect, useRouter } from 'next/navigation';
import { useAddNewUserMutation, useDeleteUserMutation, useEditeUserMutation, useUsersListQuery, useStatuschangeUserMutation, useUserpasswordresetMutation } from '@/app/_lib/redux/features/user/user_api';
import { useSelector } from 'react-redux';
import Link from 'next/link';

export default function users() {
    const [view, setView] = useState('grid');
    const [expandedResetpasswordModel, setExpandedResetpasswordModel] = useState(false);
    const [expandedEditeRoleModel, setExpandedEditeRoleModel] = useState(false);
    const [expandedDeleteRoleModel, setExpandedDeleteRoleModel] = useState(false);
    const [isOpenAddForm, setIsOpenAddFormModel] = useState(false);
    const [formerror, setError] = useState('');
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

    const handleSwitchView = (newView) => {
        setView(newView);
    };

    const toggleRoleListHandler = () =>{
        setIsOpenRoleList((prev) => !prev);
    };

    // reset password model
    const handleToggleResetpasswordModel = (rowId) => {
        setExpandedResetpasswordModel(rowId === expandedResetpasswordModel ? false : rowId);
    };

    const closeResetpasswordModel = () => {
        setExpandedResetpasswordModel(false);
    };

    // edite role model
    const handleToggleEditeRoleModel = (rowId) => {
        setExpandedEditeRoleModel(rowId === expandedDeleteRoleModel ? false : rowId);
    };

    const closeEditeRoleModel = () => {
        setExpandedEditeRoleModel(false);
    };

    // delete role model
    const handleToggleDeleteRoleModel = (rowId) => {
        setExpandedDeleteRoleModel(rowId === expandedDeleteRoleModel ? false : rowId);
    };

    const closeDeleteRoleModel = () => {
        setExpandedDeleteRoleModel(false);
    };

    const openAddFormModal = () => {
        setIsOpenAddFormModel(true);
    };
    
    const closeAddFormModal = () => {
        setIsOpenAddFormModel(false);
    };

    // user list
    const [userArray, setUserArray] = useState([]); // State to hold converted array
    const [roleArray, setRoleArray] = useState([]); // State to hold converted array
    const [thisuserpermissionArray, setthisuserpermissionArray] = useState([]); 

    const {
        data: UserList,
        isLoading,
        isError,
        error,
        refetch,
      } = useUsersListQuery();

    const permissions = useSelector(state => state.auth.permissions);

    useEffect(() => {
        if (!isLoading && !isError && UserList) {
            setUserArray(Object.values(UserList.Users));
            setRoleArray(Object.values(UserList.Role));
            setthisuserpermissionArray(permissions);
        }
    }, [isLoading, isError, UserList, refetch]);

    // add user
    const [addNewUser] = useAddNewUserMutation();  
    const router = useRouter();
    
    //add role form data
    const [user_name, setuser_name] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [contact_no, setContact_no] = useState("");
    const [address, setAddress] = useState("");
    const [selectedValues, setSelectedValues] = useState([]);
    const [user_description, setuser_description] = useState("");

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
          setSelectedValues([...selectedValues, value]);
        } else {
          setSelectedValues(selectedValues.filter((item) => item !== value));
        }
      };

    // Submit From
    const submitForm = async e => {
        e.preventDefault();
        try {
            const user = {user_name: user_name, email: email, name: name, contact_no: contact_no, address: address, roles: selectedValues, user_description: user_description}
            addNewUser(user)
            .unwrap()
            .then((response) => {
                console.log("New node added:", response);
                // router.push("/dashboard/usergroups");
                setuser_name("");
                setEmail("");
                setName("");
                setContact_no("");
                setAddress("");
                setSelectedValues("");
                setuser_description("");
                refetch();
            })
            .catch((error) => {
                console.error("Error adding new node:", error);
            });
        } catch (error) {
            console.error("Login error:", error);
        }
    }

    //edite role form data
    const [editeRole] = useEditeUserMutation();
    const [editeuser_name, setEditeuser_name] = useState("");
    const [editeemail, setEditeEmail] = useState("");
    const [editename, setEditeName] = useState("");
    const [editecontact_no, setEditeContact_no] = useState("");
    const [editeaddress, setEditeAddress] = useState("");
    const [editeselectedValues, setEditeSelectedValues] = useState([]);
    const [editeuser_description, setEditeuser_description] = useState("");

    const handleediteCheckboxChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setEditeSelectedValues([...editeselectedValues, value]);
        } else {
            setEditeSelectedValues(editeselectedValues.filter((item) => item !== value));
        }
      };

    //edite Submit Role From
    const submitEditeForm = async e => {
        const editeid = e.target.editid.value;
        console.log(editeid);
        e.preventDefault();

        try {
            const user = {id: editeid, user_name: editeuser_name, email: editeemail, name: editename, contact_no: editecontact_no, address: editeaddress, roles: editeselectedValues, user_description: editeuser_description}
            editeRole(user)
            .unwrap()
            .then((response) => {
                console.log("New node added:", response);
                // window.location.reload();
                closeEditeRoleModel();
                refetch();
            })
            .catch((error) => {
                console.error("Error adding new node:", error);
            });
        } catch (error) {
            console.error("Login error:", error);
        }
    }

    //delete user form data
    const [deleteUser] = useDeleteUserMutation();
    const [deletename, setDeleteName] = useState("");

    //delete Submit Role From
    const submitDeleteForm = async e => {
        const deleteid = e.target.id.value;
        const deleterowname = e.target.deleterowname.value;
        e.preventDefault();

        try {
            if (deletename === deleterowname) {
                const user = {ID: deleteid}
                deleteUser(user)
                .unwrap()
                .then((response) => {
                    console.log("New node added:", response);
                    // router.push("/dashboard");
                    refetch();
                })
                .catch((error) => {
                    console.error("Error adding new node:", error);
                });
            } else {
                setError('Input does not match the name of the User Name');
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    }

    // status change
    const [statuschangeUser] = useStatuschangeUserMutation();

    const handleToggleStatus = (userId, newStatus) => {
        console.log(userId);
        try {
            const user = {ID: userId, status: newStatus}
            statuschangeUser(user)
            .unwrap()
            .then((response) => {
                console.log("New node added:", response);
                // router.push("/dashboard");
                refetch();
            })
            .catch((error) => {
                console.error("Error adding new node:", error);
            });
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    const handleToggle = (userId, currentStatus) => {
        // Call the onToggleStatus function passed from the parent component
        handleToggleStatus(userId, !currentStatus);
    };

    //user password reset
    const [userpasswordreset] = useUserpasswordresetMutation();
    const [resetname, setResetName] = useState("");

    //user password reset
    const submitPasswordForm = async e => {
        const deleteid = e.target.id.value;
        const resetrowname = e.target.resetrowname.value;
        e.preventDefault();

        try {
            if (resetname === resetrowname) {
                const user = {ID: deleteid}
                userpasswordreset(user)
                .unwrap()
                .then((response) => {
                    console.log("New node added:", response);
                    // router.push("/dashboard");
                    setmessage(response.message);
                    setResetName("");
                    refetch();
                })
                .catch((error) => {
                    console.error("Error adding new node:", error);
                });
            } else {
                setError('Input does not match the name of the User Name');
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    }

    return (
        <div className="p-4 pl-8 subcontent border-gray-200 rounded-lg dark:border-gray-700">
        <div className="flex items-center justify-center rounded bg-gray-50 dark:bg-[#121212]">
            <div className="w-full w-[-webkit-fill-available]">
                {/* Start coding here */}
                <div className="overflow-hidden bg-gray-50 sm:rounded-lg dark:bg-[#121212]">
                    <div className="flex-row items-center justify-between py-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
                        <div>
                            <nav className="flex" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                                <li className="inline-flex items-center">
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                                >
                                    <svg
                                    className="w-3 h-3 me-2.5"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    >
                                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                                    </svg>
                                    Home
                                </Link>
                                </li>
                                <li aria-current="page">
                                <div className="flex items-center">
                                    <svg
                                    className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 6 10"
                                    >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="m1 9 4-4-4-4"
                                    />
                                    </svg>
                                    <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                                    User Management
                                    </span>
                                </div>
                                </li>
                                <li aria-current="page">
                                <div className="flex items-center">
                                    <svg
                                    className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 6 10"
                                    >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="m1 9 4-4-4-4"
                                    />
                                    </svg>
                                    <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                                    Users
                                    </span>
                                </div>
                                </li>
                            </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="flex-row items-center justify-between py-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
                        <div>
                            <div className='flex items-center'>
                                <FaUserAlt className="mr-3 font-semibold text-gray-700 dark:text-white text-[25px]"/>
                                <h3 className="mr-3 font-semibold text-gray-700 dark:text-white text-[25px]">Users</h3>
                            </div>
                        <p className="text-gray-500 dark:text-gray-400">
                            Manage all your existing users or add a new one
                        </p>
                        </div>
                        {thisuserpermissionArray.includes('create user') && (
                            <button
                            type="button"
                            onClick={openAddFormModal}
                            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-[#213389] hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                            >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5 mr-2 -ml-1 text-white"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                            </svg>
                            Add New Users 
                            </button>
                        )}

                        {/* Modal */}
                        {isOpenAddForm && (
                            <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center" style={{ marginLeft:0 }}>
                                <div className="absolute w-full h-full bg-gray-900 dark:bg-[#121212] opacity-50"></div>
                                <div className="bg-white w-3/4 p-6 rounded-lg z-50 dark:bg-[#1e1e1e]">
                                    {/* Modal header */}
                                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Add New User
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={closeAddFormModal}
                                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                            data-modal-toggle="crud-modal"
                                            >
                                        <svg
                                                className="w-3 h-3"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 14 14"
                                            >
                                                <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                                />
                                            </svg>
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    {/* Modal body */}
                                    <form className="p-4 md:p-5" onSubmit={submitForm} encType="multipart/form-data">
                                        <div className="grid gap-6 mb-6 md:grid-cols-2">
                                            <div>
                                                <div className="mb-6">
                                                    <label
                                                        htmlFor="user_name"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        User Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="user_name"
                                                        onChange={e => setuser_name(e.target.value)}
                                                        name="user_name"
                                                        value={user_name}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        placeholder="John"
                                                        required=""
                                                    />
                                                </div>
                                                <div className="mb-6">
                                                    <label
                                                        htmlFor="last_name"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        onChange={e => setEmail(e.target.value)}
                                                        name="email"
                                                        value={email}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        placeholder="Doe"
                                                        required=""
                                                    />
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="company"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        onChange={e => setName(e.target.value)}
                                                        name="name"
                                                        value={name}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        placeholder="Jhon"
                                                        required=""
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div class="flex items-center justify-center w-full">
                                                    <label for="dropzone-file" class="flex flex-col items-center justify-center w-52 h-52 text-center border-2 border-gray-300 border-dashed rounded-[105px] cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                            </svg>
                                                            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                                                            <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                                        </div>
                                                        <input id="dropzone-file" type="file" class="hidden"/>
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
                                            <input
                                                type="num"
                                                id="contact_no"
                                                onChange={e => setContact_no(e.target.value)}
                                                name="name"
                                                value={contact_no}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="123-45-678"
                                                required=""
                                            />
                                            </div>
                                            <div>
                                            <label
                                                htmlFor="address"
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Address
                                            </label>
                                            <input
                                                type="text"
                                                id="address"
                                                onChange={e => setAddress(e.target.value)}
                                                name="address"
                                                value={address}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder=""
                                                required=""
                                            />
                                            </div>
                                            <div>
                                                <button
                                                    id="dropdownSearchButton"
                                                    data-dropdown-toggle="dropdownSearch"
                                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                    type="button"
                                                    onClick={toggleRoleListHandler}
                                                >
                                                    Dropdown search{" "}
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
                                                {/* Dropdown menu */}
                                                <div data-collapse={isOpenRoleList} ref={refRoleList}>
                                                    <div
                                                        id="dropdownSearch"
                                                        className="z-10 hidden absolute bg-white rounded-lg shadow w-60 dark:bg-gray-700 rolelist"
                                                    >
                                                        <div className="p-3">
                                                        <label htmlFor="input-group-search" className="sr-only">
                                                            Search
                                                        </label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
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
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                            placeholder="Search user"
                                                            />
                                                        </div>
                                                        </div>
                                                        <ul
                                                        className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
                                                        aria-labelledby="dropdownSearchButton"
                                                        >
                                                        {roleArray.map(Role => (
                                                            <li>
                                                                <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                                                <input
                                                                    id="checkbox-item-11"
                                                                    type="checkbox"
                                                                    value={Role.name}
                                                                    onChange={handleCheckboxChange} 
                                                                    checked={selectedValues.includes(Role.name)}
                                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                                />
                                                                <label
                                                                    htmlFor="checkbox-item-11"
                                                                    className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                                                                >
                                                                    {Role.name}
                                                                </label>
                                                                </div>
                                                            </li>
                                                        ))}
                                                        </ul>
                                                        {/* <a
                                                        href="#"
                                                        className="flex items-center p-3 text-sm font-medium text-red-600 border-t border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-red-500 hover:underline"
                                                        >
                                                        <svg
                                                            className="w-4 h-4 me-2"
                                                            aria-hidden="true"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 18"
                                                        >
                                                            <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-6a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2Z" />
                                                        </svg>
                                                        Delete user
                                                        </a> */}
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
                                                <textarea id="user_description" rows="4" 
                                                onChange={e => setuser_description(e.target.value)}
                                                name="user_description"
                                                value={user_description}
                                                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>
                                            </div>
                                        </div>
                                        {/* 
                                        <div className="flex items-start mb-6">
                                            <div className="flex items-center h-5">
                                            <input
                                                id="remember"
                                                type="checkbox"
                                                defaultValue=""
                                                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                                                required=""
                                            />
                                            </div>
                                            <label
                                            htmlFor="remember"
                                            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                            >
                                            I agree with the{" "}
                                            <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">
                                                terms and conditions
                                            </a>
                                            .
                                            </label>
                                        </div> */}
                                        <button
                                            type="submit"
                                            className="text-white bg-[#213389] hover:bg-[#213389] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-[#213389] dark:hover:bg-[#213389] dark:focus:ring-blue-800"
                                        >
                                            Save User details
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col items-center justify-between py-4 px-1.5 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
                        <div className="w-full md:w-1/2">
                        <form className="flex items-center">
                            <label htmlFor="simple-search" className="sr-only">
                            Search
                            </label>
                            <div className="w-full">
                            <input
                                type="text"
                                id="simple-search"
                                className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-[#3c4042] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Search"
                                required=""
                            />
                            </div>
                        </form>
                        </div>
                        <div className="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
                        <div className="flex items-center w-[500px] space-x-3 md:w-auto">
                            <button
                                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg md:w-auto focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-[#3c4042] dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-[#606368]"
                                type="button"
                                >
                                Export CSV
                            </button>
                            {/* <button
                            id="actionsDropdownButton"
                            data-dropdown-toggle="actionsDropdown"
                            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg md:w-auto focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-[#3c4042] dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-[#606368]"
                            type="button"
                            >
                            <svg
                                className="-ml-1 mr-1.5 w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path
                                clipRule="evenodd"
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                />
                            </svg>
                            Actions
                            </button>
                            <div
                            id="actionsDropdown"
                            className="z-10 hidden bg-white divide-y divide-gray-100 rounded shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                            >
                            <ul
                                className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                aria-labelledby="actionsDropdownButton"
                            >
                                <li>
                                <a
                                    href="#"
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    Mass Edit
                                </a>
                                </li>
                            </ul>
                            <div className="py-1">
                                <a
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                >
                                Delete all
                                </a>
                            </div>
                            </div> */}
                            <button
                            id="filterDropdownButton"
                            data-dropdown-toggle="filterDropdown"
                            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg md:w-auto focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-[#3c4042] dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-[#606368]"
                            type="button"
                            >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                className="w-4 h-4 mr-2 text-gray-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                fillRule="evenodd"
                                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                                clipRule="evenodd"
                                />
                            </svg>
                            Filter
                            <svg
                                className="-mr-1 ml-1.5 w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path
                                clipRule="evenodd"
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                />
                            </svg>
                            </button>
                            {/* Dropdown menu */}
                            <div
                            id="filterDropdown"
                            className="z-10 hidden w-48 p-3 bg-white rounded-lg shadow dark:bg-gray-700"
                            >
                            <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                                Category
                            </h6>
                            <ul
                                className="space-y-2 text-sm"
                                aria-labelledby="dropdownDefault"
                            >
                                <li className="flex items-center">
                                <input
                                    id="apple"
                                    type="checkbox"
                                    defaultValue=""
                                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                />
                                <label
                                    htmlFor="apple"
                                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                                >
                                    Apple (56)
                                </label>
                                </li>
                                <li className="flex items-center">
                                <input
                                    id="fitbit"
                                    type="checkbox"
                                    defaultValue=""
                                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                />
                                <label
                                    htmlFor="fitbit"
                                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                                >
                                    Fitbit (56)
                                </label>
                                </li>
                                <li className="flex items-center">
                                <input
                                    id="dell"
                                    type="checkbox"
                                    defaultValue=""
                                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                />
                                <label
                                    htmlFor="dell"
                                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                                >
                                    Dell (56)
                                </label>
                                </li>
                                <li className="flex items-center">
                                <input
                                    id="asus"
                                    type="checkbox"
                                    defaultValue=""
                                    defaultChecked=""
                                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                />
                                <label
                                    htmlFor="asus"
                                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                                >
                                    Asus (97)
                                </label>
                                </li>
                            </ul>
                            </div>
                            <div className="inline-flex rounded-md shadow-sm" role="group">
                                <button
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b rounded-s-lg border-gray-200 md:w-auto focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:ring-4 focus:ring-gray-200 dark:focus:text-white dark:focus:ring-gray-700 dark:bg-[#3c4042] dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-[#606368]"
                                    onClick={() => handleSwitchView('grid')}
                                >
                                    <IoGrid />
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b rounded-e-lg border-gray-200 md:w-auto focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:ring-4 focus:ring-gray-200 dark:focus:text-white dark:focus:ring-gray-700 dark:bg-[#3c4042] dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-[#606368]"
                                    onClick={() => handleSwitchView('list')}
                                >
                                    <FaList />
                                </button>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {view === 'list' ? 
            <div className="flex items-center justify-center my-5 rounded bg-gray-50 dark:bg-[#1e1e1e] tablelist">
                <div className="overflow-x-auto border border-gray-200 sm:rounded-lg w-[-webkit-fill-available]">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-[#606368] dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                            
                            </th>
                            <th scope="col" className="px-6 py-3">
                            User Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                            Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                            Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                            Contact Number
                            </th>
                            <th scope="col" className="px-6 py-3">
                            Roles
                            </th>
                            <th scope="col" className="px-6 py-3">
                            Status
                            </th>
                            <th scope="col" className="px-6 py-3">
                            Action
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                            {userArray.map(Users => (
                                <tr className="odd:bg-white odd:dark:bg-[#1e1e1e] even:bg-gray-50 even:dark:bg-[#3c4042] border-b dark:border-gray-700">
                                    <td className="px-6 py-4">
                                        <img
                                        className="w-12 h-12 rounded-full shadow-lg"
                                        src="/avater.png"
                                        alt="Bonnie image"
                                        />
                                    </td>
                                    <td
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                    >
                                    {Users.user_name}
                                    </td>
                                    <td className="px-6 py-4">{Users.email}</td>
                                    <td className="px-6 py-4">{Users.name}</td>
                                    <td className="px-6 py-4">{Users.contact_no}</td>
                                    <td className="px-6 py-4">
                                        {Users.roles.map(roles => (
                                            <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
                                                <li className="flex items-center">
                                                <svg
                                                    className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                                </svg>
                                                    {roles.name}
                                                </li>
                                            </ul>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className='flex flex-col w-[50%] justify-between items-center'>
                                            {/* <button onClick={() => handleToggle(Users.id, Users.status)}>
                                                {Users.status ? 'Deactivate' : 'Activate'}
                                            </button> */}

                                            {/* <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={Users.status}
                                                    onChange={() => handleToggle(Users.id, Users.status)}
                                                />
                                                <span className="slider round"></span>
                                            </label> */}
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {Users.status ? 'Active' : 'Inactive'} 
                                            </span>
                                            {/* status change */}
                                            {thisuserpermissionArray.includes('user status change') && (
                                                <label className="inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" checked={Users.status} className="sr-only peer" onChange={() => handleToggle(Users.id, Users.status)}/>
                                                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600" />
                                                    {/* <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                        Green
                                                    </span> */}
                                                </label>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className='flex w-[75%] justify-between'>
                                            {/* password reset */}
                                            {thisuserpermissionArray.includes('user password reset') && (
                                                <a
                                                    onClick={() => handleToggleResetpasswordModel(Users.id)}
                                                >
                                                    <RiLockPasswordLine className='text-gray-700 text-2xl dark:text-white'/>
                                                </a>
                                            )}
                                            {/* password reset Modal */}
                                            {expandedResetpasswordModel === Users.id && (
                                                <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center" style={{ marginLeft:0 }}>
                                                        <div className="absolute w-full h-full bg-gray-900 dark:bg-[#121212] opacity-50"></div>
                                                        <div className="bg-white w-1/2 p-6 rounded-lg z-50 dark:bg-[#1e1e1e]">
                                                            {/* Modal header */}
                                                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                    If you want reset {Users.user_name}'s password, please enter "{Users.user_name}" on below feild
                                                                </h3>
                                                                <button
                                                                    type="button"
                                                                    onClick={closeResetpasswordModel}
                                                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                                                    data-modal-toggle="crud-modal"
                                                                    >
                                                                <svg
                                                                        className="w-3 h-3"
                                                                        aria-hidden="true"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 14 14"
                                                                    >
                                                                        <path
                                                                        stroke="currentColor"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                                                        />
                                                                    </svg>
                                                                    <span className="sr-only">Close modal</span>
                                                                </button>
                                                            </div>
                                                            {/* Modal body */}
                                                            <form className="p-4 md:p-5" onSubmit={submitPasswordForm}>
                                                                <div className="grid gap-4 mb-4 grid-cols-2">
                                                                    {formerror && <p className="text-sm text-gray-500 dark:text-gray-400">{formerror}</p>}
                                                                    {formemessage && <p className="text-sm text-green-600 dark:text-green-600">{formemessage}</p>}  
                                                                    <div className="col-span-2">
                                                                        <input
                                                                        type="hidden"
                                                                        name="id"
                                                                        id="id"
                                                                        value={Users.id}
                                                                        />
                                                                        <input
                                                                        type="hidden"
                                                                        name="resetrowname"
                                                                        id="resetrowname"
                                                                        value={Users.user_name}
                                                                        />
                                                                        <input
                                                                        onChange={e => setResetName(e.target.value)}
                                                                        type="text"
                                                                        name="name"
                                                                        id="name"
                                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                        required=""
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="submit"
                                                                    className="text-white inline-flex items-center bg-[#D32D41] hover:bg-[#D32D41] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#D32D41] dark:hover:bg-[#D32D41] dark:focus:ring-blue-800"
                                                                    >
                                                                    Reset {Users.user_name}'s password
                                                                </button>
                                                            </form>
                                                        </div>
                                                </div>
                                            )}

                                            {/* edite user */}
                                            {thisuserpermissionArray.includes('update user') && (
                                                <a
                                                    onClick={() => handleToggleEditeRoleModel(Users.id)}
                                                >
                                                    <FaPenToSquare className='text-[#DBAE58] text-2xl'/>
                                                </a>
                                            )}
                                            {/* Edite Modal */}
                                            {expandedEditeRoleModel === Users.id && (
                                                <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center" style={{ marginLeft:0 }}>
                                                        <div className="absolute w-full h-full bg-gray-900 dark:bg-[#121212] opacity-50"></div>
                                                        <div className="bg-white w-3/4 p-6 rounded-lg z-50 dark:bg-[#1e1e1e]">
                                                            {/* Modal header */}
                                                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                    Update {Users.user_name}
                                                                </h3>
                                                                <button
                                                                    type="button"
                                                                    onClick={closeEditeRoleModel}
                                                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                                                    data-modal-toggle="crud-modal"
                                                                    >
                                                                <svg
                                                                        className="w-3 h-3"
                                                                        aria-hidden="true"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 14 14"
                                                                    >
                                                                        <path
                                                                        stroke="currentColor"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                                                        />
                                                                    </svg>
                                                                    <span className="sr-only">Close modal</span>
                                                                </button>
                                                            </div>
                                                            {/* Modal body */}
                                                            <form className="p-4 md:p-5" onSubmit={submitEditeForm}>
                                                                <div className="grid gap-6 mb-6 md:grid-cols-2">
                                                                    <input type="hidden" name="editid" id="editid" value={Users.id}/>
                                                                    <div>
                                                                        <div className="mb-6">
                                                                            <label
                                                                                htmlFor="user_name"
                                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                                            >
                                                                                User Name
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                id="user_name"
                                                                                onChange={e => setEditeuser_name(e.target.value)}
                                                                                name="user_name"
                                                                                value={user_name}
                                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                                placeholder="John"
                                                                                required=""
                                                                            />
                                                                        </div>
                                                                        <div className="mb-6">
                                                                            <label
                                                                                htmlFor="last_name"
                                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                                            >
                                                                                Email
                                                                            </label>
                                                                            <input
                                                                                type="email"
                                                                                id="email"
                                                                                onChange={e => setEditeEmail(e.target.value)}
                                                                                name="email"
                                                                                value={email}
                                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                                placeholder="Doe"
                                                                                required=""
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label
                                                                                htmlFor="company"
                                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                                            >
                                                                                Name
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                id="name"
                                                                                onChange={e => setEditeName(e.target.value)}
                                                                                name="name"
                                                                                value={name}
                                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                                placeholder="Jhon"
                                                                                required=""
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div class="flex items-center justify-center w-full">
                                                                            <label for="dropzone-file" class="flex flex-col items-center justify-center w-52 h-52 text-center border-2 border-gray-300 border-dashed rounded-[105px] cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                                                                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                                                                    <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                                                    </svg>
                                                                                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                                                                                    <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                                                                </div>
                                                                                <input id="dropzone-file" type="file" class="hidden"/>
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
                                                                    <input
                                                                        type="num"
                                                                        id="contact_no"
                                                                        onChange={e => setEditeContact_no(e.target.value)}
                                                                        name="name"
                                                                        value={contact_no}
                                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                        placeholder="123-45-678"
                                                                        required=""
                                                                    />
                                                                    </div>
                                                                    <div>
                                                                    <label
                                                                        htmlFor="address"
                                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                                    >
                                                                        Address
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        id="address"
                                                                        onChange={e => setEditeAddress(e.target.value)}
                                                                        name="address"
                                                                        value={address}
                                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                        placeholder=""
                                                                        required=""
                                                                    />
                                                                    </div>
                                                                    <div>
                                                                        <button
                                                                            id="dropdownSearchButton"
                                                                            data-dropdown-toggle="dropdownSearch"
                                                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                                            type="button"
                                                                            onClick={toggleRoleListHandler}
                                                                        >
                                                                            Dropdown search{" "}
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
                                                                        {/* Dropdown menu */}
                                                                        <div data-collapse={isOpenRoleList} ref={refRoleList}>
                                                                            <div
                                                                                id="dropdownSearch"
                                                                                className="z-10 hidden absolute bg-white rounded-lg shadow w-60 dark:bg-gray-700 rolelist"
                                                                            >
                                                                                <div className="p-3">
                                                                                <label htmlFor="input-group-search" className="sr-only">
                                                                                    Search
                                                                                </label>
                                                                                <div className="relative">
                                                                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
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
                                                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                                    placeholder="Search user"
                                                                                    />
                                                                                </div>
                                                                                </div>
                                                                                <ul
                                                                                className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
                                                                                aria-labelledby="dropdownSearchButton"
                                                                                >
                                                                                {roleArray.map(Role => (
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
                                                                                            className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                                                                                        >
                                                                                            {Role.name}
                                                                                        </label>
                                                                                        </div>
                                                                                    </li>
                                                                                ))}
                                                                                </ul>
                                                                                {/* <a
                                                                                href="#"
                                                                                className="flex items-center p-3 text-sm font-medium text-red-600 border-t border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-red-500 hover:underline"
                                                                                >
                                                                                <svg
                                                                                    className="w-4 h-4 me-2"
                                                                                    aria-hidden="true"
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    fill="currentColor"
                                                                                    viewBox="0 0 20 18"
                                                                                >
                                                                                    <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-6a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2Z" />
                                                                                </svg>
                                                                                Delete user
                                                                                </a> */}
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
                                                                        <textarea id="user_description" rows="4" 
                                                                        onChange={e => setEditeuser_description(e.target.value)}
                                                                        name="user_description"
                                                                        value={user_description}
                                                                        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>
                                                                    </div>
                                                                </div>
                                                                {/* 
                                                                <div className="flex items-start mb-6">
                                                                    <div className="flex items-center h-5">
                                                                    <input
                                                                        id="remember"
                                                                        type="checkbox"
                                                                        defaultValue=""
                                                                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                                                                        required=""
                                                                    />
                                                                    </div>
                                                                    <label
                                                                    htmlFor="remember"
                                                                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                                    >
                                                                    I agree with the{" "}
                                                                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">
                                                                        terms and conditions
                                                                    </a>
                                                                    .
                                                                    </label>
                                                                </div> */}
                                                                <button
                                                                    type="submit"
                                                                    className="text-white bg-[#213389] hover:bg-[#213389] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-[#213389] dark:hover:bg-[#213389] dark:focus:ring-blue-800"
                                                                >
                                                                    Save User details
                                                                </button>
                                                            </form>
                                                        </div>
                                                </div>
                                            )}

                                            {/* delete user */}
                                            {thisuserpermissionArray.includes('delete user') && (
                                                <a
                                                    onClick={() => handleToggleDeleteRoleModel(Users.id)}
                                                >
                                                    <MdDelete className='text-[#D32D41] text-2xl'/>
                                                </a>
                                            )}
                                            {/* Delete Modal */}
                                            {expandedDeleteRoleModel === Users.id && (
                                                <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center" style={{ marginLeft:0 }}>
                                                        <div className="absolute w-full h-full bg-gray-900 dark:bg-[#121212] opacity-50"></div>
                                                        <div className="bg-white w-1/2 p-6 rounded-lg z-50 dark:bg-[#1e1e1e]">
                                                            {/* Modal header */}
                                                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                    If you want Delete {Users.user_name}, please enter "{Users.user_name}" on below feild
                                                                </h3>
                                                                <button
                                                                    type="button"
                                                                    onClick={closeDeleteRoleModel}
                                                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                                                    data-modal-toggle="crud-modal"
                                                                    >
                                                                <svg
                                                                        className="w-3 h-3"
                                                                        aria-hidden="true"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 14 14"
                                                                    >
                                                                        <path
                                                                        stroke="currentColor"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                                                        />
                                                                    </svg>
                                                                    <span className="sr-only">Close modal</span>
                                                                </button>
                                                            </div>
                                                            {/* Modal body */}
                                                            <form className="p-4 md:p-5" onSubmit={submitDeleteForm}>
                                                                <div className="grid gap-4 mb-4 grid-cols-2">
                                                                    {formerror && <p className="text-sm text-gray-500 dark:text-gray-400">{formerror}</p>}  
                                                                    <div className="col-span-2">
                                                                        <input
                                                                        type="hidden"
                                                                        name="id"
                                                                        id="id"
                                                                        value={Users.id}
                                                                        />
                                                                        <input
                                                                        type="hidden"
                                                                        name="deleterowname"
                                                                        id="deleterowname"
                                                                        value={Users.user_name}
                                                                        />
                                                                        <input
                                                                        onChange={e => setDeleteName(e.target.value)}
                                                                        type="text"
                                                                        name="name"
                                                                        id="name"
                                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                        required=""
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="submit"
                                                                    className="text-white inline-flex items-center bg-[#D32D41] hover:bg-[#D32D41] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#D32D41] dark:hover:bg-[#D32D41] dark:focus:ring-blue-800"
                                                                    >
                                                                    Delete {Users.user_name}
                                                                </button>
                                                            </form>
                                                        </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        : 
            <div className="grid gap-2 2xl:grid-cols-5 min-[1200px]:grid-cols-3 min-[840px]:grid-cols-2 mb-4 rounded bg-gray-50 dark:bg-[#121212]">
            {userArray.map(Users => (
                <div className="w-full p-5 my-5 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-[#1e1e1e] dark:border-gray-700">
                    <div className='flex'>
                            <img
                            className="w-24 h-24 mb-3 rounded-full shadow-lg"
                            src="/avater.png"
                            alt="Bonnie image"
                            />
                            <div className="ml-4">
                                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                                {Users.user_name}
                                </h5>
                                {Users.roles.map(roles => (
                                    <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
                                        <li className="flex items-center">
                                        <svg
                                            className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                        </svg>
                                            {roles.name}
                                        </li>
                                    </ul>
                                ))}
                            </div>
                    </div>
                    <div className="flex mt-4 md:mt-6 justify-start items-center">
                        <div className='flex flex-col w-[50%] justify-between items-center'>
                            {/* <button onClick={() => handleToggle(Users.id, Users.status)}>
                                {Users.status ? 'Deactivate' : 'Activate'}
                            </button> */}

                            {/* <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={Users.status}
                                    onChange={() => handleToggle(Users.id, Users.status)}
                                />
                                <span className="slider round"></span>
                            </label> */}
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {Users.status ? 'Active' : 'Inactive'}
                            </span>
                            {/* change user status */}
                            {thisuserpermissionArray.includes('user status change') && (
                                <label className="inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={Users.status} className="sr-only peer" onChange={() => handleToggle(Users.id, Users.status)}/>
                                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600" />
                                    {/* <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        Green
                                    </span> */}
                                </label>
                            )}
                        </div>
                        <div className='flex w-[35%] justify-between'>

                            {/* user password reset */}
                            {thisuserpermissionArray.includes('user password reset') && (
                                <a
                                    onClick={() => handleToggleResetpasswordModel(Users.id)}
                                >
                                    <RiLockPasswordLine className='text-gray-700 text-2xl dark:text-white'/>
                                </a>
                            )}
                            {/* password reset Modal */}
                            {expandedResetpasswordModel === Users.id && (
                                <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center" style={{ marginLeft:0 }}>
                                        <div className="absolute w-full h-full bg-gray-900 dark:bg-[#121212] opacity-50"></div>
                                        <div className="bg-white w-1/2 p-6 rounded-lg z-50 dark:bg-[#1e1e1e]">
                                            {/* Modal header */}
                                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    If you want reset {Users.user_name}'s password, please enter "{Users.user_name}" on below feild
                                                </h3>
                                                <button
                                                    type="button"
                                                    onClick={closeResetpasswordModel}
                                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                                    data-modal-toggle="crud-modal"
                                                    >
                                                <svg
                                                        className="w-3 h-3"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 14 14"
                                                    >
                                                        <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                                        />
                                                    </svg>
                                                    <span className="sr-only">Close modal</span>
                                                </button>
                                            </div>
                                            {/* Modal body */}
                                            <form className="p-4 md:p-5" onSubmit={submitPasswordForm}>
                                                <div className="grid gap-4 mb-4 grid-cols-2">
                                                    {formerror && <p className="text-sm text-gray-500 dark:text-gray-400">{formerror}</p>}
                                                    {formemessage && <p className="text-sm text-green-600 dark:text-green-600">{formemessage}</p>}  
                                                    <div className="col-span-2">
                                                        <input
                                                        type="hidden"
                                                        name="id"
                                                        id="id"
                                                        value={Users.id}
                                                        />
                                                        <input
                                                        type="hidden"
                                                        name="resetrowname"
                                                        id="resetrowname"
                                                        value={Users.user_name}
                                                        />
                                                        <input
                                                        onChange={e => setResetName(e.target.value)}
                                                        type="text"
                                                        name="name"
                                                        id="name"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        required=""
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="text-white inline-flex items-center bg-[#D32D41] hover:bg-[#D32D41] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#D32D41] dark:hover:bg-[#D32D41] dark:focus:ring-blue-800"
                                                    >
                                                    Reset {Users.user_name}'s password
                                                </button>
                                            </form>
                                        </div>
                                </div>
                            )}

                            {/* edite user */}
                            {thisuserpermissionArray.includes('update user') && (
                                <a
                                    onClick={() => handleToggleEditeRoleModel(Users.id)}
                                >
                                    <FaPenToSquare className='text-[#DBAE58] text-2xl'/>
                                </a>
                            )}
                            {/* Edite Modal */}
                            {expandedEditeRoleModel === Users.id && (
                                <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center" style={{ marginLeft:0 }}>
                                        <div className="absolute w-full h-full bg-gray-900 dark:bg-[#121212] opacity-50"></div>
                                        <div className="bg-white w-3/4 p-6 rounded-lg z-50 dark:bg-[#1e1e1e]">
                                            {/* Modal header */}
                                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    Update {Users.user_name}
                                                </h3>
                                                <button
                                                    type="button"
                                                    onClick={closeEditeRoleModel}
                                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                                    data-modal-toggle="crud-modal"
                                                    >
                                                <svg
                                                        className="w-3 h-3"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 14 14"
                                                    >
                                                        <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                                        />
                                                    </svg>
                                                    <span className="sr-only">Close modal</span>
                                                </button>
                                            </div>
                                            {/* Modal body */}
                                            <form className="p-4 md:p-5" onSubmit={submitEditeForm}>
                                                <div className="grid gap-6 mb-6 md:grid-cols-2">
                                                    <input type="hidden" name="editid" id="editid" value={Users.id}/>
                                                    <div>
                                                        <div className="mb-6">
                                                            <label
                                                                htmlFor="user_name"
                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                            >
                                                                User Name
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="user_name"
                                                                onChange={e => setEditeuser_name(e.target.value)}
                                                                name="user_name"
                                                                value={user_name}
                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                placeholder="John"
                                                                required=""
                                                            />
                                                        </div>
                                                        <div className="mb-6">
                                                            <label
                                                                htmlFor="last_name"
                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Email
                                                            </label>
                                                            <input
                                                                type="email"
                                                                id="email"
                                                                onChange={e => setEditeEmail(e.target.value)}
                                                                name="email"
                                                                value={email}
                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                placeholder="Doe"
                                                                required=""
                                                            />
                                                        </div>
                                                        <div>
                                                            <label
                                                                htmlFor="company"
                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Name
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="name"
                                                                onChange={e => setEditeName(e.target.value)}
                                                                name="name"
                                                                value={name}
                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                placeholder="Jhon"
                                                                required=""
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div class="flex items-center justify-center w-full">
                                                            <label for="dropzone-file" class="flex flex-col items-center justify-center w-52 h-52 text-center border-2 border-gray-300 border-dashed rounded-[105px] cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                                                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                                                    <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                                    </svg>
                                                                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                                                                    <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                                                </div>
                                                                <input id="dropzone-file" type="file" class="hidden"/>
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
                                                    <input
                                                        type="num"
                                                        id="contact_no"
                                                        onChange={e => setEditeContact_no(e.target.value)}
                                                        name="name"
                                                        value={contact_no}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        placeholder="123-45-678"
                                                        required=""
                                                    />
                                                    </div>
                                                    <div>
                                                    <label
                                                        htmlFor="address"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Address
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="address"
                                                        onChange={e => setEditeAddress(e.target.value)}
                                                        name="address"
                                                        value={address}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        placeholder=""
                                                        required=""
                                                    />
                                                    </div>
                                                    <div>
                                                        <button
                                                            id="dropdownSearchButton"
                                                            data-dropdown-toggle="dropdownSearch"
                                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                            type="button"
                                                            onClick={toggleRoleListHandler}
                                                        >
                                                            Dropdown search{" "}
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
                                                        {/* Dropdown menu */}
                                                        <div data-collapse={isOpenRoleList} ref={refRoleList}>
                                                            <div
                                                                id="dropdownSearch"
                                                                className="z-10 hidden absolute bg-white rounded-lg shadow w-60 dark:bg-gray-700 rolelist"
                                                            >
                                                                <div className="p-3">
                                                                <label htmlFor="input-group-search" className="sr-only">
                                                                    Search
                                                                </label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
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
                                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                    placeholder="Search user"
                                                                    />
                                                                </div>
                                                                </div>
                                                                <ul
                                                                className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
                                                                aria-labelledby="dropdownSearchButton"
                                                                >
                                                                {roleArray.map(Role => (
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
                                                                            className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                                                                        >
                                                                            {Role.name}
                                                                        </label>
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                                </ul>
                                                                {/* <a
                                                                href="#"
                                                                className="flex items-center p-3 text-sm font-medium text-red-600 border-t border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-red-500 hover:underline"
                                                                >
                                                                <svg
                                                                    className="w-4 h-4 me-2"
                                                                    aria-hidden="true"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 18"
                                                                >
                                                                    <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-6a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2Z" />
                                                                </svg>
                                                                Delete user
                                                                </a> */}
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
                                                        <textarea id="user_description" rows="4" 
                                                        onChange={e => setEditeuser_description(e.target.value)}
                                                        name="user_description"
                                                        value={user_description}
                                                        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>
                                                    </div>
                                                </div>
                                                {/* 
                                                <div className="flex items-start mb-6">
                                                    <div className="flex items-center h-5">
                                                    <input
                                                        id="remember"
                                                        type="checkbox"
                                                        defaultValue=""
                                                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                                                        required=""
                                                    />
                                                    </div>
                                                    <label
                                                    htmlFor="remember"
                                                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                    >
                                                    I agree with the{" "}
                                                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">
                                                        terms and conditions
                                                    </a>
                                                    .
                                                    </label>
                                                </div> */}
                                                <button
                                                    type="submit"
                                                    className="text-white bg-[#213389] hover:bg-[#213389] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-[#213389] dark:hover:bg-[#213389] dark:focus:ring-blue-800"
                                                >
                                                    Save User details
                                                </button>
                                            </form>
                                        </div>
                                </div>
                            )}

                            {/* delete user */}
                            {thisuserpermissionArray.includes('delete user') && (
                                <a
                                    onClick={() => handleToggleDeleteRoleModel(Users.id)}
                                >
                                    <MdDelete className='text-[#D32D41] text-2xl'/>
                                </a>
                            )}
                            {/* Delete Modal */}
                            {expandedDeleteRoleModel === Users.id && (
                                <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center" style={{ marginLeft:0 }}>
                                        <div className="absolute w-full h-full bg-gray-900 dark:bg-[#121212] opacity-50"></div>
                                        <div className="bg-white w-1/2 p-6 rounded-lg z-50 dark:bg-[#1e1e1e]">
                                            {/* Modal header */}
                                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    If you want Delete {Users.user_name}, please enter "{Users.user_name}" on below feild
                                                </h3>
                                                <button
                                                    type="button"
                                                    onClick={closeDeleteRoleModel}
                                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                                    data-modal-toggle="crud-modal"
                                                    >
                                                <svg
                                                        className="w-3 h-3"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 14 14"
                                                    >
                                                        <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                                        />
                                                    </svg>
                                                    <span className="sr-only">Close modal</span>
                                                </button>
                                            </div>
                                            {/* Modal body */}
                                            <form className="p-4 md:p-5" onSubmit={submitDeleteForm}>
                                                <div className="grid gap-4 mb-4 grid-cols-2">
                                                    {formerror && <p className="text-sm text-gray-500 dark:text-gray-400">{formerror}</p>}  
                                                    <div className="col-span-2">
                                                        <input
                                                        type="hidden"
                                                        name="id"
                                                        id="id"
                                                        value={Users.id}
                                                        />
                                                        <input
                                                        type="hidden"
                                                        name="deleterowname"
                                                        id="deleterowname"
                                                        value={Users.user_name}
                                                        />
                                                        <input
                                                        onChange={e => setDeleteName(e.target.value)}
                                                        type="text"
                                                        name="name"
                                                        id="name"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        required=""
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="text-white inline-flex items-center bg-[#D32D41] hover:bg-[#D32D41] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#D32D41] dark:hover:bg-[#D32D41] dark:focus:ring-blue-800"
                                                    >
                                                    Delete {Users.user_name}
                                                </button>
                                            </form>
                                        </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            </div>
        }

        <nav aria-label="Page navigation example" className="flex justify-end">
            <ul class="inline-flex -space-x-px text-sm">
                <li>
                <a href="#" class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-[#3c4042] dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
                </li>
                <li>
                <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-[#3c4042] dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
                </li>
                <li>
                <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-[#3c4042] dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
                </li>
                <li>
                <a href="#" aria-current="page" class="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-[#606368] hover:text-blue-700 dark:border-gray-700 dark:bg-[#606368] dark:hover:bg-[#3c4042] dark:text-white">3</a>
                </li>
                <li>
                <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-[#3c4042] dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">4</a>
                </li>
                <li>
                <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-[#3c4042] dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">5</a>
                </li>
                <li>
                <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-[#3c4042] dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
                </li>
            </ul>
        </nav>
        </div>
    );
}