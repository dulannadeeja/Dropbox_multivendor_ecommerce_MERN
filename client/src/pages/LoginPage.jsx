import React, { useEffect } from "react";
import LoginForm from "../components/Login/LoginForm.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    console.log("isAuthenticated", isAuthenticated);
    if (isAuthenticated === true) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
