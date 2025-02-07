import React, { useState, useEffect } from "react";
import axios from "axios";
import "./megerosites.css"; // 📌 CSS fájl a táblázatokhoz

function Megerosites() {
    const [pendingFoglalasok, setPendingFoglalasok] = useState([]);
    const [confirmedFoglalasok, setConfirmedFoglalasok] = useState([]);

    useEffect(() => {
        fetchFoglalasok();
    }, []);

    const fetchFoglalasok = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/admin/foglalasok");
            setPendingFoglalasok(response.data.pending);
            setConfirmedFoglalasok(response.data.confirmed);
        } catch (error) {
            console.error("Hiba a foglalások lekérdezésekor:", error);
        }
    };

    const handleAction = async (foglalId, action) => {
        try {
            const response = await axios.post("http://localhost:5000/api/admin/foglalasok", {
                foglalId,
                action
            });

            alert(response.data.message);
            fetchFoglalasok(); // Frissítjük a táblázatokat
        } catch (error) {
            console.error("Hiba a foglalás módosításakor:", error);
        }
    };

    return (
        <div className="admin-foglalas-container">
            <h2>Foglalások kezelése</h2>

            {/* 🟢 Függőben lévő foglalások */}
            <h3>Jóváhagyásra váró foglalások</h3>
            <table className="admin-foglalas-table">
                <thead>
                    <tr>
                        <th>Név</th>
                        <th>Email</th>
                        <th>Telefonszám</th>
                        <th>Időpont</th>
                        <th>Műveletek</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingFoglalasok.map((foglalas) => (
                        <tr key={foglalas.foglalId}>
                            <td>{foglalas.user_nev}</td>
                            <td>{foglalas.user_email}</td>
                            <td>{foglalas.user_telefon}</td>
                            <td>{foglalas.datum} {foglalas.kezdes_ido} - {foglalas.vege_ido}</td>
                            <td>
                                <button onClick={() => handleAction(foglalas.foglalId, "confirm")} className="confirm-btn">✔ Elfogadás</button>
                                <button onClick={() => handleAction(foglalas.foglalId, "reject")} className="reject-btn">✖ Elutasítás</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ✅ Megerősített foglalások */}
            <h3>Megerősített foglalások</h3>
            <table className="admin-foglalas-table">
                <thead>
                    <tr>
                        <th>Név</th>
                        <th>Email</th>
                        <th>Telefonszám</th>
                        <th>Időpont</th>
                    </tr>
                </thead>
                <tbody>
                    {confirmedFoglalasok.map((foglalas) => (
                        <tr key={foglalas.foglalId}>
                            <td>{foglalas.user_nev}</td>
                            <td>{foglalas.user_email}</td>
                            <td>{foglalas.user_telefon}</td>
                            <td>{foglalas.datum} {foglalas.kezdes_ido} - {foglalas.vege_ido}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Megerosites;
