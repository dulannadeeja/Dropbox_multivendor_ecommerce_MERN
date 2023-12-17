import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layouts/Header";
import { eventData } from "../static/eventData";

const EventsPage = () => {
  const isLoading = false;
  const allEvents = eventData;
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />
          {allEvents &&
            allEvents.map((i, index) => {
              return (
                <EventCard
                  key={index}
                  active={true}
                  data={allEvents && allEvents[0]}
                />
              );
            })}
        </div>
      )}
    </>
  );
};

export default EventsPage;
