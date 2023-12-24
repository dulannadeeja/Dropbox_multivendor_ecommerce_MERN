import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import the styles
import styles from "../../styles/styles";
import { useSellerSignupContext } from "../../contexts/SellerSignupContext";

const PhoneInputComponent = ({ handleOnPhoneChange }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({
    phone: "",
  });

  const { currentStep, firstStepInfo, thirdStepinfo } =
    useSellerSignupContext();

  const handleOnChange = (value, country, e, formattedValue) => {
    // 'value' will be the phone number in international format
    // 'country' will be the selected country
    // 'e' is the event
    // 'formattedValue' is the value displayed in the input field

    //check if phone number is valid
    if (!value) {
      setErrors({ phone: "Please enter your phone number" });
    }

    if (value.length < 10) {
      setErrors({ phone: "Please enter a valid phone number" });
    }

    if (value.length >= 10) {
      setErrors({});
    }

    setPhoneNumber(value);
    handleOnPhoneChange({
      dialCode: country.dialCode,
      countryCode: country.countryCode,
      countryName: country.name,
      phone: value,
      formattedValue: formattedValue,
      error: errors.phone,
    });
  };

  return (
    <div id="phoneInput">
      <label htmlFor="phone" className={styles.formLabel}>
        Phone
      </label>
      <PhoneInput
        id="phone"
        name="phone"
        country={"us"} // Set default country (optional)
        value={phoneNumber}
        onChange={handleOnChange}
      />
      {/* form control error */}
      {errors.phone && <p className={styles.formInputError}>{errors.phone}</p>}
    </div>
  );
};

export default PhoneInputComponent;
