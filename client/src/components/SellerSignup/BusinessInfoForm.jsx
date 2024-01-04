import { React, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../server";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import styles from "../../styles/styles";
import PhoneInput from "./PhoneInput";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { useSellerSignupContext } from "../../contexts/SellerSignupContext";
import { hasValues } from "../../utils/objectHelper";
import validateBusinessInfo from "../../validations/businessInfoValidation";

const businessInfo = () => {
  const {
    errors,
    setErrors,
    secondStepInfo,
    setSecondStepInfo,
    setSecondStepCompleted,
    firstStepCompleted,
    firstStepInfo,
    secondStepCompleted,
  } = useSellerSignupContext();

  const [formCompleted, setFormCompleted] = useState(false);

  const handleOnChange = async (e) => {
    const { name, value } = e.target;

    const prefixedName =
      "business" + name.charAt(0).toUpperCase() + name.slice(1);

    //check if the input is valid
    const error = await validateBusinessInfo(prefixedName, value);

    console.log(error);

    // if there is an error, set the error state
    if (error) {
      setErrors({ ...errors, [prefixedName]: error });
    }

    // if there is no error, remove the error state
    if (!error) {
      setErrors({ ...errors, [prefixedName]: "" });
    }

    // Prefix the name of the input with business
    // to differentiate it from the first step

    // update the state
    setSecondStepInfo({ ...secondStepInfo, [prefixedName]: value });
  };

  // handle form completion
  const handleFormCompletion = () => {
    for (let key in secondStepInfo) {
      if (
        !secondStepInfo[key] ||
        typeof secondStepInfo[key] !== "string" ||
        secondStepInfo[key].trim() === ""
      ) {
        setFormCompleted(false);
        return;
      }
    }
    setFormCompleted(true);
  };

  // Hooks to handle form re rendering
  useEffect(() => {
    handleFormCompletion();
    console.log("Errors " + JSON.stringify(errors));
    console.log("Second step info " + JSON.stringify(secondStepInfo));
    console.log("First step completed " + firstStepCompleted);
    console.log("Second form completed " + formCompleted);
    console.log("Second Step Completed " + secondStepCompleted);

    if (!hasValues(errors) && formCompleted) {
      setSecondStepCompleted(true);
    } else {
      setSecondStepCompleted(false);
    }

    console.log("\n");
  }),
    [
      errors,
      secondStepInfo,
      firstStepCompleted,
      formCompleted,
      secondStepCompleted,
    ];

  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  return (
    <div className="min-h-scree flex flex-col justify-center py-12 sm:px-6 lg:px-10 800px:w-full">
      <div className="sm:w-full">
        <h2 className="text-xl font-bold text-gray-700 mt-10">
          Business Information
        </h2>
        <p className="text-gray-500 mt-5">
          Your personal information that you provide will be used to create your
          shop and will be displayed for customers to contact you. Complete the
          form to create your shop.
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full">
        <div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Shop Name */}
            <div>
              <label htmlFor="name" className={styles.formLabel}>
                Business Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={secondStepInfo.businessName}
                onChange={(e) => handleOnChange(e)}
                className={styles.formInput}
              />
              {/* form control error */}
              {errors && errors.businessName && (
                <p className={styles.formInputError}>{errors.businessName}</p>
              )}
            </div>

            {/* Apartment */}
            <div>
              <label htmlFor="apartment" className={styles.formLabel}>
                Apartment / House Number
              </label>
              <input
                type="text"
                name="apartment"
                required
                value={secondStepInfo.businessApartment}
                onChange={(e) => handleOnChange(e)}
                className={styles.formInput}
              />
              {/* form control error */}
              {errors && errors.businessApartment && (
                <p className={styles.formInputError}>
                  {errors.businessApartment}
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
                value={secondStepInfo.businessStreet}
                onChange={(e) => handleOnChange(e)}
                className={styles.formInput}
              />
              {/* form control error */}
              {errors && errors.businessStreet && (
                <p className={styles.formInputError}>{errors.businessStreet}</p>
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
                  value={secondStepInfo.businessCountry}
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
                {errors && errors.businessCountry && (
                  <p className={styles.formInputError}>
                    {errors.businessCountry}
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
                  value={secondStepInfo.businessState}
                  onChange={(e) => handleOnChange(e)}
                  className={styles.formInput}
                >
                  <option value="">Select State</option>
                  {State.getStatesOfCountry(secondStepInfo.businessCountry).map(
                    (state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    )
                  )}
                </select>
                {/* form control error */}
                {errors && errors.businessState && (
                  <p className={styles.formInputError}>
                    {errors.businessState}
                  </p>
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
                  value={secondStepInfo.businessCity}
                  onChange={(e) => handleOnChange(e)}
                  className={styles.formInput}
                >
                  <option value="">Select City</option>
                  {City.getCitiesOfState(
                    secondStepInfo.businessCountry,
                    secondStepInfo.businessState
                  ).map((city) => (
                    <option key={city.name} value={city.isoCode}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {/* form control error */}
                {errors && errors.businessCity && (
                  <p className={styles.formInputError}>{errors.businessCity}</p>
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
                  value={secondStepInfo.businessZip}
                  onChange={(e) => handleOnChange(e)}
                  className={styles.formInput}
                />
                {/* form control error */}
                {errors && errors.businessZip && (
                  <p className={styles.formInputError}>{errors.businessZip}</p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default businessInfo;
