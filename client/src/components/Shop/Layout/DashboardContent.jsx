import React from "react";
import CreateProduct from "../CreateProduct.jsx";
import AllProducts from "../AllProducts.jsx";
import CreateEvent from "../CreateEvent/CreateEvent.jsx";
import AllEvents from "../AllEvents.jsx";
import { CreateEventProvider } from "../../../contexts/createEventContext.jsx";

const DashboardContent = ({ active }) => {
  return (
    <>
      {active === 4 && <CreateProduct />}
      {active === 3 && <AllProducts />}
      {active === 5 && <AllEvents />}
      {active === 6 && (
        <CreateEventProvider>
          <CreateEvent />
        </CreateEventProvider>
      )}
    </>
  );
};

export default DashboardContent;
