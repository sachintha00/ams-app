import React from "react";
import { Field } from "formik";

function SelectField({ label, name, options, value, onChange }) {
  return (
    <div className="mb-5">
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <Field
        as="select"
        name={name}
        id={name}
        value={value}
        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white outline-none focus:outline-none"
        onChange={onChange}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Field>
    </div>
  );
}

export default SelectField;
