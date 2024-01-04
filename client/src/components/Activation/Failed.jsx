import React from "react";
import FailedImage from "../../assets/close.png";
import PropTypes from "prop-types";
import styles from "../../styles/styles";

const ActivationFailed = ({ errorMessage }) => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex justify-center items-center font-sans bg-white p-10">
        <div className="text-center">
          <img src={FailedImage} alt="Success" className="w-20 mx-auto mb-10" />
          <h1 className="text-2xl font-bold mb-4">
            Account Activation Failed!
          </h1>
          <p className="text-lg mb-8 text-slate-500">
            Your account activation has failed. Please try again later.
          </p>
          <h2 className="font-bold text-slate-500">Reason for failure: </h2>
          <h2 className="text-red-500 mb-10 bg-red-100 p-2">
            {errorMessage && errorMessage}
          </h2>
          <button
            className={styles.buttonPrimary}
            onClick={() => (window.location.href = "/")}
          >
            Take me home
          </button>
        </div>
      </div>
    </div>
  );
};

ActivationFailed.propTypes = {
  errorMessage: PropTypes.string,
};

export default ActivationFailed;
