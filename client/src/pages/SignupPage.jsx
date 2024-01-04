import React from "react";
import SignupForm from "../components/Signup/SignupForm.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/Layouts/Header";
import Footer from "../components/Layouts/Footer";

const SignupPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);
  return (
    <div>
      <Header />
      <SignupForm />
      <Footer />
    </div>
  );
};

export default SignupPage;
