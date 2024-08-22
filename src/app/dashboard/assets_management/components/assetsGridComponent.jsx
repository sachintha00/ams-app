import { FORM_TYPE } from "@/app/_lib/constants/formType";
import { handleOpenPopupModel } from "@/app/_lib/redux/features/popupModel/popupModelSlice";
import { useDispatch } from "react-redux";
import { MdDelete } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { FaEye } from "react-icons/fa";

function AssetsGridComponent({
    gridcolume = "gap-2 2xl:grid-cols-5 min-[1200px]:grid-cols-4 min-[768px]:grid-cols-3 min-[640px]:grid-cols-2",
    data,
    thisuserpermissionArray,
    icon
  }) {
    const dispatch = useDispatch();
    console.log(data);
    const handleQuotationView = async (id, modelvalue) => {
      console.log(id);
      dispatch(
        handleOpenPopupModel({
          id,
          value: modelvalue,
          formType: FORM_TYPE.VIEW,
        })
      );
    };
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

    const defaultAvatar = '/laptopavater.png';

    return (
        <div className={`grid ${gridcolume} mb-1 rounded bg-white dark:bg-[#121212]`}>
          {data.map((Assets) => {
            return(
              <div className="p-[10px] w-full my-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-[#1e1e1e] dark:border-gray-700">
                <img
                  className="rounded"
                  src={`${process.env.NEXT_PUBLIC_API_URL}${Assets.thumbnail_image[0] || defaultAvatar}`}
                  alt={`${Assets.model_number}`}
                />
                <div>
                  <div className="flex justify-between mt-1 mb-2">
                    <p className="text-base tracking-tight text-gray-900 dark:text-white">
                      {Assets.sub_category_name}
                    </p>
                    <span className="flex justify-center items-center rounded-lg p-1 bg-yellow-200 text-xs text-gray-500 dark:text-gray-400">
                      Rs.{Assets.assets_value}
                    </span>
                  </div>
                  <div className="flex">
                    <div className="w-[60%] flex flex-col justify-between">
                      <div>
                        <p className="font-normal text-xs text-gray-700 dark:text-gray-400">
                          Model No:{Assets.model_number}
                        </p>
                        <p className="font-normal text-xs text-gray-700 dark:text-gray-400">
                          Serial No:{Assets.serial_number}
                        </p>
                        <p className="font-normal text-xs text-gray-700 dark:text-gray-400">
                          Condition:{Assets.received_condition}
                        </p>
                      </div>
                      <div className="flex w-auto justify-around">
                            {/* add permission to role */}
                            {/* {thisuserpermissionArray.includes(
                              "give permissions to role"
                            ) && ( */}
                              <a
                                onClick={() =>
                                handleQuotationView(Assets.id, Assets)
                              }
                              >
                                <FaEye className="text-2xl text-gray-700 dark:text-white" />
                              </a>
                            {/* )} */}
        
                            {/* edite role */}
                            {/* {thisuserpermissionArray.includes("update role") && ( */}
                              <a
                                onClick={() =>
                                  handleUpdate(Assets.id, Assets)
                                }
                              >
                                <BiEdit className="text-yellow-400 hover:text-yellow-500 text-2xl" />
                              </a>
                            {/* )} */}
        
                            {/* delete role */}
                            {/* {thisuserpermissionArray.includes("delete role") && ( */}
                              <a
                                onClick={() =>
                                  handleDelete(Assets.id, Assets)
                                }
                              >
                                <MdDelete className="text-red-400 hover:text-red-500 text-2xl" />
                              </a>
                            {/* )} */}
                      </div>
                    </div>
                    <div className="w-[40%]">
                      <img className="rounded" src="/sampleqr.jpg" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
    );
}

export default AssetsGridComponent;