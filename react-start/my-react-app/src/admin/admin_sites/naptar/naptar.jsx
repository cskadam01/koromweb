import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "moment/locale/hu"; // Magyar nyelv importálása



moment.locale("hu");

const localizer = momentLocalizer(moment);

const Naptar = () => {
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
      minheight:'800%',
    };
    return { style };
  };

  return (
    <div className="big-calendar-container">
      <Calendar
        
        className="big-calendar"
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 1000 }}
        eventPropGetter={eventStyleGetter} // Színezés kezelése
        defaultView="week" // Alapértelmezett heti nézet
        min={new Date(2025, 0, 1, 6, 0)} // Reggel 6:00
        max={new Date(2025, 0, 1, 21, 0)} // Este 9:00
        messages={{
          today: "Ma",
          previous: "Előző",
          next: "Következő",
          month: "Hónap",
          week: "Hét",
          day: "Nap",
          agenda: "Napló",
          date: "Dátum",
          time: "Idő",
          event: "Esemény",
          noEventsInRange: "Nincs esemény ebben az időszakban.",
        }}
      />
    </div>
  );
};

export default Naptar;
