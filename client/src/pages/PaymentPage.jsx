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
import Payment from "../components/Payment/Payment";
const PaymentPage = () => {
  return (
    <div>
      <Header />
      <CheckoutSteps active={2} />
      <Payment />
      <Footer />
    </div>
  );
};

export default PaymentPage;
