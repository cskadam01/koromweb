import React, { useState, useEffect } from "react";
import axios from "axios";
import "./megerosites.css"; // 📌 CSS fájl az admin felülethez

function Megerosites() {
    const [pendingFoglalasok, setPendingFoglalasok] = useState([]);
    const [confirmedFoglalasok, setConfirmedFoglalasok] = useState([]);

    useEffect(() => {
        fetchPendingFoglalasok();
        fetchConfirmedFoglalasok();
    }, []);

    const fetchPendingFoglalasok = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/admin/pending_foglalasok");
            setPendingFoglalasok(response.data);
        } catch (error) {
            console.error("Hiba a függőben lévő foglalások lekérdezésekor:", error);
        }
    };

    const fetchConfirmedFoglalasok = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/admin/confirmed_foglalasok");
            setConfirmedFoglalasok(response.data);
        } catch (error) {
            console.error("Hiba a megerősített foglalások lekérdezésekor:", error);
        }
    };

    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat('hu-HU', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }).format(new Date(dateString));
    };

    const confirmFoglalas = async (foglalId) => {
        try {
            await axios.post("http://localhost:5000/api/admin/foglalas_megerosites", { foglalId });
            fetchPendingFoglalasok();
            fetchConfirmedFoglalasok();
        } catch (error) {
            console.error("Hiba a foglalás megerősítésekor:", error);
        }
    };

    const rejectFoglalas = async (foglalId) => {
        try {
            await axios.post("http://localhost:5000/api/admin/foglalas_elutasitas", { foglalId });
            fetchPendingFoglalasok();
        } catch (error) {
            console.error("Hiba a foglalás elutasításakor:", error);
        }
    };

    return (
        <div className="admin-foglalas-container">
            <h2>Foglalások kezelése</h2>
            <div className="foglalas-grid">
                <div className="foglalas-column">
                    <h3>Jóváhagyásra váró foglalások</h3>
                    <table className="admin-foglalas-table">
                        <thead>
                            <tr>
                                <th>Név</th>
                                <th>Email</th>
                                <th>Telefonszám</th>
                                <th>Tanfolyam típusa</th>
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
                                    <td>{foglalas.idopont_tipus}</td>
                                    <td>{formatDate(foglalas.datum)} {foglalas.kezdes_ido} - {foglalas.vege_ido}</td>
                                    <td>
                                        <button onClick={() => confirmFoglalas(foglalas.foglalId)} className="confirm-btn">✔</button>
                                        <button onClick={() => rejectFoglalas(foglalas.foglalId)} className="reject-btn">✖</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="foglalas-column">
                    <h3>Megerősített foglalások</h3>
                    <table className="admin-foglalas-table">
                        <thead>
                            <tr>
                                <th>Név</th>
                                <th>Email</th>
                                <th>Telefonszám</th>
                                <th>Tanfolyam típusa</th>
                                <th>Időpont</th>
                            </tr>
                        </thead>
                        <tbody>
                            {confirmedFoglalasok.map((foglalas) => (
                                <tr key={foglalas.foglalId}>
                                    <td>{foglalas.user_nev}</td>
                                    <td>{foglalas.user_email}</td>
                                    <td>{foglalas.user_telefon}</td>
                                    <td>{foglalas.idopont_tipus}</td>
                                    <td>{formatDate(foglalas.datum)} {foglalas.kezdes_ido} - {foglalas.vege_ido}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Megerosites;
