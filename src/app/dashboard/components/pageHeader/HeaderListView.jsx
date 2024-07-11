import React from "react";
import { MdDelete } from "react-icons/md";
import { FaPenToSquare } from "react-icons/fa6";
import { FaUserLock } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

function HeaderListView({ component: Component, data = [], searchField }) {
  return (
        <>
          <div className="flex flex-col items-center justify-center my-5 rounded bg-gray-50 dark:bg-[#1e1e1e] tablelist">
              <Component data={data} />
          </div>
          {/* Pagination */}
          <div className="flex w-[-webkit-fill-available] justify-end mt-2">
            <nav aria-label="Page navigation example" className="flex justify-end">
              <ul className="inline-flex -space-x-px text-sm">
                <li>
                  <button
                    // onClick={prevPage}
                    className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight rounded-s-lg border border-e-0 border-gray-300 dark:border-gray-700 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white`}
                  >
                    Previous
                  </button>
                </li>
                <li>
                  <button
                    className={`flex items-center justify-center px-3 h-8 border border-gray-300 dark:border-gray-700 dark:text-white bg-blue-50 text-blue-600 dark:bg-[#606368]`}
                  >
                    1
                  </button>
                </li>
                <li>
                  <button
                    // onClick={nextPage}
                    className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 rounded-e-lg dark:border-gray-700 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white`}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </>
  );
}

export default HeaderListView;