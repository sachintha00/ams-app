import React, { useState, useEffect, useRef } from 'react';

const SelectInput = ({ placeholder, data, onSelect, selected, searchInput, setSearchInput }) => {
    const [isOpen, setIsOpen] = useState(false);
    const refList = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (refList.current && !refList.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleListHandler = () => {
        setIsOpen((prev) => !prev);
    };

    const handleInputChange = (event) => {
        setSearchInput(event.target.value);
        onSelect(null);
    };

    const handleSelect = (item) => {
        onSelect(item);
        setSearchInput(item.name);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={selected ? selected.name : searchInput}
                onChange={handleInputChange}
                onClick={toggleListHandler}
                className="flex justify-between items-center bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder={placeholder}
            />
            {isOpen && (
                <div ref={refList} className="absolute z-10 bg-white rounded-lg shadow w-full dark:bg-gray-700">
                    <ul className="h-auto max-h-48 px-3 py-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200">
                        {data.map((item) => (
                            <li onClick={() => handleSelect(item)} key={item.assest_type_id}>
                                <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                    <label className="w-full text-sm font-medium text-gray-900 dark:text-gray-300">
                                        {item.name}
                                    </label>
                                    {selected && selected.assest_type_id === item.assest_type_id && (
                                        <svg
                                            className="w-3.5 h-3.5 text-green-500 dark:text-green-400 flex-shrink-0"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                        </svg>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SelectInput;