import React from "react";
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

const AddressForm = ({ setOpen }) => {
  const { token } = useSelector((state) => state.user);

  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [addressNickname, setAddressNickname] = useState("");

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    //check if the errors object is empty
    if (hasValues(errors)) return toast.error("Please fill all the fields!");

    //check if the all fields are filled
    if (
      houseNumber === "" ||
      street === "" ||
      city === "" ||
      zip === "" ||
      state === "" ||
      country === ""
    )
      return toast.error("Please fill all the fields!");

    //craete a new form data object
    const formData = new FormData();

    //append the data to the form data object
    formData.append("houseNumber", houseNumber);
    formData.append("street", street);
    formData.append("city", city);
    formData.append("zip", zip);
    formData.append("state", state);
    formData.append("country", country);
    formData.append("addressNickname", addressNickname);

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
      default:
        break;
    }
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
                onChange={(e) => handleOnChange(e)}
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
              className={`${styles.buttonSecondary}`}
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              className={`${styles.button}`}
              onClick={(e) => handleSubmit(e)}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
