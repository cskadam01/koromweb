import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./megerosites.css"


function Kepzes() {
    const [unconfirmedBookings, setUnconfirmedBookings] = useState([]);
    const [confirmedBookings, setConfirmedBookings] = useState([]);

    // Nem megerősített foglalások betöltése
    useEffect(() => {
        fetchUnconfirmedBookings();
        fetchConfirmedBookings();
    }, []);

    const fetchUnconfirmedBookings = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/bookings');
            setUnconfirmedBookings(response.data);
        } catch (error) {
            console.error("Hiba a nem megerősített foglalások lekérésekor:", error);
        }
    };

    const deleteBooking = async (foglalId) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/delete-pending-booking`, {
                foglalId: foglalId, // Az azonosító
            });
    
            if (response.data.success) {
                alert(response.data.message);
    
                // Frissítjük a nem megerősített foglalások listáját
                setUnconfirmedBookings(unconfirmedBookings.filter(booking => booking.foglalId !== foglalId));
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                console.error("Hiba a foglalás törlésekor:", error);
            }
        }
    };

    const fetchConfirmedBookings = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/get_booking_c');
            setConfirmedBookings(response.data);
        } catch (error) {
            console.error("Hiba a megerősített foglalások lekérésekor:", error);
        }
    };

    // Foglalás megerősítése
    const confirmBooking = async (foglalId) => {
        try {
            const response = await axios.post('http://localhost:5000/api/confirm-booking', { foglalId });
    
            if (response.data.success) {
                alert(response.data.message);
    
                // Frissítjük a listákat
                setUnconfirmedBookings(unconfirmedBookings.filter(booking => booking.foglalId !== foglalId));
                setConfirmedBookings(response.data.confirmed);
            }
        } catch (error) {
            // Hibakezelés: Üzenet megjelenítése
            if (error.response && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                console.error("Hiba a foglalás megerősítésekor:", error);
            }
        }
    };

    return (
        <div className="admin-booking-container">
        <div className="booking-list">
            <h2>Nem megerősített foglalások</h2>
            <ul>
                {unconfirmedBookings.map(booking => (
                    <li key={booking.foglalId} className="booking-item">
                        <span><strong>Név:</strong> {booking.userName}</span>
                        <span><strong>Telefonszám:</strong> {booking.userPhone}</span>
                        <span><strong>Email:</strong> {booking.userEmail}</span>
                        <span><strong>Dátum:</strong> {booking.datum}</span>
                        <span><strong>Idő:</strong> {booking.kezdIdo} - {booking.vegIdo}</span>
                        <button className="accept"onClick={() => confirmBooking(booking.foglalId)}>Megerősít</button>
                        <button className='delete'style={{ backgroundColor: 'red'}} onClick={() => deleteBooking(booking.foglalId)}>Törlés</button>
                    </li>
                ))}
            </ul>
        </div>

        <div className="booking-list">
            <h2>Megerősített foglalások</h2>
            <ul>
                {confirmedBookings.map(booking => (
                    <li key={booking.foglalId} className="booking-item">
                        <span><strong>Név:</strong> {booking.userName}</span>
                        <span><strong>Telefonszám:</strong> {booking.userPhone}</span>
                        <span><strong>Email:</strong> {booking.userEmail}</span>
                        <span><strong>Dátum:</strong> {booking.datum}</span>
                        <span><strong>Idő:</strong> {booking.kezdIdo} - {booking.vegIdo}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
    );
}

export default Kepzes;
