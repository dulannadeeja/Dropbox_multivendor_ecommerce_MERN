import React from "react";
import DashboardHeader from "../components/Shop/Layout/DashboardHeader";
import Footer from "../components/Layouts/Footer";
import OrderDetails from "../components/Profile/OrderDetails";

const OrderDetailsPage = () => {
  return (
    <div>
      <DashboardHeader />
      <OrderDetails />
      <Footer />
    </div>
  );
};

export default OrderDetailsPage;
