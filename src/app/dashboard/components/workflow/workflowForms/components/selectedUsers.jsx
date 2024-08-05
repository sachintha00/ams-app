import React from "react";
import { IoMdCloseCircle } from "react-icons/io";
import Image from "next/image";
import DummyImage from "../../../../../_lib/assets/images/dummy_dp_organization.png";
import { Field } from "formik";

function SelectedUsers({
  selected,
  setSelected,
  handleSearchInput,
  query,
  users,
  setFieldValue,
  inputTagName,
  gridCols = 2,
}) {
  return (
    <div className="col-span-2 ">
      <div className={`grid grid-cols-${gridCols} mb-2`}>
        {selected.users && selected.users.length > 0 ? (
          selected.users.map((selectedUser, index) => (
            <div
              className="relative grid grid-cols-3 p-2 mt-2 mr-2 bg-gray-200 border border-gray-200 rounded-md"
              key={index}
            >
              <IoMdCloseCircle
                className="absolute top-0 right-0 z-20 text-2xl cursor-pointer"
                onClick={() => {
                  setSelected((prevSelected) => {
                    if (!prevSelected.users) return prevSelected;
                    return {
                      ...prevSelected,
                      users: prevSelected.users.filter((_, i) => i !== index),
                    };
                  });
                }}
              />

              <div className="flex items-center justify-center col-span-1 mr-2">
                <Image src={DummyImage} alt="no-dp" />
              </div>

              <div className="relative z-10 flex flex-col justify-center col-span-2">
                <p className="items-center justify-center">
                  {selectedUser?.name}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No users selected</p>
        )}
      </div>
      <Field
        type="text"
        name={inputTagName}
        id={inputTagName}
        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-primary-600  block w-full p-2.5 outline-none focus:outline-none"
        placeholder="Search"
        autoComplete="off"
        onChange={(e) => {
          handleSearchInput(e);
          setFieldValue(inputTagName, e.target.value);
        }}
      />
      {query !== "" && (
        <div className="w-full bg-white border border-gray-300 rounded-md shadow-sm ">
          {users.map((user) => (
            <p
              key={user.id}
              className="px-2 py-1 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                const isUserAlreadySelected = selected.users.some(
                  (selectedUser) => selectedUser.id === user.id
                );

                if (!isUserAlreadySelected) {
                  setSelected((prevSelected) => ({
                    ...prevSelected,
                    type: selected.users.length < 1 ? "SINGLE" : "POOL",
                    users: [
                      ...prevSelected.users,
                      { id: user.id, name: user.name },
                    ],
                  }));
                }
              }}
            >
              {user.name}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default SelectedUsers;
