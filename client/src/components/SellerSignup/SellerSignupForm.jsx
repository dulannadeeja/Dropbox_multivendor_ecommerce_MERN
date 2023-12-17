import { React, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import Stepper from "./Stepper";
import StepControl from "./StepControl.jsx";
import PersonalInfo from "./PersonalInfoForm";
import {
  SellerSignupProvider,
  useSellerSignupContext,
} from "../../contexts/SellerSignupContext.jsx";
import { useSelector } from "react-redux";
import BusinessInfo from "./BusinessInfoForm";
import ShopSetup from "./ShopSetupForm.jsx";
import ContactInfo from "./ContactInfoForm.jsx";
// import PaymentInfo from "./PaymentInfoForm";

const SellerSignupForm = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

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
    </div>
  );
};

export default SellerSignupForm;
