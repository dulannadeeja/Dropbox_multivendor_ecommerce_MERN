import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import EventCard from "../Events/EventCard";
import { server } from "../../server";
import axios from "axios";
import { useState } from "react";
import MainEventCard from "../Events/MainEventCard";

const Events = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [bestSellerEvent, setBestSellerEvent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  const fetchFeaturedEvents = async () => {
    setIsLoading(true);
    try {
      // axios request
      const res = await axios.get(`${server}/event/featured`);

      // if success then set the data
      if (res.status === 200) {
        // get best sold event
        const bestSoldEvent = res.data.events[0];

        // get featured events
        const featuredEvents = res.data.events.slice(1);

        // set the data
        setBestSellerEvent(bestSoldEvent);
        setFeaturedEvents(featuredEvents);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-10">
      {!isLoading && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading}`}>
            <h1>Popular Events</h1>
          </div>

          {bestSellerEvent && (
            <div className="w-full grid">
              <MainEventCard data={bestSellerEvent} />
            </div>
          )}

          <div className="w-full grid md:grid-cols-2 gap-4 lg:grid-cols-3">
            {featuredEvents.length !== 0 &&
              featuredEvents.map((event) => {
                return <EventCard data={event} key={event._id} />;
              })}
            <h4>{featuredEvents?.length === 0 && "No Events have!"}</h4>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
