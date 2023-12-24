import React from "react";
import Header from "../components/Layouts/Header";
import Footer from "../components/Layouts/Footer";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import OrderCompleted from "../components/Checkout/OrderCompleted";

const OrderCompletedPage = () => {
  return (
    <div>
      <Header />
      <CheckoutSteps active={3} />
      <OrderCompleted />
      <Footer />
    </div>
  );
};

export default OrderCompletedPage;
