import React from "react";
import styles from "../../../styles/styles";
import { server } from "../../../server";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import Loader from "../../../components/Loader";
import MainEventCard from "../../../components/Events/MainEventCard";

const ShopEvents = ({ shopId }) => {
  console.log("shop events rendered" + shopId);

  const [allEvents, setAllEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    setIsLoading(true);
    try {
      console.log(shopId);
      const res = await axios.get(`${server}/event/all/${shopId}`);

      if (res.status === 200) {
        setAllEvents(res.data.events);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-w-full flex justify-center items-center">
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div className={styles.section}>
            <div className="w-full">
              {allEvents.length !== 0 &&
                allEvents.map((event) => {
                  return <MainEventCard data={event} key={event._id} />;
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopEvents;
