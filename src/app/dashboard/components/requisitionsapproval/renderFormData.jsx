export const renderFormData = (data, level = 0) => {
    if (!data || typeof data !== 'object') return null;
  
    const indentStyle = { paddingLeft: `${level * 20}px` };
  
    const entries = Object.entries(data);
  
    // First pass: render primitive and non-array object properties
    const primitiveAndObjectEntries = entries
      .filter(([key, value]) => !Array.isArray(value))
      .map(([key, value], index) => {
        if (value === null || (typeof value === 'object' && Object.keys(value).length === 0)) return null;
        if (typeof value === 'object' && value !== null) {
          return (
            <div key={`obj-${index}`} style={indentStyle} className="my-2">
              <strong className="text-lg text-black flex items-center dark:text-white">
                {key}:
              </strong>
              <div className="pl-4">{renderFormData(value, level + 1)}</div>
            </div>
          );
        } else {
          return (
            <div key={`prim-${index}`} style={indentStyle} className="my-2 text-black flex">
              <strong className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white">
                <svg
                  className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                {key}:
              </strong>
              <span className="ml-5 text-sm font-medium text-gray-500 dark:text-gray-400">
                {value.toString()}
              </span>
            </div>
          );
        }
      });
  
    // Second pass: render array properties
    const arrayEntries = entries
      .filter(([key, value]) => Array.isArray(value))
      .map(([key, value], index) => {
        if (value.length === 0) return null;
  
        if (key === "Items") {
          const headers = Object.keys(value[0] || {});
          const rows = value.map((item, itemIndex) =>
            headers.map(header => (
              <td key={header} className="border px-4 py-2">
                {Array.isArray(item[header]) 
                  ? item[header].map((subItem, subIndex) => (
                      <div key={subIndex} className="flex">
                        {typeof subItem === 'object' ? renderFormData(subItem, level + 1) : subItem}
                      </div>
                    ))
                  : (typeof item[header] === 'object' ? renderFormData(item[header], level + 1) : item[header])
                }
              </td>
            ))
          );
  
          return (
            <div key={`arr-${index}`} className="my-4">
              <strong className="text-lg text-black flex items-center dark:text-white">
                {key}:
              </strong>
              <div className="overflow-x-auto border border-gray-200 sm:rounded-lg w-[100%]">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-[#606368] dark:text-gray-400">
                    <tr>
                      {headers.map(header => (
                        <th key={header} scope="col" className="px-6 py-3">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="odd:bg-white odd:dark:bg-[#1e1e1e] even:bg-gray-50 even:dark:bg-[#3c4042] border-b dark:border-gray-700">
                        {row}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        } else {
          return (
            <div key={`arr-${index}`} className="my-4">
              <strong className="text-lg text-black flex items-center dark:text-white">
                {key}:
              </strong>
              {value.map((item, itemIndex) => (
                <div className="overflow-x-auto border border-black-800 dark:border-[#3c4042] sm:rounded-lg w-[-webkit-fill-available] mb-6" key={itemIndex}>
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-black-800 dark:border-[#3c4042] dark:text-gray-400">
                    <tbody>
                      <tr className='odd:bg-white odd:dark:bg-[#1e1e1e] even:bg-gray-50 even:dark:bg-[#3c4042] border-b dark:border-gray-700'>
                        <td className="border px-4 py-2">
                          {typeof item === 'object' ? renderFormData(item, level + 1) : item}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          );
        }
      });
  
    return [...primitiveAndObjectEntries, ...arrayEntries];
  };
