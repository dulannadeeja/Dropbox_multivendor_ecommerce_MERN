import { createContext, useState, useContext } from "react";

const SellerSignupContext = createContext();

export const useSellerSignupContext = () => {
  const context = useContext(SellerSignupContext);
  if (!context) {
    throw new Error(
      "useSellerSignupContext must be used within a SellerSignupProvider"
    );
  }
  return context;
};

export const SellerSignupProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    "Personal Info",
    "Business Info",
    "Contact Info",
    "Payment Info",
  ];

  // Personal Info Form Fields
  const [firstStepInfo, setFirstStepInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    houseNumber: "",
    street: "",
    country: "",
    state: "",
    city: "",
    zip: "",
    phone: "",
  });
  const [firstStepCompleted, setFirstStepCompleted] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    houseNumber: "",
    street: "",
    country: "",
    state: "",
    city: "",
    phone: "",
    zip: "",
    businessName: "",
    businessApartment: "",
    businessStreet: "",
    businessZip: "",
    businessCountry: "",
    businessState: "",
    businessCity: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  // Business Info Form Fields
  const [secondStepCompleted, setSecondStepCompleted] = useState(false);
  const [secondStepInfo, setSecondStepInfo] = useState({
    businessName: "",
    businessApartment: "",
    businessStreet: "",
    businessZip: "",
    businessCountry: "",
    businessState: "",
    businessCity: "",
  });

  // Contact Info Form Fields
  const [thirdStepCompleted, setThirdStepCompleted] = useState(false);
  const [thirdStepInfo, setThirdStepInfo] = useState({
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  const contextValue = {
    currentStep,
    setCurrentStep,
    steps,
    firstStepCompleted,
    setFirstStepCompleted,
    firstStepInfo,
    setFirstStepInfo,
    errors,
    setErrors,
    secondStepInfo,
    setSecondStepInfo,
    secondStepCompleted,
    setSecondStepCompleted,
    thirdStepInfo,
    setThirdStepInfo,
    thirdStepCompleted,
    setThirdStepCompleted,
  };

  return (
    <SellerSignupContext.Provider value={contextValue}>
      {children}
    </SellerSignupContext.Provider>
  );
};
