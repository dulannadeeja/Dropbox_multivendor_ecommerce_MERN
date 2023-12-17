import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SellerSignupForm from "../components/SellerSignup/SellerSignupForm";
<<<<<<< HEAD
import { SellerSignupProvider } from "../contexts/SellerSignupContext";
=======
>>>>>>> 576e884e8479516853b1675d158c83bb1d6956fa

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
<<<<<<< HEAD
      <SellerSignupProvider>
        <SellerSignupForm />
      </SellerSignupProvider>
=======
      <SellerSignupForm />
>>>>>>> 576e884e8479516853b1675d158c83bb1d6956fa
    </div>
  );
};

export default SellerSignupPage;
