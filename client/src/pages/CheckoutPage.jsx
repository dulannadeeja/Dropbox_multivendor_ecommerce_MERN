import React, { useEffect } from "react";
import Header from "../components/Layouts/Header";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import Checkout from "../components/Checkout/Checkout";
import Footer from "../components/Layouts/Footer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../server";
import { useState } from "react";
import Loader from "../components/Loader";
import { CheckoutProvider } from "../contexts/CheckoutContext";

const CheckoutPage = () => {
  const { user } = useSelector((state) => state.user);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAddress();
  }, []);

  const fetchAddress = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.get(`${server}/user/get-addresses`, config);
      console.log(res.data.addresses);
      setAddresses(res.data.addresses);
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <CheckoutProvider>
        <CheckoutSteps active={1} />
        <Checkout addresses={addresses} loading={loading} />
      </CheckoutProvider>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
