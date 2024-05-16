import React from 'react';

const renderComponent = (config) => {
  const { type, props } = config;

  // Create a React element from the configuration
  const Component = React.createElement(type, props);
  return Component;
};

export default renderComponent;