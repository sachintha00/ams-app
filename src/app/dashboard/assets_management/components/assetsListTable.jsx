import { FORM_TYPE } from "@/app/_lib/constants/formType";
import { handleOpenPopupModel } from "@/app/_lib/redux/features/popupModel/popupModelSlice";
import { useDispatch } from "react-redux";
import { MdDelete } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { FaEye } from "react-icons/fa";

function AssetsListTable({ data, thisuserpermissionArray }) {
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

                        </th>
                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Category
                        </th>
                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Sub Category_name
                        </th>
                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Model Number
                        </th>
                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Serial Number
                        </th>
                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Received Condition
                        </th>
                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Warranty
                        </th>
                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">

                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((Assets) => {
                        return(
                        <tr className="odd:bg-white odd:dark:bg-[#1e1e1e] even:bg-gray-50 even:dark:bg-[#3c4042] border-b dark:border-gray-700">
                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              <img className="h-[100px] w-[100px] rounded-lg shadow-xl dark:shadow-gray-800" src="/laptopavater.png"/>
                            </td>
                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              {Assets.category_name}
                            </td>
                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              {Assets.sub_category_name}
                            </td>
                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              {Assets.model_number}
                            </td>
                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              {Assets.serial_number}
                            </td>
                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              {Assets.received_condition}
                            </td>
                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              {Assets.warranty}
                            </td>
                            <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              <div className="flex w-auto justify-between items-center">
                                    {/* add permission to role */}
                                    {/* {thisuserpermissionArray.includes(
                                      "give permissions to role"
                                    ) && ( */}
                                      <a
                                      >
                                        <FaEye className="text-3xl text-gray-700 dark:text-white" />
                                      </a>
                                    {/* )} */}
                
                                    {/* edite role */}
                                    {/* {thisuserpermissionArray.includes("update role") && ( */}
                                      <a
                                      >
                                        <BiEdit className="text-yellow-400 hover:text-yellow-500 text-3xl" />
                                      </a>
                                    {/* )} */}
                
                                    {/* delete role */}
                                    {/* {thisuserpermissionArray.includes("delete role") && ( */}
                                      <a
                                      >
                                        <MdDelete className="text-red-400 hover:text-red-500 text-3xl" />
                                      </a>
                                    {/* )} */}
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

export default AssetsListTable;