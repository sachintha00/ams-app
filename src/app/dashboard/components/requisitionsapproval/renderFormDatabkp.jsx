// utils/renderFormData.js
export const renderFormData = (data, level = 0) => {
    return Object.entries(data).map(([key, value], index) => {
      const indentStyle = { paddingLeft: `${level * 20}px` };
  
      if (Array.isArray(value) && level === 0) {
        return (
          <div key={index} className="my-4">
            <strong className="text-lg text-black flex items-center dark:text-white">
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
            {value.map((item, itemIndex) => (
                <div className="overflow-x-auto border border-black-800 dark:border-[#3c4042] sm:rounded-lg w-[-webkit-fill-available] mb-6">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500border border-black-800 dark:border-[#3c4042] dark:text-gray-400" key={itemIndex}>
                        <tbody>
                            <tr key={itemIndex} className='odd:bg-white odd:dark:bg-[#1e1e1e] even:bg-gray-50 even:dark:bg-[#3c4042] border-b dark:border-gray-700'>
                            <td className="border px-4 py-2">
                                {typeof item === 'object' ? renderFormData(item) : item}
                            </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ))}
          </div>
        );
      } else if (typeof value === 'object' && value !== null) {
        return (
          <div key={index} style={indentStyle} className="my-2">
            <strong className="text-lg text-black flex items-center dark:text-white">
              {key}:</strong>
            <div className="pl-4">{renderFormData(value, level + 1)}</div>
          </div>
        );
      } else {
        return (
          <div key={index} style={indentStyle} className="my-2 text-black">
            <strong className="text-lg flex items-center dark:text-white">
              <svg
                  className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
              >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              {key}:</strong> 
              <span className="ml-5 text-gray-500 dark:text-gray-400">
                {value.toString()}
              </span>
          </div>
        );
      }
    });
};  