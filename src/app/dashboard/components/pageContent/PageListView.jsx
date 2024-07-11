import React from "react";
import { MdDelete } from "react-icons/md";
import { FaPenToSquare } from "react-icons/fa6";
import { FaUserLock } from "react-icons/fa";
import { IoClose } from "react-icons/io5"; 

function PageListView({ component: Component, data = [], currentPage, itemsPerPage, setCurrentPage, thisuserpermissionArray }) {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => prev + 1);
  const prevPage = () => setCurrentPage((prev) => prev - 1); 
  return (
        <>
          <div className="flex flex-col items-center justify-center my-5 rounded bg-white dark:bg-[#1e1e1e] tablelist">
              <Component data={currentItems} thisuserpermissionArray={thisuserpermissionArray} />
          </div>
          {/* Pagination */}
          <div className="flex w-[-webkit-fill-available] justify-end">
            <nav
              aria-label="Page navigation example"
              className="flex justify-end"
            >
              <ul class="inline-flex -space-x-px text-sm">
                <li>
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight rounded-s-lg border border-e-0 border-gray-300 dark:border-gray-700 ${
                      currentPage === 1
                        ? "text-gray-500 dark:text-gray-400 bg-white dark:bg-[#3c4042]"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white"
                    }`}
                  >
                    Previous
                  </button>
                </li>
                {[...Array(Math.ceil(data.length / itemsPerPage))].map(
                  (_, index) => (
                    <li>
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`flex items-center justify-center px-3 h-8 border border-gray-300 dark:border-gray-700 dark:text-white ${
                          currentPage === index + 1
                            ? "bg-gray-200 text-blue-700 dark:bg-[#3c4042]"
                            : "bg-blue-50 text-blue-600 dark:bg-[#606368]"
                        }`}
                      >
                        {index + 1}
                      </button>
                    </li>
                  )
                )}
                <li>
                  <button
                    onClick={nextPage}
                    disabled={
                      currentPage ===
                      Math.ceil(data.length / itemsPerPage)
                    }
                    className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 rounded-e-lg dark:border-gray-700 ${
                      currentPage ===
                      Math.ceil(data.length / itemsPerPage)
                        ? "text-gray-500 bg-white border dark:bg-[#3c4042] dark:text-gray-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white"
                    }`}
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

export default PageListView;
