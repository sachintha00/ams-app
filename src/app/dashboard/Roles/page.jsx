'use client'
import React, { useEffect, useState, useContext, useRef } from 'react';
import { IoGrid } from "react-icons/io5";
import { FaList } from "react-icons/fa";
import { FaUserCog } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaPenToSquare } from "react-icons/fa6";
import { FaUserLock } from "react-icons/fa";
import { redirect, useRouter } from 'next/navigation';
import { useAddNewRoleMutation, useDeleteRoleMutation, useEditeRoleMutation, useGivePermissiontoRoleMutation, useRolesListQuery } from '@/app/_lib/redux/features/role/role_api';
import { useSelector } from 'react-redux';
import Link from 'next/link';

export default function Roles() {
    const [view, setView] = useState('grid');
    const [expandedAddPermisionModel, setExpandedAddPermisionModel] = useState(false);
    const [expandedEditeRoleModel, setExpandedEditeRoleModel] = useState(false);
    const [expandedDeleteRoleModel, setExpandedDeleteRoleModel] = useState(false);
    const [isOpenAddForm, setIsOpenAddFormModel] = useState(false);
    const [formerror, setError] = useState('');

    const handleSwitchView = (newView) => {
        setView(newView);
    };

    // add permisson model
    const handleToggleAddPermisionModel = (rowId) => {
        setExpandedAddPermisionModel(rowId === expandedAddPermisionModel ? false : rowId);
    };

    const closeAddPermisionModel = () => {
        setExpandedAddPermisionModel(false);
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

    // role list and permission list(for give permission)
    const [roleArray, setRoleArray] = useState([]); // State to hold converted array
    const [permissionlistItems, setPermissionlistItems] = useState([]);
    const [thisuserpermissionArray, setthisuserpermissionArray] = useState([]);

    const {
        data: RoleList,
        isLoading,
        isError,
        error,
        refetch,
      } = useRolesListQuery();

      function buildTree(data, parentId = null) {
        const children = data.filter((node) => node.parent_id === parentId);
        return children.map((child) => ({
          id: child.id,
          name: child.name,
          description: child.description,
          parentNode: parentId,
          children: buildTree(data, child.id),
        }));
      }
      
      const organizationTableDataToTreeStructure = (organizationData) => {
        const rootNodes = organizationData.filter((node) => node.parent_id === null);
        const transformedData = rootNodes.map((root) => ({
          id: root.id,
          name: root.name,
          description: root.description,
          parentNode: null,
          children: buildTree(organizationData, root.id),
        }));
        return transformedData;
      };

    const permissions = useSelector(state => state.auth.permissions);
  
    useEffect(() => {
        if (!isLoading && !isError && RoleList) {
            setRoleArray(Object.values(RoleList.Role));
            setthisuserpermissionArray(permissions);

            const permissionmenuItems = organizationTableDataToTreeStructure(RoleList.Permission);
            setPermissionlistItems(permissionmenuItems);
        }
    }, [isLoading, isError, RoleList, refetch]);

    // add role
    const [addNewRole] = useAddNewRoleMutation();  
    const router = useRouter();
    
    //add role form data
    const [name, setName] = useState("");
    const [role_description, setrole_description] = useState("");

    // Submit From
    const submitForm = async e => {
        e.preventDefault();

        try {
            const role = {name: name, description: role_description}
            addNewRole(role)
            .unwrap()
            .then((response) => {
                console.log("New node added:", response);
                // router.push("/dashboard/usergroups");
                setName("");
                setrole_description("");
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
    const [editeRole] = useEditeRoleMutation();
    const [editename, setEditeName] = useState("");
    const [editerole_description, setEditerole_description] = useState("");

    //edite Submit Role From
    const submitEditeForm = async e => {
        const editeid = e.target.editid.value;
        console.log(editeid);
        e.preventDefault();

        try {
            const role = {id: editeid, name: editename, description: editerole_description}
            editeRole(role)
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

    //delete role form data
    const [deleteRole] = useDeleteRoleMutation();
    const [deletename, setDeleteName] = useState("");

    //delete Submit Role From
    const submitDeleteForm = async e => {
        const deleteid = e.target.id.value;
        const deleterowname = e.target.deleterowname.value;
        e.preventDefault();

        try {
            if (deletename === deleterowname) {
                const role = {ID: deleteid}
                deleteRole(role)
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
                setError('Input does not match the name of the Role Name');
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    }

    const isPermissionAssigned = (role, permissionName) => {
        // Logic to check if permissionName is in role's permissions array
        const selectedrole = role.includes(role);
        return selectedrole.permissions.includes(permissionName);
    };

    // give permission
    const [givePermissiontoRole] = useGivePermissiontoRoleMutation();  

    const togglePermissionForRole = (roleId, permissionName, isChecked) => {
        console.log(permissionName);
        try {
                const role = {roleId: roleId, permission: permissionName}
                givePermissiontoRole(role)
                .unwrap()
                .then((response) => {
                    console.log("New node added:", response);
                    // router.push("/dashboard/usergroups");
                    refetch();
                })
                .catch((error) => {
                    console.error("Error adding new node:", error);
                });
        } catch (error) {
            console.error("Login error:", error);
        }
    };

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
                                    href='/dashboard'
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
                                    User Roles
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
                                <FaUserCog className="mr-3 font-semibold text-gray-700 dark:text-white text-[25px]"/>
                                <h3 className="mr-3 font-semibold text-gray-700 dark:text-white text-[25px]">User Roles</h3>
                            </div>
                        <p className="text-gray-500 dark:text-gray-400">
                            Manage all your existing users or add a new one
                        </p>
                        </div>
                        {thisuserpermissionArray.includes('create role') && (
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
                                Add New User Role 
                            </button>
                        )}

                        {/* Modal */}
                        {isOpenAddForm && (
                            <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center" style={{ marginLeft:0 }}>
                                <div className="absolute w-full h-full bg-gray-900 dark:bg-[#121212] opacity-50"></div>
                                <div className="bg-white w-1/2 p-6 rounded-lg z-50 dark:bg-[#1e1e1e]">
                                    {/* Modal header */}
                                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Add New Role
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
                                    <form className="p-4 md:p-5" onSubmit={submitForm}>
                                        <div className="grid gap-4 mb-4 grid-cols-2">  
                                            <div className="col-span-2">
                                                <label
                                                htmlFor="name"
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                Role Name
                                                </label>
                                                <input
                                                onChange={e => setName(e.target.value)}
                                                type="text"
                                                name="name"
                                                id="name"
                                                value={name}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                placeholder="Type permission name"
                                                required=""
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label
                                                htmlFor="name"
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                Role Description
                                                </label>
                                                <textarea id="role_description" rows="4" 
                                                onChange={e => setrole_description(e.target.value)}
                                                name="role_description"
                                                value={role_description}
                                                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="text-white inline-flex items-center bg-[#213389] hover:bg-[#213389] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#213389] dark:hover:bg-[#213389] dark:focus:ring-blue-800"
                                            >
                                            Create Role
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
                            Role name
                            </th>
                            <th scope="col" className="px-6 py-3">
                            Description
                            </th>
                            <th scope="col" className="px-6 py-3">
                            Action
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                            {roleArray.map(Role => (
                                <tr className="odd:bg-white odd:dark:bg-[#1e1e1e] even:bg-gray-50 even:dark:bg-[#3c4042] border-b dark:border-gray-700">
                                    <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                    >
                                    {Role.name}
                                    </th>
                                    <td className="px-6 py-4">{Role.description}</td>
                                    <td className="px-6 py-4">
                                        <div className='flex w-[35%] justify-between'>
                                            {/* add permission to role */}
                                            {thisuserpermissionArray.includes('give permissions to role') && (
                                                <a
                                                    onClick={() => handleToggleAddPermisionModel(Role.id)}
                                                >
                                                    <FaUserLock className='text-gray-700 text-2xl dark:text-white'/>
                                                </a>
                                            )}
                                            {/* Add permission Modal */}
                                            {expandedAddPermisionModel === Role.id && (
                                                <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center" style={{ marginLeft:0 }}>
                                                        <div className="absolute w-full h-full bg-gray-900 dark:bg-[#121212] opacity-50"></div>
                                                        <div className="bg-white w-3/4 p-6 rounded-lg z-50 dark:bg-[#1e1e1e]">
                                                            {/* Modal header */}
                                                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                    Managing {Role.name}'s Parmison
                                                                </h3>
                                                                <button
                                                                    type="button"
                                                                    onClick={closeAddPermisionModel}
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
                                                            <form className="p-4 md:p-5">
                                                                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-[#1e1e1e]">
                                                                    <ul className="space-y-2 font-medium">
                                                                        {permissionlistItems.map(permissionlist => (
                                                                            <li>
                                                                                <div
                                                                                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-[#3c4042]"
                                                                                aria-controls="dropdown-example"
                                                                                data-collapse-toggle="dropdown-example"
                                                                                >
                                                                                    <svg
                                                                                        className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                                                                                        aria-hidden="true"
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                        fill="currentColor"
                                                                                        viewBox="0 0 18 21"
                                                                                    >
                                                                                        <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                                                                                    </svg>
                                                                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                                                                                        {permissionlist.name}
                                                                                    </span>
                                                                                    {/* <svg
                                                                                        className="w-3 h-3"
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
                                                                                    </svg> */}
                                                                                    <label className="inline-flex items-center cursor-pointer">
                                                                                        <input type="checkbox" className="sr-only peer" onChange={() => togglePermissionForRole(Role.id, permissionlist.name)}/>
                                                                                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                                                                                        {/* <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                                                            Toggle me
                                                                                        </span> */}
                                                                                    </label>
                                                                                </div>
                                                                                {permissionlist.children && (
                                                                                    <ul id="dropdown-example" className="py-2 space-y-2">
                                                                                    {permissionlist.children.map(submenu1 => (
                                                                                        <li>
                                                                                            <div
                                                                                            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-[#3c4042]"
                                                                                    >
                                                                                                {/* <svg
                                                                                                    className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                                                                                                    aria-hidden="true"
                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                    fill="currentColor"
                                                                                                    viewBox="0 0 18 21"
                                                                                                >
                                                                                                    <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                                                                                                </svg> */}
                                                                                                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                                                                                                    {submenu1.name}
                                                                                                </span>
                                                                                                {/* <svg
                                                                                                    className="w-3 h-3"
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
                                                                                                </svg> */}
                                                                                                <label className="inline-flex items-center cursor-pointer">
                                                                                                    <input type="checkbox" className="sr-only peer" onChange={() => togglePermissionForRole(Role.id, submenu1.name)}/>
                                                                                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                                                                                                    {/* <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                                                                        Toggle me
                                                                                                    </span> */}
                                                                                                </label>
                                                                                            </div>
                                                                                            {submenu1.children && (
                                                                                                <div class="grid grid-cols-4 gap-4 pl-16">
                                                                                                    {submenu1.children.map(subsubmenu => (
                                                                                                            <div
                                                                                                            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-[#3c4042]"
                                                                                                            >
                                                                                                                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                                                                                                                    {subsubmenu.name}
                                                                                                                </span>                                                          
                                                                                                                {/* <svg
                                                                                                                    className="w-3 h-3"
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
                                                                                                                </svg> */}
                                                                                                                <label className="inline-flex items-center cursor-pointer">
                                                                                                                    <input type="checkbox" className="sr-only peer" onChange={() => togglePermissionForRole(Role.id, subsubmenu.name)}/>
                                                                                                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                                                                                                                    {/* <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                                                                                        Toggle me
                                                                                                                    </span> */}
                                                                                                                </label>
                                                                                                            </div>
                                                                                                    ))}
                                                                                                </div>
                                                                                            )}
                                                                                        </li>
                                                                                    ))}
                                                                                    </ul>
                                                                                )}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </form>
                                                        </div>
                                                </div>
                                            )}

                                            {/* edite role */}
                                            {thisuserpermissionArray.includes('update role') && (
                                                <a
                                                    onClick={() => handleToggleEditeRoleModel(Role.id)}
                                                >
                                                    <FaPenToSquare className='text-[#DBAE58] text-2xl'/>
                                                </a>
                                            )}
                                            {/* Edite Modal */}
                                            {expandedEditeRoleModel === Role.id && (
                                                <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center" style={{ marginLeft:0 }}>
                                                        <div className="absolute w-full h-full bg-gray-900 dark:bg-[#121212] opacity-50"></div>
                                                        <div className="bg-white w-1/2 p-6 rounded-lg z-50 dark:bg-[#1e1e1e]">
                                                            {/* Modal header */}
                                                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                    Update {Role.name} Role
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
                                                                <div className="grid gap-4 mb-4 grid-cols-2">  
                                                                    <div className="col-span-2">
                                                                        <input
                                                                        type="hidden"
                                                                        name="editid"
                                                                        id="editid"
                                                                        value={Role.id}
                                                                        />
                                                                        <label
                                                                        htmlFor="name"
                                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                                        >
                                                                        Role Name
                                                                        </label>
                                                                        <input
                                                                        onChange={e => setEditeName(e.target.value)}
                                                                        type="text"
                                                                        name="name"
                                                                        id="name"
                                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                        placeholder="Type permission name"
                                                                        required=""
                                                                        />
                                                                    </div>
                                                                    <div className="col-span-2">
                                                                        <label
                                                                        htmlFor="name"
                                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                                        >
                                                                        Role Description
                                                                        </label>
                                                                        <textarea id="role_description" rows="4" 
                                                                        onChange={e => setEditerole_description(e.target.value)}
                                                                        name="role_description"
                                                                        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="submit"
                                                                    className="text-white inline-flex items-center bg-[#DBAE58] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#DBAE58] dark:hover:bg-[#DBAE58] dark:focus:ring-blue-800"
                                                                    >
                                                                    Update {Role.name} Role
                                                                </button>
                                                            </form>
                                                        </div>
                                                </div>
                                            )}

                                            {/* delete role */}
                                            {thisuserpermissionArray.includes('delete role') && (
                                                <a
                                                    onClick={() => handleToggleDeleteRoleModel(Role.id)}
                                                >
                                                    <MdDelete className='text-[#D32D41] text-2xl'/>
                                                </a>
                                            )}
                                            {/* Delete Modal */}
                                            {expandedDeleteRoleModel === Role.id && (
                                                <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center" style={{ marginLeft:0 }}>
                                                        <div className="absolute w-full h-full bg-gray-900 dark:bg-[#121212] opacity-50"></div>
                                                        <div className="bg-white w-1/2 p-6 rounded-lg z-50 dark:bg-[#1e1e1e]">
                                                            {/* Modal header */}
                                                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                    If you want Delete {Role.name}, please enter "{Role.name}" on below feild
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
                                                                        value={Role.id}
                                                                        />
                                                                        <input
                                                                        type="hidden"
                                                                        name="deleterowname"
                                                                        id="deleterowname"
                                                                        value={Role.name}
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
                                                                    Delete {Role.name} Role
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
            {roleArray.map(Role => (
                <div className="w-full p-5 my-5 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-[#1e1e1e] dark:border-gray-700">
                    <div className='flex'>
                            <FaUserCog className="mr-3 font-semibold text-gray-700 dark:text-white text-[54px]"/>
                            <div>
                                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                                {Role.name}
                                </h5>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                {Role.description}
                                </span>
                            </div>
                    </div>
                    <div className="flex mt-4 md:mt-6 justify-end items-center">

                        <div className='flex w-[35%] justify-between'>
                            {/* add permission to role */}
                            {thisuserpermissionArray.includes('give permissions to role') && (
                                <a
                                    onClick={() => handleToggleAddPermisionModel(Role.id)}
                                >
                                    <FaUserLock className='text-gray-700 text-2xl dark:text-white'/>
                                </a>
                            )}
                            {/* Add permission Modal */}
                            {expandedAddPermisionModel === Role.id && (
                                <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center" style={{ marginLeft:0 }}>
                                        <div className="absolute w-full h-full bg-gray-900 dark:bg-[#121212] opacity-50"></div>
                                        <div className="bg-white w-3/4 p-6 rounded-lg z-50 dark:bg-[#1e1e1e]">
                                            {/* Modal header */}
                                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    Managing {Role.name}'s Parmison
                                                </h3>
                                                <button
                                                    type="button"
                                                    onClick={closeAddPermisionModel}
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
                                            <form className="p-4 md:p-5">
                                                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-[#1e1e1e]">
                                                    <ul className="space-y-2 font-medium">
                                                        {permissionlistItems.map(permissionlist => (
                                                            <li>
                                                                <div
                                                                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-[#3c4042]"
                                                                aria-controls="dropdown-example"
                                                                data-collapse-toggle="dropdown-example"
                                                                >
                                                                    <svg
                                                                        className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                                                                        aria-hidden="true"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="currentColor"
                                                                        viewBox="0 0 18 21"
                                                                    >
                                                                        <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                                                                    </svg>
                                                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                                                                        {permissionlist.name}
                                                                    </span>
                                                                    {/* <svg
                                                                        className="w-3 h-3"
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
                                                                    </svg> */}
                                                                    <label className="inline-flex items-center cursor-pointer">
                                                                        <input type="checkbox" className="sr-only peer" checked={Role.permissions.some(permission => permission.name === permissionlist.name)} onChange={(e) => togglePermissionForRole(Role.id, permissionlist.name, e.target.checked)}/>
                                                                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                                                                        {/* <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                                            Toggle me
                                                                        </span> */}
                                                                    </label>
                                                                </div>
                                                                {permissionlist.children && (
                                                                    <ul id="dropdown-example" className="py-2 space-y-2">
                                                                    {permissionlist.children.map(submenu1 => (
                                                                        <li>
                                                                            <div
                                                                            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-[#3c4042]"
                                                                    >
                                                                                {/* <svg
                                                                                    className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                                                                                    aria-hidden="true"
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    fill="currentColor"
                                                                                    viewBox="0 0 18 21"
                                                                                >
                                                                                    <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                                                                                </svg> */}
                                                                                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                                                                                    {submenu1.name}
                                                                                </span>
                                                                                {/* <svg
                                                                                    className="w-3 h-3"
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
                                                                                </svg> */}
                                                                                <label className="inline-flex items-center cursor-pointer">
                                                                                    <input type="checkbox" className="sr-only peer" checked={Role.permissions.some(permission => permission.name === submenu1.name)} onChange={() => togglePermissionForRole(Role.id, submenu1.name)}/>
                                                                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                                                                                    {/* <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                                                        Toggle me
                                                                                    </span> */}
                                                                                </label>
                                                                            </div>
                                                                            {submenu1.children && (
                                                                                <div class="grid grid-cols-4 gap-4 pl-16">
                                                                                    {submenu1.children.map(subsubmenu => (
                                                                                            <div
                                                                                            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-[#3c4042]"
                                                                                            >
                                                                                                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                                                                                                    {subsubmenu.name}
                                                                                                </span>                                                          
                                                                                                {/* <svg
                                                                                                    className="w-3 h-3"
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
                                                                                                </svg> */}
                                                                                                <label className="inline-flex items-center cursor-pointer">
                                                                                                    <input type="checkbox" className="sr-only peer" checked={Role.permissions.some(permission => permission.name === subsubmenu.name)} onChange={() => togglePermissionForRole(Role.id, subsubmenu.name)}/>
                                                                                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                                                                                                    {/* <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                                                                        Toggle me
                                                                                                    </span> */}
                                                                                                </label>
                                                                                            </div>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </li>
                                                                    ))}
                                                                    </ul>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </form>
                                        </div>
                                </div>
                            )}

                            {/* edite role */}
                            {thisuserpermissionArray.includes('update role') && (
                                <a
                                    onClick={() => handleToggleEditeRoleModel(Role.id)}
                                >
                                    <FaPenToSquare className='text-[#DBAE58] text-2xl'/>
                                </a>
                            )}
                            {/* Edite Modal */}
                            {expandedEditeRoleModel === Role.id && (
                                <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center" style={{ marginLeft:0 }}>
                                        <div className="absolute w-full h-full bg-gray-900 dark:bg-[#121212] opacity-50"></div>
                                        <div className="bg-white w-1/2 p-6 rounded-lg z-50 dark:bg-[#1e1e1e]">
                                            {/* Modal header */}
                                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    Update {Role.name} Role
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
                                                <div className="grid gap-4 mb-4 grid-cols-2">  
                                                    <div className="col-span-2">
                                                        <input
                                                        type="hidden"
                                                        name="editid"
                                                        id="editid"
                                                        value={Role.id}
                                                        />
                                                        <label
                                                        htmlFor="name"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                        Role Name
                                                        </label>
                                                        <input
                                                        onChange={e => setEditeName(e.target.value)}
                                                        type="text"
                                                        name="name"
                                                        id="name"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        placeholder="Type permission name"
                                                        required=""
                                                        />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label
                                                        htmlFor="name"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                        Role Description
                                                        </label>
                                                        <textarea id="role_description" rows="4" 
                                                        onChange={e => setEditerole_description(e.target.value)}
                                                        name="role_description"
                                                        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here...">{Role.description}</textarea>
                                                    </div>
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="text-white inline-flex items-center bg-[#DBAE58] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#DBAE58] dark:hover:bg-[#DBAE58] dark:focus:ring-blue-800"
                                                    >
                                                    Update {Role.name} Role
                                                </button>
                                            </form>
                                        </div>
                                </div>
                            )}

                            {/* delete role */}
                            {thisuserpermissionArray.includes('delete role') && (
                                <a
                                    onClick={() => handleToggleDeleteRoleModel(Role.id)}
                                >
                                    <MdDelete className='text-[#D32D41] text-2xl'/>
                                </a>
                            )}
                            {/* Delete Modal */}
                            {expandedDeleteRoleModel === Role.id && (
                                <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center" style={{ marginLeft:0 }}>
                                        <div className="absolute w-full h-full bg-gray-900 dark:bg-[#121212] opacity-50"></div>
                                        <div className="bg-white w-1/2 p-6 rounded-lg z-50 dark:bg-[#1e1e1e]">
                                            {/* Modal header */}
                                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    If you want Delete {Role.name}, please enter "{Role.name}" on below feild
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
                                                        value={Role.id}
                                                        />
                                                        <input
                                                        type="hidden"
                                                        name="deleterowname"
                                                        id="deleterowname"
                                                        value={Role.name}
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
                                                    Delete {Role.name} Role
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