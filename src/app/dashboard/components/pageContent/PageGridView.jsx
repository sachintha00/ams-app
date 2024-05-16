import React from "react";

function PageGridView({ component: Component, gridcolume, data = [], ...rest }) {
  return (
    <div className="flex flex-col mt-2">
      <Component gridcolume={gridcolume} data={data} {...rest}/>
    </div>
  );
}

export default PageGridView;
