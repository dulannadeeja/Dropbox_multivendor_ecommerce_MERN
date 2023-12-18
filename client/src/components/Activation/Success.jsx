import React from "react";
import successImage from "../../assets/check-mark.png";

const ActivationSuccess = () => {
  return (
    <div className="flex justify-center items-center h-screen font-sans">
      <div className="text-center">
        <img src={successImage} alt="Success" className="w-40 mx-auto" />
        <h1 className="text-2xl font-bold mb-4">Activation Successful!</h1>
        <p className="text-lg mb-8">
          Thank you for joining with us, we have successfully verified your
          account. You can now proceed with your dropbox journey.
        </p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded text-lg"
          onClick={() => (window.location.href = "/login")}
        >
          Login to Dropbox
        </button>
      </div>
    </div>
  );
};

export default ActivationSuccess;
