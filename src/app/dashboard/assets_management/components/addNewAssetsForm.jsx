'use client'
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useAssestListQuery } from '@/app/_lib/redux/features/assetsmanagement/assets_management_api';
import SelectInput from '../../components/inputs/SelectInput';

function AddNewAssetsForm({ }) {

        const { data: assestList } = useAssestListQuery();
        const [assetsTypeArray, setAssetsTypeArray] = useState([]);
        const [selectedAssetsType, setSelectedAssetsType] = useState(null);
        const [searchInput, setSearchInput] = useState('');
      
        useEffect(() => {
          if (assestList) {
            const Allassesttype = Object.values(assestList.allassesttype);
            const filtered = Allassesttype.filter(item => item.name.toLowerCase().includes(searchInput.toLowerCase()));
            setAssetsTypeArray(filtered);
          }
        }, [assestList, searchInput]);
        console.log(selectedAssetsType);
    return (
            <>
                {/* Modal header */}
                    <form
                        className="px-2 pt-2 overflow-y-scroll h-auto max-h-[600px] min-h-[450px]"
                        style={{ scrollbarWidth: "2px", scrollbarColor: "#888" }}
                        encType="multipart/form-data"
                    >
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                            <label
                                htmlFor="last_name"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Asset Type
                            </label>
                            <SelectInput
                                placeholder="Search and Select supplier"
                                data={assetsTypeArray}
                                onSelect={setSelectedAssetsType}
                                selected={selectedAssetsType}
                                searchInput={searchInput}
                                setSearchInput={setSearchInput}
                            />
                            </div>
                        </div>
                    </form>
            </>
    );
}

export default AddNewAssetsForm;