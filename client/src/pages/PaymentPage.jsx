import React from "react";
import Header from "../components/Layouts/Header";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import Footer from "../components/Layouts/Footer";
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
