import React, { useEffect, useState } from 'react';
import axios from "axios";

function Admin() {
    const [adminData, setAdminData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // API hívás függvény
        const fetchAdminData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:5000/api/admin', {
                    headers: {
                        Authorization: token
                    }
                });

                setAdminData(response.data.message); // Adatok mentése
            } catch (error) {
                console.error("Hiba az admin adatok lekérésekor:", error);
                setError('Nem sikerült betölteni az admin adatokat.');
            }
        };

        fetchAdminData(); // Hívás az `useEffect`-ben
    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    if (!adminData) {
        return <p>Adatok betöltése...</p>;
    }

    return (
        <div>
            <h1>Admin Felület</h1>
            <p>{adminData}</p> {/* Az admin adatok megjelenítése */}
        </div>
    );
}

export default Admin;
