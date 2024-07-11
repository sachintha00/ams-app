import { FORM_TYPE } from "@/app/_lib/constants/formType";
import { handleOpenPopupModel } from "@/app/_lib/redux/features/popupModel/popupModelSlice";
import { useDispatch } from "react-redux";
import { MdDelete } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { FaUserLock } from "react-icons/fa";

function RoleListTable({ data, thisuserpermissionArray }) {
    const dispatch = useDispatch();
    console.log(data);

    const handleToggleAddPermisionModel = async (id, modelvalue) => {
        console.log(id);
        dispatch(
          handleOpenPopupModel({
            id,
            value: modelvalue,
            formType: FORM_TYPE.VIEW,
          })
        );
      };
    const handleUpdate = async (id, modelvalue) => {
        console.log(id);
        dispatch(
          handleOpenPopupModel({
            id,
            value: modelvalue,
            formType: FORM_TYPE.UPDATE,
          })
        );
      };
    const handleDelete = async (id, modelvalue) => {
        console.log(id);
        dispatch(
          handleOpenPopupModel({
            id,
            value: modelvalue,
            formType: FORM_TYPE.DELETE,
          })
        );
      };
    return (
            <div className="overflow-x-auto border border-gray-200 sm:rounded-lg w-[-webkit-fill-available]">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-[#606368] dark:text-gray-400">
                    <tr>
                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Name 
                        </th>
                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Description
                        </th>
                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((Role) => {
                        return(
                        <tr className="odd:bg-white odd:dark:bg-[#1e1e1e] even:bg-gray-50 even:dark:bg-[#3c4042] border-b dark:border-gray-700">
                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{Role.name}</td>
                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{Role.description}</td>
                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              <div className="flex w-[45%] justify-between">
                                  {/* add permission to role */}
                                  {thisuserpermissionArray.includes(
                                    "give permissions to role"
                                  ) && (
                                    <a
                                    onClick={() =>
                                      handleToggleAddPermisionModel(Role.id, Role)
                                    }
                                    >
                                      <FaUserLock className="text-2xl text-gray-700 dark:text-white" />
                                    </a>
                                  )}
              
                                  {/* edite role */}
                                  {thisuserpermissionArray.includes("update role") && (
                                    <a
                                    onClick={() =>
                                      handleUpdate(Role.id, Role)
                                    }
                                    >
                                      <BiEdit className="text-yellow-400 hover:text-yellow-500 text-2xl" />
                                    </a>
                                  )}
              
                                  {/* delete role */}
                                  {thisuserpermissionArray.includes("delete role") && (
                                    <a
                                    onClick={() =>
                                        handleDelete(Role.id, Role)
                                    }
                                    >
                                      <MdDelete className="text-red-400 hover:text-red-500 text-2xl" />
                                    </a>
                                  )}
                              </div>
                            </td>
                        </tr>
                        )
                    })}
                </tbody>
                </table>
            </div>
    );
}

export default RoleListTable;