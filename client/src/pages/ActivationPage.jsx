import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../server";
import { toast } from "react-toastify";
import Success from "../components/Activation/Success.jsx";
import Failed from "../components/Activation/Failed.jsx";

const ActivationPage = () => {
  const { token } = useParams();
  const { role } = useParams();
  const [activationStatus, setActivationStatus] = useState("pending");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const activateAccount = async () => {
      try {
        if (token) {
          const res = await axios.post(`${server}/auth/account-activation`, {
            role,
            token,
          });
          setActivationStatus("success");
        }
      } catch (err) {
        setActivationStatus("error");
        setErrorMessage(err.response.data.message);
      }
    };

    activateAccount();
  }, []);

  useEffect(() => {
    if (activationStatus === "error" && errorMessage) {
      toast.error(errorMessage);
    }
  }, [activationStatus, errorMessage]);

  useEffect(() => {
    if (activationStatus === "success" && !errorMessage) {
      toast.success("Account Activation Successful!");
    }
  }, [activationStatus, errorMessage]);

  const renderActivationMessage = () => {
    switch (activationStatus) {
      case "success":
        return <Success />;
      case "error":
        return <Failed errorMessage={errorMessage} />;
      default:
        return <h2 className="text-blue-600">Activating your account...</h2>;
    }
  };

  return (
    <div className="flex items-center justify-center">
      {renderActivationMessage()}
    </div>
  );
};

export default ActivationPage;
