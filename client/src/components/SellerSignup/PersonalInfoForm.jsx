import { React, useState } from "react";
import axios from "axios";
import { server } from "../../server";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import styles from "../../styles/styles";
import PhoneInput from "./PhoneInput";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
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
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
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
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
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
                value={street}
                onChange={(e) => setStreet(e.target.value)}
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
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
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
                  value={state}
                  onChange={(e) => setState(e.target.value)}
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
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
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
            </div>

            {/* Phone */}
            <PhoneInput setPhoneObj={setPhoneObj} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
