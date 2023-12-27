import { createContext, useState, useContext } from "react";
import { useSelector } from "react-redux";

const CreateCheckoutContext = createContext();

export const useCheckoutContext = () => {
  const context = useContext(CreateCheckoutContext);
  if (!context) {
    throw new Error(
      "CreateCheckoutContext must be used within CreateCheckoutProvider"
    );
  }
  return context;
};

export const CheckoutProvider = ({ children }) => {
  const { cartTotal, items, coupon, isCouponApplied, couponDiscount } =
    useSelector((state) => state.cart);

  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("BD");
  const [zip, setZip] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingInfoError, setShippingInfoError] = useState({});

  const validateFields = () => {
    if (!houseNumber) {
      setShippingInfoError((prev) => ({
        ...prev,
        houseNumber: "House number is required",
      }));
      return false;
    }

    if (!street) {
      setShippingInfoError((prev) => ({
        ...prev,
        street: "Street is required",
      }));
      return false;
    }

    if (!city) {
      setShippingInfoError((prev) => ({
        ...prev,
        city: "City is required",
      }));

      return false;
    }

    if (!state) {
      setShippingInfoError((prev) => ({
        ...prev,
        state: "State is required",
      }));

      return false;
    }

    if (!zip) {
      setShippingInfoError((prev) => ({
        ...prev,
        zip: "Zip is required",
      }));

      return false;
    }

    if (!contactName) {
      setShippingInfoError((prev) => ({
        ...prev,
        contactName: "Contact name is required",
      }));

      return false;
    }

    if (!phone) {
      setShippingInfoError((prev) => ({
        ...prev,
        phone: "Phone is required",
      }));

      return false;
    }

    console.log(shippingInfoError);

    // check if the shipping info errors object has any key with value
    // if it has, then return false, otherwise return true

    Object.values(shippingInfoError).forEach((val) => {
      if (val.length > 0) {
        return false;
      }
    });

    return true;
  };

  const saveShippingInfo = () => {
    const shippingInfo = {
      houseNumber,
      street,
      city,
      state,
      country,
      zip,
      contactName,
      phone,
    };

    // save the shipping info to local storage
    localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));
  };

  const contextValue = {
    houseNumber,
    setHouseNumber,
    street,
    setStreet,
    city,
    setCity,
    state,
    setState,
    country,
    setCountry,
    zip,
    setZip,
    contactName,
    setContactName,
    phone,
    setPhone,
    shippingInfoError,
    setShippingInfoError,
    validateFields,
    saveShippingInfo,
  };

  return (
    <CreateCheckoutContext.Provider value={contextValue}>
      {children}
    </CreateCheckoutContext.Provider>
  );
};
