import React, { useEffect } from "react";
import EventsTable from "./EventsTable.jsx";
import { useSelector } from "react-redux";

const AllEvents = () => {
  console.log("all events rendered");

  const { shop } = useSelector((state) => state.shop);

  const { token } = useSelector((state) => state.user);

  return <>{<EventsTable shopId={shop?._id} token={token} />}</>;
};

export default AllEvents;
