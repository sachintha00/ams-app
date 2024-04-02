'use client'
import React, { useEffect, useState, useContext, useRef } from 'react';
import { IoGrid } from "react-icons/io5";
import { FaList } from "react-icons/fa";
import { FaUser } from "react-icons/fa";

const datalist = [
  {
    id: 1,
    username: "chamod dushyantha",
    firstname: "chamod",
    lastname: "randeni",
    email: "chamod@gmail.com",
    type: "admin",
  },
  {
    id: 2,
    username: "sachintha madawa",
    firstname: "sachintha",
    lastname: "madawa",
    email: "sachintha@gmail.com",
    type: "admin",
  },
  {
    id: 3,
    username: "chamod dushyantha",
    firstname: "chamod",
    lastname: "randeni",
    email: "chamod@gmail.com",
    type: "admin",
  },
  {
    id: 4,
    username: "sachintha madawa",
    firstname: "sachintha",
    lastname: "madawa",
    email: "sachintha@gmail.com",
    type: "admin",
  },
  {
    id: 5,
    username: "chamod dushyantha",
    firstname: "chamod",
    lastname: "randeni",
    email: "chamod@gmail.com",
    type: "admin",
  },
  {
    id: 6,
    username: "sachintha madawa",
    firstname: "sachintha",
    lastname: "madawa",
    email: "sachintha@gmail.com",
    type: "admin",
  },
  {
    id: 7,
    username: "chamod dushyantha",
    firstname: "chamod",
    lastname: "randeni",
    email: "chamod@gmail.com",
    type: "admin",
  },
  {
    id: 8,
    username: "sachintha madawa",
    firstname: "sachintha",
    lastname: "madawa",
    email: "sachintha@gmail.com",
    type: "admin",
  },
]

export default function usergroups() {
    const [view, setView] = useState('grid');
    const [expandedRow, setExpandedRow] = useState(null);
    const [expandedAddPermisionModel, setExpandedAddPermisionModel] = useState(false);
    const [isOpenAddForm, setIsOpenAddFormModel] = useState(false);

    const handleSwitchView = (newView) => {
        setView(newView);
    };
    
    const handleToggleRow = (rowId) => {
        setExpandedRow(rowId === expandedRow ? null : rowId);
    };

    const handleToggleAddPermisionModel = (rowId) => {
        setExpandedAddPermisionModel(rowId === expandedAddPermisionModel ? false : rowId);
    };

    const closeAddPermisionModel = () => {
        setExpandedAddPermisionModel(false);
    };


    const openAddFormModal = () => {
        setIsOpenAddFormModel(true);
    };
    
    const closeAddFormModal = () => {
        setIsOpenAddFormModel(false);
    };

    return (
        <div className="p-4 pl-8 subcontent border-gray-200 rounded-lg dark:border-gray-700">
        <div className="flex items-center justify-center rounded bg-gray-50 dark:bg-[#121212]">
            <div className="w-full w-[-webkit-fill-available]">
                {/* Start coding here */}
                <div className="overflow-hidden bg-white sm:rounded-lg dark:bg-[#121212]">
                    <div className="flex-row items-center justify-between py-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
                        <div>
                            <nav className="flex" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                                <li className="inline-flex items-center">
                                <a
                                    href="#"
                                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                                >
                                    <svg
                                    className="w-3 h-3 me-2.5"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    >
                                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                                    </svg>
                                    Home
                                </a>
                                </li>
                                <li aria-current="page">
                                <div className="flex items-center">
                                    <svg
                                    className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 6 10"
                                    >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="m1 9 4-4-4-4"
                                    />
                                    </svg>
                                    <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                                    All User Groups
                                    </span>
                                </div>
                                </li>
                            </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="flex-row items-center justify-between py-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
                        <div>
                            <div className='flex items-center'>
                                <FaUser className="mr-3 font-semibold text-gray-700 dark:text-white text-[25px]"/>
                                <h3 className="mr-3 font-semibold text-gray-700 dark:text-white text-[25px]">All User Groups</h3>
                            </div>
                        <p className="text-gray-500 dark:text-gray-400">
                            Manage all your existing users or add a new one
                        </p>
                        </div>
                        <button
                        type="button"
                        onClick={openAddFormModal}
                        className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-[#213389] hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                        >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5 mr-2 -ml-1 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                        </svg>
                        Add new user
                        </button>

                        {/* Modal */}
                        {isOpenAddForm && (
                            <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center" style={{ marginLeft:0 }}>
                                <div className="absolute w-full h-full bg-gray-900 opacity-50"></div>
                                <div className="bg-white w-1/2 p-6 rounded-lg z-50">
                                    {/* Modal header */}
                                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Add New User Groups
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={closeAddFormModal}
                                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                            data-modal-toggle="crud-modal"
                                            >
                                        <svg
                                                className="w-3 h-3"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 14 14"
                                            >
                                                <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                                />
                                            </svg>
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    {/* Modal body */}
                                    <form className="p-4 md:p-5">
                                        <div className="grid gap-4 mb-4 grid-cols-2">
                                            <div className="col-span-2">
                                                <label
                                                htmlFor="name"
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                Name
                                                </label>
                                                <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                placeholder="Type permission name"
                                                required=""
                                                />
                                            </div>
                                            <div className="col-span-2 sm:col-span-1">
                                                <label
                                                htmlFor="price"
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                status
                                                </label>
                                                <input
                                                type="number"
                                                name="price"
                                                id="price"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                placeholder="$2999"
                                                required=""
                                                />
                                            </div>
                                            <div className="col-span-2 sm:col-span-1">
                                                <label
                                                htmlFor="category"
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                Category
                                                </label>
                                                <select
                                                id="category"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                >
                                                <option selected="">Select category</option>
                                                <option value="TV">TV/Monitors</option>
                                                <option value="PC">PC</option>
                                                <option value="GA">Gaming/Console</option>
                                                <option value="PH">Phones</option>
                                                </select>
                                            </div>
                                            <div className="col-span-2">
                                                <label
                                                htmlFor="description"
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                Permission Description
                                                </label>
                                                <textarea
                                                id="description"
                                                rows={4}
                                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="Write Permission description here"
                                                defaultValue={""}
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                            >
                                            <svg
                                                className="me-1 -ms-1 w-5 h-5"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                fillRule="evenodd"
                                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                                clipRule="evenodd"
                                                />
                                            </svg>
                                            Add new product
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col items-center justify-between py-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
                        <div className="w-full md:w-1/2">
                        <form className="flex items-center">
                            <label htmlFor="simple-search" className="sr-only">
                            Search
                            </label>
                            <div className="w-full">
                            <input
                                type="text"
                                id="simple-search"
                                className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-[#3c4042] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Search"
                                required=""
                            />
                            </div>
                        </form>
                        </div>
                        <div className="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
                        <div className="flex items-center w-full space-x-3 md:w-auto">
                            <button
                                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg md:w-auto focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-[#3c4042] dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-[#606368]"
                                type="button"
                                >
                                Export CSV
                            </button>
                            <button
                            id="actionsDropdownButton"
                            data-dropdown-toggle="actionsDropdown"
                            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg md:w-auto focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-[#3c4042] dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-[#606368]"
                            type="button"
                            >
                            <svg
                                className="-ml-1 mr-1.5 w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path
                                clipRule="evenodd"
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                />
                            </svg>
                            Actions
                            </button>
                            <div
                            id="actionsDropdown"
                            className="z-10 hidden bg-white divide-y divide-gray-100 rounded shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                            >
                            <ul
                                className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                aria-labelledby="actionsDropdownButton"
                            >
                                <li>
                                <a
                                    href="#"
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    Mass Edit
                                </a>
                                </li>
                            </ul>
                            <div className="py-1">
                                <a
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                >
                                Delete all
                                </a>
                            </div>
                            </div>
                            <button
                            id="filterDropdownButton"
                            data-dropdown-toggle="filterDropdown"
                            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg md:w-auto focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-[#3c4042] dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-[#606368]"
                            type="button"
                            >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                className="w-4 h-4 mr-2 text-gray-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                fillRule="evenodd"
                                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                                clipRule="evenodd"
                                />
                            </svg>
                            Filter
                            <svg
                                className="-mr-1 ml-1.5 w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path
                                clipRule="evenodd"
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                />
                            </svg>
                            </button>
                            {/* Dropdown menu */}
                            <div
                            id="filterDropdown"
                            className="z-10 hidden w-48 p-3 bg-white rounded-lg shadow dark:bg-gray-700"
                            >
                            <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                                Category
                            </h6>
                            <ul
                                className="space-y-2 text-sm"
                                aria-labelledby="dropdownDefault"
                            >
                                <li className="flex items-center">
                                <input
                                    id="apple"
                                    type="checkbox"
                                    defaultValue=""
                                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                />
                                <label
                                    htmlFor="apple"
                                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                                >
                                    Apple (56)
                                </label>
                                </li>
                                <li className="flex items-center">
                                <input
                                    id="fitbit"
                                    type="checkbox"
                                    defaultValue=""
                                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                />
                                <label
                                    htmlFor="fitbit"
                                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                                >
                                    Fitbit (56)
                                </label>
                                </li>
                                <li className="flex items-center">
                                <input
                                    id="dell"
                                    type="checkbox"
                                    defaultValue=""
                                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                />
                                <label
                                    htmlFor="dell"
                                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                                >
                                    Dell (56)
                                </label>
                                </li>
                                <li className="flex items-center">
                                <input
                                    id="asus"
                                    type="checkbox"
                                    defaultValue=""
                                    defaultChecked=""
                                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                />
                                <label
                                    htmlFor="asus"
                                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                                >
                                    Asus (97)
                                </label>
                                </li>
                            </ul>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex items-center justify-center rounded bg-gray-50 dark:bg-[#121212]">
            <div className="w-full w-[-webkit-fill-available]">
                {/* Start coding here */}
                <div className="overflow-hidden bg-white sm:rounded-lg dark:bg-[#121212]">
                    <div className="flex-row items-center justify-end space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
                        <div className="inline-flex rounded-md shadow-sm" role="group">
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-[#3c4042] dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                                onClick={() => handleSwitchView('grid')}
                            >
                                <IoGrid />
                            </button>
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-[#3c4042] dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                                onClick={() => handleSwitchView('list')}
                            >
                                <FaList />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {view === 'list' ? 
            <div className="flex items-center justify-center my-5 rounded bg-gray-50 dark:bg-[#1e1e1e] tablelist">
                <div className="overflow-x-auto shadow-md sm:rounded-lg w-[-webkit-fill-available]">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-[#606368] dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                            User name
                            </th>
                            <th scope="col" className="px-6 py-3">
                            First Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                            Last Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                            Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                            Action
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                            {datalist.map(({ id, username, firstname, lastname, email, type }) => (
                                <tr className="odd:bg-white odd:dark:bg-[#1e1e1e] even:bg-gray-50 even:dark:bg-[#3c4042] border-b dark:border-gray-700">
                                    <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                    >
                                    {username}
                                    </th>
                                    <td className="px-6 py-4">{firstname}</td>
                                    <td className="px-6 py-4">{lastname}</td>
                                    <td className="px-6 py-4">{email}</td>
                                    <td className="px-6 py-4">
                                    <a
                                        href="#"
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                    >
                                        Edit
                                    </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        : 
            <div className="grid gap-2 2xl:grid-cols-4 min-[1200px]:grid-cols-3 min-[840px]:grid-cols-2 mb-4 rounded bg-gray-50 dark:bg-[#121212]">
            {datalist.map(({ id, username, firstname, lastname, email, type }) => (
                <div className="w-full my-5 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-[#1e1e1e] dark:border-gray-700">
                    <div className="flex justify-end px-4 pt-4">
                        <button
                        id="dropdownButton"
                        data-dropdown-toggle="dropdown"
                        className="inline-block text-gray-500 dark:text-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-[#606368] rounded-lg text-sm p-1.5"
                        type="button"
                        onClick={() => handleToggleRow(id)}
                        >
                        <span className="sr-only">Open dropdown</span>
                        <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 16 3"
                        >
                            <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                        </svg>
                        </button>
                        {/* Dropdown menu */}
                        {expandedRow === id && (
                            <div className='absolute dark:bg-[#3c4042] mt-[35px] text-base list-none bg-white divide-gray-100 rounded-lg shadow w-44'>
                                <div
                                id="dropdown"
                                className="z-10 text-base list-none bg-white divide-gray-100 rounded-lg shadow w-44"
                                >
                                <ul className="py-2" aria-labelledby="dropdownButton">
                                    <li>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-[#606368] dark:text-gray-200 dark:hover:text-white"
                                    >
                                        Profile
                                    </a>
                                    </li>
                                    <li>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-[#606368] dark:text-gray-200 dark:hover:text-white"
                                    >
                                        Edit
                                    </a>
                                    </li>
                                    <li>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-[#606368] dark:text-gray-200 dark:hover:text-white"
                                    >
                                        Delete
                                    </a>
                                    </li>
                                </ul>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col items-center pb-10">
                        <img
                        className="w-24 h-24 mb-3 rounded-full shadow-lg"
                        src="/avater.png"
                        alt="Bonnie image"
                        />
                        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                        {username}
                        </h5>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                        {type}
                        </span>
                        <div className="flex mt-4 md:mt-6">
                        <a
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-[#213395] rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={() => handleToggleAddPermisionModel(id)}
                        >
                            Add Permison
                        </a>

                        {/* Modal */}
                        {expandedAddPermisionModel === id && (
                            <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center" style={{ marginLeft:0 }}>
                                    <div className="absolute w-full h-full bg-gray-900 opacity-50"></div>
                                    <div className="bg-white w-1/2 p-6 rounded-lg z-50">
                                        {/* Modal header */}
                                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Managing {username}'s Parmison
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={closeAddPermisionModel}
                                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                                data-modal-toggle="crud-modal"
                                                >
                                            <svg
                                                    className="w-3 h-3"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 14 14"
                                                >
                                                    <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                                    />
                                                </svg>
                                                <span className="sr-only">Close modal</span>
                                            </button>
                                        </div>
                                        {/* Modal body */}
                                        <form className="p-4 md:p-5">
                                            <ul className="my-4 ">
                                                <li>
                                                    <div
                                                    className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                                                    >
                                                    <span className="flex-1 ms-3 whitespace-nowrap">Permission</span>
                                                    <span className="inline-flex items-center justify-center px-2 py-0.5 ms-3 text-xs font-medium text-gray-500 rounded dark:bg-gray-700 dark:text-gray-400">
                                                        <label className="inline-flex items-center me-5 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                defaultValue=""
                                                                className="sr-only peer"
                                                                defaultChecked=""
                                                            />
                                                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600" />
                                                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                                View
                                                            </span>
                                                        </label>
                                                    </span>
                                                    <span className="inline-flex items-center justify-center px-2 py-0.5 ms-3 text-xs font-medium text-gray-500 rounded dark:bg-gray-700 dark:text-gray-400">
                                                        <label className="inline-flex items-center me-5 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                defaultValue=""
                                                                className="sr-only peer"
                                                                defaultChecked=""
                                                            />
                                                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-400" />
                                                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                                Edite
                                                            </span>
                                                        </label>
                                                    </span>
                                                    <span className="inline-flex items-center justify-center px-2 py-0.5 ms-3 text-xs font-medium text-gray-500 rounded dark:bg-gray-700 dark:text-gray-400">
                                                        <label className="inline-flex items-center me-5 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                defaultValue=""
                                                                className="sr-only peer"
                                                                defaultChecked=""
                                                            />
                                                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600" />
                                                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                                Delete
                                                            </span>
                                                        </label>
                                                    </span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div
                                                    className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                                                    >
                                                    <span className="flex-1 ms-3 whitespace-nowrap">Roles</span>
                                                    <span className="inline-flex items-center justify-center px-2 py-0.5 ms-3 text-xs font-medium text-gray-500 rounded dark:bg-gray-700 dark:text-gray-400">
                                                        <label className="inline-flex items-center me-5 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                defaultValue=""
                                                                className="sr-only peer"
                                                                defaultChecked=""
                                                            />
                                                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600" />
                                                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                                View
                                                            </span>
                                                        </label>
                                                    </span>
                                                    <span className="inline-flex items-center justify-center px-2 py-0.5 ms-3 text-xs font-medium text-gray-500 rounded dark:bg-gray-700 dark:text-gray-400">
                                                        <label className="inline-flex items-center me-5 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                defaultValue=""
                                                                className="sr-only peer"
                                                                defaultChecked=""
                                                            />
                                                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-400" />
                                                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                                Edite
                                                            </span>
                                                        </label>
                                                    </span>
                                                    <span className="inline-flex items-center justify-center px-2 py-0.5 ms-3 text-xs font-medium text-gray-500 rounded dark:bg-gray-700 dark:text-gray-400">
                                                        <label className="inline-flex items-center me-5 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                defaultValue=""
                                                                className="sr-only peer"
                                                                defaultChecked=""
                                                            />
                                                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600" />
                                                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                                Delete
                                                            </span>
                                                        </label>
                                                    </span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div
                                                    className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                                                    >
                                                    <span className="flex-1 ms-3 whitespace-nowrap">Product</span>
                                                    <span className="inline-flex items-center justify-center px-2 py-0.5 ms-3 text-xs font-medium text-gray-500 rounded dark:bg-gray-700 dark:text-gray-400">
                                                        <label className="inline-flex items-center me-5 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                defaultValue=""
                                                                className="sr-only peer"
                                                                defaultChecked=""
                                                            />
                                                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600" />
                                                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                                View
                                                            </span>
                                                        </label>
                                                    </span>
                                                    <span className="inline-flex items-center justify-center px-2 py-0.5 ms-3 text-xs font-medium text-gray-500 rounded dark:bg-gray-700 dark:text-gray-400">
                                                        <label className="inline-flex items-center me-5 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                defaultValue=""
                                                                className="sr-only peer"
                                                                defaultChecked=""
                                                            />
                                                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-400" />
                                                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                                Edite
                                                            </span>
                                                        </label>
                                                    </span>
                                                    <span className="inline-flex items-center justify-center px-2 py-0.5 ms-3 text-xs font-medium text-gray-500 rounded dark:bg-gray-700 dark:text-gray-400">
                                                        <label className="inline-flex items-center me-5 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                defaultValue=""
                                                                className="sr-only peer"
                                                                defaultChecked=""
                                                            />
                                                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600" />
                                                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                                Delete
                                                            </span>
                                                        </label>
                                                    </span>
                                                    </div>
                                                </li>
                                            </ul>
                                            <button
                                                type="submit"
                                                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                >
                                                <svg
                                                    className="me-1 -ms-1 w-5 h-5"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                    fillRule="evenodd"
                                                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                                    clipRule="evenodd"
                                                    />
                                                </svg>
                                                Save
                                            </button>
                                        </form>
                                    </div>
                            </div>
                        )}

                        <a
                            href="#"
                            className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-[#3c4042] dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        >
                            Message
                        </a>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        }

        <nav aria-label="Page navigation example" className="flex justify-end">
            <ul class="inline-flex -space-x-px text-sm">
                <li>
                <a href="#" class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-[#3c4042] dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
                </li>
                <li>
                <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-[#3c4042] dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
                </li>
                <li>
                <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-[#3c4042] dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
                </li>
                <li>
                <a href="#" aria-current="page" class="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-[#606368] hover:text-blue-700 dark:border-gray-700 dark:bg-[#606368] dark:hover:bg-[#3c4042] dark:text-white">3</a>
                </li>
                <li>
                <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-[#3c4042] dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">4</a>
                </li>
                <li>
                <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-[#3c4042] dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">5</a>
                </li>
                <li>
                <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-[#3c4042] dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
                </li>
            </ul>
        </nav>
        </div>
    );
}