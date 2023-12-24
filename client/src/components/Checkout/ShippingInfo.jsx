import styles from "../../styles/styles";
import { Country, State, City } from "country-state-city";
import { useEffect } from "react";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import the styles
import Loader from "../Loader";

const ShippingInfo = ({
  addresses,
  houseNumber,
  street,
  city,
  state,
  country,
  zip,
  contactName,
  phone,
  setHouseNumber,
  setStreet,
  setCity,
  setState,
  setCountry,
  setZip,
  setContactName,
  setPhone,
  loading,
}) => {
  const [errors, setErrors] = useState([]);
  const [checkedId, setCheckedId] = useState(null);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    if (!value) {
      setErrors({ [name]: `Please enter your ${name}` });
    } else {
      setErrors({});
    }

    switch (name) {
      case "houseNumber":
        setHouseNumber(value);
        break;
      case "street":
        setStreet(value);
        break;
      case "city":
        setCity(value);
        break;
      case "state":
        setState(value);
        break;
      case "country":
        setCountry(value);
        break;
      case "zip":
        setZip(value);
        break;
      case "contactName":
        setContactName(value);
        break;
      default:
        break;
    }
  };

  // handle phone input change event and set phone number state
  const handleOnPhoneChange = (value, country, e, formattedValue) => {
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

    setPhone(value);
  };

  return (
    <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
      <h5 className="text-[18px] font-[500]">Shipping Address</h5>
      <br />
      <form>
        {/* Contact Name */}
        <div>
          <label htmlFor="contactName" className={styles.formLabel}>
            Contact Name
          </label>
          <input
            type="text"
            name="contactName"
            required
            value={contactName}
            onChange={(e) => handleOnChange(e)}
            className={styles.formInput}
          />
          {/* form control error */}
          {errors && errors.contactName && (
            <p className={styles.formInputError}>{errors.contactName}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="w-[50%]">
          <div id="phoneInput">
            <label htmlFor="phone" className={styles.formLabel}>
              Phone
            </label>
            <PhoneInput
              id="phone"
              name="phone"
              country={"us"} // Set default country (optional)
              value={phone}
              onChange={handleOnPhoneChange}
            />
            {/* form control error */}
            {errors.phone && (
              <p className={styles.formInputError}>{errors.phone}</p>
            )}
          </div>
        </div>

        {/* House Number */}
        <div>
          <label htmlFor="houseNumber" className={styles.formLabel}>
            House Number
          </label>
          <input
            type="text"
            name="houseNumber"
            required
            value={houseNumber}
            onChange={(e) => handleOnChange(e)}
            className={styles.formInput}
          />
          {/* form control error */}
          {errors && errors.houseNumber && (
            <p className={styles.formInputError}>{errors.houseNumber}</p>
          )}
        </div>

        {/* Street */}
        <div>
          <label htmlFor="street" className={styles.formLabel}>
            Street
          </label>
          <input
            type="text"
            name="street"
            required
            value={street}
            onChange={(e) => handleOnChange(e)}
            className={styles.formInput}
          />
          {/* form control error */}
          {errors && errors.street && (
            <p className={styles.formInputError}>{errors.street}</p>
          )}
        </div>

        {/* country state city */}
        <div className="flex flex-col sm:flex-row sm:space-x-2 gap-2 md:gap-5">
          {/* Country */}
          <div>
            <label htmlFor="country" className={styles.formLabel}>
              Country
            </label>
            <select
              name="country"
              required
              value={country}
              onChange={(e) => handleOnChange(e)}
              className={styles.formInput}
            >
              <option value="">Select Country</option>
              {Country.getAllCountries().map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
            {/* form control error */}
            {errors && errors.country && (
              <p className={styles.formInputError}>{errors.country}</p>
            )}
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className={styles.formLabel}>
              State
            </label>
            <select
              name="state"
              required
              value={state}
              onChange={(e) => handleOnChange(e)}
              className={styles.formInput}
            >
              <option value="">Select State</option>
              {State.getStatesOfCountry(country).map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
            {/* form control error */}
            {errors && errors.state && (
              <p className={styles.formInputError}>{errors.state}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className={styles.formLabel}>
              City
            </label>
            <select
              name="city"
              required
              value={city}
              onChange={(e) => handleOnChange(e)}
              className={styles.formInput}
            >
              <option value="">Select City</option>
              {City.getCitiesOfState(country, state).map((city) => (
                <option key={city.name} value={city.isoCode}>
                  {city.name}
                </option>
              ))}
            </select>
            {/* form control error */}
            {errors && errors.city && (
              <p className={styles.formInputError}>{errors.city}</p>
            )}
          </div>

          {/* Zip Code */}
          <div>
            <label htmlFor="zip" className={styles.formLabel}>
              Zip Code
            </label>
            <input
              type="text"
              name="zip"
              required
              value={zip}
              onChange={(e) => handleOnChange(e)}
              className={styles.formInput}
            />
            {/* form control error */}
            {errors && errors.zip && (
              <p className={styles.formInputError}>{errors.zip}</p>
            )}
          </div>
        </div>
      </form>

      <h5 className="text-[18px] cursor-pointer inline-block">
        Choose From saved address
      </h5>

      <div>
        {addresses &&
          addresses.map((item, index) => (
            <div className="w-full flex mt-1" key={item._id}>
              {loading && <Loader />}
              <input
                type="checkbox"
                className="mr-3"
                value={item._id}
                checked={checkedId === item._id}
                onChange={() => setCheckedId(item._id)}
                onClick={() => {
                  setHouseNumber(item.houseNumber);
                  setStreet(item.street);
                  setCity(item.city);
                  setState(item.state);
                  setCountry(item.country);
                  setZip(item.zip);
                  setContactName(item.contactName || "");
                  setPhone(item.phone || "");
                }}
              />
              <h2>{item.addressNickname}</h2>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ShippingInfo;
