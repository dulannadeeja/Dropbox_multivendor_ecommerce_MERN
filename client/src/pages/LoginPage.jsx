import React, { useEffect } from "react";
import LoginForm from "../components/Login/LoginForm.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../components/Layouts/Header";
import Footer from "../components/Layouts/Footer";

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated === true) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      <Header />
      <LoginForm />
      <Footer />
    </div>
  );
};

export default LoginPage;
