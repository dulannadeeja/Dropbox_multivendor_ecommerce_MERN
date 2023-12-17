<<<<<<< HEAD
import { React, useContext, useEffect, useState } from "react";
=======
import { React, useEffect, useState } from "react";
>>>>>>> 576e884e8479516853b1675d158c83bb1d6956fa
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import Stepper from "./Stepper";
import StepControl from "./StepControl.jsx";
import PersonalInfo from "./PersonalInfoForm";
<<<<<<< HEAD
import {
  SellerSignupProvider,
  useSellerSignupContext,
} from "../../contexts/SellerSignupContext.jsx";
import { useSelector } from "react-redux";
import BusinessInfo from "./BusinessInfoForm";
import ShopSetup from "./ShopSetupForm.jsx";
import ContactInfo from "./ContactInfoForm.jsx";
=======
import SellerSignupContext from "../../contexts/SellerSignupContext.js";
import { useSelector } from "react-redux";
// import BusinessInfo from "./BusinessInfoForm";
// import ContactInfo from "./ContactInfoForm";
>>>>>>> 576e884e8479516853b1675d158c83bb1d6956fa
// import PaymentInfo from "./PaymentInfoForm";

const SellerSignupForm = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

<<<<<<< HEAD
  const { currentStep } = useSellerSignupContext();
  const { setFirstName, setLastName, setEmail, setPhone } =
    useSellerSignupContext();

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPhone(user?.phone);
    }
  }, [user]);

  useEffect(() => {
    console.log("currentStep", currentStep);
  }, [currentStep]);

  return (
    <div className="w-full">
      {/* Stepper */}

      <Stepper />

      {/* Step-1 personal information */}
      {currentStep === 1 && <PersonalInfo />}
      {/* Step-2 business information */}
      {currentStep === 2 && <BusinessInfo />}
      {/* Step-3 Contact Information */}
      {currentStep === 3 && <ContactInfo />}
      {/* Step-4 Shop Seup */}
      {currentStep === 4 && <ShopSetup />}
      {/* Step-3 Contact Information */}
      {/* Step Controller */}

      <StepControl />
=======
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(user?.email);
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");

  const allSteps = [
    "Personal Info",
    "Business Info",
    "Contact Info",
    "Payment Info",
  ];
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    console.log(currentStep);
  }, [currentStep]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const formData = new FormData();
  //   formData.append("email", email);
  //   formData.append("name", name);
  //   formData.append("mobile", phoneNumber);
  //   formData.append("address", address);
  //   formData.append("zipCode", zipCode);
  //   formData.append("password", password);
  //   formData.append("confirmPassword", confirmPassword);
  //   formData.append("image", avatar);

  //   axios
  //     .put(`${server}/shop/shop-create`, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     })
  //     .then((res) => {
  //       toast.success(res.data.message);
  //       setName("");
  //       setEmail("");
  //       setPassword("");
  //       setAvatar();
  //       setZipCode();
  //       setAddress("");
  //       setPhoneNumber();

  //       navigate(`/shop/verification/${res.data.shopId}`);
  //     })
  //     .catch((error) => {
  //       console.log(error.response.data.message);
  //       toast.error(error.response.data.message);
  //     });
  // };

  return (
    <div className="w-full">
      {/* Stepper */}
      <Stepper steps={allSteps} currentStep={currentStep} />

      {/* Step-1 personal information */}
      {currentStep === 1 && (
        <SellerSignupContext.Provider
          value={{
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
          }}
        >
          <PersonalInfo />
        </SellerSignupContext.Provider>
      )}
      {/* Step-2 business information */}
      {/* {currentStep === 2 && <BusinessInfo />} */}
      {/* Step-3 Contact Information */}
      {/* {currentStep === 3 && <ContactInfo />} */}
      {/* Step-4 Payment Information */}
      {/* {currentStep === 4 && <PaymentInfo />} */}
      {/* Step-3 Contact Information */}
      {/* Step Controller */}
      <StepControl
        allSteps={allSteps}
        setCurrentStep={setCurrentStep}
        currentStep={currentStep}
      />
>>>>>>> 576e884e8479516853b1675d158c83bb1d6956fa
    </div>
  );
};

export default SellerSignupForm;
