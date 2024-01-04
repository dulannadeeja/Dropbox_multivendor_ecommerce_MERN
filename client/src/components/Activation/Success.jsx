import React from "react";
import successImage from "../../assets/check-mark.png";
import styles from "../../styles/styles";

const ActivationSuccess = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex justify-center items-center font-sans bg-white p-10">
        <div className="text-center">
          <img
            src={successImage}
            alt="Success"
            className="w-20 mx-auto mb-10"
          />
          <h1 className="text-2xl font-bold mb-4">Activation Successful!</h1>
          <p className="text-lg mb-10 text-slate-500">
            Thank you for joining with us, we have successfully verified your
            account. You can now proceed with your dropbox journey.
          </p>
          <button
            className={styles.buttonPrimary}
            onClick={() => (window.location.href = "/login")}
          >
            Login to Dropbox
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivationSuccess;
