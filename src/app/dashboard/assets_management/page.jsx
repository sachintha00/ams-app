"use client";
import React, { useEffect, useState, useContext, useRef } from "react";
import PageHeader from "../components/pageHeader/pageHeader";
import { useSelector } from "react-redux";
import { redirect, useRouter } from 'next/navigation';
import PageListView from "../components/pageContent/PageListView";
import PageGridView from "../components/pageContent/PageGridView";
import { FaDollyFlatbed } from "react-icons/fa";
import UpdateSupplierQuotationForm from "../supplier_quotation/components/updateNewSupplierQuotationForm";
import AddNewAssetsForm from "./components/addNewAssetsForm";
import AssetsGridComponent from "./components/assetsGridComponent";
import { useAssestListQuery } from "@/app/_lib/redux/features/assetsmanagement/assets_management_api";
import AssetsListTable from "./components/assetsListTable";
import ViewAssetsDetails from "./components/viewAssetsDetails";
import DeleteAssetsForm from "./components/deleteAssetsForm";

export default function Page() {

  const router = useRouter();

  const [showHeaderLineA, setShowHeaderLineA] = useState(false);
  const [showHeaderLineB, setShowHeaderLineB] = useState(false);
  const [showHeaderLineC, setShowHeaderLineC] = useState(false);
  const [showAddButton, setShowAddButton] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showGridListButton, setShowGridListButton] = useState(false);
  const [showModelTitle, setshowModelTitle] = useState(false);
  const gridviewColume = "gap-2 2xl:grid-cols-5 min-[1200px]:grid-cols-3 min-[768px]:grid-cols-2 min-[640px]:grid-cols-1";

  const view = useSelector((state) => state.pageHeader.view);

  const {
    data: assestList,
    isLoading,
    isError,
    error,
    refetch,
  } = useAssestListQuery();
 
  // search bar
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const searchQuery = useSelector((state) => state.pageHeader.searchQuery) || "";
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (!isLoading && !isError && assestList) {
      const Allassestslist = Object.values(assestList.Allassests);

      // Sort users alphabetically by user_name
      const sortedAssets = Allassestslist.sort((a, b) => a.serial_number.localeCompare(b.serial_number));
      const filteredAssets = sortedAssets.filter((assets) =>
        assets.serial_number.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filteredAssets);
    }
  }, [isLoading, isError, assestList, searchQuery, refetch]);

  // console.log(filteredData);

  const form = {
    addForm: {
      modelTitle: "Assets Record & Register",
      formComponent: <AddNewAssetsForm />,
      modelPageSize: "w-4/5",
    },
    updateForm: {
      modelTitle: "Update Supplier Quotation",
      formComponent: <UpdateSupplierQuotationForm/>,
      modelPageSize: "w-4/5",
    },
    viewForm: {
      modelTitle: "Assets Details",
      formComponent: <ViewAssetsDetails/>,
      modelPageSize: "w-4/5",
    },
    deleteForm: {
      modelTitle: "Remove Supplier Quotation",
      formComponent: <DeleteAssetsForm />,
      showModelTitle:{showModelTitle},
    },
  };

  const menuPath = [
    { name: "Home", url: "/dashboard" },
    { name: "Procurement Management", url: "" },
    { name: "Supplier Quotation", url: "/dashboard/supplier_quotation" },
  ];

  return (
    <div className="p-4 pl-8 border-gray-200 rounded-lg subcontent dark:border-gray-700 mt-10">
        <PageHeader 
          HeaderIcon={
            <FaDollyFlatbed className="mr-3 font-semibold text-gray-700 dark:text-white text-[25px]" />
          }
          menuPath={menuPath}
          headerTitle="Assets management"
          headerDescription="Manage all your existing Assets or Register  new Assets"
          headerButtonText="Assets Record & Register"
          form={form}
          // You can hide the component related to that option in the page header by uncommenting the option below
          // showHeaderLineA={showHeaderLineA}
          // showHeaderLineB={showHeaderLineB}
          // showHeaderLineC={showHeaderLineC}
          // showAddButton={showAddButton}
          // showSearchBar={showSearchBar} 
          // showGridListButton={showGridListButton}
          // showModelTitle={showModelTitle}
          Searchplaceholder="Search Serial No"
        />
        {view === "list" ? (
          <PageListView 
            component={AssetsListTable}
            data={filteredData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentPage}
          />
        ) : (
          <PageGridView
            component={AssetsGridComponent}
            gridcolume={gridviewColume}
            data={filteredData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentPage}
            icon={
              <FaDollyFlatbed className="font-semibold text-white dark:text-white text-[42px]" />
            }
          />
        )}
    </div>
  );
}