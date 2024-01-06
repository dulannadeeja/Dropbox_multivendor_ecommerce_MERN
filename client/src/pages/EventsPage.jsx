import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layouts/Header";
import Loader from "../components/Loader";
import { server } from "../server";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import styles from "../styles/styles";
import Footer from "../components/Layouts/Footer";

const EventsPage = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${server}/event/all`);

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
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />
          <div className={styles.section}>
            <div className="w-full grid md:grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {allEvents.length !== 0 &&
                allEvents.map((event) => {
                  return <EventCard data={event} key={event._id} />;
                })}
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default EventsPage;
