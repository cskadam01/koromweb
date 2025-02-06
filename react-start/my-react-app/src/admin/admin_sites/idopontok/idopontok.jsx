import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Idopontok.css"; // 📌 Új CSS fájl beillesztése

function Idopontok() {
    const [idopontok, setIdopontok] = useState([]);
    const [ujDatum, setUjDatum] = useState("");
    const [ujKezdes, setUjKezdes] = useState("");
    const [ujVege, setUjVege] = useState("");
    const [ujFerohely, setUjFerohely] = useState("");

    useEffect(() => {
        fetchIdopontok();
    }, []);

    const fetchIdopontok = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/idopontok");
            setIdopontok(response.data);
        } catch (error) {
            console.error("Hiba az időpontok lekérdezésekor:", error);
        }
    };

    const handleUjIdopont = async (e) => {
        e.preventDefault();
        if (!ujDatum || !ujFerohely) {
            alert("A dátum és a férőhely megadása kötelező!");
            return;
        }

        try {
            await axios.post("http://localhost:5000/api/idopontok", {
                datum: ujDatum,
                kezdes_ido: ujKezdes || null,
                vege_ido: ujVege || null,
                max_ferohely: parseInt(ujFerohely, 10),
            });

            setUjDatum("");
            setUjKezdes("");
            setUjVege("");
            setUjFerohely("");
            fetchIdopontok();
        } catch (error) {
            console.error("Hiba az új időpont hozzáadásakor:", error);
        }
    };

    const handleTorles = async (id) => {
        if (window.confirm("Biztosan törölni szeretnéd ezt az időpontot?")) {
            try {
                await axios.delete(`http://localhost:5000/api/idopontok/${id}`);
                fetchIdopontok();
            } catch (error) {
                console.error("Hiba az időpont törlésekor:", error);
            }
        }
    };

    return (
        <div className="admin-idopont-container">
            <h2>Időpontok kezelése</h2>

            {/* 🟢 Új időpont felvétel űrlap */}
            <form onSubmit={handleUjIdopont} className="admin-idopont-form">
                <label>Dátum:</label>
                <input type="date" value={ujDatum} onChange={(e) => setUjDatum(e.target.value)} required />

                <label>Kezdési idő (opcionális):</label>
                <input type="time" value={ujKezdes} onChange={(e) => setUjKezdes(e.target.value)} />

                <label>Befejezési idő (opcionális):</label>
                <input type="time" value={ujVege} onChange={(e) => setUjVege(e.target.value)} />

                <label>Maximális férőhely:</label>
                <input type="number" value={ujFerohely} onChange={(e) => setUjFerohely(e.target.value)} required min="1" />

                <button type="submit">Időpont hozzáadása</button>
            </form>

            {/* 🟢 Időpontok listázása */}
            <h3>Elérhető időpontok</h3>
            <table className="admin-idopont-table">
                <thead>
                    <tr>
                        <th>Dátum</th>
                        <th>Időtartam</th>
                        <th>Férőhely</th>
                        <th>Műveletek</th>
                    </tr>
                </thead>
                <tbody>
                    {idopontok.map((idopont) => (
                        <tr key={idopont.id}>
                            <td>{idopont.datum}</td>
                            <td>
                                {idopont.kezdes_ido && idopont.vege_ido
                                    ? `${idopont.kezdes_ido} - ${idopont.vege_ido}`
                                    : "Nincs megadva"}
                            </td>
                            <td>{idopont.max_ferohely} fő</td>
                            <td>
                                <button className="admin-idopont-delete" onClick={() => handleTorles(idopont.id)}>Törlés</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Idopontok;
