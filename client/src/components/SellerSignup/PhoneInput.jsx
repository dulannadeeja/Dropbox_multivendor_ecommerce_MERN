import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import the styles
import styles from "../../styles/styles";

const PhoneInputComponent = ({ setPhoneObj }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({});

  const handleOnChange = (value, country, e, formattedValue) => {
    // 'value' will be the phone number in international format
    // 'country' will be the selected country
    // 'e' is the event
    // 'formattedValue' is the value displayed in the input field

    //check if phone number is valid
    if (value.length < 10) {
      setErrors({ phone: "please enter a valid phone number" });
    }

    if (!value) {
      setErrors({ phone: "please enter your phone number" });
    }

    if (value.length >= 10) {
      setErrors({});
    }

    console.log(value);
    console.log(country);

    setPhoneNumber(value);
    setPhoneObj({
      phone: value,
      country: country,
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
