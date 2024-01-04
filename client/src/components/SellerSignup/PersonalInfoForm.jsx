import { React, useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import styles from "../../styles/styles";
import PhoneInput from "./PhoneInput";
import validatePersonalInfo from "../../validations/personalInfoValidation";
import { useSellerSignupContext } from "../../contexts/SellerSignupContext";
import { hasValues } from "../../utils/objectHelper";

const PersonalInfo = () => {
  const {
    errors,
    setErrors,
    setFirstStepInfo,
    firstStepInfo,
    setFirstStepCompleted,
    firstStepCompleted,
  } = useSellerSignupContext();

  const [formCompleted, setFormCompleted] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handleOnChange = async (e) => {
    const { name, value } = e.target;

    //check if the input is valid
    const error = await validatePersonalInfo(name, value);

    console.log(error);

    // if there is an error, set the error state
    if (error) {
      setErrors({ ...errors, [name]: error });
    }

    // if there is no error, remove the error state
    if (!error) {
      setErrors({ ...errors, [name]: "" });
    }

    // update the state
    setFirstStepInfo({ ...firstStepInfo, [name]: value });
  };

  // handle phone number error
  useEffect(() => {
    if (phoneError) {
      setErrors({ ...errors, phone: phoneError });
    } else {
      setErrors({ ...errors, phone: "" });
    }
  }, [phoneError]);

  // handle phone number
  useEffect(() => {
    setFirstStepInfo({ ...firstStepInfo, phone: phoneNumber });
  }, [phoneNumber]);

  // when comes back from the next step, set the phone number from the context
  useEffect(() => {
    setPhoneNumber(firstStepInfo.phone);
  }, []);

  // handle form completion
  const handleFormCompletion = () => {
    for (let key in firstStepInfo) {
      if (
        !firstStepInfo[key] ||
        typeof firstStepInfo[key] !== "string" ||
        firstStepInfo[key].trim() === ""
      ) {
        setFormCompleted(false);
        return;
      }
    }
    setFormCompleted(true);
  };

  // Hooks to handle form re rendering
  useEffect(() => {
    console.log("form completed " + formCompleted);
    console.log("first Step Completed " + firstStepCompleted);
    handleFormCompletion();
    if (!hasValues(errors) && formCompleted) {
      setFirstStepCompleted(true);
    } else {
      setFirstStepCompleted(false);
    }

    console.log("\n");
  }),
    [errors, firstStepInfo];

  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  return (
    <div className="min-h-scree flex flex-col justify-center sm:p-2 md:p-5 lg:p-10">
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-700 mt-10">
          Personal Information
        </h2>
        <p className="text-gray-500 mt-5">
          Your personal information that you provide will be used to create your
          shop and will be displayed for customers to contact you. Complete the
          form to create your shop.
        </p>
      </div>
      <div className="">
        <div>
          <form
            className="grid grid-cols-1 lg:grid-cols-2 gap-10"
            onSubmit={handleSubmit}
          >
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className={styles.formLabel}>
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                required
                value={firstStepInfo.firstName}
                onChange={(e) => handleOnChange(e)}
                className={styles.formInput}
              />
              {/* form control error */}
              {errors && errors.firstName && (
                <p className={styles.formInputError}>{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className={styles.formLabel}>
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                required
                value={firstStepInfo.lastName}
                onChange={(e) => handleOnChange(e)}
                className={styles.formInput}
              />
              {/* form control error */}
              {errors && errors.lastName && (
                <p className={styles.formInputError}>{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={styles.formLabel}>
                Email{" "}
                <span className="text-gray-400 text-xs">
                  (cannot be changed)
                </span>
              </label>
              <input
                type="email"
                name="email"
                required
                disabled
                value={firstStepInfo.email}
                onChange={(e) => handleOnChange(e)}
                className={`${styles.formInput} bg-gray-100 pointer-disabled`}
              />
              {/* form control error */}
              {errors && errors.email && (
                <p className={styles.formInputError}>{errors.email}</p>
              )}
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
                value={firstStepInfo.houseNumber}
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
                value={firstStepInfo.street}
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
                  value={firstStepInfo.country}
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
                  value={firstStepInfo.state}
                  onChange={(e) => handleOnChange(e)}
                  className={styles.formInput}
                >
                  <option value="">Select State</option>
                  {State.getStatesOfCountry(firstStepInfo.country).map(
                    (state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    )
                  )}
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
                  value={firstStepInfo.city}
                  onChange={(e) => handleOnChange(e)}
                  className={styles.formInput}
                >
                  <option value="">Select City</option>
                  {City.getCitiesOfState(
                    firstStepInfo.country,
                    firstStepInfo.state
                  ).map((city) => (
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
                  value={firstStepInfo.zip}
                  onChange={(e) => handleOnChange(e)}
                  className={styles.formInput}
                />
                {/* form control error */}
                {errors && errors.zip && (
                  <p className={styles.formInputError}>{errors.zip}</p>
                )}
              </div>
            </div>

            <div>
              {/* Phone */}
              <PhoneInput
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                setPhoneError={setPhoneError}
              />

              {/* form control error */}
              {errors && errors.phone && (
                <p className={styles.formInputError}>{errors.phone}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
