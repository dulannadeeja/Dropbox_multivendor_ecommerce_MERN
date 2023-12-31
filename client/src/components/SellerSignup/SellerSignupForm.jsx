import { React, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import Stepper from "./Stepper";
import StepControl from "./StepControl.jsx";
import PersonalInfo from "./PersonalInfoForm";
import { useSelector } from "react-redux";
import BusinessInfo from "./BusinessInfoForm";
import { useSellerSignupContext } from "../../contexts/SellerSignupContext.jsx";
import ContactInfo from "./ContactInfoForm.jsx";
import ShopSetup from "./ShopSetupForm.jsx";
import { loadUser } from "../../redux/actions/user.js";
import { useDispatch } from "react-redux";

const SellerSignupForm = () => {
  const {
    user,
    token,
    currentStatus: userCurrentStatus,
  } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    currentStep,
    isFirstStepCompleted,
    isSecondStepCompleted,
    isThirdStepCompleted,
    firstStepInfo,
    secondStepInfo,
    thirdStepInfo,
    fourthStepInfo,
  } = useSellerSignupContext();

  useEffect(() => {
    // if the users data is already in the redux store
    // then set the first step info
    if (user) {
      firstStepInfo.firstName = user.firstName;
      firstStepInfo.lastName = user.lastName;
      firstStepInfo.email = user.email;
      firstStepInfo.houseNumber = user.houseNumber;
      firstStepInfo.street = user.street;
      firstStepInfo.country = user.country;
      firstStepInfo.state = user.state;
      firstStepInfo.city = user.city;
      firstStepInfo.zip = user.zip;
      firstStepInfo.phone = user.phone;
    }
  }, [userCurrentStatus]);

  const handleSubmit = async () => {
    try {
      if (isFirstStepCompleted === false) {
        throw new Error("Please complete the first step");
      } else if (isSecondStepCompleted === false) {
        throw new Error("Please complete the second step");
      } else if (isThirdStepCompleted === false) {
        throw new Error("Please complete the third step");
      }

      const formData = new FormData();
      formData.append("firstName", firstStepInfo.firstName);
      formData.append("lastName", firstStepInfo.lastName);
      formData.append("email", firstStepInfo.email);
      formData.append("houseNumber", firstStepInfo.houseNumber);
      formData.append("street", firstStepInfo.street);
      formData.append("country", firstStepInfo.country);
      formData.append("state", firstStepInfo.state);
      formData.append("city", firstStepInfo.city);
      formData.append("zip", firstStepInfo.zip);
      formData.append("phone", firstStepInfo.phone);
      formData.append("businessName", secondStepInfo.businessName);
      formData.append("businessApartment", secondStepInfo.businessApartment);
      formData.append("businessStreet", secondStepInfo.businessStreet);
      formData.append("businessZip", secondStepInfo.businessZip);
      formData.append("businessCountry", secondStepInfo.businessCountry);
      formData.append("businessState", secondStepInfo.businessState);
      formData.append("businessCity", secondStepInfo.businessCity);
      formData.append("contactPhone", thirdStepInfo.contactPhone);
      formData.append("contactEmail", thirdStepInfo.contactEmail);
      formData.append("contactName", thirdStepInfo.contactName);
      formData.append("shopDescription", fourthStepInfo.shopDescription);
      formData.append("bannerName", fourthStepInfo.shopBanner.name);
      formData.append("logoName", fourthStepInfo.shopLogo.name);

      formData.append("images", fourthStepInfo.shopLogo);
      formData.append("images", fourthStepInfo.shopBanner);

      console.log(fourthStepInfo.shopLogo.name);
      console.log(fourthStepInfo.shopBanner.name);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      await axios
        .post(`${server}/seller/signup`, formData, config)
        .then((res) => {
          if (res.status === 201) {
            toast.success(res.data.message);
            dispatch(loadUser());
            navigate("/");
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response?.data?.message || "Something went wrong");
        });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="w-full py-20 px-5 bg-white md:max-w-3xl lg:max-w-7xl mx-auto my-10 md:my-20 shadow-lg rounded-lg md:px-20">
      {/* Stepper */}
      <Stepper />

      {/* Step-1 personal information */}
      {currentStep === 1 && <PersonalInfo />}
      {/* Step-2 business information */}
      {currentStep === 2 && <BusinessInfo />}
      {/* Step-3 Contact Information */}
      {currentStep === 3 && <ContactInfo />}
      {/* Step-4 Payment Information */}
      {currentStep === 4 && <ShopSetup />}
      {/* Step-3 Contact Information */}
      {/* Step Controller */}
      <StepControl handleSubmit={handleSubmit} />
    </div>
  );
};

export default SellerSignupForm;
