import React, { useState, useEffect, useRef } from 'react';

const SelectInput = ({ placeholder, data, onSelect, selected, searchInput, setSearchInput, renderItem, name }) => {
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
        setSearchInput(item[name]);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={selected ? selected[name] : searchInput}
                onChange={handleInputChange}
                onClick={toggleListHandler}
                className="flex justify-between items-center bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder={placeholder}
            />
            {isOpen && (
                <div ref={refList} className="absolute z-10 bg-white rounded-b-lg shadow-2xl w-full dark:bg-[#3c4042]">
                    <ul className="h-auto max-h-48 px-3 py-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200">
                        {data.map((item) => (
                            <li onClick={() => handleSelect(item)} key={item.assest_type_id}>
                                {renderItem ? renderItem(item, selected) : (
                                    <div>Empty list</div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SelectInput;