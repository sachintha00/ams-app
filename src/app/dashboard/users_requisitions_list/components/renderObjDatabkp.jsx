export const renderObjData = (data, level = 0) => {
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
              <div className="pl-4">{renderObjData(value, level + 1)}</div>
            </div>
          );
        } else {
          return (
            <div key={`prim-${index}`} style={indentStyle} className="my-2 text-black grid grid-cols-2 gap-2">
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
                {key}:
              </strong>
              <span className="ml-5 text-gray-500 dark:text-gray-400">
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
  
        if (typeof value[0] === 'string') {
          return (
            <div key={`arr-${index}`} style={indentStyle} className="my-2 text-black grid grid-cols-2 gap-2">
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
              <div className="mt-2 space-y-2 pl-4">
                {value.map((item, itemIndex) => (
                  <div key={itemIndex} className="text-black dark:text-white">
                    {item}
                  </div>
                ))}
              </div> 
            </div>
          );
        } else {
          return (
            <div key={`arr-${index}`} style={indentStyle} className="my-2 text-black">
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
              <div className="mt-2 space-y-4">
                {value.map((item, itemIndex) => (
                  <div key={itemIndex} className="border border-black-800 dark:border-[#3c4042] rounded-lg p-4">
                    {renderObjData(item, level + 1)}
                  </div>
                ))}
              </div>
            </div>
          );
        }
      });
  
    return [...primitiveAndObjectEntries, ...arrayEntries];
  };