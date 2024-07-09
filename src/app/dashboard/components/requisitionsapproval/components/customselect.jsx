'use client'
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import CustomOption from './customOption';

export default function Customselect  ({ options })  {
  return (
    <Select
      options={options}
      getOptionLabel={(option) => option.label}
      getOptionValue={(option) => option.value}
      components={{ Option: CustomOption }}
    />
  );
};