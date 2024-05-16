"use client";
import HeaderListView from "../components/pageHeader/HeaderListView";
import HeaderGridView from "../components/pageHeader/HeaderGridView";
import PageHeader from "../components/pageHeader/pageHeader";
import { FaUsers } from "react-icons/fa";
import AddNewWorkflowForm from "../components/workflow/workflowForms/addNewWorkflowForm";
import { useSelector } from "react-redux";
import StaffAddForm from "./components/forms/staffAddForm";
import StaffRemoveForm from "./components/forms/staffRemoveForm";
import { useGetProcurementStaffQuery } from "@/app/_lib/redux/features/procurementProcess/procurementApi";
import ProcurementHomeGridComponent from "./components/ProcurementHomeGridComponent";
import ProcurementHomeListComponent from "./components/ProcurementHomeListComponent";
import StaffUpdateForm from "./components/forms/staffUpdateForm";

export default function Roles() {
    const view = useSelector((state) => state.pageHeader.view);
    const { data, isSuccess } = useGetProcurementStaffQuery();

    const form = {
        addForm: {
            modelTitle: "Add New Member",
            formComponent: <StaffAddForm />,
        },
        updateForm: {
            modelTitle: "Update Existing Workflow",
            formComponent: <StaffUpdateForm />,
        },
        deleteForm: {
            modelTitle: "Remove Member",
            formComponent: <StaffRemoveForm />,
        },
    };

    const menuPath = [
        { name: "Home", url: "/dashboard" },
        { name: "Procurement Management", url: "/dashboard/config" },
        { name: "Staff", url: "/dashboard/config/workflow" },
    ];

    return (
        <div className="px-4 pt-2 pl-8 border-gray-200 rounded-lg subcontent dark:border-gray-700">
            <PageHeader
                HeaderIcon={
                    <FaUsers className="mr-3 font-semibold text-gray-700 dark:text-white text-[25px]" />
                }
                menuPath={menuPath}
                headerTitle="Staff"
                headerDescription="Manage all your existing staff or add  new staff"
                headerButtonText="Add New Member"
                form={form}
            />
            {view === "list" ? (
                <HeaderListView
                    component={ProcurementHomeListComponent}
                    data={data?.data}
                    searchField={'name'}
                />
            ) : (
                <HeaderGridView
                    component={ProcurementHomeGridComponent}
                    data={data?.data}
                    searchField={'name'}
                    icon={
                        <FaUsers className="mr-3 font-semibold text-gray-700 dark:text-white text-[40px]" />
                    }
                />
            )}
        </div>
    );
}
