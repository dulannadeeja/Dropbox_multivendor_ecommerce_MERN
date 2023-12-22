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
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    console.log("Logging in");

    try {
      const res = await axios.post(`${server}/auth/login`, formData, config);

      if (res.status === 200) {
        console.log(res);
        toast.success(res.data.message);

        // Dispatch the "LoadUserSuccess" action here
        await dispatch({ type: "LoadUserSuccess", payload: res.data.user });

        if (!document.cookie.includes("token")) {
          document.cookie = `token=${res.data.user.token}; path=/;`;
        }

        // Navigate to the previous route or "/" if not available
        navigate(location.state?.from || "/");
      }
    } catch (err) {
      console.error(err);
      if (
        err.response?.status === 401 &&
        err.response?.data?.message ===
          "This account is not activated. Please check your email and activate your account." &&
        err.response?.data?.userId !== null
      ) {
        navigate(`/verification/${err.response?.data?.data?.userId}`);
      }
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-10 w-auto" src={Logo} alt="Your Company" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
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
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
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
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </Link>
              </div>
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
          Not a member?{" "}
          <Link
            to="/signup"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Create an account &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
