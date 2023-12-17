<<<<<<< HEAD
import { React, useEffect, useState } from "react";
=======
import { React, useState } from "react";
>>>>>>> 576e884e8479516853b1675d158c83bb1d6956fa
import axios from "axios";
import { server } from "../../server";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import styles from "../../styles/styles";
import PhoneInput from "./PhoneInput";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
<<<<<<< HEAD
import { useSellerSignupContext } from "../../contexts/SellerSignupContext";
import validateInput from "../../validations/sellerSignupValidation";

const PersonalInfo = () => {
  const sellerSignupContext = useSellerSignupContext();
  const country = sellerSignupContext.country;
  const state = sellerSignupContext.state;
  const { firstName, lastName, email, phone, city, houseNumber, street, zip } =
    sellerSignupContext;
  const {
    setFirstName,
    setLastName,
    setEmail,
    setPhone,
    setHouseNumber,
    setCity,
    setState,
    setStreet,
    setCountry,
    setZip,
    setFirstStepCompleted,
    firstStepCompleted,
  } = sellerSignupContext;

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const validity = validateForm();
    if (
      validity &&
      firstName &&
      lastName &&
      email &&
      houseNumber &&
      street &&
      country &&
      state &&
      city &&
      zip &&
      phone
    ) {
      setFirstStepCompleted(true);
    } else {
      setFirstStepCompleted(false);
    }
  }, [errors, phone]);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    const validationError = await validateInput(name, value);

    // Update the error state
    setErrors((prevErrors) => ({ ...prevErrors, [name]: validationError }));
  };

  // check if the errors object has any keys containing errors
  const validateForm = () => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
=======
import SellerSignupContext from "../../contexts/SellerSignupContext.js";

const PersonalInfo = () => {
  const [phoneObj, setPhoneObj] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [errors, setErrors] = useState({
    firstName: "please enter your first name",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const formData = new FormData();
    // formData.append("firstName", firstName);
    // formData.append("lastName", lastName);
    // formData.append("email", email);
    // formData.append("houseNumber", houseNumber);
    // formData.append("street", street);
    // formData.append("country", country);
    // formData.append("state", state);
    // formData.append("city", city);
    // formData.append("zip", zip);
    // formData.append("phone", phone);
    // formData.append("password", password);
    // formData.append("confirmPassword", confirmPassword);
    // formData.append("avatar", avatar);

    // axios
    //   .put(`${server}/shop/shop-create`, formData, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   })
    //   .then((res) => {
    //     toast.success(res.data.message);
    //     setFirstName("");
    //     setLastName("");
    //     setEmail("");
    //     setHouseNumber("");
    //     setStreet("");
    //     setCountry("");
    //     setState("");
    //     setCity("");
    //     setZip("");
    //     setPhone("");
    //     setPassword("");
    //     setConfirmPassword("");
    //     setAvatar("");
    //     navigate(`/shop/verification/${res.data.shopId}`);
    //   })
    //   .catch((error) => {
    //     console.log(error.response.data.message);
    //     toast.error(error.response.data.message);
    //   });
>>>>>>> 576e884e8479516853b1675d158c83bb1d6956fa
  };
  return (
    <div className="min-h-scree flex flex-col justify-center py-12 sm:px-6 lg:px-10 800px:w-full">
      <div className="sm:w-full">
        <h2 className="text-xl font-bold text-gray-700 mt-10">
          Personal Information
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
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className={styles.formLabel}>
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                required
<<<<<<< HEAD
                value={sellerSignupContext.firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  handleInputChange(e);
                }}
=======
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
>>>>>>> 576e884e8479516853b1675d158c83bb1d6956fa
                className={styles.formInput}
              />
              {/* form control error */}
              {errors.firstName && (
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
<<<<<<< HEAD
                value={sellerSignupContext.lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  handleInputChange(e);
                }}
=======
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
>>>>>>> 576e884e8479516853b1675d158c83bb1d6956fa
                className={styles.formInput}
              />
              {/* form control error */}
              {errors.lastName && (
                <p className={styles.formInputError}>{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={styles.formLabel}>
                Email
              </label>
              <input
                type="email"
                name="email"
                required
<<<<<<< HEAD
                value={sellerSignupContext.email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  handleInputChange(e);
                }}
=======
                value={email}
                onChange={(e) => setEmail(e.target.value)}
>>>>>>> 576e884e8479516853b1675d158c83bb1d6956fa
                className={styles.formInput}
              />
              {/* form control error */}
              {errors.email && (
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
<<<<<<< HEAD
                value={sellerSignupContext.houseNumber}
                onChange={(e) => {
                  setHouseNumber(e.target.value);
                  handleInputChange(e);
                }}
=======
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
>>>>>>> 576e884e8479516853b1675d158c83bb1d6956fa
                className={styles.formInput}
              />
              {/* form control error */}
              {errors.houseNumber && (
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
<<<<<<< HEAD
                value={sellerSignupContext.street}
                onChange={(e) => {
                  setStreet(e.target.value);
                  handleInputChange(e);
                }}
=======
                value={street}
                onChange={(e) => setStreet(e.target.value)}
>>>>>>> 576e884e8479516853b1675d158c83bb1d6956fa
                className={styles.formInput}
              />
              {/* form control error */}
              {errors.street && (
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
<<<<<<< HEAD
                  value={sellerSignupContext.country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    handleInputChange(e);
                  }}
=======
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
>>>>>>> 576e884e8479516853b1675d158c83bb1d6956fa
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
<<<<<<< HEAD
                  value={sellerSignupContext.state}
                  onChange={(e) => {
                    setState(e.target.value);
                    handleInputChange(e);
                  }}
=======
                  value={state}
                  onChange={(e) => setState(e.target.value)}
>>>>>>> 576e884e8479516853b1675d158c83bb1d6956fa
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
<<<<<<< HEAD
                  value={sellerSignupContext.city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    handleInputChange(e);
                  }}
=======
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
>>>>>>> 576e884e8479516853b1675d158c83bb1d6956fa
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
                {errors.city && (
                  <p className={styles.formInputError}>{errors.city}</p>
                )}
              </div>
<<<<<<< HEAD

              {/* Zip */}
              <div>
                <label htmlFor="zip" className={styles.formLabel}>
                  Zip
                </label>
                <input
                  type="text"
                  name="zip"
                  required
                  value={sellerSignupContext.zip}
                  onChange={(e) => {
                    setZip(e.target.value);
                    handleInputChange(e);
                  }}
                  className={styles.formInput}
                />
                {/* form control error */}
                {errors.zip && (
                  <p className={styles.formInputError}>{errors.zip}</p>
                )}
              </div>
            </div>

            {/* Phone */}
            <PhoneInput setPhoneObj={setPhone} />
=======
            </div>

            {/* Phone */}
            <PhoneInput setPhoneObj={setPhoneObj} />
>>>>>>> 576e884e8479516853b1675d158c83bb1d6956fa
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
