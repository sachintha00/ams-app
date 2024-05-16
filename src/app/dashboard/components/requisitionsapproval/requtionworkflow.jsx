import React from 'react';
import { FaUserTie, FaUsers } from "react-icons/fa6";
import { FcApprove } from "react-icons/fc";

export const Requtionworkflow = ({ node }) => {
  if (!node) {
    return null; // If node is undefined, don't render anything
  }

  // Determine the background color based on node.status
  const getStatusColor = (type) => {
    switch (type) {
      case 'WORKFLOW':
        return '';
      case 'CONDITION':
        return '';
      case 'APPROVED':
        return '';
      default:
        return 'bg-gray-500'; // Default color if status is unknown
    }
  };

    // Check if user array exists in node.data
    const hasUsers = Array.isArray(node?.data?.users) && node.data.users.length > 0;
    console.log(hasUsers);

  return (
    <div className="flex items-center space-x-2">
      <div className={`${getStatusColor(node.type)} max-w-sm mx-auto bg-white dark:bg-[#3c4042] rounded-xl shadow-md overflow-hidden md:max-w-2xl`}>
            {Array.isArray(node.data) ? (
              // node.data.map((dataItem, index) => (
              //   <div key={index}>
              //     {Object.entries(dataItem).map(([key, value]) => (
              //       <p key={key}>
              //         {key}: {JSON.stringify(value)}
              //       </p>
              //     ))}
              //   </div>
              // ))
                <div className="md:flex">
                    <div className="flex items-center justify-center m-3">
                        <div className="flex justify-center items-center w-12 h-12 rounded-full shadow-lg dark:bg-[#606368]">
                            <FcApprove className='text-[20px] dark:text-white'/>
                        </div>
                    </div>
                    <div className="flex item-center p-3">
                        <div className="flex items-center tracking-wide text-sm text-black dark:text-white font-semibold">
                        {node.type}
                        </div>
                        {/* <p className="mt-2 text-gray-500">
                            This is a brief description or any additional information about the user. You can customize this text as needed.
                        </p> */}
                    </div>
                </div>
            ) : (
              node.type === "WORKFLOW" && node.data && (
                <div>
                  {Object.entries(node.data).map(([key, value]) => (
                    <p key={key}>
                        <span>
                          {value === "SINGLE" && node.data.behaviourType === "EMPLOYEE" ? (
                            node.data.users.map((user, index) => (
                              <div className="md:flex" key={index}>
                                  <div className="flex items-center justify-center m-3">
                                      <div className="flex justify-center items-center w-12 h-12 rounded-full shadow-lg dark:bg-[#606368]">
                                        <img
                                            className="w-12 h-12 rounded-full shadow-lg"
                                            src="/avater.png"
                                            alt="Bonnie image"
                                        />
                                      </div>
                                  </div>
                                  <div className="flex item-center p-3">
                                      <div className="flex items-center tracking-wide text-sm text-black dark:text-white font-semibold">
                                       {user.name}
                                      </div>
                                      {/* <p className="mt-2 text-gray-500">
                                          This is a brief description or any additional information about the user. You can customize this text as needed.
                                      </p> */}
                                  </div>
                              </div>
                            ))
                          ) : value === "POOL" && node.data.behaviourType === "EMPLOYEE" ? (
                            <div className="md:flex">
                                <div className="flex items-center justify-center m-3">
                                    <div className="flex justify-center items-center w-12 h-12 rounded-full shadow-lg dark:bg-[#606368]">
                                        <FaUsers className='text-[20px] dark:text-white'/>
                                    </div>
                                </div>
                                <div className="flex item-center p-3">
                                    <div className="flex items-center tracking-wide text-sm text-black dark:text-white font-semibold">
                                      Employee Pool
                                    </div>
                                    {/* <p className="mt-2 text-gray-500">
                                        This is a brief description or any additional information about the user. You can customize this text as needed.
                                    </p> */}
                                </div>
                            </div>
                          ) : value === "SINGLE" && node.data.behaviourType === "DESIGNATION" ? (
                              <div className="md:flex">
                                  <div className="flex items-center justify-center m-3">
                                      <div className="flex justify-center items-center w-12 h-12 rounded-full shadow-lg dark:bg-[#606368]">
                                          <FaUserTie className='text-[20px] dark:text-white'/>
                                      </div>
                                  </div>
                                  <div className="flex item-center p-3">
                                      <div className="flex items-center tracking-wide text-sm text-black dark:text-white font-semibold">
                                      SINGLE DESIGNATION
                                      </div>
                                      {/* <p className="mt-2 text-gray-500">
                                          This is a brief description or any additional information about the user. You can customize this text as needed.
                                      </p> */}
                                  </div>
                              </div>
                          ) : value === "POOL" && node.data.behaviourType === "DESIGNATION" ? (
                            <div className="md:flex">
                                <div className="flex items-center justify-center m-3">
                                    <div className="flex justify-center items-center w-12 h-12 rounded-full shadow-lg dark:bg-[#606368]">
                                        <FaUserTie className='text-[20px] dark:text-white'/>
                                    </div>
                                </div>
                                <div className="flex item-center p-3">
                                    <div className="flex items-center tracking-wide text-sm text-black dark:text-white font-semibold">
                                    DESIGNATION POOL
                                    </div>
                                    {/* <p className="mt-2 text-gray-500">
                                        This is a brief description or any additional information about the user. You can customize this text as needed.
                                    </p> */}
                                </div>
                            </div>
                          ) : null}
                        </span>
                    </p>
                  ))}
                </div>
              )
            )}
      </div>
      {node.children && node.children.length > 0 && <div className="arrow-right" />}
      {node.children && node.children.length > 0 && (
        <div className="ml-6 space-y-2">
          {node.children.map((child) => (
            <Requtionworkflow key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};