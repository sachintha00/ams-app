import React from 'react';

const CustomOption = (props) => {
  const { innerRef, innerProps, data } = props;
  return (
    <div ref={innerRef} {...innerProps} className="flex items-center p-2">
      <img src={data.image} alt={data.label} className="w-8 h-8 mr-2" />
      <span className={props.theme === 'dark' ? 'text-white' : 'text-black'}>{data.label}</span>
    </div>
  );
};

export default CustomOption;