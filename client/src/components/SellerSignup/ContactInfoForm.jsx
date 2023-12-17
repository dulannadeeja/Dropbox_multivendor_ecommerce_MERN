// ContactInfo.js

import React, { useState, useEffect } from "react";
import styles from "../../styles/styles";
import validateContactInfo from "../../validations/contactInfoValidation";
import PhoneInput from "./PhoneInput"; // Assuming you have a PhoneInput component

const ContactInfo = () => {
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phoneNumber: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const validity = validateForm();
    // Update your form completion status based on validity
    // For example, setCompletionStatus(validity);
  }, [errors]);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    const validationError = await validateContactInfo(name, value);

    // Update the contact info state
    setContactInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
    // Update the error state
    setErrors((prevErrors) => ({ ...prevErrors, [name]: validationError }));
  };

  const validateForm = () => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-10 800px:w-full">
      <div className="sm:w-full">
        <h2 className="text-xl font-bold text-gray-700 mt-10">
          Contact Information
        </h2>
        <p className="text-gray-500 mt-5">
          Provide your shop's contact information.
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full">
        <div>
          <form className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className={styles.formLabel}>
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={contactInfo.email}
                onChange={handleInputChange}
                className={styles.formInput}
              />
              {/* Form control error */}
              {errors.email && (
                <p className={styles.formInputError}>{errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className={styles.formLabel}>
                Phone Number
              </label>
              <PhoneInput
                name="phoneNumber"
                required
                value={contactInfo.phoneNumber}
                onChange={handleInputChange}
                className={styles.formInput}
              />
              {/* Form control error */}
              {errors.phoneNumber && (
                <p className={styles.formInputError}>{errors.phoneNumber}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className={styles.formLabel}>
                Address
              </label>
              <textarea
                name="address"
                required
                value={contactInfo.address}
                onChange={handleInputChange}
                className={styles.formInput}
              />
              {/* Form control error */}
              {errors.address && (
                <p className={styles.formInputError}>{errors.address}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
