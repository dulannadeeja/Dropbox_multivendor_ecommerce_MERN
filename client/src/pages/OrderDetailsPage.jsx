import React from "react";
import Header from "../components/Layouts/Header";
import Footer from "../components/Layouts/Footer";
import OrderDetails from "../components/Profile/OrderDetails";
import styles from "../styles/styles";

const OrderDetailsPage = () => {
  return (
    <div>
      <Header />
      <div className={`${styles.section} bg-white py-10`}>
        <OrderDetails />
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetailsPage;
