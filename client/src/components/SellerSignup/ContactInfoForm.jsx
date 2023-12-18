import { React, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../server";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import styles from "../../styles/styles";
import PhoneInput from "./PhoneInput";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import validateContactInfo from "../../validations/contactInfoValidation";
import { useSellerSignupContext } from "../../contexts/SellerSignupContext";
import { hasValues } from "../../utils/objectHelper";

const ContactInfo = () => {
  const {
    errors,
    setErrors,
    thirdStepCompleted,
    setThirdStepInfo,
    thirdStepInfo,
    setThirdStepCompleted,
  } = useSellerSignupContext();

  const [formCompleted, setFormCompleted] = useState(false);

  const handleOnChange = async (e) => {
    const { name, value } = e.target;

    //check if the input is valid
    const error = await validateContactInfo(name, value);

    console.log(error);

    // if there is an error, set the error state
    if (error) {
      setErrors({ ...errors, [name]: error });
    }

    // if there is no error, remove the error state
    if (!error) {
      setErrors({ ...errors, [name]: "" });
    }

    // update the state
    setThirdStepInfo({ ...thirdStepInfo, [name]: value });
  };

  const handleOnPhoneChange = (value) => {
    console.log(value);

    // check if the phone number is valid
    if (value.error) {
      setErrors((prevErrors) => ({ ...prevErrors, contactPhone: value.error }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, contactPhone: "" }));
    }

    // update the state
    setThirdStepInfo((prevInfo) => ({
      ...prevInfo,
      contactPhone: value.phone,
    }));
  };

  // handle form completion
  const handleFormCompletion = () => {
    for (let key in thirdStepInfo) {
      if (
        !thirdStepInfo[key] ||
        typeof thirdStepInfo[key] !== "string" ||
        thirdStepInfo[key].trim() === ""
      ) {
        setFormCompleted(false);
        return;
      }
    }
    setFormCompleted(true);
  };

  // Hooks to handle form re rendering
  useEffect(() => {
    console.log("form completed " + formCompleted);
    console.log("third Step Completed " + thirdStepCompleted);
    handleFormCompletion();
    if (!hasValues(errors) && formCompleted) {
      setThirdStepCompleted(true);
    } else {
      setThirdStepCompleted(false);
    }

    console.log("\n");
  }),
    [errors, thirdStepInfo];

  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  return (
    <div className="min-h-scree flex flex-col justify-center py-12 sm:px-6 lg:px-10 800px:w-full">
      <div className="sm:w-full">
        <h2 className="text-xl font-bold text-gray-700 mt-10">
          Contact Information
        </h2>
        <p className="text-gray-500 mt-5">
          Enter your business contact information. This information will be used
          to contact you regarding your shop. Please ensure that the information
          is correct.
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full">
        <div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Contact Name */}
            <div>
              <label htmlFor="contactName" className={styles.formLabel}>
                Contact Name
              </label>
              <input
                type="text"
                name="contactName"
                required
                value={thirdStepInfo.contactName}
                onChange={(e) => handleOnChange(e)}
                className={styles.formInput}
              />
              {/* form control error */}
              {errors && errors.contactName && (
                <p className={styles.formInputError}>{errors.contactName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="contactEmail" className={styles.formLabel}>
                Email
              </label>
              <input
                type="email"
                name="contactEmail"
                required
                value={thirdStepInfo.contactEmail}
                onChange={(e) => handleOnChange(e)}
                className={styles.formInput}
              />
              {/* form control error */}
              {errors && errors.contactEmail && (
                <p className={styles.formInputError}>{errors.contactEmail}</p>
              )}
            </div>

            {/* Phone */}
            <PhoneInput handleOnPhoneChange={handleOnPhoneChange} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
