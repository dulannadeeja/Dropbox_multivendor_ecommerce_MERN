// BusinessInfo.js

import React, { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import styles from "../../styles/styles";
import { useSellerSignupContext } from "../../contexts/SellerSignupContext";
import validateBusinessInfo from "../../validations/businessInfoValidation";

const BusinessInfo = () => {
  const sellerSignupContext = useSellerSignupContext();

  const {
    businessName,
    businessLocation,
    setBusinessName,
    setBusinessLocation,
    setSecondStepCompleted,
  } = sellerSignupContext;

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const validity = validateForm();
    if (validity && businessName && businessLocation) {
      setSecondStepCompleted(true);
    } else {
      setSecondStepCompleted(false);
    }
  }, [errors]);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    const validationError = await validateBusinessInfo(name, value);

    // Update the error state
    setErrors((prevErrors) => ({ ...prevErrors, [name]: validationError }));
  };

  // check if the errors object has any keys containing errors
  const validateForm = () => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-10 800px:w-full">
      <div className="sm:w-full">
        <h2 className="text-xl font-bold text-gray-700 mt-10">
          Business Information
        </h2>
        <p className="text-gray-500 mt-5">
          Provide information about your business to complete the registration
          process.
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full">
        <div>
          <form className="space-y-6">
            {/* Business Name */}
            <div>
              <label htmlFor="businessName" className={styles.formLabel}>
                Business Name
              </label>
              <input
                type="text"
                name="businessName"
                required
                value={businessName}
                onChange={(e) => {
                  setBusinessName(e.target.value);
                  handleInputChange(e);
                }}
                className={styles.formInput}
              />
              {/* form control error */}
              {errors.businessName && (
                <p className={styles.formInputError}>{errors.businessName}</p>
              )}
            </div>

            {/* Business Location */}
            <div className="flex flex-col sm:flex-row sm:space-x-2 gap-2 md:gap-5">
              {/* Country */}
              <div>
                <label htmlFor="country" className={styles.formLabel}>
                  Country
                </label>
                <select
                  name="country"
                  required
                  value={businessLocation.country}
                  onChange={(e) => {
                    setBusinessLocation({
                      ...businessLocation,
                      country: e.target.value,
                    });
                    handleInputChange(e);
                  }}
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
                {errors.country && (
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
                  value={businessLocation.state}
                  onChange={(e) => {
                    setBusinessLocation({
                      ...businessLocation,
                      state: e.target.value,
                    });
                    handleInputChange(e);
                  }}
                  className={styles.formInput}
                >
                  <option value="">Select State</option>
                  {State.getStatesOfCountry(businessLocation.country).map(
                    (state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    )
                  )}
                </select>
                {/* form control error */}
                {errors.state && (
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
                  value={businessLocation.city}
                  onChange={(e) => {
                    setBusinessLocation({
                      ...businessLocation,
                      city: e.target.value,
                    });
                    handleInputChange(e);
                  }}
                  className={styles.formInput}
                >
                  <option value="">Select City</option>
                  {City.getCitiesOfState(
                    businessLocation.country,
                    businessLocation.state
                  ).map((city) => (
                    <option key={city.name} value={city.isoCode}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {/* form control error */}
                {errors.city && (
                  <p className={styles.formInputError}>{errors.city}</p>
                )}
              </div>

              {/* Zip */}
              <div>
                <label htmlFor="zip" className={styles.formLabel}>
                  Zip
                </label>
                <input
                  type="text"
                  name="zip"
                  required
                  value={businessLocation.zip}
                  onChange={(e) => {
                    setBusinessLocation({
                      ...businessLocation,
                      zip: e.target.value,
                    });
                    handleInputChange(e);
                  }}
                  className={styles.formInput}
                />
                {/* form control error */}
                {errors.zip && (
                  <p className={styles.formInputError}>{errors.zip}</p>
                )}
              </div>

              {/* Apartment */}
              <div>
                <label htmlFor="apartment" className={styles.formLabel}>
                  Apartment
                </label>
                <input
                  type="text"
                  name="apartment"
                  required
                  value={businessLocation.apartment}
                  onChange={(e) => {
                    setBusinessLocation({
                      ...businessLocation,
                      apartment: e.target.value,
                    });
                    handleInputChange(e);
                  }}
                  className={styles.formInput}
                />
                {/* form control error */}
                {errors.apartment && (
                  <p className={styles.formInputError}>{errors.apartment}</p>
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
                  value={businessLocation.street}
                  onChange={(e) => {
                    setBusinessLocation({
                      ...businessLocation,
                      street: e.target.value,
                    });
                    handleInputChange(e);
                  }}
                  className={styles.formInput}
                />
                {/* form control error */}
                {errors.street && (
                  <p className={styles.formInputError}>{errors.street}</p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfo;
