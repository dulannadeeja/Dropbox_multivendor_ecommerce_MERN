import { React, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";
import "react-phone-number-input/style.css";

const PersonalInfo = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [visibleConfirmPassword, setConfirmVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("houseNumber", houseNumber);
    formData.append("street", street);
    formData.append("country", country);
    formData.append("state", state);
    formData.append("city", city);
    formData.append("zip", zip);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("avatar", avatar);

    axios
      .put(`${server}/shop/shop-create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        toast.success(res.data.message);
        setFirstName("");
        setLastName("");
        setEmail("");
        setHouseNumber("");
        setStreet("");
        setCountry("");
        setState("");
        setCity("");
        setZip("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
        setAvatar("");
        navigate(`/shop/verification/${res.data.shopId}`);
      })
      .catch((error) => {
        console.log(error.response.data.message);
        toast.error(error.response.data.message);
      });
  };
  return (
    <div className="min-h-scree flex flex-col justify-center py-12 sm:px-6 lg:px-10 800px:w-full">
      <div className="sm:w-full sm:max-w-md">
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
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input-style"
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input-style"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-style"
              />
            </div>

            {/* House Number */}
            <div>
              <label
                htmlFor="houseNumber"
                className="block text-sm font-medium text-gray-700"
              >
                House Number
              </label>
              <input
                type="text"
                name="houseNumber"
                required
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
                className="input-style"
              />
            </div>

            {/* Street */}
            <div>
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700"
              >
                Street
              </label>
              <input
                type="text"
                name="street"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="input-style"
              />
            </div>

            {/* Country */}
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <select
                name="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="input-style"
              >
                <option value="" disabled>
                  Select Country
                </option>
                {Country.getAllCountries().map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* State */}
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700"
              >
                State
              </label>
              <select
                name="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="input-style"
              >
                <option value="" disabled>
                  Select State
                </option>
                {State.getStatesOfCountry(country)?.map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <select
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="input-style"
              >
                <option value="" disabled>
                  Select City
                </option>
                {City.getCitiesOfState(country, state)?.map((city) => (
                  <option key={city.name} value={city.isoCode}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Zip */}
            <div>
              <label
                htmlFor="zip"
                className="block text-sm font-medium text-gray-700"
              >
                Zip Code
              </label>
              <input
                type="text"
                name="zip"
                required
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="input-style"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-style"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Submit
              </button>
            </div>

            {/* Sign in link */}
            <div className="w-full">
              <h4>Already have an account?</h4>
              <Link to="/shop-login" className="text-blue-600 pl-2">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
