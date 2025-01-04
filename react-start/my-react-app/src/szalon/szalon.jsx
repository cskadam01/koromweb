import React, { useState, useEffect } from "react";
import axios from "axios";
import "./szalon.css";

function WeeklyScheduler() {
    const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());
    const [bookings, setBookings] = useState([]);

    // API hívás foglalások betöltésére
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/bookings");
                setBookings(response.data);
            } catch (error) {
                console.error("Hiba a foglalások betöltésekor:", error);
            }
        };

        fetchBookings();
    }, []);

    // Heti napok meghatározása
    function getCurrentWeek() {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Hétfő
        const days = [];
        for (let i = 0; i < 7; i++) {
            days.push(new Date(startOfWeek.getTime() + i * 86400000)); // Minden nap hozzáadása
        }
        return days;
    }

    const nextWeek = () => {
        const nextWeekStart = new Date(currentWeek[0].getTime() + 7 * 86400000);
        setCurrentWeek(getWeekDays(nextWeekStart));
    };

    const prevWeek = () => {
        const prevWeekStart = new Date(currentWeek[0].getTime() - 7 * 86400000);
        setCurrentWeek(getWeekDays(prevWeekStart));
    };

    function getWeekDays(startDate) {
        const days = [];
        for (let i = 0; i < 7; i++) {
            days.push(new Date(startDate.getTime() + i * 86400000));
        }
        return days;
    }

    const getBookingsForDay = (day) => {
        return bookings.filter((booking) => {
            const bookingDate = new Date(booking.datum.replace(/-/g, "/")); // Safari-kompatibilis formátum
            return bookingDate.toDateString() === day.toDateString();
        });
    };

    return (
        <div className="weekly-scheduler">
            <div className="scheduler-nav">
                <button onClick={prevWeek}>Előző hét</button>
                <h2>
                    {currentWeek[0].toLocaleDateString()} - {currentWeek[6].toLocaleDateString()}
                </h2>
                <button onClick={nextWeek}>Következő hét</button>
            </div>
            <div className="scheduler-grid">
                {/* Órák oszlopa */}
                <div className="hour-column">
                    {[...Array(24)].map((_, hour) => (
                        <div key={hour} className="hour-cell">
                            {`${hour}:00`}
                        </div>
                    ))}
                </div>
                {/* Napok oszlopai */}
                {currentWeek.map((day, index) => (
                    <div key={index} className="day-column">
                        <div className="day-header">
                            {day.toLocaleDateString("hu-HU", { weekday: "long" })}
                        </div>
                        <div className="day-body">
                            {getBookingsForDay(day).map((booking, idx) => (
                                <div
                                    key={idx}
                                    className="booking-block"
                                    style={{
                                        top: `${
                                            parseInt(booking.kezdIdo.split(":")[0]) * 50 +
                                            (parseInt(booking.kezdIdo.split(":")[1]) / 60) * 50
                                        }px`,
                                        height: `${
                                            ((parseInt(booking.vegIdo.split(":")[0]) -
                                                parseInt(booking.kezdIdo.split(":")[0])) *
                                                50) +
                                            ((parseInt(booking.vegIdo.split(":")[1]) -
                                                parseInt(booking.kezdIdo.split(":")[1])) /
                                                60) *
                                                50
                                        }px`,
                                    }}
                                >
                                    {booking.userName} <br />
                                    {booking.kezdIdo} - {booking.vegIdo}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WeeklyScheduler;
