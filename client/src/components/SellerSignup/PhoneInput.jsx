<<<<<<< HEAD
import React, { useEffect, useState } from "react";
=======
import React, { useState } from "react";
>>>>>>> 576e884e8479516853b1675d158c83bb1d6956fa
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import the styles
import styles from "../../styles/styles";

const PhoneInputComponent = ({ setPhoneObj }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
<<<<<<< HEAD
  const [error, setError] = useState(null);
  const [country, setCountry] = useState("");

  useEffect(() => {
    if (phoneNumber.length >= 10 && error === null) {
      console.log("phone number", phoneNumber);
      setPhoneObj({
        phone: phoneNumber,
        country: country,
      });
    }
  }, [phoneNumber, error]);
=======
  const [errors, setErrors] = useState({});
>>>>>>> 576e884e8479516853b1675d158c83bb1d6956fa

  const handleOnChange = (value, country, e, formattedValue) => {
    // 'value' will be the phone number in international format
    // 'country' will be the selected country
    // 'e' is the event
    // 'formattedValue' is the value displayed in the input field

    //check if phone number is valid
    if (value.length < 10) {
<<<<<<< HEAD
      setError("please enter a valid phone number");
    }

    if (!value) {
      setError("please enter your phone number");
    }

    if (value.length >= 10) {
      setCountry(country);
      setPhoneNumber(value);
      setError(null);
    }
=======
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
>>>>>>> 576e884e8479516853b1675d158c83bb1d6956fa
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
<<<<<<< HEAD
      {error && <p className={styles.formInputError}>{error}</p>}
=======
      {errors.phone && <p className={styles.formInputError}>{errors.phone}</p>}
>>>>>>> 576e884e8479516853b1675d158c83bb1d6956fa
    </div>
  );
};

export default PhoneInputComponent;
