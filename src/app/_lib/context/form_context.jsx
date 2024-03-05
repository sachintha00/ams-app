import { createContext, useContext, useState } from "react";

const FormContext = createContext({});

export const FormProvider = ({ children }) => {
  const registerData = useState({});
  return (
    <FormContext.Provider value={registerData}>{children}</FormContext.Provider>
  );
};

export const useFormState = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useAppState must be used within the AppProvider");
  }
  return context;
};
