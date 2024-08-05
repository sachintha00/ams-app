"use client";
import React, { useEffect, useState, useContext, useRef } from "react";
import PageHeader from "../components/pageHeader/pageHeader";
import { useSelector } from "react-redux";
import { redirect, useRouter } from 'next/navigation';
import PageListView from "../components/pageContent/PageListView";
import PageGridView from "../components/pageContent/PageGridView";
import { FaUserAlt } from "react-icons/fa";
import { useAuthpermissionsQuery } from "@/app/_lib/redux/features/authpermission/auth_permission_api";
import RoleListTable from "../Roles/components/roleListTable";
import RolesGridComponent from "../Roles/components/rolesGridComponent";
import AddNewRolesForm from "../Roles/components/addNewRolesForm";
import UpdateRolesForm from "../Roles/components/updateRolesForm";
import AddPermisionModel from "../Roles/components/addPermisionModel";
import DeleteRolesForm from "../Roles/components/deleteRolesForm";
import { useUsersListQuery } from "@/app/_lib/redux/features/user/user_api";
import usersGridComponent from "./components/usersGridComponent";
import AddNewUsersForm from "./components/addNewUsersForm";
import UsersListTable from "./components/usersListTable";
import DeleteUserForm from "./components/deleteUserForm";
import ResetUserPasswordForm from "./components/resetUserPasswordForm";
import UpdateUserForm from "./components/updateUserForm";

export default function Page() {

  //auth permissions
  const [thisuserpermissionArray, setthisuserpermissionArray] = useState([]);
  const { data: permissionList } = useAuthpermissionsQuery();

  useEffect(() => {
    if (permissionList) {
      const permissions = Object.values(permissionList.thisuserpermission);
      setthisuserpermissionArray(permissions);
    }
  }, [permissionList]);

  const router = useRouter();

  const [showHeaderLineA, setShowHeaderLineA] = useState(false);
  const [showHeaderLineB, setShowHeaderLineB] = useState(false);
  const [showHeaderLineC, setShowHeaderLineC] = useState(false);
  const [showAddButton, setShowAddButton] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showGridListButton, setShowGridListButton] = useState(false);
  const [showModelTitle, setshowModelTitle] = useState(false);
  const gridviewColume = "gap-2 2xl:grid-cols-5 min-[1200px]:grid-cols-4 min-[768px]:grid-cols-3 min-[640px]:grid-cols-2";

  const view = useSelector((state) => state.pageHeader.view);

  const {
    data: UserList,
    isLoading,
    isError,
    error,
    refetch,
} = useUsersListQuery();

  // search bar
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const searchQuery = useSelector((state) => state.pageHeader.searchQuery) || "";
  const [filteredData, setFilteredData] = useState([]);

  // const roleitem = RoleList?.Role || [];
  // const sortedRoles = roleitem.sort((a, b) => a.name.localeCompare(b.name));
  // const filteredData = sortedRoles.filter((Role) =>
  //                         Role.name.toLowerCase().includes(searchQuery.toLowerCase())
  //                       );
  useEffect(() => {
    if (!isLoading && !isError && UserList) {
      const users = Object.values(UserList.Users);
      // Sort users alphabetically by user_name
      const sortedUsers = users.sort((a, b) => a.user_name.localeCompare(b.user_name));
      const filteredusers = sortedUsers.filter(user => user.user_name.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredData(filteredusers);
    }
  }, [isLoading, isError, UserList, searchQuery, refetch]);

  // console.log(filteredData);

  const form = {
    addForm: {
      modelTitle: "Add New User",
      formComponent: <AddNewUsersForm />,
      modelPageSize: "w-4/5",
    },
    updateForm: {
      modelTitle: "Update User Details",
      formComponent: <UpdateUserForm/>,
      modelPageSize: "w-4/5",
    },
    viewForm: {
      modelTitle: "Managing Parmison",
      formComponent: <AddPermisionModel/>,
      modelPageSize: "w-[95%]",
    },
    deleteForm: {
      modelTitle: "",
      formComponent: <DeleteUserForm/>,
      showModelTitle:{showModelTitle},
    },
    otherForm: {
      modelTitle: "",
      formComponent: <ResetUserPasswordForm/>,
      showModelTitle:{showModelTitle},
    },
  };

  const menuPath = [
    { name: "Home", url: "/dashboard" },
    { name: "User Management", url: "" },
    { name: "Users", url: "/dashboard/users" },
  ];

  return (
    <div className="p-4 pl-8 border-gray-200 rounded-lg subcontent dark:border-gray-700 mt-10">
        <PageHeader 
          HeaderIcon={
            <FaUserAlt className="mr-3 font-semibold text-gray-700 dark:text-white text-[25px]" />
          }
          menuPath={menuPath}
          headerTitle="Users"
          headerDescription="Manage all existing users or add a new one"
          headerButtonText="Add New Users"
          form={form}
          // You can hide the component related to that option in the page header by uncommenting the option below
          // showHeaderLineA={showHeaderLineA}
          // showHeaderLineB={showHeaderLineB}
          // showHeaderLineC={showHeaderLineC}
          // showAddButton={showAddButton}
          // showSearchBar={showSearchBar} 
          // showGridListButton={showGridListButton}
          // showModelTitle={showModelTitle}
          Searchplaceholder="Search User name"
        />
        {view === "list" ? (
          <PageListView 
            component={UsersListTable}
            data={filteredData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentPage}
            thisuserpermissionArray={thisuserpermissionArray}
          />
        ) : (
          <PageGridView
            component={usersGridComponent}
            gridcolume={gridviewColume}
            data={filteredData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentPage}
            thisuserpermissionArray={thisuserpermissionArray}
            icon={
              <FaUserAlt className="mr-3 font-semibold text-gray-700 dark:text-white text-[54px]" />
            }
          />
        )}
    </div>
  );
}