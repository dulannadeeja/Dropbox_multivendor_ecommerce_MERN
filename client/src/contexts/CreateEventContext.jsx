import { createContext, useState, useContext } from "react";
import { categoriesData } from "../static/categoriesData.js";

const CreateEventContext = createContext();

export const useCreateEventContext = () => {
  const context = useContext(CreateEventContext);
  if (!context) {
    throw new Error(
      "CreateEventContext must be used within CreateEventProvider"
    );
  }
  return context;
};

export const CreateEventProvider = ({ children }) => {
  const allTypesOfVisibility = ["Public", "Private"];
  const allCategories = categoriesData.map((category) => category.title);
  const allTypesOfEvents = ["Percentage Off", "Fixed Amount Off"];
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    eventType: "",
    discountAmount: 0,
    categories: [],
    couponCode: "",
    minPurchaseAmount: 0,
    visibility: "",
    banner: "",
    termsAndConditions: "",
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState({});

  const contextValue = {
    eventData,
    setEventData,
    selectedCategories,
    setSelectedCategories,
    allCategories,
    allTypesOfEvents,
    allTypesOfVisibility,
    errors,
    setErrors,
  };

  console.log(selectedCategories);
  console.log(eventData);

  return (
    <CreateEventContext.Provider value={contextValue}>
      {children}
    </CreateEventContext.Provider>
  );
};
