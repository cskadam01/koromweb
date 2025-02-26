import React, { useState, useEffect } from "react";
import axios from "axios";
import "./megerosites.css"; // 📌 Admin CSS fájl

function Megerosites() {
    const [pendingFoglalasok, setPendingFoglalasok] = useState([]);
    const [confirmedFoglalasok, setConfirmedFoglalasok] = useState([]);

    useEffect(() => {
        fetchPendingFoglalasok();
        fetchConfirmedFoglalasok();
    }, []);

    const fetchPendingFoglalasok = async () => {
        try {
            const response = await axios.get("http://zsukoromtest.duckdns.org:5000/api/admin/pending_foglalasok");
            setPendingFoglalasok(response.data);
        } catch (error) {
            console.error("Hiba a függő foglalások lekérdezésekor:", error);
        }
    };

    const fetchConfirmedFoglalasok = async () => {
        try {
            const response = await axios.get("http://zsukoromtest.duckdns.org:5000/api/admin/confirmed_foglalasok");
            setConfirmedFoglalasok(response.data);
        } catch (error) {
            console.error("Hiba a megerősített foglalások lekérdezésekor:", error);
        }
    };

    const confirmFoglalas = async (foglalId) => {
        try {
            await axios.post("http://zsukoromtest.duckdns.org:5000/api/admin/foglalas_megerosites", { foglalId });
            fetchPendingFoglalasok();
            fetchConfirmedFoglalasok();
        } catch (error) {
            console.error("Hiba a foglalás megerősítésekor:", error);
        }
    };

    const rejectFoglalas = async (foglalId) => {
        try {
            await axios.post("http://zsukoromtest.duckdns.org:5000/api/admin/foglalas_elutasitas", { foglalId });
            fetchPendingFoglalasok();
        } catch (error) {
            console.error("Hiba a foglalás elutasításakor:", error);
        }
    };

    // 🟢 **Dátum és idő formázása**
    const formatDate = (dateString) => {
        if (!dateString) return "Érvénytelen dátum";
        const parsedDate = new Date(dateString);
        return new Intl.DateTimeFormat('hu-HU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        }).format(parsedDate);
    };

    const formatTime = (timeString) => {
        return timeString ? timeString.slice(0, 5) : "Nincs megadva";
    };

    return (
        <div className="admin-foglalas-container">
            <h2>Foglalások kezelése</h2>

            {/* 🟢 Jóváhagyásra váró foglalások */}
            <h3>Jóváhagyásra váró foglalások</h3>
            <div className="admin-foglalasok-container">
                {pendingFoglalasok.map((foglalas) => (
                    <div key={foglalas.foglalId} className="admin-foglalas-kartya">
                        <h3>{foglalas.user_nev}</h3>
                        <p><strong>Email:</strong> {foglalas.user_email}</p>
                        <p><strong>Telefonszám:</strong> {foglalas.user_telefon}</p>
                        <p><strong>Tanfolyam típusa:</strong> {foglalas.idopont_tipus}</p>
                        <p><strong>Időpont:</strong> {formatDate(foglalas.datum)}, {formatTime(foglalas.kezdes_ido)} - {formatTime(foglalas.vege_ido)}</p>
                        <button onClick={() => confirmFoglalas(foglalas.foglalId)} className="admin-confirm-btn">✔ Elfogadás</button>
                        <button onClick={() => rejectFoglalas(foglalas.foglalId)} className="admin-reject-btn">✖ Elutasítás</button>
                    </div>
                ))}
            </div>

            {/* 🟢 Megerősített foglalások */}
            <h3>Megerősített foglalások</h3>
            <div className="admin-foglalasok-container">
                {confirmedFoglalasok.map((foglalas) => (
                    <div key={foglalas.foglalId} className="admin-foglalas-kartya admin-confirmed">
                        <h3>{foglalas.user_nev}</h3>
                        <p><strong>Email:</strong> {foglalas.user_email}</p>
                        <p><strong>Telefonszám:</strong> {foglalas.user_telefon}</p>
                        <p><strong>Tanfolyam típusa:</strong> {foglalas.idopont_tipus}</p>
                        <p><strong>Időpont:</strong> {formatDate(foglalas.datum)}, {formatTime(foglalas.kezdes_ido)} - {formatTime(foglalas.vege_ido)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Megerosites;