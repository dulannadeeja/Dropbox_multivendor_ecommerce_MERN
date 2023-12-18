import React from "react";
import FailedImage from "../../assets/close.png";
import PropTypes from "prop-types";

const ActivationFailed = ({ errorMessage }) => {
  return (
    <div className="flex justify-center items-center h-screen font-sans">
      <div className="text-center">
        <img src={FailedImage} alt="Success" className="w-40 mx-auto" />
        <h1 className="text-2xl font-bold mb-4">Account Activation Failed!</h1>
        <p className="text-lg mb-8">
          Your account activation has failed. Please try again later.
        </p>
        <h2>Reason for failure: </h2>
        <h2>{errorMessage && errorMessage}</h2>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded text-lg"
          onClick={() => (window.location.href = "/home")}
        >
          Take me home
        </button>
      </div>
    </div>
  );
};

ActivationFailed.propTypes = {
  errorMessage: PropTypes.string,
};

export default ActivationFailed;
