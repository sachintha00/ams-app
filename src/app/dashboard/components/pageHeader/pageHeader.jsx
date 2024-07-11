import React, { useState } from "react";
import { IoGrid } from "react-icons/io5";
import { FaList } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import {
  handleSwitchView,
  setSearchQuery,
} from "@/app/_lib/redux/features/pageHeader/pageHeaderSlice";
import { handleOpenPopupModel } from "@/app/_lib/redux/features/popupModel/popupModelSlice";
import PopupModel from "../popupModel/popupModel";
import { FORM_TYPE } from "@/app/_lib/constants/formType";
import { CSSTransition } from 'react-transition-group';
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

function PageHeader({
  HeaderIcon,
  menuPath,
  headerTitle,
  headerDescription,
  showHeaderLineA = true,
  showHeaderLineB = true, 
  showHeaderLineC = true,
  showSearchBar = true, 
  showAddButton = true,
  showGridListButton = true,
  headerButtonText,
  form,
  Searchplaceholder = "search",
}) {
  const dispatch = useDispatch();
  const { formType } = useSelector((state) => state.popupModel);
  const searchQuery = useSelector((state) => state.pageHeader.searchQuery);
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const openAddFormModal = (formType) => {
    dispatch(handleOpenPopupModel(formType));
  };

  return (
    <div className="flex items-center justify-center rounded bg-white dark:bg-[#121212]">
      <div className="w-full">
        <div className="overflow-hidden bg-white sm:rounded-lg dark:bg-[#121212]">
          {/* header line a */}
          {showHeaderLineA && 
            <div className="flex-row items-center justify-between py-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
              <div>
                <nav className="flex" aria-label="Breadcrumb">
                  <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    {menuPath.map((path, index) => (
                      <li key={index} className="inline-flex items-center">
                        {index > 0 && (
                          <svg
                            className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180"
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
                        )}
                        {index < menuPath.length - 1 ? (
                          <Link
                            href={path.url}
                            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                          >
                            {index === 0 && (
                              <svg
                                className="w-3 h-3 me-2.5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                              </svg>
                            )}
                            {path.name}
                          </Link>
                        ) : (
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-500 ms-1 md:ms-2 dark:text-gray-400">
                              {headerTitle}
                            </span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>
            </div>
          }
          {/* header line b */}
          {showHeaderLineB && 
            <div className="flex-row items-center justify-between py-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
              <div>
                <div className="flex items-center">
                  {HeaderIcon}
                  <h3 className="mr-3 font-semibold text-gray-700 dark:text-white text-[25px]">
                    {headerTitle}
                  </h3>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  {headerDescription}
                </p>
              </div>
              <div className="flex flex-col items-end">
                {showAddButton && 
                  <button
                    type="button"
                    onClick={() => openAddFormModal(FORM_TYPE.SUBMIT)}
                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-[#213389] hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                  >
                    {headerButtonText}
                  </button>
                }
                <div className="flex flex-col items-center justify-center cursor-pointer">
                    <button onClick={toggleVisibility} className="flex justify-center items-center w-[24px] h-[24px] bg-white border border-gray-200 rounded-full shadow dark:bg-[#1e1e1e] dark:border-gray-600 row-enter-done mt-2">
                        {isVisible ? <IoIosArrowUp/> : <IoIosArrowDown/>}
                    </button>
                </div>
              </div>

              {formType === FORM_TYPE.SUBMIT ? (
                <PopupModel
                  popupModelTitle={form.addForm.modelTitle}
                  Form={form.addForm.formComponent}
                  modelPageSize={form.addForm.modelPageSize}
                  showModelTitle = {form.addForm.showModelTitle}
                />
              ) : formType === FORM_TYPE.UPDATE ? (
                <PopupModel
                  popupModelTitle={form.updateForm.modelTitle}
                  Form={form.updateForm.formComponent}
                  modelPageSize={form.updateForm.modelPageSize}
                  showModelTitle = {form.updateForm.showModelTitle}
                />
              ) : formType === FORM_TYPE.VIEW ? (
                <PopupModel
                  popupModelTitle={form.viewForm.modelTitle}
                  Form={form.viewForm.formComponent}
                  modelPageSize={form.viewForm.modelPageSize}
                  showModelTitle = {form.viewForm.showModelTitle}
                />
              ) : (
                formType === FORM_TYPE.DELETE && (
                  <PopupModel
                    popupModelTitle={form.deleteForm.modelTitle}
                    Form={form.deleteForm.formComponent}
                    showModelTitle = {form.deleteForm.showModelTitle}
                  />
                )
              )}
            </div>
          }
          <CSSTransition
              in={isVisible}
              timeout={200}
              classNames="row"
              unmountOnExit
          >
            <>
              {/* header line c */}
              {showHeaderLineC && 
                <div className={`${showSearchBar ? 'justify-between' : 'justify-end'} flex items-center py-4 px-1.5 space-y-3 md:flex-row md:space-y-0 md:space-x-4`}>
                  {showSearchBar && 
                    <div className="w-full md:w-1/2">
                      <div className="flex items-center">
                        <label htmlFor="simple-search" className="sr-only">
                          Search
                        </label>
                        <div className="w-full">
                          <input
                            value={searchQuery}
                            onChange={handleSearch}
                            type="text"
                            id="simple-search"
                            className="block w-full p-2 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-primary-500 focus:border-primary-500 dark:bg-[#3c4042] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder={Searchplaceholder} 
                          />
                        </div>
                      </div>
                    </div>
                  }
                  <div className="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
                    <div className="flex items-center w-[500px] space-x-3 md:w-auto">
                      <button
                        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg md:w-auto focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-[#3c4042] dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-[#606368]"
                        type="button"
                      >
                        Export CSV
                      </button>

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
                      {showGridListButton && 
                        <div className="inline-flex rounded-md shadow-sm" role="group">
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b rounded-s-lg border-gray-200 md:w-auto focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:ring-4 focus:ring-gray-200 dark:focus:text-white dark:focus:ring-gray-700 dark:bg-[#3c4042] dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-[#606368]"
                            onClick={() => dispatch(handleSwitchView("grid"))}
                          >
                            <IoGrid />
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b rounded-e-lg border-gray-200 md:w-auto focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:ring-4 focus:ring-gray-200 dark:focus:text-white dark:focus:ring-gray-700 dark:bg-[#3c4042] dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-[#606368]"
                            onClick={() => dispatch(handleSwitchView("list"))}
                          >
                            <FaList />
                          </button>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }
            </>
          </CSSTransition>
        </div>
      </div>
    </div>
  );
}

export default PageHeader;
