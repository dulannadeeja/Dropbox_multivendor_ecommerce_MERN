import { createContext, useState, useContext } from "react";
import { categoriesData } from "../static/categoriesData.js";

const CreateCouponContext = createContext();

export const useCreateCouponContext = () => {
  const context = useContext(CreateCouponContext);
  if (!context) {
    throw new Error(
      "CreateEventContext must be used within CreateEventProvider"
    );
  }
  return context;
};

export const CreateCouponProvider = ({ children }) => {
  const allCouponTypes = ["Percentage Off", "Fixed Amount Off"];
  const allCategoriesData = categoriesData.map((category) => category.title);
  const [couponData, setCouponData] = useState({
    code: "",
    type: "",
    discountAmount: "",
    minOrderAmount: "",
    expirationDate: "",
    startDate: "",
    categories: [],
  });
  const [errors, setErrors] = useState({});
  const [allCoupons, setAllCoupons] = useState([]);

  const contextValue = {
    allCouponTypes,
    allCategoriesData,
    couponData,
    setCouponData,
    errors,
    setErrors,
    allCoupons,
    setAllCoupons,
  };

  return (
    <CreateCouponContext.Provider value={contextValue}>
      {children}
    </CreateCouponContext.Provider>
  );
};
