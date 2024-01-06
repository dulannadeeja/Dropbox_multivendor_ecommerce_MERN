import React, { useEffect } from "react";
import Header from "../components/Layouts/Header";
import Footer from "../components/Layouts/Footer";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import OrderCompleted from "../components/Checkout/OrderCompleted";
import { useDispatch } from "react-redux";
import styles from "../styles/styles";

const OrderCompletedPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    clearCart();
  }, []);

  const clearCart = async () => {
    try {
      await dispatch({ type: "ClearCart" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Header />
      <div className={`${styles.section} py-10 bg-white`}>
        <CheckoutSteps active={3} />
        <OrderCompleted />
      </div>
      <Footer />
    </div>
  );
};

export default OrderCompletedPage;
