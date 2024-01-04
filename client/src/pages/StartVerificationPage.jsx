import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import verifyUserImage from "../assets/verified-account.png";
import axios from "axios";
import { server } from "../server";

const StartVerificationPage = () => {
  // Destructuring values from the React Router useParams hook
  const { userId } = useParams();

  // State hooks for managing loading state, error messages, success messages, countdown, and resend button state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resendDisabled, setResendDisabled] = useState(true);

  // Function to send a verification email
  const sendVerificationEmail = async () => {
    setResendDisabled(true); // Disabling the resend button
    setLoading(true);
    try {
      // Making an asynchronous request to the server to send a verification email
      const res = await axios.post(`${server}/auth/verification`, {
        id: userId,
        role: "user",
      });
      // Updating the success message and starting the countdown
      setSuccessMessage(res.data.message);
    } catch (err) {
      // Handling errors and updating the error message
      setErrorMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      // Ensuring that loading state is set to false regardless of success or failure
      setLoading(false);
      setResendDisabled(false); // Enabling the resend button
    }
  };

  // useEffect hook to send the verification email when the component mounts
  useEffect(() => {
    sendVerificationEmail();
  }, []);

  // useEffect hook to display an error toast message when errorMessage changes
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]); // The useEffect will run whenever errorMessage changes

  // useEffect hook to display a success toast message when successMessage changes
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
    }
  }, [successMessage]); // The useEffect will run whenever successMessage changes

  // The main JSX structure of the component
  return (
    <div className="h-screen flex items-center justify-center ">
      <div className="flex justify-center items-center font-sans bg-white p-10 flex-col">
        {/* Displaying an image */}
        <img
          src={verifyUserImage}
          alt="Verify User"
          className="w-20 mx-auto mb-10"
        />
        {/* Heading */}
        <h1 className="text-3xl font-bold mb-10">Verify Email to Continue</h1>
        {/* Informational text */}
        <p className="text-gray-500">
          We have sent an email with verification details to the address you
          provided.
        </p>
        <p className="text-gray-500 mb-10">
          Please check your email and click on the verification link to activate
          your account.
        </p>
        {/* Resend verification email button */}
        <div className="flex items-center mb-4">
          <p className="text-gray-600 font-bold">Didn't receive the email?</p>
          <button
            disabled={resendDisabled}
            onClick={sendVerificationEmail}
            className={`ml-2 text-blue-500 hover:underline focus:outline-none ${
              resendDisabled ? "cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Resending..." : "Resend verification email"}
          </button>
        </div>
        {/* Additional information and a link */}
        <p className="text-gray-500">
          If you continue to face issues,{" "}
          <Link to="/contact" className="text-blue-500 hover:underline">
            contact support
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default StartVerificationPage;
