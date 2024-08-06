import React, { useEffect, useState } from 'react';
import { useGetSupplierlistQuery } from '@/app/_lib/redux/features/supplier/supplier_api';

const AssetsTypeListDrodwon = ({ handleSupplierSelect, searchInput, selectedAssetType, assetsTypeArray }) => {
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        if (assetsTypeArray) {
            const filtered = assetsTypeArray.filter(assetsType => assetsType.name.toLowerCase().includes(searchInput.toLowerCase()));
            setFilteredData(filtered);
        }
    }, [assetsTypeArray, searchInput]);


  return (
    <div
    id="dropdownSearch"
    className="z-10 hidden absolute bg-white rounded-lg shadow w-[100%] dark:bg-gray-700 rolelist"
    >
    <ul
        className="h-auto max-h-48 px-3 py-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
        aria-labelledby="dropdownSearchButton"
        style={{ scrollbarWidth: "2px", scrollbarColor: "#888" }}
    >
        {filteredData.map((data) => (
            <li 
            onClick={() => handleSupplierSelect(data)}
            key={data.id}
            >
                <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                <label
                    htmlFor="checkbox-item-11"
                    className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                >
                    {data.name}
                </label>
                {selectedAssetType && selectedAssetType.id === data.id && (
                    <div>
                        <span className='text-black'>
                            <svg
                                className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                            </svg>
                        </span>
                    </div>
                )}
                </div>
            </li>
        ))}
    </ul>
    </div>
  );
};

export default AssetsTypeListDrodwon;