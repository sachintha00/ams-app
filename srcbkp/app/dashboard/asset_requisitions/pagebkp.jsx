'use client'
import React, { useEffect, useState, useContext, useRef } from 'react';
import { IoGrid } from "react-icons/io5";
import { FaList } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaPenToSquare } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { RiLockPasswordLine } from "react-icons/ri";
import { VscServerProcess } from "react-icons/vsc";
import { IoAddOutline } from "react-icons/io5";
import { redirect, useRouter } from 'next/navigation';
import { useAddNewUserMutation, useDeleteUserMutation, useEditeUserMutation, useUsersListQuery, useStatuschangeUserMutation, useUserpasswordresetMutation } from '@/app/_lib/redux/features/user/user_api';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useAuthpermissionsQuery } from '@/app/_lib/redux/features/authpermission/auth_permission_api';

export default function users() {
    const [view, setView] = useState('grid');
    const [expandedResetpasswordModel, setExpandedResetpasswordModel] = useState(false);
    const [expandedEditeRoleModel, setExpandedEditeRoleModel] = useState(false);
    const [expandedDeleteRoleModel, setExpandedDeleteRoleModel] = useState(false);
    const [isOpenAddForm, setIsOpenAddFormModel] = useState(false);
    const [passwordreseterror, setPasswordResetError] = useState('');
    const [usercreateerror, setUserCreateError] = useState('');
    const [userediteerror, setUserEditeError] = useState('');
    const [userdeleteerror, setUserDeleteError] = useState('');
    const [formemessage, setmessage] = useState('');
    const [isOpenRoleList, setIsOpenRoleList] = useState(false);
    const [editeUserUserName, setEditeUserUserName] = useState('');
    const [editeUserEmail, setEditeUserEmail] = useState('');
    const [editeUserName, setEditeUserName] = useState('');
    const [editeUserContactNo, setEditeUserContactNo] = useState('');
    const [editeUserAddress, setEditeUserAddress] = useState('');
    const [editeselectedValues, setEditeSelectedValues] = useState([]);
    const [editeuser_description, setEditeuser_description] = useState("");

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

    //Toast notifications
    const handleClose = () => {
        setmessage('');
    };

    const handleErrorClose = () => {
        setPasswordResetError('');
        setUserEditeError('');
        setUserDeleteError('');
    };

    // reset password model
    const handleToggleResetpasswordModel = (rowId) => {
        setExpandedResetpasswordModel(rowId === expandedResetpasswordModel ? false : rowId);
    };

    const closeResetpasswordModel = () => {
        setExpandedResetpasswordModel(false);
    };

    // edite user model
    const handleToggleEditeRoleModel = (rowId, rowusername, rowemail, rowname, rowcontact, rowaddress, userRoles) => {
        setExpandedEditeRoleModel(rowId === expandedDeleteRoleModel ? false : rowId);
        setEditeUserUserName(rowusername);
        setEditeUserEmail(rowemail);
        setEditeUserName(rowname);
        setEditeUserContactNo(rowcontact);
        setEditeUserAddress(rowaddress);
        setEditeSelectedValues(userRoles.map(role => role.name));
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

    // add user model
    const openAddFormModal = () => {
        setIsOpenAddFormModel(true);
    };
    
    const closeAddFormModal = () => {
        setIsOpenAddFormModel(false);
    };

    //auth permissions
    const [thisuserpermissionArray, setthisuserpermissionArray] = useState([]); 
    const {
        data: permissionList,
      } = useAuthpermissionsQuery();

    useEffect(() => {
        if (permissionList) {
            const permissions = Object.values(permissionList.thisuserpermission);
            setthisuserpermissionArray(permissions);
        }
    }, [permissionList]);

    // user list
    const [userArray, setUserArray] = useState([]); // State to hold converted array
    const [roleArray, setRoleArray] = useState([]); // State to hold converted array
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);

    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchUserInput, setSearchUserInput] = useState('');

    const handleSearchUserInputChange = (event) => {
        setSearchUserInput(event.target.value);
    };

    const [filteredRoles, setFilteredRoles] = useState([]);
    const [searchInput, setSearchInput] = useState('');

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
            const users = Object.values(UserList.Users);
            // Sort users alphabetically by user_name
            const sortedUsers = users.sort((a, b) => a.user_name.localeCompare(b.user_name));
            const filteredusers = sortedUsers.filter(user => user.user_name.toLowerCase().includes(searchUserInput.toLowerCase()));
            setFilteredUsers(filteredusers);

            const roles = Object.values(UserList.Role);
            const filtered = roles.filter(role => role.name.toLowerCase().includes(searchInput.toLowerCase()));
            setFilteredRoles(filtered);

            const timer = setTimeout(() => {
                setmessage('');
                setPasswordResetError('');
                setUserEditeError('');
                setUserDeleteError('');
            }, 5000); // Adjust the duration (in milliseconds) as needed
        
            return () => clearTimeout(timer);
        }
    }, [isLoading, isError, UserList, searchInput, searchUserInput,  refetch]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage((prev) => prev + 1);
    const prevPage = () => setCurrentPage((prev) => prev - 1);

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
                setuser_description("");
                setSelectedValues([]);
                setmessage(response.message);
                refetch();
            })
            .catch((error) => {
                console.error("Error adding new node:", error);
                setUserCreateError(error);
                const timer = setTimeout(() => {
                    setUserCreateError('');
                }, 5000); // Adjust the duration (in milliseconds) as needed
                return () => clearTimeout(timer);
            });
        } catch (error) {
            console.error("Login error:", error);
        }
    }

    //edite role form data
    const [editeRole] = useEditeUserMutation();

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

    //edite Submit Role From
    const submitEditeForm = async e => {
        const editeid = e.target.editid.value;
        console.log(editeid);
        e.preventDefault();

        try {
            const user = {id: editeid, user_name: editeUserUserName, email: editeUserEmail, name: editeUserName, contact_no: editeUserContactNo, address: editeUserAddress, roles: editeselectedValues, user_description: editeuser_description}
            editeRole(user)
            .unwrap()
            .then((response) => {
                console.log("New node added:", response);
                // window.location.reload();
                closeEditeRoleModel();
                const message = `${editeUserUserName}'s ${response.message}`;
                setmessage(message);
                refetch();
            })
            .catch((error) => {
                console.error("Error adding new node:", error);
                setUserEditeError(error);
                const timer = setTimeout(() => {
                    setUserEditeError('');
                }, 5000); // Adjust the duration (in milliseconds) as needed
                return () => clearTimeout(timer);
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
                    const message = `${deleterowname}'s ${response.message}`;
                    setmessage(message);
                    refetch();
                })
                .catch((error) => {
                    console.error("Error adding new node:", error);
                    setUserDeleteError(error);
                    const timer = setTimeout(() => {
                        setUserDeleteError('');
                    }, 5000); // Adjust the duration (in milliseconds) as needed
                    return () => clearTimeout(timer);
                });
            } else {
                setUserDeleteError('Input does not match the name of the User Name');
                const timer = setTimeout(() => {
                    setUserDeleteError('');
                }, 5000); // Adjust the duration (in milliseconds) as needed
                return () => clearTimeout(timer);
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
                setmessage(response.message);
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
                    const message = `${resetrowname}'s ${response.message}`;
                    setmessage(message);
                    setResetName("");
                    closeResetpasswordModel();
                    refetch();
                })
                .catch((error) => {
                    console.error("Error adding new node:", error);
                    setPasswordResetError(error);
                    const timer = setTimeout(() => {
                        setPasswordResetError('');
                    }, 5000); // Adjust the duration (in milliseconds) as needed
                    return () => clearTimeout(timer);
                });
            } else {
                setPasswordResetError('Input does not match the name of the User Name');
                const timer = setTimeout(() => {
                    setPasswordResetError('');
                }, 5000); // Adjust the duration (in milliseconds) as needed
                return () => clearTimeout(timer);
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    }

    // download user list with csv
    const downloadCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8," +
            "User Name,Email,Name,Contact No,Address,Description \n" +
            filteredUsers.map(user => `${user.user_name},${user.email},${user.name},${user.contact_no},${user.address},${user.user_description}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "user_details.csv");
        document.body.appendChild(link); // Required for Firefox
        link.click();
        setmessage("user_details.csv is downloading");
    };

    return (
        <div className="p-4 pl-8 subcontent border-gray-200 rounded-lg dark:border-gray-700">
            {/* notification Toast*/}
            {formemessage && 
                <div className='flex justify-end w-[100%] fixed'>
                    <div
                    id="toast-default"
                    className="flex items-center opacity-90 w-full max-w-xs p-4 text-white bg-green-400 rounded-lg shadow mr-28"
                    role="alert"
                    >
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
                        <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 18 20"
                        >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.147 15.085a7.159 7.159 0 0 1-6.189 3.307A6.713 6.713 0 0 1 3.1 15.444c-2.679-4.513.287-8.737.888-9.548A4.373 4.373 0 0 0 5 1.608c1.287.953 6.445 3.218 5.537 10.5 1.5-1.122 2.706-3.01 2.853-6.14 1.433 1.049 3.993 5.395 1.757 9.117Z"
                        />
                        </svg>
                        <span className="sr-only">Fire icon</span>
                    </div>
                    <div className="ms-3 text-sm font-normal">{formemessage}</div>
                    <button type="button" onClick={handleClose} className="text-gray-400 bg-transparent hover:bg-red-400 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-red-400 dark:hover:text-white" data-modal-toggle="crud-modal">
                        <IoClose className='text-2xl text-white'/>
                        <span className="sr-only">Close modal</span>
                    </button>
                    </div>
                </div>
            }

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
                                    Procurement Management 
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
                                    Asset Requisition 
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
                                <VscServerProcess className="mr-3 font-semibold text-gray-700 dark:text-white text-[25px]"/>
                                <h3 className="mr-3 font-semibold text-gray-700 dark:text-white text-[25px]">Asset Requisitions</h3>
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
                                <IoAddOutline className="h-3.5 w-3.5 mr-2 -ml-1 text-white"/>
                                Sent Asset Requisition 
                            </button>
                        )}

                        {/* Modal */}
                        {isOpenAddForm && (
                            <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center" style={{ marginLeft:0 }}>
                                <div className="absolute w-full h-full bg-gray-900 dark:bg-[#121212] opacity-50"></div>
                                <div className="bg-white w-4/5 p-4 rounded-lg z-50 dark:bg-[#1e1e1e]">
                                    <div className="flex items-center justify-between rounded-t dark:border-gray-600">
                                        <button type="button" onClick={closeAddFormModal} className="text-gray-400 bg-transparent hover:bg-red-400 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-red-400 dark:hover:text-white" data-modal-toggle="crud-modal">
                                            <IoClose className='text-2xl hover:text-white'/>
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    {/* Modal header */}
                                    <div className="flex items-center mt-[-17px] px-2 pb-2 justify-between border-b rounded-t dark:border-gray-600">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Sent Asset Requisition 
                                        </h3>
                                    </div>
                                    {/* Modal body */}
                                    <form className="px-2 pt-2" onSubmit={submitForm} encType="multipart/form-data">
                                        {usercreateerror &&
                                            <div className="bg-red-100 border mb-2 border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                                {/* <strong className="font-bold">Holy smokes!</strong> */}
                                                    <span className="block sm:inline">{usercreateerror}</span>
                                                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={handleErrorClose}>
                                                                            <svg
                                                                                className="fill-current h-6 w-6 text-red-500"
                                                                                role="button"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                viewBox="0 0 20 20"
                                                                            >
                                                                                <title>Close</title>
                                                                                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                                                                            </svg>
                                                    </span>
                                            </div>
                                        } 
                                        <div className="grid gap-6 mb-6 md:grid-cols-2">
                                            <div>
                                                <div className="mb-6">
                                                    <label
                                                        htmlFor="user_name"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Assest Type
                                                    </label>
                                                    <select
                                                    id="countries"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    >
                                                        <option selected="">Choose a Assest Type</option>
                                                        <option value="computer">computer</option>
                                                        <option value="machinary">machinary</option>
                                                    </select>
                                                </div>
                                                <div className="mb-6">
                                                    <label
                                                        htmlFor="last_name"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Whether to upgrade the existing one or purchase a new
                                                    </label>
                                                    <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input
                                                            id="horizontal-list-radio-license"
                                                            type="radio"
                                                            defaultValue=""
                                                            name="list-radio"
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                            />
                                                            <label
                                                            htmlFor="horizontal-list-radio-license"
                                                            className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                            >
                                                            upgrade the existing one
                                                            </label>
                                                        </div>
                                                        </li>
                                                        <li className="w-full dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input
                                                            id="horizontal-list-radio-passport"
                                                            type="radio"
                                                            defaultValue=""
                                                            name="list-radio"
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                            />
                                                            <label
                                                            htmlFor="horizontal-list-radio-passport"
                                                            className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                            >
                                                            purchase a new
                                                            </label>
                                                        </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="mb-6">
                                                    <label
                                                        htmlFor="last_name"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Reason for the Asset Requisition
                                                    </label>
                                                    <textarea id="user_description" rows="4" 
                                                    onChange={e => setuser_description(e.target.value)}
                                                    name="user_description"
                                                    value={user_description}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Write short description about this user"></textarea>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="mb-6">
                                                    <label
                                                        htmlFor="user_name"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Business Perpose
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="user_name"
                                                        onChange={e => setuser_name(e.target.value)}
                                                        name="user_name"
                                                        value={user_name}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        placeholder="Enter user user name"
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-6">
                                                    <label
                                                        htmlFor="user_name"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Organization structure - where to place?
                                                    </label>
                                                    <button
                                                        id="dropdownSearchButton"
                                                        data-dropdown-toggle="dropdownSearch"
                                                        className="flex justify-between items-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        type="button"
                                                        onClick={toggleRoleListHandler}
                                                    >
                                                        Add role to this user
                                                        <IoAddOutline className="h-3.5 w-3.5 mr-2 -ml-1"/>
                                                    </button>
                                                    <div className="flex mt-1 flex-wrap gap-2">
                                                        {selectedValues.map(Role => (
                                                            <span className='flex px-3 py-1 bg-gray-400 rounded-md'>
                                                                {Role}
                                                                <button
                                                                    className="ml-2"
                                                                    onClick={(event) => handleCheckboxChange(event, Role)}
                                                                >
                                                                    <IoClose className='text-2xl text-white hover:text-red-400'/>
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                    {/* Dropdown menu */}
                                                    <div data-collapse={isOpenRoleList} ref={refRoleList}>
                                                        <div
                                                            id="dropdownSearch"
                                                            className="z-10 hidden absolute bg-white rounded-lg shadow dark:bg-gray-700 rolelist"
                                                        >
                                                            <div className="container mx-auto px-4 py-8 relative">
                                                                <div className="bg-gray-200 p-6">
                                                                <div className="tree-view">
                                                                    <div className="tree-row">
                                                                    <div className="tree-node">
                                                                        <div className="tree-node-content">Root</div>
                                                                    </div>
                                                                    </div>
                                                                    <div className="tree-row">
                                                                    <div className="tree-node">
                                                                        <div className="tree-node-content">Node 1</div>
                                                                    </div>
                                                                    <div className="tree-node">
                                                                        <div className="tree-node-content">Node 2</div>
                                                                    </div>
                                                                    </div>
                                                                    <div className="tree-row">
                                                                    <div className="tree-node">
                                                                        <div className="tree-node-content">Node 1.1</div>
                                                                    </div>
                                                                    <div className="tree-node">
                                                                        <div className="tree-node-content">Node 1.2</div>
                                                                    </div>
                                                                    <div className="tree-node">
                                                                        <div className="tree-node-content">Node 2.1</div>
                                                                    </div>
                                                                    </div>
                                                                </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
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
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        placeholder="Enter user full name"
                                                        required
                                                    />
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
                                                type="number"
                                                id="contact_no"
                                                onChange={e => setContact_no(e.target.value)}
                                                name="name"
                                                value={contact_no}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                placeholder="Enter user mobile number"
                                                required
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
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                placeholder="Enter user address"
                                                required
                                            />
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
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Write short description about this user"></textarea>
                                            </div>
                                        </div>
                                        
                                        {/* <div className="flex items-start mb-6">
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
                                            Save
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col items-center justify-between py-4 px-1.5 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
                        <div className="w-full md:w-1/2">
                            {/* search bar */}
                            <div className="flex items-center">
                                <label htmlFor="simple-search" className="sr-only">
                                Search
                                </label>
                                <div className="w-full">
                                <input
                                    type="text"
                                    id="simple-search"
                                    className="block w-full p-2 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-[#3c4042] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Search"
                                    value={searchUserInput}
                                    onChange={handleSearchUserInputChange}
                                />
                                </div>
                            </div>                       
                        </div>
                        <div className="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
                        <div className="flex items-center w-[500px] space-x-3 md:w-auto">
                            <button
                                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg md:w-auto focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-[#3c4042] dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-[#606368]"
                                type="button"
                                onClick={downloadCSV}
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
            <div className="flex flex-col items-center justify-center my-5 rounded bg-gray-50 dark:bg-[#121212] tablelist">
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
                            {currentItems.map(Users => (
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
                                    <td className="px-2 py-4">
                                        <div className='flex w-auto justify-between'>
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
                                                        <div className="bg-white w-1/2 p-4 rounded-lg z-50 dark:bg-[#1e1e1e]">
                                                            <div className="flex items-center justify-between rounded-t dark:border-gray-600">
                                                                <button type="button" onClick={closeResetpasswordModel} className="text-gray-400 bg-transparent hover:bg-red-400 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-red-400 dark:hover:text-white" data-modal-toggle="crud-modal">
                                                                    <IoClose className='text-2xl hover:text-white'/>
                                                                    <span className="sr-only">Close modal</span>
                                                                </button>
                                                            </div>
                                                            {/* Modal header */}
                                                            <div className="flex items-center mt-[-17px] px-2 pb-2 justify-between border-b rounded-t dark:border-gray-600">
                                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white w-[80%]">
                                                                    If you want reset {Users.user_name}'s password, please enter "{Users.user_name}" on below feild
                                                                </h3>
                                                            </div>
                                                            {/* Modal body */}
                                                            <form className="px-2 pt-2" onSubmit={submitPasswordForm}>
                                                                    {passwordreseterror &&
                                                                        <div
                                                                            className="bg-red-100 border mb-2 border-red-400 text-red-700 px-4 py-3 rounded relative"
                                                                            role="alert"
                                                                        >
                                                                            {/* <strong className="font-bold">Holy smokes!</strong> */}
                                                                            <span className="block sm:inline">{passwordreseterror}</span>
                                                                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={handleErrorClose}>
                                                                                <IoClose className='text-2xl text-red-700'/>
                                                                            </span>
                                                                        </div>
                                                                    } 
                                                                <div className="grid gap-4 mb-4 grid-cols-2">
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
                                                                    Reset password
                                                                </button>
                                                            </form>
                                                        </div>
                                                </div>
                                            )}

                                            {/* edite user */}
                                            {thisuserpermissionArray.includes('update user') && (
                                                <a
                                                    onClick={() => handleToggleEditeRoleModel(Users.id, Users.user_name, Users.email, Users.name, Users.contact_no, Users.address, Users.roles)}
                                                >
                                                    <FaPenToSquare className='text-[#DBAE58] text-2xl'/> 
                                                </a>
                                            )}
                                            {/* Edite Modal */}
                                            {expandedEditeRoleModel === Users.id && (
                                                <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center" style={{ marginLeft:0 }}>
                                                        <div className="absolute w-full h-full bg-gray-900 dark:bg-[#121212] opacity-50"></div>
                                                        <div className="bg-white w-3/4 p-4 rounded-lg z-50 dark:bg-[#1e1e1e]">
                                                            <div className="flex items-center justify-between rounded-t dark:border-gray-600">
                                                                <button type="button" onClick={closeEditeRoleModel} className="text-gray-400 bg-transparent hover:bg-red-400 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-red-400 dark:hover:text-white" data-modal-toggle="crud-modal">
                                                                    <IoClose className='text-2xl hover:text-white'/>
                                                                    <span className="sr-only">Close modal</span>
                                                                </button>
                                                            </div>
                                                            {/* Modal header */}
                                                            <div className="flex items-center mt-[-17px] px-2 pb-2 justify-between border-b rounded-t dark:border-gray-600">
                                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                    Update {Users.user_name}
                                                                </h3>
                                                            </div>
                                                            {/* Modal body */}
                                                            <form className="px-2 pt-2" onSubmit={submitEditeForm}>
                                                                    {userediteerror &&
                                                                        <div
                                                                            className="bg-red-100 border mb-2 border-red-400 text-red-700 px-4 py-3 rounded relative"
                                                                            role="alert"
                                                                        >
                                                                            {/* <strong className="font-bold">Holy smokes!</strong> */}
                                                                            <span className="block sm:inline">{userediteerror}</span>
                                                                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={handleErrorClose}>
                                                                                <IoClose className='text-2xl text-red-700'/>
                                                                            </span>
                                                                        </div>
                                                                    } 
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
                                                                                onChange={(e) => setEditeUserUserName(e.target.value)}
                                                                                name="user_name"
                                                                                value={editeUserUserName}
                                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                                placeholder="Enter User name"
                                                                                required
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
                                                                                onChange={(e) => setEditeUserEmail(e.target.value)}
                                                                                name="email"
                                                                                value={editeUserEmail}
                                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                                placeholder="Enter user email address"
                                                                                required
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
                                                                                onChange={(e) => setEditeUserName(e.target.value)}
                                                                                name="name"
                                                                                value={editeUserName}
                                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                                placeholder="Enter user full name"
                                                                                required
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="flex items-center justify-center w-full">
                                                                            <label for="dropzone-file" className="flex flex-col items-center justify-center w-52 h-52 text-center border-2 border-gray-300 border-dashed rounded-[105px] cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                                                    </svg>
                                                                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                                                                </div>
                                                                                <input id="dropzone-file" type="file" className="hidden"/>
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
                                                                        type='number'
                                                                        id="contact_no"
                                                                        onChange={(e) => setEditeUserContactNo(e.target.value)}
                                                                        name="name"
                                                                        value={editeUserContactNo}
                                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                        placeholder="Enter user phon number"
                                                                        required
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
                                                                        onChange={e => setEditeUserAddress(e.target.value)}
                                                                        name="address"
                                                                        value={editeUserAddress}
                                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                        placeholder="Enter user address"
                                                                        required
                                                                    />
                                                                    </div>                                            
                                                                    <div>
                                                                        <button
                                                                            id="dropdownSearchButton"
                                                                            data-dropdown-toggle="dropdownSearch"
                                                                            className="flex justify-between items-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
                                                                        <div className="flex mt-1 flex-wrap gap-2">
                                                                            {editeselectedValues.map(Role => (
                                                                                <span className='flex px-3 py-1 bg-gray-400 rounded-md'>
                                                                                    {Role}
                                                                                    <button
                                                                                        className="ml-2"
                                                                                        onClick={(event) => handleediteCheckboxChange(event, Role)}
                                                                                    >
                                                                                        <IoClose className='text-2xl text-white hover:text-red-400'/>
                                                                                    </button>
                                                                                </span>
                                                                            ))}
                                                                        </div>
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
                                                                                    type="text" id="input-group-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search role name"
                                                                                    value={searchInput}
                                                                                    onChange={handleSearchInputChange}
                                                                                    />
                                                                                </div>
                                                                                </div>
                                                                                <ul
                                                                                className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
                                                                                aria-labelledby="dropdownSearchButton"
                                                                                >
                                                                                {filteredRoles.map(Role => (
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
                                                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Write short description about this user">{Users.user_description}</textarea>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="submit"
                                                                    className="text-white inline-flex items-center bg-[#DBAE58] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#DBAE58] dark:hover:bg-[#DBAE58] dark:focus:ring-blue-800"
                                                                >
                                                                    Update
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
                                                        <div className="bg-white w-1/2 p-4 rounded-lg z-50 dark:bg-[#1e1e1e]">
                                                            <div className="flex items-center justify-between rounded-t dark:border-gray-600">
                                                                <button type="button" onClick={closeDeleteRoleModel} className="text-gray-400 bg-transparent hover:bg-red-400 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-red-400 dark:hover:text-white" data-modal-toggle="crud-modal">
                                                                    <IoClose className='text-2xl hover:text-white'/>
                                                                    <span className="sr-only">Close modal</span>
                                                                </button>
                                                            </div>
                                                            {/* Modal header */}
                                                            <div className="flex items-center mt-[-17px] px-2 pb-2 justify-between border-b rounded-t dark:border-gray-600">
                                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white w-[80%]">
                                                                    If you want Delete {Users.user_name}, please enter "{Users.user_name}" on below feild
                                                                </h3>
                                                            </div>

                                                            {/* Modal body */}
                                                            <form className="px-2 pt-2" onSubmit={submitDeleteForm}>
                                                                    {userdeleteerror &&
                                                                        <div
                                                                            className="bg-red-100 border mb-2 border-red-400 text-red-700 px-4 py-3 rounded relative"
                                                                            role="alert"
                                                                        >
                                                                            {/* <strong className="font-bold">Holy smokes!</strong> */}
                                                                            <span className="block sm:inline">{userdeleteerror}</span>
                                                                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={handleErrorClose}>
                                                                                <IoClose className='text-2xl text-red-700'/>
                                                                            </span>
                                                                        </div>
                                                                    } 
                                                                <div className="grid gap-4 mb-4 grid-cols-2"> 
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
                                                                    Delete
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
                {/* Pagination */}
                <div className='flex w-[-webkit-fill-available] justify-end mt-2'>
                    <nav aria-label="Page navigation example" className="flex justify-end">
                        <ul className="inline-flex -space-x-px text-sm">
                            <li>
                                <button
                                    onClick={prevPage}
                                    disabled={currentPage === 1}
                                    className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight rounded-s-lg border border-e-0 border-gray-300 dark:border-gray-700 ${currentPage === 1 ? 'text-gray-500 dark:text-gray-400 bg-white dark:bg-[#3c4042]' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white'}`}
                                >
                                    Previous
                                </button>
                            </li>
                            {[...Array(Math.ceil(filteredUsers.length / itemsPerPage))].map((_, index) => (
                                <li>
                                    <button
                                        key={index}
                                        onClick={() => paginate(index + 1)}
                                        className={`flex items-center justify-center px-3 h-8 border border-gray-300 dark:border-gray-700 dark:text-white ${
                                            currentPage === index + 1 ? 'bg-gray-200 text-blue-700 dark:bg-[#3c4042]' : 'bg-blue-50 text-blue-600 dark:bg-[#606368]'
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                            <li>
                                <button
                                    onClick={nextPage}
                                    disabled={currentPage === Math.ceil(filteredUsers.length / itemsPerPage)}
                                    className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 rounded-e-lg dark:border-gray-700 ${currentPage === Math.ceil(filteredUsers.length / itemsPerPage) ? 'text-gray-500 bg-white border dark:bg-[#3c4042] dark:text-gray-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white'}`}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        : 
            <div className='flex flex-col'>
                <div className="grid gap-2 2xl:grid-cols-5 min-[1200px]:grid-cols-4 min-[768px]:grid-cols-3 min-[640px]:grid-cols-2 mb-4 rounded bg-gray-50 dark:bg-[#121212]">
                {currentItems.map(Users => (
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
                                                        <div className="bg-white w-1/2 p-4 rounded-lg z-50 dark:bg-[#1e1e1e]">
                                                            <div className="flex items-center justify-between rounded-t dark:border-gray-600">
                                                                <button type="button" onClick={closeResetpasswordModel} className="text-gray-400 bg-transparent hover:bg-red-400 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-red-400 dark:hover:text-white" data-modal-toggle="crud-modal">
                                                                    <IoClose className='text-2xl hover:text-white'/>
                                                                    <span className="sr-only">Close modal</span>
                                                                </button>
                                                            </div>
                                                            {/* Modal header */}
                                                            <div className="flex items-center mt-[-17px] px-2 pb-2 justify-between border-b rounded-t dark:border-gray-600">
                                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white w-[80%]">
                                                                    If you want reset {Users.user_name}'s password, please enter "{Users.user_name}" on below feild
                                                                </h3>
                                                            </div>
                                                            {/* Modal body */}
                                                            <form className="px-2 pt-2" onSubmit={submitPasswordForm}>
                                                                    {passwordreseterror &&
                                                                        <div
                                                                            className="bg-red-100 border mb-2 border-red-400 text-red-700 px-4 py-3 rounded relative"
                                                                            role="alert"
                                                                        >
                                                                            {/* <strong className="font-bold">Holy smokes!</strong> */}
                                                                            <span className="block sm:inline">{passwordreseterror}</span>
                                                                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={handleErrorClose}>
                                                                                <IoClose className='text-2xl text-red-700'/>
                                                                            </span>
                                                                        </div>
                                                                    } 
                                                                <div className="grid gap-4 mb-4 grid-cols-2">
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
                                                                    Reset password
                                                                </button>
                                                            </form>
                                                        </div>
                                                </div>
                                )}

                                {/* edite user */}
                                {thisuserpermissionArray.includes('update user') && (
                                                <a
                                                    onClick={() => handleToggleEditeRoleModel(Users.id, Users.user_name, Users.email, Users.name, Users.contact_no, Users.address, Users.roles)}
                                                >
                                                    <FaPenToSquare className='text-[#DBAE58] text-2xl'/>
                                                </a>
                                )}
                                {/* Edite Modal */}
                                {expandedEditeRoleModel === Users.id && (
                                                <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center" style={{ marginLeft:0 }}>
                                                        <div className="absolute w-full h-full bg-gray-900 dark:bg-[#121212] opacity-50"></div>
                                                        <div className="bg-white w-3/4 p-4 rounded-lg z-50 dark:bg-[#1e1e1e]">
                                                            <div className="flex items-center justify-between rounded-t dark:border-gray-600">
                                                                <button type="button" onClick={closeEditeRoleModel} className="text-gray-400 bg-transparent hover:bg-red-400 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-red-400 dark:hover:text-white" data-modal-toggle="crud-modal">
                                                                    <IoClose className='text-2xl hover:text-white'/>
                                                                    <span className="sr-only">Close modal</span>
                                                                </button>
                                                            </div>
                                                            {/* Modal header */}
                                                            <div className="flex items-center mt-[-17px] px-2 pb-2 justify-between border-b rounded-t dark:border-gray-600">
                                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                    Update {Users.user_name}
                                                                </h3>
                                                            </div>
                                                            {/* Modal body */}
                                                            <form className="px-2 pt-2" onSubmit={submitEditeForm}>
                                                                    {userediteerror &&
                                                                        <div
                                                                            className="bg-red-100 border mb-2 border-red-400 text-red-700 px-4 py-3 rounded relative"
                                                                            role="alert"
                                                                        >
                                                                            {/* <strong className="font-bold">Holy smokes!</strong> */}
                                                                            <span className="block sm:inline">{userediteerror}</span>
                                                                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={handleErrorClose}>
                                                                                <IoClose className='text-2xl text-red-700'/>
                                                                            </span>
                                                                        </div>
                                                                    } 
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
                                                                                onChange={(e) => setEditeUserUserName(e.target.value)}
                                                                                name="user_name"
                                                                                value={editeUserUserName}
                                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                                placeholder="Enter User name"
                                                                                required
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
                                                                                onChange={(e) => setEditeUserEmail(e.target.value)}
                                                                                name="email"
                                                                                value={editeUserEmail}
                                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                                placeholder="Enter user email address"
                                                                                required
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
                                                                                onChange={(e) => setEditeUserName(e.target.value)}
                                                                                name="name"
                                                                                value={editeUserName}
                                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                                placeholder="Enter user full name"
                                                                                required
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="flex items-center justify-center w-full">
                                                                            <label for="dropzone-file" className="flex flex-col items-center justify-center w-52 h-52 text-center border-2 border-gray-300 border-dashed rounded-[105px] cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                                                    </svg>
                                                                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                                                                </div>
                                                                                <input id="dropzone-file" type="file" className="hidden"/>
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
                                                                        type='number'
                                                                        id="contact_no"
                                                                        onChange={(e) => setEditeUserContactNo(e.target.value)}
                                                                        name="name"
                                                                        value={editeUserContactNo}
                                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                        placeholder="Enter user phon number"
                                                                        required
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
                                                                        onChange={e => setEditeUserAddress(e.target.value)}
                                                                        name="address"
                                                                        value={editeUserAddress}
                                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                        placeholder="Enter user address"
                                                                        required
                                                                    />
                                                                    </div>                                            
                                                                    <div>
                                                                        <button
                                                                            id="dropdownSearchButton"
                                                                            data-dropdown-toggle="dropdownSearch"
                                                                            className="flex justify-between items-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
                                                                        <div className="flex mt-1 flex-wrap gap-2">
                                                                            {editeselectedValues.map(Role => (
                                                                                <span className='flex px-3 py-1 bg-gray-400 rounded-md'>
                                                                                    {Role}
                                                                                    <button
                                                                                        className="ml-2"
                                                                                        onClick={(event) => handleediteCheckboxChange(event, Role)}
                                                                                    >
                                                                                        <IoClose className='text-2xl text-white hover:text-red-400'/>
                                                                                    </button>
                                                                                </span>
                                                                            ))}
                                                                        </div>
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
                                                                                    type="text" id="input-group-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search role name"
                                                                                    value={searchInput}
                                                                                    onChange={handleSearchInputChange}
                                                                                    />
                                                                                </div>
                                                                                </div>
                                                                                <ul
                                                                                className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
                                                                                aria-labelledby="dropdownSearchButton"
                                                                                >
                                                                                {filteredRoles.map(Role => (
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
                                                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Write short description about this user">{Users.user_description}</textarea>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="submit"
                                                                    className="text-white inline-flex items-center bg-[#DBAE58] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#DBAE58] dark:hover:bg-[#DBAE58] dark:focus:ring-blue-800"
                                                                >
                                                                    Update
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
                                                        <div className="bg-white w-1/2 p-4 rounded-lg z-50 dark:bg-[#1e1e1e]">
                                                            <div className="flex items-center justify-between rounded-t dark:border-gray-600">
                                                                <button type="button" onClick={closeDeleteRoleModel} className="text-gray-400 bg-transparent hover:bg-red-400 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-red-400 dark:hover:text-white" data-modal-toggle="crud-modal">
                                                                    <IoClose className='text-2xl hover:text-white'/>
                                                                    <span className="sr-only">Close modal</span>
                                                                </button>
                                                            </div>
                                                            {/* Modal header */}
                                                            <div className="flex items-center mt-[-17px] px-2 pb-2 justify-between border-b rounded-t dark:border-gray-600">
                                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white w-[80%]">
                                                                    If you want Delete {Users.user_name}, please enter "{Users.user_name}" on below feild
                                                                </h3>
                                                            </div>

                                                            {/* Modal body */}
                                                            <form className="px-2 pt-2" onSubmit={submitDeleteForm}>
                                                                    {userdeleteerror &&
                                                                        <div
                                                                            className="bg-red-100 border mb-2 border-red-400 text-red-700 px-4 py-3 rounded relative"
                                                                            role="alert"
                                                                        >
                                                                            {/* <strong className="font-bold">Holy smokes!</strong> */}
                                                                            <span className="block sm:inline">{userdeleteerror}</span>
                                                                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={handleErrorClose}>
                                                                                <IoClose className='text-2xl text-red-700'/>
                                                                            </span>
                                                                        </div>
                                                                    } 
                                                                <div className="grid gap-4 mb-4 grid-cols-2">
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
                                                                    Delete
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
                {/* Pagination */}
                <div className='flex w-[-webkit-fill-available] justify-end'>
                    <nav aria-label="Page navigation example" className="flex justify-end">
                        <ul className="inline-flex -space-x-px text-sm">
                            <li>
                                <button
                                    onClick={prevPage}
                                    disabled={currentPage === 1}
                                    className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight rounded-s-lg border border-e-0 border-gray-300 dark:border-gray-700 ${currentPage === 1 ? 'text-gray-500 dark:text-gray-400 bg-white dark:bg-[#3c4042]' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white'}`}
                                >
                                    Previous
                                </button>
                            </li>
                            {[...Array(Math.ceil(filteredUsers.length / itemsPerPage))].map((_, index) => (
                                <li>
                                    <button
                                        key={index}
                                        onClick={() => paginate(index + 1)}
                                        className={`flex items-center justify-center px-3 h-8 border border-gray-300 dark:border-gray-700 dark:text-white ${
                                            currentPage === index + 1 ? 'bg-gray-200 text-blue-700 dark:bg-[#3c4042]' : 'bg-blue-50 text-blue-600 dark:bg-[#606368]'
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                            <li>
                                <button
                                    onClick={nextPage}
                                    disabled={currentPage === Math.ceil(filteredUsers.length / itemsPerPage)}
                                    className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 rounded-e-lg dark:border-gray-700 ${currentPage === Math.ceil(filteredUsers.length / itemsPerPage) ? 'text-gray-500 bg-white border dark:bg-[#3c4042] dark:text-gray-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white'}`}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        }
        </div>
    );
}