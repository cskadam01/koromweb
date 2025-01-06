import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

const localizer = momentLocalizer(moment);

const MyBigCalendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Nem megerősített foglalások lekérése
        const bookingsResponse = await fetch("http://localhost:5000/api/bookings");
        const bookings = await bookingsResponse.json();

        // Megerősített foglalások lekérése
        const confirmedResponse = await fetch("http://localhost:5000/api/get_booking_c");
        const confirmed = await confirmedResponse.json();

        // Adatok formázása
        const formattedBookings = bookings.map((booking) => ({
          id: booking.foglalId,
          title: booking.userName,
          start: new Date(`${booking.datum}T${booking.kezdIdo}`),
          end: new Date(`${booking.datum}T${booking.vegIdo}`),
          color: "yellow", // Sárga szín a nem megerősítetteknek
        }));

        const formattedConfirmed = confirmed.map((booking) => ({
          id: booking.foglalId,
          title: booking.userName,
          start: new Date(`${booking.datum}T${booking.kezdIdo}`),
          end: new Date(`${booking.datum}T${booking.vegIdo}`),
          color: "green", // Zöld szín a megerősítetteknek
        }));

        // Egyesített eseménylista
        setEvents([...formattedBookings, ...formattedConfirmed]);
      } catch (error) {
        console.error("Hiba az események betöltésekor:", error);
      }
    };

    fetchEvents();
  }, []);

  // Egyedi eseménymegjelenítés színezéshez
  const eventStyleGetter = (event) => {
    const backgroundColor = event.color;
    const style = {
      backgroundColor,
      borderRadius: "5px",
      color: "white",
      border: "none",
      display: "block",
    };
    return { style };
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter} // Színezés kezelése
        defaultView="week" // Alapértelmezett heti nézet
      />
    </div>
  );
};

export default MyBigCalendar;
