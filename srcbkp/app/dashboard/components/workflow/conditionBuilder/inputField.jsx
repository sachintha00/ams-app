import React, { useState } from "react";
import { useNode } from "@craftjs/core";

function InputField({ value }) {
  const {
    connectors: { connect, drag },
    actions,
  } = useNode();

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    actions.setProp((props) => (props.value = event.target.value));
  };
  return (
    <div
      ref={(ref) => connect(drag(ref))}
      className="h-[30px] bg-red-700 cursor-pointer"
    >
      <textarea
        onChange={handleInputChange}
        placeholder={value}
        className="rounded-sm resize-x h-[30px] py-1 px-2 cursor-pointer"
      />
    </div>
  );
}

export default InputField;
