import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useGivePermissiontoRoleMutation, useRemovePermissionfromRoleMutation, useRolesListQuery } from '@/app/_lib/redux/features/role/role_api';
import { IoClose } from "react-icons/io5";

function AddPermisionModel({  }) {

    const { value } = useSelector((state) => state.popupModel);
    const { id } = useSelector((state) => state.popupModel);
    const permision = value.permissions;
    const [rolehaspermissionarray, setRoleHasPermissionArray] = useState([]);
    const [permissionlistItems, setPermissionlistItems] = useState([]);
    const [givepermissionerror, setGivePermissionError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // useEffect(() => {
    //     if (value) {
    //         setProcuremenSelectedItems(value.selected_items);
    //         setSupplierQuotation(value.quotation_feedbacks);
    //     }
    // }, []);
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
        const rootNodes = organizationData.filter(
          (node) => node.parent_id === null
        );
        const transformedData = rootNodes.map((root) => ({
          id: root.id,
          name: root.name,
          description: root.description,
          parentNode: null,
          children: buildTree(organizationData, root.id),
        }));
        return transformedData;
      };

    console.log(RoleList.Permission);
    
    useEffect(() => {
        if (RoleList) {
            const permissionmenuItems = organizationTableDataToTreeStructure(
                RoleList.Permission
              );
            setPermissionlistItems(permissionmenuItems);
        }
    }, [RoleList]);

    useEffect(() => {
        if (permision) {
            setRoleHasPermissionArray(
                permision.map((permission) => permission.name)
            );
        }
    }, [permision]);

    // give permission
    const [givePermissiontoRole] = useGivePermissiontoRoleMutation();
    // remove permission
    const [removePermissionfromRole] = useRemovePermissionfromRoleMutation();

    const handleCheckboxChange = (roleId, permissionName) => {
        const updatedPermissions = rolehaspermissionarray.includes(permissionName)
        ? rolehaspermissionarray.filter((id) => id !== permissionName)
        : [...rolehaspermissionarray, permissionName];

        setRoleHasPermissionArray(updatedPermissions);

        // Handle API requests for adding or removing permissions
        if (updatedPermissions.includes(permissionName)) {
        // Send request to addpermission API endpoint
        console.log(roleId);
        try {
            const role = { roleId: roleId, permission: permissionName };
            givePermissiontoRole(role)
            .unwrap()
            .then((response) => {
                console.log("New node added:", response);
                setSuccessMessage(response.message);
                const timer = setTimeout(() => {
                    setSuccessMessage("");
                }, 5000); // Adjust the duration (in milliseconds) as needed
                return () => clearTimeout(timer);
                refetch();
            })
            .catch((error) => {
                console.error("Error adding new node:", error);
                setGivePermissionError(error);
                // const timer = setTimeout(() => {
                // setGivePermissionError("");
                // }, 5000); // Adjust the duration (in milliseconds) as needed
                // return () => clearTimeout(timer);
            });
        } catch (error) {
            console.error("Login error:", error);
        }
        } else {
        // Send request to deletepermission API endpoint
        console.log(permissionName);
        try {
            const role = { roleId: roleId, permission: permissionName };
            removePermissionfromRole(role)
            .unwrap()
            .then((response) => {
                console.log("New node added:", response);
                setSuccessMessage(response.message);
                const timer = setTimeout(() => {
                    setSuccessMessage("");
                }, 5000); // Adjust the duration (in milliseconds) as needed
                return () => clearTimeout(timer);
                refetch();
            })
            .catch((error) => {
                console.error("Error adding new node:", error);
                setGivePermissionError(error);
                // const timer = setTimeout(() => {
                // setGivePermissionError("");
                // }, 5000); // Adjust the duration (in milliseconds) as needed
                // return () => clearTimeout(timer);
            });
        } catch (error) {
            console.error("Login error:", error);
        }
        }
    };

    const handleErrorClose = () => {
        setGivePermissionError("");
        setSuccessMessage("");
    };

    return (
        <>
            <form>
            {givepermissionerror && (
                <div
                className="relative px-4 py-3 mb-2 text-red-700 bg-red-100 border border-red-400 rounded"
                role="alert"
                >
                {/* <strong className="font-bold">Holy smokes!</strong> */}
                <span className="block sm:inline">{givepermissionerror}</span>
                <span
                    className="absolute top-0 bottom-0 right-0 px-4 py-3"
                    onClick={handleErrorClose}
                >
                    <IoClose className="text-2xl text-red-700" />
                </span>
                </div>
            )}
            {successMessage && (
                <div
                className="relative px-4 py-3 mb-2 text-green-700 bg-green-100 border border-green-400 rounded"
                role="alert"
                >
                {/* <strong className="font-bold">Holy smokes!</strong> */}
                <span className="block sm:inline">{successMessage}</span>
                <span
                    className="absolute top-0 bottom-0 right-0 px-4 py-3"
                    onClick={handleErrorClose}
                >
                    <IoClose className="text-2xl text-green-700" />
                </span>
                </div>
            )}
            <div className="h-full py-4 overflow-y-auto bg-white dark:bg-[#1e1e1e]">
                <ul
                className="space-y-2 font-medium overflow-y-scroll h-[500px]"
                style={{ scrollbarWidth: "thin" }}
                >
                {permissionlistItems.map((permissionlist) => (
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
                        <span className="flex-1 text-left whitespace-normal ms-3 rtl:text-right">
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
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={rolehaspermissionarray.includes(permissionlist.name)}
                            onChange={() =>
                            handleCheckboxChange(id, permissionlist.name)
                            }
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                        {/* <span className="text-sm font-medium text-gray-900 ms-3 dark:text-gray-300">
                                                                                            Toggle me
                                                                                        </span> */}
                        </label>
                    </div>
                    {permissionlist.children && (
                        <ul id="dropdown-example" className="py-2 space-y-2">
                        {permissionlist.children.map((submenu1) => (
                            <li>
                            <div className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-[#3c4042]">
                                {/* <svg
                                                                                                    className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                                                                                                    aria-hidden="true"
                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                    fill="currentColor"
                                                                                                    viewBox="0 0 18 21"
                                                                                                >
                                                                                                    <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                                                                                                </svg> */}
                                <span className="flex-1 text-left whitespace-normal ms-3 rtl:text-right">
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
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={rolehaspermissionarray.includes(submenu1.name)}
                                    onChange={() =>
                                    handleCheckboxChange(id, submenu1.name)
                                    }
                                />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                                {/* <span className="text-sm font-medium text-gray-900 ms-3 dark:text-gray-300">
                                                                                                        Toggle me
                                                                                                    </span> */}
                                </label>
                            </div>
                            {submenu1.children && (
                                <div class="grid grid-cols-4 gap-4 pl-16">
                                {submenu1.children.map((subsubmenu) => (
                                    <div className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-[#3c4042]">
                                    <span className="flex-1 mr-8 text-left whitespace-normal ms-3 rtl:text-right">
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
                                        <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={rolehaspermissionarray.includes(
                                            subsubmenu.name
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(id, subsubmenu.name)
                                        }
                                        />
                                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                                        {/* <span className="text-sm font-medium text-gray-900 ms-3 dark:text-gray-300">
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
        </>
    );
}

export default AddPermisionModel; 