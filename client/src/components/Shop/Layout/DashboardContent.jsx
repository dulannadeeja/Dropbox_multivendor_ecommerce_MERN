import React from "react";
import CreateProduct from "../CreateProduct.jsx";
import AllProducts from "../AllProducts.jsx";

const DashboardContent = ({ active }) => {
  return (
    <>
      {active === 4 && <CreateProduct />}
      {active === 3 && <AllProducts />}
    </>
  );
};

export default DashboardContent;
