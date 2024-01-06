import React from "react";
import Header from "../components/Layouts/Header";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import Footer from "../components/Layouts/Footer";
import Payment from "../components/Payment/Payment";
import styles from "../styles/styles";
const PaymentPage = () => {
  return (
    <div>
      <Header />
      <div className={`${styles.section} bg-white py-10`}>
        <CheckoutSteps active={2} />
        <Payment />
      </div>
      <Footer />
    </div>
  );
};

export default PaymentPage;
