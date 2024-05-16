import React, { useEffect } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { Field } from "formik";

function SelectDesignations({
  selected,
  setSelected,
  handleSearchInput,
  query,
  designations,
  setFieldValue,
  inputTagName,
  gridCols = 2,
}) {
  return (
    <div className="col-span-2 ">
      <div className={`grid grid-cols-${gridCols} mb-2`}>
        {selected.designations && selected.designations.length > 0 ? (
          selected.designations.map((selectedDesignation, index) => (
            <div
              className="relative grid grid-cols-3 p-2 mt-2 mr-2 bg-gray-200 border border-gray-200 rounded-md"
              key={index}
            >
              <IoMdCloseCircle
                className="absolute top-0 right-0 z-20 text-2xl cursor-pointer"
                onClick={() => {
                  setSelected((prevSelected) => {
                    if (!prevSelected.designations) return prevSelected;
                    return {
                      ...prevSelected,
                      designations: prevSelected.designations.filter((_, i) => i !== index),
                    };
                  });
                }}
              />

              <div className="relative z-10 flex flex-col justify-center col-span-2">
                <p className="items-center justify-center">
                  {selectedDesignation?.name}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No designations selected</p>
        )}
      </div>
      <Field
        type="text"
        name={inputTagName}
        id={inputTagName}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-primary-600  block w-full p-2.5 outline-none focus:outline-none"
        placeholder="Search"
        autoComplete="off"
        onChange={(e) => {
          handleSearchInput(e);
          setFieldValue(inputTagName, e.target.value);
        }}
      />
      {query !== "" && (
        <div className="w-full bg-white border border-gray-300 rounded-md shadow-sm ">
          {designations.map((designation) => (
            <p
              key={designation.id}
              className="px-2 py-1 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                const isDesignationAlreadySelected = selected.designations.some(
                  (selectedDesignation) => selectedDesignation.id === designation.id
                );

                if (!isDesignationAlreadySelected) {
                  setSelected((prevSelected) => ({
                    ...prevSelected,
                    type: selected.designations.length < 1 ? "SINGLE" : "POOL",
                    designations: [
                      ...prevSelected.designations,
                      { id: designation.id, name: designation.designation },
                    ],
                  }));
                }
              }}
            >
              {designation.designation}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default SelectDesignations;
