"use client";
import React, { useEffect, useState, useContext, useRef } from "react";
import PageHeader from "../components/pageHeader/pageHeader";
import { useSelector } from "react-redux";
import { redirect, useRouter } from 'next/navigation';
import PageListView from "../components/pageContent/PageListView";
import PageGridView from "../components/pageContent/PageGridView";
import { FaUserCog } from "react-icons/fa";
import { useRolesListQuery } from "@/app/_lib/redux/features/role/role_api";
import RolesGridComponent from "./components/rolesGridComponent";
import AddNewRolesForm from "./components/addNewRolesForm";
import DeleteRolesForm from "./components/deleteRolesForm";
import UpdateRolesForm from "./components/updateRolesForm";
import AddPermisionModel from "./components/addPermisionModel";
import RoleListTable from "./components/roleListTable";
import { useAuthpermissionsQuery } from "@/app/_lib/redux/features/authpermission/auth_permission_api";

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
    data: RoleList,
    isLoading,
    isError,
    error,
    refetch,
  } = useRolesListQuery();

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
    console.log(RoleList);
    if (!isLoading && !isError && RoleList) {
      const roleitem = Object.values(RoleList.Role);

      // Sort users alphabetically by user_name
      const sortedRoles = roleitem.sort((a, b) => a.name.localeCompare(b.name));
      const filteredroles = sortedRoles.filter((role) =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase())
      );


      setFilteredData(filteredroles);
    }
  }, [isLoading, isError, RoleList, searchQuery, refetch]);

  // console.log(filteredData);

  const form = {
    addForm: {
      modelTitle: "Add New Role",
      formComponent: <AddNewRolesForm />,
      modelPageSize: "w-1/2",
    },
    updateForm: {
      modelTitle: "Update Supplier Quotation",
      formComponent: <UpdateRolesForm />,
      modelPageSize: "w-1/2",
    },
    viewForm: {
      modelTitle: "Managing Parmison",
      formComponent: <AddPermisionModel />,
      modelPageSize: "w-[95%]",
    },
    deleteForm: {
      modelTitle: "Remove Supplier Quotation",
      formComponent: <DeleteRolesForm />,
      showModelTitle: { showModelTitle },
    },
  };

  const menuPath = [
    { name: "Home", url: "/dashboard" },
    { name: "User Management", url: "" },
    { name: "User Roles", url: "/dashboard/Roles" },
  ];

  return (
    <div className="p-4 pl-8 mt-10 border-gray-200 rounded-lg subcontent dark:border-gray-700">
      <PageHeader
        HeaderIcon={
          <FaUserCog className="mr-3 font-semibold text-gray-700 dark:text-white text-[25px]" />
        }
        menuPath={menuPath}
        headerTitle="User Roles"
        headerDescription="Manage all your existing Roles or add a new one"
        headerButtonText="Add New User Role"
        form={form}
        // You can hide the component related to that option in the page header by uncommenting the option below
        // showHeaderLineA={showHeaderLineA}
        // showHeaderLineB={showHeaderLineB}
        // showHeaderLineC={showHeaderLineC}
        // showAddButton={showAddButton}
        // showSearchBar={showSearchBar} 
        // showGridListButton={showGridListButton}
        // showModelTitle={showModelTitle}
        Searchplaceholder="Search Roles name"
      />
      {view === "list" ? (
        <PageListView
          component={RoleListTable}
          data={filteredData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
          thisuserpermissionArray={thisuserpermissionArray}
        />
      ) : (
        <PageGridView
          component={RolesGridComponent}
          gridcolume={gridviewColume}
          data={filteredData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
          thisuserpermissionArray={thisuserpermissionArray}
          icon={
            <FaUserCog className="mr-3 font-semibold text-gray-700 dark:text-white text-[54px]" />
          }
        />
      )}
    </div>
  );
}