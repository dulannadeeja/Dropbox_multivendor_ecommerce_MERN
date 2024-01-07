import React, { useEffect } from "react";
import styles from "../../../styles/styles";
import { Country, State, City } from "country-state-city";
import { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import validateAddress from "../../../validations/addressValidation";
import { hasValues } from "../../../utils/objectHelper";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../../server";
import { useSelector } from "react-redux";
import PhoneInputComponent from "../../SellerSignup/PhoneInput";

const AddressForm = ({ setOpen, addresses, addressAdded }) => {
  const { token } = useSelector((state) => state.user);

  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [addressNickname, setAddressNickname] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [isSubmitAllowed, setIsSubmitAllowed] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // check if all conditions are met to allow address addition
    setIsSubmitAllowed(
      houseNumber &&
        street &&
        city &&
        zip &&
        state &&
        country &&
        addressNickname &&
        contactName &&
        contactNumber &&
        !errors.houseNumber &&
        !errors.street &&
        !errors.city &&
        !errors.zip &&
        !errors.state &&
        !errors.country &&
        !errors.addressNickname &&
        !errors.contactName &&
        !errors.contactNumber
    );
  }, [
    errors,
    houseNumber,
    street,
    city,
    zip,
    state,
    country,
    addressNickname,
    contactName,
    contactNumber,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //craete a new form data object
    const formData = new FormData();

    // Get the country and state names based on isoCodes
    const countryName = Country.getCountryByCode(country)?.name || "";
    const stateName = State.getStateByCode(country, state)?.name || "";

    console.log(country, state);
    console.log(countryName, stateName);

    //append the data to the form data object
    formData.append("houseNumber", houseNumber);
    formData.append("street", street);
    formData.append("city", city);
    formData.append("zip", zip);
    formData.append("state", stateName);
    formData.append("country", countryName);
    formData.append("addressNickname", addressNickname);
    formData.append("contactName", contactName);
    formData.append("contactNumber", contactNumber);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.put(
        `${server}/user/add-address`,
        formData,
        config
      );

      if (res.status === 201) {
        toast.success(res.data.message);
        addressAdded(res.data.address);
        setOpen(false);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "something went wrong"
      );
      console.log(err);
    }
  };

  const handleOnChange = async (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    //check if the input is valid
    const error = await validateAddress(name, value);

    // if there is an error, set the error state
    if (error) {
      setErrors({ ...errors, [name]: error });
    }

    // if there is no error, remove the error state
    if (!error) {
      setErrors({ ...errors, [name]: "" });
    }

    // update the state
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
      case "zip":
        setZip(value);
        break;
      case "state":
        setState(value);
        break;
      case "country":
        setCountry(value);
        break;
      case "addressNickname":
        setAddressNickname(value);
        break;
      case "contactName":
        setContactName(value);
        break;
      default:
        break;
    }
  };

  const handleNicknameChange = (e) => {
    const { name, value } = e.target;

    // check if the nickname is taken
    const isTaken = addresses.find(
      (address) => address.addressNickname.toLowerCase() === value.toLowerCase()
    );

    if (isTaken) {
      setErrors({ ...errors, [name]: "Nickname already taken" });
    }

    if (!isTaken) {
      setErrors({ ...errors, [name]: "" });
    }

    setAddressNickname(value);
  };

  return (
    <div className="w-full">
      {/* model close btn */}
      <div className="flex justify-end">
        <button className="" onClick={() => setOpen(false)}>
          <RxCross1 size={20} />
        </button>
      </div>
      <div className="sm:w-full">
        <h2 className="text-xl font-bold text-gray-700 mt-10">
          Add New Address
        </h2>
        <p className="text-gray-500 mt-5">
          Please fill in the information below to add new address.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full">
        <div>
          <form className="space-y-6">
            <div className="md:grid md:grid-cols-2 gap-5">
              {/* contact Name */}
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

              {/* contact Number */}
              <div>
                <PhoneInputComponent
                  phoneNumber={contactNumber}
                  setPhoneNumber={setContactNumber}
                  setPhoneError={(error) =>
                    setErrors({ ...errors, contactNumber: error })
                  }
                />
                {/* form control error */}
                {errors && errors.contactNumber && (
                  <p className={styles.formInputError}>
                    {errors.contactNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Home */}
            <div>
              <label htmlFor="houseNumber" className={styles.formLabel}>
                House Number/Name
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
            <div className="flex flex-row sm:space-x-2 gap-2 md:gap-5">
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

            {/* enter address nickname */}
            <div>
              <label htmlFor="addressNickname" className={styles.formLabel}>
                Address Nickname
                <span className="text-gray-400 text-sm">
                  (e.g. Home, Office, etc.)
                </span>
              </label>
              <input
                type="text"
                name="addressNickname"
                required
                value={addressNickname}
                onChange={(e) => handleNicknameChange(e)}
                className={styles.formInput}
              />
              {/* form control error */}
              {errors && errors.addressNickname && (
                <p className={styles.formInputError}>
                  {errors.addressNickname}
                </p>
              )}
            </div>
          </form>

          {/* cancel and save buttons */}
          <div className="flex justify-end mt-5 gap-5">
            <button
              className={
                isSubmitAllowed
                  ? `${styles.button}`
                  : `${styles.button} ${styles.buttonDisabled}`
              }
              onClick={(e) => handleSubmit(e)}
            >
              Save Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
