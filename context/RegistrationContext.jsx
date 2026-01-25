import { createContext, useContext, useState } from "react";

const RegistrationContext = createContext(null);
const initialFormState = {
  title: "",
  first_name: "",
  last_name: "",
  date_of_birth: "",
  gender: "",
  marital_status: "",
  education_level: "",
  national_id: "",
  passport_number: "",

  phone_number: "",
  email: "",
  physical_address: "",
  district: "",
  sub_county: "",
  parish: "",
  village: "",
  resident_type: "",

  occupation: "",
  employer_name: "",
  income_source: "",
  monthly_income: "",

  next_of_kin_name: "",
  next_of_kin_relationship: "",
  next_of_kin_phone: "",
  next_of_kin_address: "",
};

export function RegistrationProvider({ children }) {
  const [formData, setFormData] = useState(initialFormState);

  const updateForm = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  return (
    <RegistrationContext.Provider
      value={{
        formData,
        updateForm,
        resetForm,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const ctx = useContext(RegistrationContext);
  if (!ctx) {
    throw new Error("useRegistration must be used inside RegistrationProvider");
  }
  return ctx;
}
