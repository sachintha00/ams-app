import { FORM_TYPE } from "@/app/_lib/constants/formType";
import { handleOpenPopupModel } from "@/app/_lib/redux/features/popupModel/popupModelSlice";
import { useDispatch } from "react-redux";
import { MdDelete } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { FaUserLock } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { RiLockPasswordLine } from "react-icons/ri";
import { useStatuschangeUserMutation } from "@/app/_lib/redux/features/user/user_api";

function UsersListTable({ data, thisuserpermissionArray }) {
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
    const handleUpdate = async (id, Users) => {
        console.log(id);
        dispatch(
            handleOpenPopupModel({
                id,
                value: Users,
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

    // status change
    const [statuschangeUser] = useStatuschangeUserMutation();

    const handleToggleStatus = (userId, newStatus) => {
        console.log(userId);
        try {
            const user = { ID: userId, status: newStatus }
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
    return (
        <div className="overflow-x-auto border border-gray-200 sm:rounded-lg w-[-webkit-fill-available]">
            <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-[#606368] dark:text-gray-400">
                    <tr>
                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">

                        </th>
                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            User Name
                        </th>
                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Email
                        </th>
                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Name
                        </th>
                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Contact Number
                        </th>
                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Roles
                        </th>
                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Status
                        </th>
                        <th className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">

                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((Users) => {
                        return (
                            <tr className="odd:bg-white odd:dark:bg-[#1e1e1e] even:bg-gray-50 even:dark:bg-[#3c4042] border-b dark:border-gray-700">
                                <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {Users.profie_image ? (
                                        <img
                                            className="w-12 h-12 mb-3 rounded-full shadow-lg"
                                            src={`${process.env.NEXT_PUBLIC_API_URL}${Users.profie_image}`}
                                            alt={`${Users.name} profile`} />
                                    )
                                        :
                                        (
                                            <img
                                                className="w-12 h-12 mb-3 rounded-full shadow-lg"
                                                src="/avater.png"
                                                alt="Bonnie image"
                                            />
                                        )}
                                </td>
                                <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{Users.user_name}</td>
                                <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{Users.email}</td>
                                <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{Users.name}</td>
                                <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{Users.contact_no}</td>
                                <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
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
                                <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {Users.status === true ? (
                                        <span>Active</span>
                                    )
                                        :
                                        Users.status === false ? (
                                            <span>DeActive</span>
                                        ) : null}
                                </td>
                                <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <div className="flex items-center justify-between w-auto mt-4 md:mt-6">
                                        {/* <div className='flex flex-col w-[50%] justify-between items-center'>
                                          <span className="text-sm text-gray-500 dark:text-gray-400">
                                              {Users.status ? 'Active' : 'Inactive'}
                                          </span> */}
                                        {/* change user status */}
                                        {/* {thisuserpermissionArray.includes('user status change') && (
                                              <label className="inline-flex items-center cursor-pointer">
                                                  <input type="checkbox" checked={Users.status} className="sr-only peer" onChange={() => handleToggle(Users.id, Users.status)} />
                                                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600" />
                                              </label>
                                          )}
                                      </div> */}
                                        {thisuserpermissionArray.includes('user status change') && (
                                            <label className="inline-flex items-center mx-1 cursor-pointer">
                                                <input type="checkbox" checked={Users.status} className="sr-only peer" onChange={() => handleToggle(Users.id, Users.status)} />
                                                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600" />
                                            </label>
                                        )}
                                        {/* password reset */}
                                        {thisuserpermissionArray.includes('user password reset') && (
                                            <a
                                                className="mx-1"
                                            // onClick={() => handleToggleResetpasswordModel(Users.id)}
                                            >
                                                <RiLockPasswordLine className='text-3xl text-gray-700 dark:text-white' />
                                            </a>
                                        )}

                                        {/* edite user */}
                                        {thisuserpermissionArray.includes('update user') && (
                                            <a
                                                className="mx-1"
                                                onClick={() =>
                                                    handleUpdate(Users.id, Users)
                                                }
                                            >
                                                <BiEdit className="text-3xl text-yellow-400 hover:text-yellow-500" />
                                            </a>
                                        )}

                                        {/* delete user */}
                                        {thisuserpermissionArray.includes('delete user') && (
                                            <a
                                                className="mx-1"
                                            // onClick={() => handleToggleDeleteRoleModel(Users.id)}
                                            >
                                                <MdDelete className="text-3xl text-red-400 hover:text-red-500" />
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

export default UsersListTable;