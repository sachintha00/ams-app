import React from 'react';

const CustomOption = (props) => {
  const { innerRef, innerProps, data } = props;
  return (
    <div ref={innerRef} {...innerProps} style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
      <img src={data.image} alt={data.label} style={{ width: '30px', height: '30px', marginRight: '10px' }} />
      <span className='text-black'>{data.label}</span>
    </div>
  );
};

export default CustomOption;