import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SellerSignupForm from "../components/SellerSignup/SellerSignupForm";
import { SellerSignupProvider } from "../contexts/SellerSignupContext";

const SellerSignupPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const isSeller = user?.isSeller;
  const shop = user?.shop;

  useEffect(() => {
    if (isSeller === true) {
      navigate(`/shop/${shop}`);
    }
  }, []);
  return (
    <div className="800px:flex w-full">
      <SellerSignupProvider>
        <SellerSignupForm />
      </SellerSignupProvider>
    </div>
  );
};

export default SellerSignupPage;
