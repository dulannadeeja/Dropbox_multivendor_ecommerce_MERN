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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [firstStepCompleted, setFirstStepCompleted] = useState(false);

  const [businessName, setBusinessName] = useState("");
  const [businessLocation, setBusinessLocation] = useState("");
  const [secondStepCompleted, setSecondStepCompleted] = useState(false);
  const [apartment, setApartment] = useState("");
  const [isSameAddress, setIsSameAddress] = useState(false);

  const contextValue = {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    houseNumber,
    setHouseNumber,
    street,
    setStreet,
    country,
    setCountry,
    state,
    setState,
    city,
    setCity,
    zip,
    setZip,
    phone,
    setPhone,
    currentStep,
    setCurrentStep,
    steps,
    firstStepCompleted,
    setFirstStepCompleted,
    secondStepCompleted,
    setSecondStepCompleted,
    businessName,
    setBusinessName,
    businessLocation,
    setBusinessLocation,
    apartment,
    setApartment,
    isSameAddress,
    setIsSameAddress,
  };

  return (
    <SellerSignupContext.Provider value={contextValue}>
      {children}
    </SellerSignupContext.Provider>
  );
};
