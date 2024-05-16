import React from 'react';

export const Requtionworkflow = ({ node }) => {
  if (!node) {
    return null; // If node is undefined, don't render anything
  }

  // Determine the background color based on node.status
  const getStatusColor = (type) => {
    switch (type) {
      case 'WORKFLOW':
        return 'ring-4 ring-blue-400';
      case 'CONDITION':
        return 'ring-4 ring-red-400';
      case 'APPROVED':
        return 'bg-green-300 ring-4 ring-green-400';
      default:
        return 'bg-gray-500'; // Default color if status is unknown
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`p-5 ${getStatusColor(node.type)} rounded-full text-gray-500 dark:text-gray-400`}>
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
              <div>{node.type}</div>
            ) : (
              node.type === "WORKFLOW" && node.data && (
                <div>
                  {Object.entries(node.data).map(([key, value]) => (
                    <p key={key}>
                        <span>
                          {value === "SINGLE" ? (
                            node.data.users.map((user, index) => (
                              <div key={index} className='flex justify-center ml-3 mr-3'>
                                <img
                                    className="w-12 h-12 rounded-full shadow-lg"
                                    src="/avater.png"
                                    alt="Bonnie image"
                                />
                                <span>
                                  {user.name}
                                </span>
                              </div>
                            ))
                          ) : value === "POOL" ? (
                            <span>POOL</span>
                          ) : (
                            null
                          )}
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