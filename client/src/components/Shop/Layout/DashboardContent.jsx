import React from "react";
import CreateProduct from "../CreateProduct.jsx";
import AllProducts from "../AllProducts.jsx";
import CreateEvent from "../CreateEvent/CreateEvent.jsx";
import AllEvents from "../AllEvents.jsx";
import DiscountCodes from "../DiscountCodes/DiscountCodes.jsx";
import { CreateCouponProvider } from "../../../contexts/CreateCouponContext.jsx";
import DashboardHero from "../DashboardHero.jsx";
import AllOrdersTable from "../AllOrders.jsx";

const DashboardContent = ({ active, setActive }) => {
  return (
    <>
      {active === 1 && <DashboardHero setActive={setActive} />}
      {active === 2 && <AllOrdersTable />}
      {active === 4 && <CreateProduct />}
      {active === 3 && <AllProducts />}
      {active === 5 && <AllEvents />}
      {active === 6 && <CreateEvent setActive={setActive} />}
      {active === 9 && (
        <CreateCouponProvider>
          <DiscountCodes />
        </CreateCouponProvider>
      )}
    </>
  );
};

export default DashboardContent;
