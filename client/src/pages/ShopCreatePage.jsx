import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ShopCreateForm from "../components/Shop/ShopCreateForm";

const ShopCreatePage = () => {
  const navigate = useNavigate();
  const isSeller = false;
  const seller = {};

  useEffect(() => {
    if (isSeller === true) {
      navigate(`/shop/${seller._id}`);
    }
  }, []);
  return (
    <div>
      <ShopCreateForm />
    </div>
  );
};

export default ShopCreatePage;
