import React from "react";
import { useSelector } from "react-redux";

function HeaderGridView({ component: Component, data = [], searchField, ...rest }) {
  const searchQuery =
    useSelector((state) => state.pageHeader.searchQuery) || "";

  const filteredData = data?.filter((item) =>
    item[searchField].toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log(filteredData)

  return (
    <div className="flex flex-col mt-2">
      <div className="grid gap-2 2xl:grid-cols-5 min-[1200px]:grid-cols-4 min-[768px]:grid-cols-3 min-[640px]:grid-cols-2 mb-1 rounded bg-white dark:bg-[#121212]">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <Component key={item.id} {...item} {...rest} />
          ))
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
}

export default HeaderGridView;