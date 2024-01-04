import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import the styles
import styles from "../../styles/styles";

const PhoneInputComponent = ({
  phoneNumber,
  setPhoneNumber,
  setPhoneError,
}) => {
  const handleOnChange = (value, country, e, formattedValue) => {
    // 'value' will be the phone number in international format
    // 'country' will be the selected country
    // 'e' is the event
    // 'formattedValue' is the value displayed in the input field

    //check if phone number is valid
    if (!value) {
      setPhoneError("Please enter a valid phone number");
    }

    if (value.length < 10) {
      setPhoneError("Please enter a valid phone number");
    }

    if (value.length >= 10) {
      setPhoneError(null);
    }

    setPhoneNumber(value);
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
    </div>
  );
};

export default PhoneInputComponent;
