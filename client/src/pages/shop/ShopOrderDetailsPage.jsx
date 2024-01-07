import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import Footer from "../../components/Layouts/Footer";
import OrderDetails from "../../components/Shop/OrderDetails";
import styles from "../../styles/styles";

const ShopOrderDetailsPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className={`${styles.section} bg-white py-10 px-10 md:px-5`}>
        <OrderDetails />
      </div>
      <Footer />
    </div>
  );
};

export default ShopOrderDetailsPage;
