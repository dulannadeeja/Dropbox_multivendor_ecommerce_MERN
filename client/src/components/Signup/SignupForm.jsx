import React, { useEffect } from "react";
import { useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import validateUser from "../../validations/userValidation";
import { hasValues, hasNullValues } from "../../utils/objectHelper";
import styles from "../../styles/styles";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [signupEnabled, setSignupEnabled] = useState(false);

  const handleSubmit = (e) => {
    // set signup button to disabled
    setSignupEnabled(false);

    const config = { "Content-Type": "multipart/form-data" };
    const formData = new FormData();

    formData.append("email", email);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("image", avatar);

    e.preventDefault();
    axios
      .put(`${server}/auth/signup`, formData, config)
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
          toast.success("Signup Success!");
          navigate(`/verification/${res.data.userId}`);
        }
        console.log(res);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Something went wrong");
        console.log(err);
      })
      .finally(() => {
        setSignupEnabled(true);
      });
  };

  const onChangeHandler = async (e) => {
    const { name, value } = e.target;

    // set input value
    switch (name) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      default:
        break;
    }

    // validate user input
    let error = await validateUser(name, value);

    // check password and confirm password match
    if (name === "confirmPassword" && value !== password) {
      console.log("passwords do not match");
      error = "Passwords do not match";
    }

    // if has error, set error state
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      // if no error, remove from error state
      const { [name]: _, ...rest } = errors;
      setErrors(rest);
    }
  };

  useEffect(() => {
    // check all fiels are filled
    const hasNullInputes = hasNullValues({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });
    console.log("hasNullInputes", hasNullInputes);
    // check if all inputs are valid
    const hasError = hasValues(errors);
    console.log("hasError", hasError);

    // if all fields are filled and no error, enable signup button
    if (!hasNullInputes && !hasError) {
      setSignupEnabled(true);
    } else {
      setSignupEnabled(false);
    }
  }, [firstName, lastName, email, password, confirmPassword, errors]);

  return (
    <div className="flex items-center justify-center py-10">
      <div className="sm:max-w-sm lg:max-w-lg py-10 lg:py-20 bg-white p-5 sm:p-10 lg:p-20 shadow-lg rounded-lg">
        <div className="mb-10">
          <img
            className="mx-auto h-20 hidden md:block"
            src={Logo}
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create an account with Dropbox
          </h2>
        </div>

        <div className="">
          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={handleSubmit}
          >
            <div className="md:grid md:grid-cols-2 md:gap-6">
              {/* first name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  First Name
                </label>
                <div className="mt-2">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={firstName}
                    onChange={(e) => onChangeHandler(e)}
                  />
                  {/* input error */}
                  {errors.firstName && (
                    <p className="text-red-500 text-xs italic">
                      {errors.firstName}
                    </p>
                  )}
                </div>
              </div>
              {/* last name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Last Name
                </label>
                <div className="mt-2">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="given-name"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={lastName}
                    onChange={(e) => onChangeHandler(e)}
                  />
                  {/* input error */}
                  {errors.lastName && (
                    <p className="text-red-500 text-xs italic">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={email}
                  onChange={(e) => onChangeHandler(e)}
                />
                {/* input error */}
                {errors.email && (
                  <p className="text-red-500 text-xs italic">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={visible ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={password}
                  onChange={(e) => onChangeHandler(e)}
                />
                <div className="flex items-center justify-between cursor-pointer h-5 w-5 absolute top-2 right-2">
                  {visible ? (
                    <AiOutlineEyeInvisible
                      className="text-gray-600 h-full w-full"
                      onClick={() => setVisible(false)}
                    />
                  ) : (
                    <AiOutlineEye
                      className="text-gray-600 h-full w-full"
                      onClick={() => setVisible(true)}
                    />
                  )}
                </div>
                {/* input error */}
                {errors.password && (
                  <p className="text-red-500 text-xs italic">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm Password
                </label>
              </div>
              <div className="mt-2 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={visibleConfirmPassword ? "text" : "password"}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={confirmPassword}
                  onChange={(e) => onChangeHandler(e)}
                />
                <div className="flex items-center justify-between cursor-pointer h-5 w-5 absolute top-2 right-2">
                  {visibleConfirmPassword ? (
                    <AiOutlineEyeInvisible
                      className="text-gray-600 h-full w-full"
                      onClick={() => setVisibleConfirmPassword(false)}
                    />
                  ) : (
                    <AiOutlineEye
                      className="text-gray-600 h-full w-full"
                      onClick={() => setVisibleConfirmPassword(true)}
                    />
                  )}
                </div>
                {/* input error */}
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs italic">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="avatar">
                <span className="block text-sm font-medium leading-6 text-gray-900">
                  Avatar
                </span>
                <span className="block text-sm leading-6 text-gray-500">
                  PNG, JPG, JPEG up to 10MB
                </span>
              </label>
              <div className="mt-2 flex items-center gap-4">
                <label htmlFor="avatar">
                  {/* preview */}
                  <div className="flex items-center justify-center h-20 w-20 rounded-md bg-gray-100">
                    {avatar ? (
                      <img
                        className="h-full w-full object-cover rounded-md"
                        src={avatar ? URL.createObjectURL(avatar) : ""}
                        alt="avatar"
                      />
                    ) : (
                      <svg
                        className="h-6 w-6 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    )}
                  </div>
                  <input
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    className="sr-only inline-block w-full rounded-md border-0 p-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e) => setAvatar(e.target.files[0])}
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember_me" className="flex items-center">
                <span className="block text-sm font-medium leading-6 text-gray-500">
                  Remember me
                </span>
              </label>
            </div>

            <div>
              <button
                type="submit"
                className={
                  signupEnabled
                    ? `${styles.buttonPrimary}`
                    : `${styles.buttonPrimary} ${styles.buttonDisabled}`
                }
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-sm text-gray-500 flex gap-2 items-center">
            Already Have an account?{" "}
            <Link
              to="/login"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign in &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
