import styles from "../../styles/styles";
import { Country, State, City } from "country-state-city";
import { useEffect } from "react";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import the styles
import Loader from "../Loader";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCheckoutContext } from "../../contexts/CheckoutContext";
import isAddressError from "../../validations/addressValidation";

const ShippingInfo = ({}) => {
  const navigate = useNavigate();
  const [checkedId, setCheckedId] = useState(null);
  const { addresses, loading } = useSelector((state) => state.user);
  const { items } = useSelector((state) => state.cart);

  const {
    houseNumber,
    setHouseNumber,
    street,
    setStreet,
    city,
    setCity,
    state,
    setState,
    country,
    setCountry,
    zip,
    setZip,
    contactName,
    setContactName,
    phone,
    setPhone,
    shippingInfoError,
    setShippingInfoError,
  } = useCheckoutContext();

  useEffect(() => {
    // if local storage has the shipping info, then set the shipping info
    const shippingInfo = JSON.parse(localStorage.getItem("shippingInfo"));
    if (shippingInfo) {
      setHouseNumber(shippingInfo.houseNumber);
      setStreet(shippingInfo.street);
      setCity(shippingInfo.city);
      setState(shippingInfo.state);
      setCountry(shippingInfo.country);
      setZip(shippingInfo.zip);
      setContactName(shippingInfo.contactName);
      setPhone(shippingInfo.phone);
    }

    // if cart not any items, then redirect to home page
    if (items.length === 0) {
      navigate("/");
    }

    window.scrollTo(0, 0);
  }, []);

  const handleOnChange = async (e) => {
    const { name, value } = e.target;

    // check for field errors
    const error = await isAddressError(name, value);

    console.log(error);

    if (error) {
      setShippingInfoError({ ...shippingInfoError, [name]: error });
    } else {
      setShippingInfoError({ ...shippingInfoError, [name]: "" });
    }

    const nameAndFunction = {
      houseNumber: setHouseNumber,
      street: setStreet,
      city: setCity,
      state: setState,
      country: setCountry,
      zip: setZip,
      contactName: setContactName,
      phone: setPhone,
    };

    nameAndFunction[name](value);

    console.log(shippingInfoError);
  };

  // handle phone input change event and set phone number state
  const handleOnPhoneChange = (value, country, e, formattedValue) => {
    // 'value' will be the phone number in international format
    // 'country' will be the selected country
    // 'e' is the event
    // 'formattedValue' is the value displayed in the input field

    //check if phone number is valid
    if (!value) {
      setShippingInfoError({ phone: "Please enter your phone number" });
    }

    if (value.length < 10) {
      setShippingInfoError({ phone: "Please enter a valid phone number" });
    }

    if (value.length >= 10) {
      setShippingInfoError({ ...shippingInfoError, phone: "" });
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
          {shippingInfoError && shippingInfoError.contactName && (
            <p className={styles.formInputError}>
              {shippingInfoError.contactName}
            </p>
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
            {shippingInfoError.phone && (
              <p className={styles.formInputError}>{shippingInfoError.phone}</p>
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
          {shippingInfoError && shippingInfoError.houseNumber && (
            <p className={styles.formInputError}>
              {shippingInfoError.houseNumber}
            </p>
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
          {shippingInfoError && shippingInfoError.street && (
            <p className={styles.formInputError}>{shippingInfoError.street}</p>
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
            {shippingInfoError && shippingInfoError.country && (
              <p className={styles.formInputError}>
                {shippingInfoError.country}
              </p>
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
            {shippingInfoError && shippingInfoError.state && (
              <p className={styles.formInputError}>{shippingInfoError.state}</p>
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
            {shippingInfoError && shippingInfoError.city && (
              <p className={styles.formInputError}>{shippingInfoError.city}</p>
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
            {shippingInfoError && shippingInfoError.zip && (
              <p className={styles.formInputError}>{shippingInfoError.zip}</p>
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
