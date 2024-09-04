'use client'
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoClose } from "react-icons/io5";
import { handleClosePopupModel } from '@/app/_lib/redux/features/popupModel/popupModelSlice';
import { useUserpasswordresetMutation, useUsersListQuery } from '@/app/_lib/redux/features/user/user_api';

function ResetUserPasswordForm({ }) {
    const dispatch = useDispatch()
    const { refetch } = useUsersListQuery();
    const { id } = useSelector((state) => state.popupModel);
    const { value } = useSelector((state) => state.popupModel);
    console.log(id);

    //user password reset
    const [passwordreseterror, setPasswordResetError] = useState('');
    const [userpasswordreset] = useUserpasswordresetMutation();
    const [resetname, setResetName] = useState("");

    const submitPasswordForm = async e => {
        e.preventDefault();

        try {
            if (resetname === value.name) {
                const user = { ID: value.id }
                userpasswordreset(user)
                    .unwrap()
                    .then((response) => {
                        console.log("New node added:", response);
                        // router.push("/dashboard");
                        // const message = `${resetrowname}'s ${response.message}`;
                        setResetName("");
                        dispatch(handleClosePopupModel());
                        refetch();
                    })
                    .catch((error) => {
                        console.error("Error adding new node:", error);
                        setPasswordResetError(error);
                        const timer = setTimeout(() => {
                            setPasswordResetError('');
                        }, 5000); // Adjust the duration (in milliseconds) as needed
                        return () => clearTimeout(timer);
                    });
            } else {
                setPasswordResetError('Input does not match the name of the User Name');
                const timer = setTimeout(() => {
                    setPasswordResetError('');
                }, 5000); // Adjust the duration (in milliseconds) as needed
                return () => clearTimeout(timer);
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    }

    const handleErrorClose = () => {
        setPasswordResetError('');
    };

    return (
        <>
            {/* Modal header */}
            <div className="flex items-center mt-[-17px] px-2 pb-2 justify-between border-b rounded-t dark:border-gray-600">
                <h3 className="text-base w-[90%] text-gray-900 dark:text-white">
                    If you want reset {value.name}'s password, please enter <span className='font-semibold'>"{value.name}"</span> on below feild
                </h3>
            </div>
            {/* Modal body */}
            <form className="px-2 pt-2" onSubmit={submitPasswordForm}>
                {passwordreseterror &&
                    <div
                        className="relative px-4 py-3 mb-2 text-red-700 bg-red-100 border border-red-400 rounded"
                        role="alert"
                    >
                        {/* <strong className="font-bold">Holy smokes!</strong> */}
                        <span className="block sm:inline">{passwordreseterror}</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={handleErrorClose}>
                            <IoClose className='text-2xl text-red-700' />
                        </span>
                    </div>
                }
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="col-span-2">
                        <input
                            onChange={e => setResetName(e.target.value)}
                            type="text"
                            name="name"
                            id="name"
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#3c4042] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            required=""
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="text-white inline-flex items-center bg-[#D32D41] hover:bg-[#D32D41] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#D32D41] dark:hover:bg-[#D32D41] dark:focus:ring-blue-800"
                >
                    Reset password
                </button>
            </form>
        </>
    );
}

export default ResetUserPasswordForm;