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
import { useParams } from "react-router-dom";

const SetPasswordForm = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
    } else {
      try {
        const res = await axios.post(`${server}/auth/set-password`, {
          token,
          password,
          confirmPassword,
        });

        if (res.status === 200) {
          toast.success(res.data.message);
          navigate("/login");
        }
      } catch (error) {
        console.log("Error catched : " + error);
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-10 w-auto" src={Logo} alt="Your Company" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          New Password
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
                type={visiblePassword ? "text" : "password"}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex items-center justify-between cursor-pointer h-5 w-5 absolute top-2 right-2">
                {visiblePassword ? (
                  <AiOutlineEyeInvisible
                    className="text-gray-600 h-full w-full"
                    onClick={() => setVisiblePassword(false)}
                  />
                ) : (
                  <AiOutlineEye
                    className="text-gray-600 h-full w-full"
                    onClick={() => setVisiblePassword(true)}
                  />
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Password should be at least 6 characters long and may include
              uppercase letters, lowercase letters and numbers.
            </p>
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
            <button
              disabled={loading}
              type="submit"
              className={
                loading
                  ? "flex w-full justify-center rounded-md bg-gray-100 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  : "flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              }
            >
              Save Password{" "}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetPasswordForm;
