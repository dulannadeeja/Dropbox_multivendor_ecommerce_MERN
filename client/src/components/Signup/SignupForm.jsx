import React from "react";
import { useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [fullName, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    const config = { "Content-Type": "multipart/form-data" };
    const formData = new FormData();

    formData.append("email", email);
    formData.append("name", fullName);
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
        toast.error(err.response.data.message);
        console.log(err);
      });
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-10 w-auto" src={Logo} alt="Your Company" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Register for an account with Dropbox
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white rounded-md px-10 py-10 shadow-md">
        <form
          className="space-y-6"
          action="#"
          method="POST"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Full Name
            </label>
            <div className="mt-2">
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={fullName}
                onChange={(e) => setName(e.target.value)}
              />
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
                onChange={(e) => setEmail(e.target.value)}
              />
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
                onChange={(e) => setPassword(e.target.value)}
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
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
  );
};

export default LoginForm;
