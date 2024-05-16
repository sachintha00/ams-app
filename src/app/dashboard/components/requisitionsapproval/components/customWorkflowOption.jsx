import React from 'react';

const CustomWorkflowOption = (props) => {
  const { innerRef, innerProps, data } = props;
  return (
    <div ref={innerRef} {...innerProps} style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
      <span className='text-black'>{data.label}</span>
    </div>
  );
};

export default CustomWorkflowOption;