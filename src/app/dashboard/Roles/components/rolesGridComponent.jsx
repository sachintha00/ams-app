import { FORM_TYPE } from "@/app/_lib/constants/formType";
import { handleOpenPopupModel } from "@/app/_lib/redux/features/popupModel/popupModelSlice";
import { useDispatch } from "react-redux";
import { MdDelete } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { FaUserLock } from "react-icons/fa";

function RolesGridComponent({
    gridcolume = "gap-2 2xl:grid-cols-5 min-[1200px]:grid-cols-4 min-[768px]:grid-cols-3 min-[640px]:grid-cols-2",
    data,
    thisuserpermissionArray,
    icon
  }) {
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
        <div className={`grid ${gridcolume} mb-1 rounded bg-white dark:bg-[#121212]`}>
                {data.map((Role) => {
                    return(
                        <div className="w-full p-5 my-5 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-[#1e1e1e] dark:border-gray-700">
                        <div className="flex">
                          {icon}
                          <div>
                            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                              {Role.name}
                            </h5>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {Role.description}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-end mt-4 md:mt-6">
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
                        </div>
                      </div>
                    )
                })}
            </div>
    );
}

export default RolesGridComponent;