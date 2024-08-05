'use client'
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAddNewRoleMutation } from '@/app/_lib/redux/features/role/role_api';

function AddNewRolesForm({ }) {
    const usedispatch = useDispatch();

    // add role
    const [addNewRole] = useAddNewRoleMutation();

    const [rolecreateerror, setRoleCreateError] = useState("");
    //add role form data
    const [name, setName] = useState("");
    const [role_description, setrole_description] = useState("");

    // Submit From
    const submitForm = async (e) => {
        e.preventDefault();

        try {
        const role = { name: name, description: role_description };
        addNewRole(role)
            .unwrap()
            .then((response) => {
            console.log("New node added:", response);
            // router.push("/dashboard/usergroups");
            setName("");
            setrole_description("");
            })
            .catch((error) => {
            console.error("Error adding new node:", error);
            setRoleCreateError(error);
            const timer = setTimeout(() => {
                setRoleCreateError("");
            }, 5000); // Adjust the duration (in milliseconds) as needed
            return () => clearTimeout(timer);
            });
        } catch (error) {
        console.error("Login error:", error);
        }
    };

    return (
            <>
                {/* Modal header */}
                    <form className="px-2 pt-2" onSubmit={submitForm}>
                      {rolecreateerror && (
                        <div
                          className="relative px-4 py-3 mb-2 text-red-700 bg-red-100 border border-red-400 rounded"
                          role="alert"
                        >
                          {/* <strong className="font-bold">Holy smokes!</strong> */}
                          <span className="block sm:inline">
                            {rolecreateerror}
                          </span>
                          <span
                            className="absolute top-0 bottom-0 right-0 px-4 py-3"
                            onClick={handleErrorClose}
                          >
                            <IoClose className="text-2xl text-red-700" />
                          </span>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="col-span-2">
                          <label
                            htmlFor="name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Role Name
                          </label>
                          <input
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            name="name"
                            id="name"
                            value={name}
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Type Role name"
                            required=""
                          />
                        </div>
                        <div className="col-span-2">
                          <label
                            htmlFor="name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Role Description
                          </label>
                          <textarea
                            id="role_description"
                            rows="4"
                            onChange={(e) =>
                              setrole_description(e.target.value)
                            }
                            name="role_description"
                            value={role_description}
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Type Role description"
                          ></textarea>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="text-white inline-flex items-center bg-[#213389] hover:bg-[#213389] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#213389] dark:hover:bg-[#213389] dark:focus:ring-blue-800"
                      >
                        Create
                      </button>
                    </form>
            </>
    );
}

export default AddNewRolesForm;